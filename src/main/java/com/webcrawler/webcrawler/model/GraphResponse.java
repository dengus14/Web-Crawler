package com.webcrawler.webcrawler.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraphResponse {
    private List<GraphNode> nodes;
    private List<GraphLink> links;
}
