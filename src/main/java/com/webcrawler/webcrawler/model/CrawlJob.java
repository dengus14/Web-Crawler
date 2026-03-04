package com.webcrawler.webcrawler.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "crawl_jobs")
public class CrawlJob {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String seedUrl;
    private String status; // PENDING, RUNNING, DONE - are in Status.java
    private int pagesCrawled;
    private int maxPages = 500;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PageResult> results = new ArrayList<>();
}