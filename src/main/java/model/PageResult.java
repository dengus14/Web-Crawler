package model;

import lombok.Data;

import java.util.List;

@Data
public class PageResult {
    private String url;
    private int statusCode;
    private long responseTimeMs;
    private String title;
    private String metaDescription;
    private boolean hasH1 = false;
    private List<String> outboundLinks;
    private List<String> brokenLinks;
    private String contentFingerprint;
}
