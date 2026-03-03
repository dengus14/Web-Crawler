package service;

import lombok.extern.slf4j.Slf4j;
import model.CrawlJob;
import model.PageResult;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;

import static utils.Status.RUNNING;

@Slf4j
public class CrawlerService {
    HttpClient client = HttpClient.newHttpClient();

    private HttpResponse<String> fetchUrl(String url) throws IOException, InterruptedException {
        HttpResponse<String> response;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();
        response = client.send(request, HttpResponse.BodyHandlers.ofString());


        return response;
    }

    private PageResult parsePage(String html, String baseUrl) {
        PageResult pageResult = new PageResult();
        Document doc = Jsoup.parse(html, baseUrl);
        pageResult.setTitle(doc.title());
        pageResult.setMetaDescription(doc.select("meta[name=description]").attr("content"));
        if (doc.select("h1").size() > 0){
            pageResult.setHasH1(true);
        }
        pageResult.setOutboundLinks(doc.select("a[href]").eachAttr("abs:href"));

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

        return host.equals(host2);
    }

    public void crawl(CrawlJob crawlJob) throws IOException, InterruptedException, URISyntaxException {
        Queue<String> queue = new LinkedList<>();
        HashMap<String, Boolean> visited = new HashMap();
        crawlJob.setStatus("RUNNING");

        queue.add(crawlJob.getSeedUrl());

        while (!queue.isEmpty() && crawlJob.getPagesCrawled() != 500){
            String url = queue.poll();
            if (visited.containsKey(url)){
                continue;
            }
            visited.put(url, true);

            try{
                long startTime = System.currentTimeMillis();
                HttpResponse<String> response = fetchUrl(url);
                long endTime = System.currentTimeMillis();
                long duration = endTime - startTime;

                PageResult pageResult = parsePage(response.body(), url);
                pageResult.setStatusCode(response.statusCode());
                pageResult.setResponseTimeMs(duration);
                pageResult.setUrl(url);

                for(String link: pageResult.getOutboundLinks()){
                    if(!visited.containsKey(link) && isSameDomain(link, url)){
                        queue.add(link);
                    }
                }
                crawlJob.getResults().add(pageResult);
                crawlJob.setPagesCrawled(crawlJob.getPagesCrawled() + 1);
            }catch (Exception e){
                log.error("Crawling error", e);
            }

        }
        crawlJob.setStatus("DONE");
    }

}
