package service;

import model.PageResult;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;

public class CrawlerService {
    HttpClient client = HttpClient.newHttpClient();
    Queue<String> queue = new LinkedList<>();
    HashMap visited = new HashMap();

    private HttpResponse<String> fetchUrl(String url) throws IOException, InterruptedException {
        HttpResponse<String> response = null;
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();
        response = client.send(request, HttpResponse.BodyHandlers.ofString());


        return response;
    }

}
