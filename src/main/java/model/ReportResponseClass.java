package model;

import lombok.Data;

import java.util.List;
@Data
public class ReportResponseClass {

    private List<PageResult> brokenLinks;
    private List<PageResult> slowPages;
    private List<PageResult> seoIssues;
    private List<PageResult> duplicatePages;
}
