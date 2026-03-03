package controller;


import model.CrawlJob;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import repository.CrawlerRepository;
import service.AnalysisService;
import service.CrawlerService;

import java.io.IOException;
import java.net.URISyntaxException;

@Controller

public class CrawlerController {
    private AnalysisService analysisService;
    private CrawlerService crawlerService;
    private CrawlerRepository crawlerRepository;

    @PostMapping("/api/crawl")
    public String startCrawlJob(@RequestParam String url) throws IOException, URISyntaxException, InterruptedException {
        CrawlJob crawlJob = new CrawlJob();
        crawlJob.setSeedUrl(url);
        crawlJob.setStatus("PENDING");

        CrawlJob savedJob = crawlerRepository.save(crawlJob);
        crawlerService.crawl(savedJob);
        return savedJob.getId();

    }


}
