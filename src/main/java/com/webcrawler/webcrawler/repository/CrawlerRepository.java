package com.webcrawler.webcrawler.repository;

import com.webcrawler.webcrawler.model.CrawlJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrawlerRepository extends JpaRepository<CrawlJob, String> {
}
