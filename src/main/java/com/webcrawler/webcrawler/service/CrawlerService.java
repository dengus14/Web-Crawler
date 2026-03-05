package com.webcrawler.webcrawler.service;

import com.webcrawler.webcrawler.repository.CrawlerRepository;
import lombok.extern.slf4j.Slf4j;
import com.webcrawler.webcrawler.model.CrawlJob;
import com.webcrawler.webcrawler.model.PageResult;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CrawlerService {
    HttpClient client = createHttpClient();
    @Autowired
    private CrawlerRepository crawlerRepository;
    @Autowired
    private RobotsTxtService robotsTxtService;
    @Autowired
    private RateLimiter rateLimiter;

    private HttpClient createHttpClient() {
        try {
            TrustManager[] trustAll = new TrustManager[]{
                    new X509TrustManager() {
                        public java.security.cert.X509Certificate[] getAcceptedIssuers() { return null; }
                        public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                        public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                    }
            };
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAll, new java.security.SecureRandom());
            return HttpClient.newBuilder().sslContext(sc).build();
        } catch (Exception e) {
            log.error("Failed to create HTTP client", e);
            return HttpClient.newHttpClient();
        }
    }

    private HttpResponse<String> fetchUrl(String url) throws IOException, InterruptedException {
        HttpResponse<String> response;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(30)) //GUARD RAIL FOR REQUEST TIMEOUTS, THREAD COULD WAIT FOREVER WITHOUT IT
                .GET()
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .build();
        response = client.send(request, HttpResponse.BodyHandlers.ofString());


        return response;
    }

    private PageResult parsePage(String html, String baseUrl) {
        PageResult pageResult = new PageResult();
        Document doc = Jsoup.parse(html, baseUrl);
        pageResult.setTitle(doc.title());
        pageResult.setMetaDescription(doc.select("meta[name=description]").attr("content"));
        pageResult.setText(doc.text());
        if (doc.select("h1").size() > 0){
            pageResult.setHasH1(true);
        }

        List<String> allLinks = doc.select("a[href]").eachAttr("abs:href");
        pageResult.setOutboundLinks(allLinks.stream().limit(5).collect(Collectors.toList()));

        return pageResult;
    }

    private boolean isSameDomain(String url1, String url2) throws URISyntaxException {
        URI uri1 = new URI(url1);
        URI uri2 = new URI(url2);
        String host = uri1.getHost();
        String host2 = uri2.getHost();
        if (host == null || host2 == null){
            return false;
        }

        host = host.replaceAll("^www\\.", "");
        host2 = host2.replaceAll("^www\\.", "");
        return host.equals(host2);
    }

    private boolean isHtmlUrl(String url) {
        String lowerUrl = url.toLowerCase();

        // Blacklist of non-HTML file extensions to skip before making HTTP requests
        String[] nonHtmlExtensions = {
            ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico",
            ".mp4", ".avi", ".mov", ".mkv", ".webm",
            ".mp3", ".wav", ".ogg",
            ".zip", ".tar", ".gz", ".rar", ".7z",
            ".css", ".js", ".woff", ".woff2", ".ttf",
            ".xml", ".json", ".txt",
            ".exe", ".dmg", ".deb", ".rpm"
        };

        for (String ext : nonHtmlExtensions) {
            if (lowerUrl.endsWith(ext)) {
                return false;
            }
        }
        return true;
    }

    @Async
    public void crawl(CrawlJob crawlJob) {
        log.info("Crawl started for job: {}", crawlJob.getId());
        try {
            Queue<String> queue = new ConcurrentLinkedQueue<>();
            ConcurrentHashMap<String, Boolean> visited = new ConcurrentHashMap<>();
            ExecutorService executor = Executors.newFixedThreadPool(10);
            Phaser phaser = new Phaser(1);
            crawlJob.setStatus("RUNNING");
            crawlerRepository.save(crawlJob);

            queue.add(crawlJob.getSeedUrl());
            log.info("Seed URL added: {}", crawlJob.getSeedUrl());
            AtomicInteger activeThreads = new AtomicInteger(0);
            AtomicInteger pagesCrawled = new AtomicInteger(0);

            while (!queue.isEmpty() || activeThreads.get() > 0) {
                if (queue.isEmpty() && activeThreads.get() > 0) {
                    Thread.sleep(50);
                    continue;
                }

                String url = queue.poll();
                if (url == null || visited.containsKey(url)) {
                    continue;
                }

                if (pagesCrawled.incrementAndGet() > crawlJob.getMaxPages()) {
                    break;
                }

                visited.put(url, true);
                phaser.register();
                activeThreads.incrementAndGet();
                executor.execute(() -> {
                    try {
                        rateLimiter.waitIfNeeded(url);

                        long startTime = System.currentTimeMillis();
                        HttpResponse<String> response = fetchUrl(url);
                        long endTime = System.currentTimeMillis();
                        long duration = endTime - startTime;

                        PageResult pageResult = parsePage(response.body(), url);
                        pageResult.setStatusCode(response.statusCode());
                        pageResult.setResponseTimeMs(duration);
                        pageResult.setUrl(url);
                        pageResult.setCrawlJob(crawlJob);
                        log.info("Parsed page: {}, found {} links", url, pageResult.getOutboundLinks().size());

                        for (String link : pageResult.getOutboundLinks()) {
                            if (!visited.containsKey(link) && isSameDomain(link, url) && isHtmlUrl(link) && robotsTxtService.isAllowed(link)) {
                                queue.add(link);
                                log.info("Enqueuing link: {}", link);
                            } else if (!isHtmlUrl(link)) {
                                log.debug("Skipping non-HTML: {}", link);
                            } else if (!robotsTxtService.isAllowed(link)) {
                                log.debug("Skipping URL (robots.txt): {}", link);
                            }
                        }
                        crawlJob.getResults().add(pageResult);
                        crawlJob.setPagesCrawled(pagesCrawled.get());
                    } catch (Exception e) {
                        log.error("Crawling error", e);
                    } finally {
                        activeThreads.decrementAndGet();
                        phaser.arriveAndDeregister();
                    }
                });
            }
            phaser.arriveAndAwaitAdvance();
            executor.shutdown();
            try {
                if (!executor.awaitTermination(10, TimeUnit.MINUTES)) {
                    executor.shutdownNow();
                }
            } catch (InterruptedException e) {
                executor.shutdownNow();
            }
            crawlJob.setStatus("DONE");
            crawlJob.setPagesCrawled(pagesCrawled.get());
            crawlerRepository.save(crawlJob);
        } catch (Exception e) {
            log.error("Crawl failed", e);
            crawlJob.setStatus("FAILED");
        }
    }

}
