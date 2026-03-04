package com.webcrawler.webcrawler.model;


import lombok.Data;

import java.util.List;

@Data
public class ResponseClass {

    private String status;
    private int pagesCrawled;
}
