package model;

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
    private List<String> outboundLinks;
    private List<String> brokenLinks;
    private String contentFingerprint;
    private String text;
}
