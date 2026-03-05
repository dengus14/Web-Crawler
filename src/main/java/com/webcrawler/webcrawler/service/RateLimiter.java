package com.webcrawler.webcrawler.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class RateLimiter {

    private final ConcurrentHashMap<String, Long> lastRequestTime = new ConcurrentHashMap<>();
    private final long delayMs;

    public RateLimiter(@Value("${crawler.rate.limit.delay:500}") long delayMs) {
        this.delayMs = delayMs;
        log.info("RateLimiter initialized with {}ms delay", delayMs);
    }

    public synchronized void waitIfNeeded(String url) throws InterruptedException {
        String domain = extractDomain(url);
        if (domain == null) {
            return;
        }

        Long lastTime = lastRequestTime.get(domain);

        if (lastTime != null) {
            long elapsed = System.currentTimeMillis() - lastTime;
            long waitTime = delayMs - elapsed;

            if (waitTime > 0) {
                log.debug("Rate limiting: waiting {}ms for domain {}", waitTime, domain);
                Thread.sleep(waitTime);
            }
        }

        lastRequestTime.put(domain, System.currentTimeMillis());
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
}
