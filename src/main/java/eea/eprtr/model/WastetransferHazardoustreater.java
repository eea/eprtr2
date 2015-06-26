package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the WASTETRANSFER_HAZARDOUSTREATERS database table.
 * 
 */
@Entity
@Table(name="WASTETRANSFER_HAZARDOUSTREATERS")
@NamedQuery(name="WastetransferHazardoustreater.findAll", query="SELECT w FROM WastetransferHazardoustreater w")
public class WastetransferHazardoustreater implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="ConfidentialCode")
	private String confidentialCode;

	@Column(name="ConfidentialIndicator")
	private Boolean confidentialIndicator;

	@Column(name="ConfidentialIndicatorFacility")
	private Boolean confidentialIndicatorFacility;

	@Column(name="CountryCode")
	private String countryCode;

	@Column(name="FacilityID")
	private Integer facilityID;

	@Column(name="FacilityName")
	private String facilityName;

	@Id
	@Column(name="FacilityReportID")
	private Integer facilityReportID;

	private String IAActivityCode;

	private String IASectorCode;

	private String IASubActivityCode;

	private String IPPCActivityCode;

	private String IPPCSectorCode;

	private String IPPCSubActivityCode;

	private Integer LOV_ConfidentialityID;

	private Integer LOV_CountryID;

	private Integer LOV_IAActivityID;

	private Integer LOV_IASectorID;

	private Integer LOV_IASubActivityID;

	private Integer LOV_NACEActivityID;

	private Integer LOV_NACESectorID;

	private Integer LOV_NACESubActivityID;

	private Integer LOV_NUTSRLevel1ID;

	private Integer LOV_NUTSRLevel2ID;

	private Integer LOV_NUTSRLevel3ID;

	private Integer LOV_RiverBasinDistrictID;

	private String NACEActivityCode;

	private String NACESectorCode;

	private String NACESubActivityCode;

	@Column(name="NumberOfReports")
	private Integer numberOfReports;

	private String NUTSLevel2RegionCode;

	@Column(name="Quantity")
	private Double quantity;

	@Column(name="ReportingYear")
	private Integer reportingYear;

	@Column(name="RiverBasinDistrictCode")
	private String riverBasinDistrictCode;

	@Column(name="UnitCode")
	private String unitCode;

	@Column(name="WasteTreatmentCode")
	private String wasteTreatmentCode;

	private String WHPAddress;

	private String WHPCity;

	private String WHPCountryCode;

	private String WHPName;

	private String WHPPostalCode;

	private String WHPSiteAddress;

	private String WHPSiteCity;

	private String WHPSiteCountryCode;

	private String WHPSitePostalCode;

	public WastetransferHazardoustreater() {
	}

	public String getConfidentialCode() {
		return this.confidentialCode;
	}

	public void setConfidentialCode(String confidentialCode) {
		this.confidentialCode = confidentialCode;
	}

	public Boolean getConfidentialIndicator() {
		return this.confidentialIndicator;
	}

	public void setConfidentialIndicator(Boolean confidentialIndicator) {
		this.confidentialIndicator = confidentialIndicator;
	}

	public Boolean getConfidentialIndicatorFacility() {
		return this.confidentialIndicatorFacility;
	}

	public void setConfidentialIndicatorFacility(Boolean confidentialIndicatorFacility) {
		this.confidentialIndicatorFacility = confidentialIndicatorFacility;
	}

	public String getCountryCode() {
		return this.countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public Integer getFacilityID() {
		return this.facilityID;
	}

	public void setFacilityID(Integer facilityID) {
		this.facilityID = facilityID;
	}

	public String getFacilityName() {
		return this.facilityName;
	}

	public void setFacilityName(String facilityName) {
		this.facilityName = facilityName;
	}

	public Integer getFacilityReportID() {
		return this.facilityReportID;
	}

	public void setFacilityReportID(Integer facilityReportID) {
		this.facilityReportID = facilityReportID;
	}

	public String getIAActivityCode() {
		return this.IAActivityCode;
	}

	public void setIAActivityCode(String IAActivityCode) {
		this.IAActivityCode = IAActivityCode;
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

	public Integer getLOV_CountryID() {
		return this.LOV_CountryID;
	}

	public void setLOV_CountryID(Integer LOV_CountryID) {
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

	public Integer getLOV_RiverBasinDistrictID() {
		return this.LOV_RiverBasinDistrictID;
	}

	public void setLOV_RiverBasinDistrictID(Integer LOV_RiverBasinDistrictID) {
		this.LOV_RiverBasinDistrictID = LOV_RiverBasinDistrictID;
	}

	public String getNACEActivityCode() {
		return this.NACEActivityCode;
	}

	public void setNACEActivityCode(String NACEActivityCode) {
		this.NACEActivityCode = NACEActivityCode;
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

	public Integer getNumberOfReports() {
		return this.numberOfReports;
	}

	public void setNumberOfReports(Integer numberOfReports) {
		this.numberOfReports = numberOfReports;
	}

	public String getNUTSLevel2RegionCode() {
		return this.NUTSLevel2RegionCode;
	}

	public void setNUTSLevel2RegionCode(String NUTSLevel2RegionCode) {
		this.NUTSLevel2RegionCode = NUTSLevel2RegionCode;
	}

	public Double getQuantity() {
		return this.quantity;
	}

	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}

	public Integer getReportingYear() {
		return this.reportingYear;
	}

	public void setReportingYear(Integer reportingYear) {
		this.reportingYear = reportingYear;
	}

	public String getRiverBasinDistrictCode() {
		return this.riverBasinDistrictCode;
	}

	public void setRiverBasinDistrictCode(String riverBasinDistrictCode) {
		this.riverBasinDistrictCode = riverBasinDistrictCode;
	}

	public String getUnitCode() {
		return this.unitCode;
	}

	public void setUnitCode(String unitCode) {
		this.unitCode = unitCode;
	}

	public String getWasteTreatmentCode() {
		return this.wasteTreatmentCode;
	}

	public void setWasteTreatmentCode(String wasteTreatmentCode) {
		this.wasteTreatmentCode = wasteTreatmentCode;
	}

	public String getWHPAddress() {
		return this.WHPAddress;
	}

	public void setWHPAddress(String WHPAddress) {
		this.WHPAddress = WHPAddress;
	}

	public String getWHPCity() {
		return this.WHPCity;
	}

	public void setWHPCity(String WHPCity) {
		this.WHPCity = WHPCity;
	}

	public String getWHPCountryCode() {
		return this.WHPCountryCode;
	}

	public void setWHPCountryCode(String WHPCountryCode) {
		this.WHPCountryCode = WHPCountryCode;
	}

	public String getWHPName() {
		return this.WHPName;
	}

	public void setWHPName(String WHPName) {
		this.WHPName = WHPName;
	}

	public String getWHPPostalCode() {
		return this.WHPPostalCode;
	}

	public void setWHPPostalCode(String WHPPostalCode) {
		this.WHPPostalCode = WHPPostalCode;
	}

	public String getWHPSiteAddress() {
		return this.WHPSiteAddress;
	}

	public void setWHPSiteAddress(String WHPSiteAddress) {
		this.WHPSiteAddress = WHPSiteAddress;
	}

	public String getWHPSiteCity() {
		return this.WHPSiteCity;
	}

	public void setWHPSiteCity(String WHPSiteCity) {
		this.WHPSiteCity = WHPSiteCity;
	}

	public String getWHPSiteCountryCode() {
		return this.WHPSiteCountryCode;
	}

	public void setWHPSiteCountryCode(String WHPSiteCountryCode) {
		this.WHPSiteCountryCode = WHPSiteCountryCode;
	}

	public String getWHPSitePostalCode() {
		return this.WHPSitePostalCode;
	}

	public void setWHPSitePostalCode(String WHPSitePostalCode) {
		this.WHPSitePostalCode = WHPSitePostalCode;
	}

}