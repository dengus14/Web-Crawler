package com.webcrawler.webcrawler.model;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;

public class RobotsTxtRules {
    private final List<String> disallowedPaths;

    public RobotsTxtRules(List<String> disallowedPaths) {
        this.disallowedPaths = disallowedPaths;
    }

    public boolean allows(String url) {
        try {
            URI uri = new URI(url);
            String path = uri.getPath();

            if (path == null || path.isEmpty()) {
                path = "/";
            }

            String finalPath = path;
            return disallowedPaths.stream()
                    .noneMatch(finalPath::startsWith);

        } catch (URISyntaxException e) {
            return true;
        }
    }

    public static RobotsTxtRules allowAll() {
        return new RobotsTxtRules(Collections.emptyList());
    }
}
