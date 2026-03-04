package com.webcrawler.webcrawler.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "page_results")
public class PageResult {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String url;
    private int statusCode;
    private long responseTimeMs;
    private String title;
    private String metaDescription;
    private boolean hasH1 = false;
    @ElementCollection
    private List<String> outboundLinks;
    @ElementCollection
    private List<String> brokenLinks;
    private String contentFingerprint;
    private String text;

    @ManyToOne
    @JoinColumn(name = "crawl_job_id")
    private CrawlJob crawlJob;
}
