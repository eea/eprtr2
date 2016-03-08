package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;
import java.sql.Timestamp;


/**
 * The persistent class for the FACILITYDETAIL_COMPETENTAUTHORITYPARTY database table.
 *
 */
@Entity
@Table(name="FACILITYDETAIL_COMPETENTAUTHORITYPARTY")
@NamedQuery(name="FacilitydetailAuthority.findByFacilityReportID", query="SELECT f FROM FacilitydetailAuthority f where f.facilityReportID = :FacilityReportID")
public class FacilitydetailAuthority implements Serializable {
    private static final long serialVersionUID = 1L;

    private String CAAddress;

    private String CACity;

    private String CAContactPersonName;

    private String CAEmailCommunication;

    private String CAFaxCommunication;

    private Timestamp CALastUpdate;

    private String CAName;

    private String CAPostalCode;

    private Integer CAReportingYear;

    private String CATelephoneCommunication;

    @Id
    @Column(name="FacilityReportID")
    private Integer facilityReportID;

    public FacilitydetailAuthority() {
    }

    public String getCAAddress() {
        return this.CAAddress;
    }

    public void setCAAddress(String CAAddress) {
        this.CAAddress = CAAddress;
    }

    public String getCACity() {
        return this.CACity;
    }

    public void setCACity(String CACity) {
        this.CACity = CACity;
    }

    public String getCAContactPersonName() {
        return this.CAContactPersonName;
    }

    public void setCAContactPersonName(String CAContactPersonName) {
        this.CAContactPersonName = CAContactPersonName;
    }

    public String getCAEmailCommunication() {
        return this.CAEmailCommunication;
    }

    public void setCAEmailCommunication(String CAEmailCommunication) {
        this.CAEmailCommunication = CAEmailCommunication;
    }

    public String getCAFaxCommunication() {
        return this.CAFaxCommunication;
    }

    public void setCAFaxCommunication(String CAFaxCommunication) {
        this.CAFaxCommunication = CAFaxCommunication;
    }

    public Timestamp getCALastUpdate() {
        return this.CALastUpdate;
    }

    public void setCALastUpdate(Timestamp CALastUpdate) {
        this.CALastUpdate = CALastUpdate;
    }

    public String getCAName() {
        return this.CAName;
    }

    public void setCAName(String CAName) {
        this.CAName = CAName;
    }

    public String getCAPostalCode() {
        return this.CAPostalCode;
    }

    public void setCAPostalCode(String CAPostalCode) {
        this.CAPostalCode = CAPostalCode;
    }

    public Integer getCAReportingYear() {
        return this.CAReportingYear;
    }

    public void setCAReportingYear(Integer CAReportingYear) {
        this.CAReportingYear = CAReportingYear;
    }

    public String getCATelephoneCommunication() {
        return this.CATelephoneCommunication;
    }

    public void setCATelephoneCommunication(String CATelephoneCommunication) {
        this.CATelephoneCommunication = CATelephoneCommunication;
    }

    public Integer getFacilityReportID() {
        return this.facilityReportID;
    }

    public void setFacilityReportID(Integer facilityReportID) {
        this.facilityReportID = facilityReportID;
    }

}
