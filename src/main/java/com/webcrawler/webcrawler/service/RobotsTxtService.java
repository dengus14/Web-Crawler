package com.webcrawler.webcrawler.service;

import com.webcrawler.webcrawler.model.RobotsTxtRules;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class RobotsTxtService {

    private final ConcurrentHashMap<String, RobotsTxtRules> cache = new ConcurrentHashMap<>();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public boolean isAllowed(String url) {
        String domain = extractDomain(url);
        if (domain == null) {
            return true;
        }

        RobotsTxtRules rules = cache.computeIfAbsent(domain, this::fetchAndParseRobotsTxt);
        return rules.allows(url);
    }

    private String extractDomain(String url) {
        try {
            URI uri = new URI(url);
            String scheme = uri.getScheme();
            String host = uri.getHost();
            int port = uri.getPort();

            if (scheme == null || host == null) {
                return null;
            }

            if (port == -1) {
                return scheme + "://" + host;
            } else {
                return scheme + "://" + host + ":" + port;
            }
        } catch (URISyntaxException e) {
            return null;
        }
    }

    private RobotsTxtRules fetchAndParseRobotsTxt(String domain) {
        try {
            String robotsTxtUrl = domain + "/robots.txt";
            log.info("Fetching robots.txt from {}", robotsTxtUrl);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(robotsTxtUrl))
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 404) {
                log.info("No robots.txt found for {}, allowing all URLs", domain);
                return RobotsTxtRules.allowAll();
            }

            if (response.statusCode() != 200) {
                log.warn("robots.txt returned status {} for {}, allowing all URLs", response.statusCode(), domain);
                return RobotsTxtRules.allowAll();
            }

            return parseRobotsTxt(response.body());

        } catch (Exception e) {
            log.warn("Failed to fetch robots.txt for {}, allowing all URLs. Error: {}", domain, e.getMessage());
            return RobotsTxtRules.allowAll();
        }
    }

    private RobotsTxtRules parseRobotsTxt(String content) {
        List<String> disallowedPaths = new ArrayList<>();
        String currentUserAgent = null;

        for (String line : content.split("\n")) {
            line = line.trim();

            if (line.isEmpty() || line.startsWith("#")) {
                continue;
            }

            String lowerLine = line.toLowerCase();

            if (lowerLine.startsWith("user-agent:")) {
                currentUserAgent = lowerLine.substring(11).trim();
            }

            if ("*".equals(currentUserAgent) && lowerLine.startsWith("disallow:")) {
                String path = line.substring(9).trim();
                if (!path.isEmpty()) {
                    disallowedPaths.add(path);
                    log.debug("Added disallow rule: {}", path);
                }
            }
        }

        log.info("Parsed robots.txt with {} disallow rules", disallowedPaths.size());
        return new RobotsTxtRules(disallowedPaths);
    }
}
