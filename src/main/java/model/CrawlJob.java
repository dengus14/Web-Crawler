package model;

import lombok.Data;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Data
public class CrawlJob {
    private String id;
    private String seedUrl;
    private String status; // PENDING, RUNNING, DONE - are in Status.java
    private int pagesCrawled;
    private CopyOnWriteArrayList<PageResult> results;
}