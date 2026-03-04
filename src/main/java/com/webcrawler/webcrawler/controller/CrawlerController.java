package com.webcrawler.webcrawler.controller;


import com.webcrawler.webcrawler.model.CrawlJob;
import com.webcrawler.webcrawler.model.ReportResponseClass;
import com.webcrawler.webcrawler.model.ResponseClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.webcrawler.webcrawler.repository.CrawlerRepository;
import com.webcrawler.webcrawler.service.AnalysisService;
import com.webcrawler.webcrawler.service.CrawlerService;

import java.io.IOException;
import java.net.URISyntaxException;

@RestController
public class CrawlerController {
    @Autowired
    private AnalysisService analysisService;
    @Autowired
    private CrawlerService crawlerService;
    @Autowired
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
    @GetMapping("/api/crawl/{id}/status")
    public ResponseClass getCrawlStatus(@PathVariable String id) {
        CrawlJob crawlJob = crawlerRepository.findById(id).orElse(null);

        ResponseClass responseClass = new ResponseClass();
        responseClass.setStatus(crawlJob.getStatus());
        responseClass.setPagesCrawled(crawlJob.getPagesCrawled());
        return responseClass;
    }

    @GetMapping("/api/crawl/{id}/report")
    public ReportResponseClass getCrawlReport(@PathVariable String id) {
        CrawlJob crawlJob = crawlerRepository.findById(id).orElse(null);

        if (crawlJob == null) {
            return new ReportResponseClass();
        }

        ReportResponseClass responseClass = new ReportResponseClass();
        responseClass.setBrokenLinks(analysisService.getBrokenLinks(crawlJob));
        responseClass.setSeoIssues(analysisService.findSeoIssues(crawlJob));
        responseClass.setDuplicatePages(analysisService.findDuplicatePages(crawlJob));
        responseClass.setSlowPages(analysisService.getSlowPages(crawlJob));

        return responseClass;

    }




}
