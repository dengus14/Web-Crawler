package controller;


import model.CrawlJob;
import model.ReportResponseClass;
import model.ResponseClass;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
