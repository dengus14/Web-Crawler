package com.webcrawler.webcrawler.service;

import com.webcrawler.webcrawler.model.CrawlJob;
import com.webcrawler.webcrawler.model.PageResult;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class AnalysisService {

    public List<PageResult> getBrokenLinks(CrawlJob job){
        return job.getResults().stream()
                .filter(page -> page.getStatusCode() >= 400)
                .collect(Collectors.toList());
    }

    public List<PageResult> getSlowPages(CrawlJob job){

        int k = job.getResults().size() / 10;
        PriorityQueue<PageResult> minHeap = new PriorityQueue<>(k,
                Comparator.comparingLong(PageResult::getResponseTimeMs));

        for (PageResult pageResult : job.getResults()) {
            if(minHeap.size() < k){
                minHeap.offer(pageResult);
            }
            else if (minHeap.size() == k &&  pageResult.getResponseTimeMs() > minHeap.peek().getResponseTimeMs() ) {
                minHeap.poll();
                minHeap.offer(pageResult);
            }
        }
        return minHeap.stream().collect(Collectors.toList());
    }

    public List<PageResult> findSeoIssues(CrawlJob job){
        List<PageResult> seoIssues = new ArrayList<>();

        for (PageResult pageResult : job.getResults()) {
            if (pageResult.getTitle() == null
                    || pageResult.getTitle().isBlank()
                    || pageResult.getTitle().length() > 60
                    || pageResult.getMetaDescription().isEmpty()
                    || !pageResult.isHasH1()){
                seoIssues.add(pageResult);
            }
        }
        return seoIssues;
    }

    public List<PageResult> findDuplicatePages(CrawlJob job){
        HashMap<PageResult,Long> duplicatePages = new HashMap<>();
        List<PageResult> duplicateList = new ArrayList<>();

        for (PageResult pageResult : job.getResults()) {
            long hash = computeSimHash(pageResult.getText());
            duplicatePages.put(pageResult, hash);
        }
        List<PageResult> pages = new ArrayList<>(duplicatePages.keySet());
        for (int i = 0; i < pages.size(); i++) {
            for (int j = i + 1; j < pages.size(); j++) {
                if(duplicateList.contains(pages.get(i))){
                    continue;
                }
                long page1 = duplicatePages.get(pages.get(i));
                long page2 = duplicatePages.get(pages.get(j));

                long distance = Long.bitCount(page1 ^ page2);
                if (distance <= 5) {
                    duplicateList.add(pages.get(i));
                }

            }

        }
        return duplicateList;
    }

    public Long computeSimHash(String text){
        int vector[] = new int[64];
        long fingerprint = 0;

        String[] words = text.split("\\s+");
        for (int i = 0; i < words.length; i++) {
            long hash = words[i].hashCode();
            for(int j = 0; j < vector.length; j++){
                if (((hash >> j) & 1) == 1) {
                    vector[j] += 1;
                } else {
                    vector[j] -= 1;
                }
            }
        }

        for (int i = 0; i < vector.length; i++) {
            if (vector[i] > 0) {
                fingerprint |= (1L << i);
            }
        }
        return fingerprint;
    }


}
