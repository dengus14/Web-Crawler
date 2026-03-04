package com.webcrawler.webcrawler.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Column(columnDefinition = "TEXT")
    private String url;
    private int statusCode;
    private long responseTimeMs;
    @Column(columnDefinition = "TEXT")
    private String title;
    @Column(columnDefinition = "TEXT")
    private String metaDescription;
    private boolean hasH1 = false;
    @ElementCollection
    private List<String> outboundLinks;
    @ElementCollection
    private List<String> brokenLinks;
    private String contentFingerprint;
    @Column(columnDefinition = "TEXT")
    private String text;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "crawl_job_id")
    private CrawlJob crawlJob;
}
