package com.webcrawler.webcrawler.service;

import com.webcrawler.webcrawler.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GraphService {

    public GraphResponse buildGraph(CrawlJob crawlJob) {
        List<GraphNode> nodes = new ArrayList<>();
        List<GraphLink> links = new ArrayList<>();

        Set<String> crawledUrls = crawlJob.getResults().stream()
                .map(PageResult::getUrl)
                .collect(Collectors.toSet());

        for (PageResult page : crawlJob.getResults()) {
            GraphNode node = new GraphNode();
            node.setId(page.getUrl());
            node.setStatusCode(page.getStatusCode());
            node.setResponseTimeMs(page.getResponseTimeMs());
            node.setHasIssues(hasIssues(page));
            nodes.add(node);

            for (String outboundLink : page.getOutboundLinks()) {
                if (crawledUrls.contains(outboundLink)) {
                    GraphLink link = new GraphLink();
                    link.setSource(page.getUrl());
                    link.setTarget(outboundLink);
                    links.add(link);
                }
            }
        }

        return new GraphResponse(nodes, links);
    }

    private boolean hasIssues(PageResult page) {
        return page.getStatusCode() >= 400
                || page.getResponseTimeMs() > 1000
                || !page.isHasH1()
                || page.getTitle() == null
                || page.getTitle().isEmpty();
    }
}
