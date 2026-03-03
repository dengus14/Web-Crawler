package model;

import java.util.List;

public class CrawlJob {
    private String id;
    private String seedUrl;
    private String status; // PENDING, RUNNING, DONE - are in Status.java
    private int pagesCrawled;
    private List<PageResult> results;
}