package eea.eprtrcms.model;

import java.sql.Timestamp;

/**
 * Log of data imports.
 */
public class DataImport {

    private Integer reportingYear;

    private String country;

    private Timestamp forReview;

    private Timestamp published;

    public Integer getReportingYear() {
        return reportingYear;
    }

    public void setReportingYear(Integer reportingYear) {
        this.reportingYear = reportingYear;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Timestamp getForReview() {
        return forReview;
    }

    public void setForReview(Timestamp forReview) {
        this.forReview = forReview;
    }

    public Timestamp getPublished() {
        return published;
    }

    public void setPublished(Timestamp published) {
        this.published = published;
    }

}
