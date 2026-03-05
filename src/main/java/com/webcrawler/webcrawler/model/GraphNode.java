package com.webcrawler.webcrawler.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraphNode {
    private String id;
    private int statusCode;
    private long responseTimeMs;
    private boolean hasIssues;
}
