package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the FACILITYSEARCH_MAINACTIVITY database table.
 *
 */
@Entity
@Table(name="FACILITYSEARCH_MAINACTIVITY")
@NamedQuery(name="FacilitySearchMainActivity.findAll", query="SELECT f FROM FacilitySearchMainActivity f")
public class FacilitySearchMainActivity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name="FacilityReportID", unique=true, nullable=false)
    private int facilityReportID;

    @Column(name="Address", length=511)
    private String address;

    @Column(name="City", length=255)
    private String city;

    @Column(name="ConfidentialCode", length=255)
    private String confidentialCode;

    @Column(name="ConfidentialIndicator", nullable=false)
    private boolean confidentialIndicator;

    @Column(name="CountryCode", length=255)
    private String countryCode;

    @Column(name="FacilityID", nullable=false)
    private int facilityID;

    @Column(name="FacilityName", length=255)
    private String facilityName;

    @Column(length=255)
    private String IAActivityCode;

    @Column(nullable=false, length=255)
    private String IAReportedActivityCode;

    @Column(length=255)
    private String IASectorCode;

    @Column(length=255)
    private String IASubActivityCode;

    @Column(length=255)
    private String IPPCActivityCode;

    @Column(length=255)
    private String IPPCReportedActivityCode;

    @Column(length=255)
    private String IPPCSectorCode;

    @Column(length=255)
    private String IPPCSubActivityCode;

    private Integer LOV_ConfidentialityID;

    @Column(nullable=false)
    private int LOV_CountryID;

    private Integer LOV_IAActivityID;

    private Integer LOV_IASectorID;

    private Integer LOV_IASubActivityID;

    private Integer LOV_NACEActivityID;

    private Integer LOV_NACESectorID;

    private Integer LOV_NACESubActivityID;

    private Integer LOV_NUTSRLevel1ID;

    private Integer LOV_NUTSRLevel2ID;

    private Integer LOV_NUTSRLevel3ID;

    @Column(nullable=false)
    private int LOV_RiverBasinDistrictID;

    @Column(length=255)
    private String NACEActivityCode;

    @Column(nullable=false, length=255)
    private String NACEReportedActivityCode;

    @Column(length=255)
    private String NACESectorCode;

    @Column(length=255)
    private String NACESubActivityCode;

    @Column(name="NationalID", nullable=false, length=255)
    private String nationalID;

    @Column(length=255)
    private String NUTSLevel2RegionCode;

    @Column(name="ParentCompanyName", length=255)
    private String parentCompanyName;

    @Column(name="PostalCode", length=50)
    private String postalCode;

    @Column(name="ReportingYear", nullable=false)
    private int reportingYear;

    @Column(name="RiverBasinDistrictCode", nullable=false, length=255)
    private String riverBasinDistrictCode;

    public FacilitySearchMainActivity() {
    }

    public int getFacilityReportID() {
        return this.facilityReportID;
    }

    public void setFacilityReportID(int facilityReportID) {
        this.facilityReportID = facilityReportID;
    }

    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getConfidentialCode() {
        return this.confidentialCode;
    }

    public void setConfidentialCode(String confidentialCode) {
        this.confidentialCode = confidentialCode;
    }

    public boolean getConfidentialIndicator() {
        return this.confidentialIndicator;
    }

    public void setConfidentialIndicator(boolean confidentialIndicator) {
        this.confidentialIndicator = confidentialIndicator;
    }

    public String getCountryCode() {
        return this.countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public int getFacilityID() {
        return this.facilityID;
    }

    public void setFacilityID(int facilityID) {
        this.facilityID = facilityID;
    }

    public String getFacilityName() {
        return this.facilityName;
    }

    public void setFacilityName(String facilityName) {
        this.facilityName = facilityName;
    }

    public String getIAActivityCode() {
        return this.IAActivityCode;
    }

    public void setIAActivityCode(String IAActivityCode) {
        this.IAActivityCode = IAActivityCode;
    }

    public String getIAReportedActivityCode() {
        return this.IAReportedActivityCode;
    }

    public void setIAReportedActivityCode(String IAReportedActivityCode) {
        this.IAReportedActivityCode = IAReportedActivityCode;
    }

    public String getIASectorCode() {
        return this.IASectorCode;
    }

    public void setIASectorCode(String IASectorCode) {
        this.IASectorCode = IASectorCode;
    }

    public String getIASubActivityCode() {
        return this.IASubActivityCode;
    }

    public void setIASubActivityCode(String IASubActivityCode) {
        this.IASubActivityCode = IASubActivityCode;
    }

    public String getIPPCActivityCode() {
        return this.IPPCActivityCode;
    }

    public void setIPPCActivityCode(String IPPCActivityCode) {
        this.IPPCActivityCode = IPPCActivityCode;
    }

    public String getIPPCReportedActivityCode() {
        return this.IPPCReportedActivityCode;
    }

    public void setIPPCReportedActivityCode(String IPPCReportedActivityCode) {
        this.IPPCReportedActivityCode = IPPCReportedActivityCode;
    }

    public String getIPPCSectorCode() {
        return this.IPPCSectorCode;
    }

    public void setIPPCSectorCode(String IPPCSectorCode) {
        this.IPPCSectorCode = IPPCSectorCode;
    }

    public String getIPPCSubActivityCode() {
        return this.IPPCSubActivityCode;
    }

    public void setIPPCSubActivityCode(String IPPCSubActivityCode) {
        this.IPPCSubActivityCode = IPPCSubActivityCode;
    }

    public Integer getLOV_ConfidentialityID() {
        return this.LOV_ConfidentialityID;
    }

    public void setLOV_ConfidentialityID(Integer LOV_ConfidentialityID) {
        this.LOV_ConfidentialityID = LOV_ConfidentialityID;
    }

    public int getLOV_CountryID() {
        return this.LOV_CountryID;
    }

    public void setLOV_CountryID(int LOV_CountryID) {
        this.LOV_CountryID = LOV_CountryID;
    }

    public Integer getLOV_IAActivityID() {
        return this.LOV_IAActivityID;
    }

    public void setLOV_IAActivityID(Integer LOV_IAActivityID) {
        this.LOV_IAActivityID = LOV_IAActivityID;
    }

    public Integer getLOV_IASectorID() {
        return this.LOV_IASectorID;
    }

    public void setLOV_IASectorID(Integer LOV_IASectorID) {
        this.LOV_IASectorID = LOV_IASectorID;
    }

    public Integer getLOV_IASubActivityID() {
        return this.LOV_IASubActivityID;
    }

    public void setLOV_IASubActivityID(Integer LOV_IASubActivityID) {
        this.LOV_IASubActivityID = LOV_IASubActivityID;
    }

    public Integer getLOV_NACEActivityID() {
        return this.LOV_NACEActivityID;
    }

    public void setLOV_NACEActivityID(Integer LOV_NACEActivityID) {
        this.LOV_NACEActivityID = LOV_NACEActivityID;
    }

    public Integer getLOV_NACESectorID() {
        return this.LOV_NACESectorID;
    }

    public void setLOV_NACESectorID(Integer LOV_NACESectorID) {
        this.LOV_NACESectorID = LOV_NACESectorID;
    }

    public Integer getLOV_NACESubActivityID() {
        return this.LOV_NACESubActivityID;
    }

    public void setLOV_NACESubActivityID(Integer LOV_NACESubActivityID) {
        this.LOV_NACESubActivityID = LOV_NACESubActivityID;
    }

    public Integer getLOV_NUTSRLevel1ID() {
        return this.LOV_NUTSRLevel1ID;
    }

    public void setLOV_NUTSRLevel1ID(Integer LOV_NUTSRLevel1ID) {
        this.LOV_NUTSRLevel1ID = LOV_NUTSRLevel1ID;
    }

    public Integer getLOV_NUTSRLevel2ID() {
        return this.LOV_NUTSRLevel2ID;
    }

    public void setLOV_NUTSRLevel2ID(Integer LOV_NUTSRLevel2ID) {
        this.LOV_NUTSRLevel2ID = LOV_NUTSRLevel2ID;
    }

    public Integer getLOV_NUTSRLevel3ID() {
        return this.LOV_NUTSRLevel3ID;
    }

    public void setLOV_NUTSRLevel3ID(Integer LOV_NUTSRLevel3ID) {
        this.LOV_NUTSRLevel3ID = LOV_NUTSRLevel3ID;
    }

    public int getLOV_RiverBasinDistrictID() {
        return this.LOV_RiverBasinDistrictID;
    }

    public void setLOV_RiverBasinDistrictID(int LOV_RiverBasinDistrictID) {
        this.LOV_RiverBasinDistrictID = LOV_RiverBasinDistrictID;
    }

    public String getNACEActivityCode() {
        return this.NACEActivityCode;
    }

    public void setNACEActivityCode(String NACEActivityCode) {
        this.NACEActivityCode = NACEActivityCode;
    }

    public String getNACEReportedActivityCode() {
        return this.NACEReportedActivityCode;
    }

    public void setNACEReportedActivityCode(String NACEReportedActivityCode) {
        this.NACEReportedActivityCode = NACEReportedActivityCode;
    }

    public String getNACESectorCode() {
        return this.NACESectorCode;
    }

    public void setNACESectorCode(String NACESectorCode) {
        this.NACESectorCode = NACESectorCode;
    }

    public String getNACESubActivityCode() {
        return this.NACESubActivityCode;
    }

    public void setNACESubActivityCode(String NACESubActivityCode) {
        this.NACESubActivityCode = NACESubActivityCode;
    }

    public String getNationalID() {
        return this.nationalID;
    }

    public void setNationalID(String nationalID) {
        this.nationalID = nationalID;
    }

    public String getNUTSLevel2RegionCode() {
        return this.NUTSLevel2RegionCode;
    }

    public void setNUTSLevel2RegionCode(String NUTSLevel2RegionCode) {
        this.NUTSLevel2RegionCode = NUTSLevel2RegionCode;
    }

    public String getParentCompanyName() {
        return this.parentCompanyName;
    }

    public void setParentCompanyName(String parentCompanyName) {
        this.parentCompanyName = parentCompanyName;
    }

    public String getPostalCode() {
        return this.postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public int getReportingYear() {
        return this.reportingYear;
    }

    public void setReportingYear(int reportingYear) {
        this.reportingYear = reportingYear;
    }

    public String getRiverBasinDistrictCode() {
        return this.riverBasinDistrictCode;
    }

    public void setRiverBasinDistrictCode(String riverBasinDistrictCode) {
        this.riverBasinDistrictCode = riverBasinDistrictCode;
    }

}
