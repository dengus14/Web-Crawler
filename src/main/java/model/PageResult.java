package model;

import java.util.List;

public class PageResult {
    private String url;
    private int statusCode;
    private long responseTimeMs;
    private String title;
    private String metaDescription;
    private boolean hasH1;
    private List<String> outboundLinks;
    private List<String> brokenLinks;
    private String contentFingerprint;
}
