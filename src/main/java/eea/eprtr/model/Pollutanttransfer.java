package eea.eprtr.model;

import java.io.Serializable;

import javax.persistence.*;

/**
 * The persistent class for the POLLUTANTTRANSFER database table.
 * 
 */
@Entity
@Table(name="POLLUTANTTRANSFER")
@NamedQuery(name="Pollutanttransfer.findAll", query="SELECT p FROM Pollutanttransfer p")
public class Pollutanttransfer implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Column(name="CAS")
	private String cas;

	@Column(name="ConfidentialIndicator")
	private boolean confidentialIndicator;

	@Column(name="ConfidentialIndicatorFacility")
	private boolean confidentialIndicatorFacility;
	
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
	
	private Integer LOV_CountryID;
	
	private Integer LOV_IAActivityID;

	private Integer LOV_IASectorID;

	private Integer LOV_IASubActivityID;
	
	private Integer LOV_NUTSRLevel1ID;

	private Integer LOV_NUTSRLevel2ID;

	private Integer LOV_NUTSRLevel3ID;
	
	private Integer LOV_PollutantGroupID;

	private Integer LOV_PollutantID;

	private Integer LOV_RiverBasinDistrictID;
	
	private String NACEActivityCode;

	private String NACESectorCode;
	
	private String NACESubActivityCode;

	private String NUTSLevel2RegionCode;
	
	private Integer LOV_NACEActivityID;

	private Integer LOV_NACESectorID;

	private Integer LOV_NACESubActivityID;
	
	@Column(name="ReportingYear")
	private Integer reportingYear;

	@Column(name="RiverBasinDistrictCode")
	private String riverBasinDistrictCode;
	
	@Column(name="UnitCode")
	private String unitCode;
	
	@Column(name="PollutantCode")
	private String pollutantCode;

	@Column(name="PollutantGroupCode")
	private String pollutantGroupCode;
	
	@Column(name="Quantity")
	private Double quantity;

	public String getCas() {
		return cas;
	}

	public void setCas(String cas) {
		this.cas = cas;
	}

	public boolean isConfidentialIndicator() {
		return confidentialIndicator;
	}

	public void setConfidentialIndicator(boolean confidentialIndicator) {
		this.confidentialIndicator = confidentialIndicator;
	}

	public boolean isConfidentialIndicatorFacility() {
		return confidentialIndicatorFacility;
	}

	public void setConfidentialIndicatorFacility(
			boolean confidentialIndicatorFacility) {
		this.confidentialIndicatorFacility = confidentialIndicatorFacility;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public Integer getFacilityID() {
		return facilityID;
	}

	public void setFacilityID(Integer facilityID) {
		this.facilityID = facilityID;
	}

	public String getFacilityName() {
		return facilityName;
	}

	public void setFacilityName(String facilityName) {
		this.facilityName = facilityName;
	}

	public Integer getFacilityReportID() {
		return facilityReportID;
	}

	public void setFacilityReportID(Integer facilityReportID) {
		this.facilityReportID = facilityReportID;
	}

	public String getIAActivityCode() {
		return IAActivityCode;
	}

	public void setIAActivityCode(String iAActivityCode) {
		IAActivityCode = iAActivityCode;
	}

	public String getIASectorCode() {
		return IASectorCode;
	}

	public void setIASectorCode(String iASectorCode) {
		IASectorCode = iASectorCode;
	}

	public String getIASubActivityCode() {
		return IASubActivityCode;
	}

	public void setIASubActivityCode(String iASubActivityCode) {
		IASubActivityCode = iASubActivityCode;
	}

	public String getIPPCActivityCode() {
		return IPPCActivityCode;
	}

	public void setIPPCActivityCode(String iPPCActivityCode) {
		IPPCActivityCode = iPPCActivityCode;
	}

	public String getIPPCSectorCode() {
		return IPPCSectorCode;
	}

	public void setIPPCSectorCode(String iPPCSectorCode) {
		IPPCSectorCode = iPPCSectorCode;
	}

	public String getIPPCSubActivityCode() {
		return IPPCSubActivityCode;
	}

	public void setIPPCSubActivityCode(String iPPCSubActivityCode) {
		IPPCSubActivityCode = iPPCSubActivityCode;
	}

	public Integer getLOV_CountryID() {
		return LOV_CountryID;
	}

	public void setLOV_CountryID(Integer lOV_CountryID) {
		LOV_CountryID = lOV_CountryID;
	}

	public Integer getLOV_IAActivityID() {
		return LOV_IAActivityID;
	}

	public void setLOV_IAActivityID(Integer lOV_IAActivityID) {
		LOV_IAActivityID = lOV_IAActivityID;
	}

	public Integer getLOV_IASectorID() {
		return LOV_IASectorID;
	}

	public void setLOV_IASectorID(Integer lOV_IASectorID) {
		LOV_IASectorID = lOV_IASectorID;
	}

	public Integer getLOV_IASubActivityID() {
		return LOV_IASubActivityID;
	}

	public void setLOV_IASubActivityID(Integer lOV_IASubActivityID) {
		LOV_IASubActivityID = lOV_IASubActivityID;
	}

	public Integer getLOV_NUTSRLevel1ID() {
		return LOV_NUTSRLevel1ID;
	}

	public void setLOV_NUTSRLevel1ID(Integer lOV_NUTSRLevel1ID) {
		LOV_NUTSRLevel1ID = lOV_NUTSRLevel1ID;
	}

	public Integer getLOV_NUTSRLevel2ID() {
		return LOV_NUTSRLevel2ID;
	}

	public void setLOV_NUTSRLevel2ID(Integer lOV_NUTSRLevel2ID) {
		LOV_NUTSRLevel2ID = lOV_NUTSRLevel2ID;
	}

	public Integer getLOV_NUTSRLevel3ID() {
		return LOV_NUTSRLevel3ID;
	}

	public void setLOV_NUTSRLevel3ID(Integer lOV_NUTSRLevel3ID) {
		LOV_NUTSRLevel3ID = lOV_NUTSRLevel3ID;
	}

	public Integer getLOV_PollutantGroupID() {
		return LOV_PollutantGroupID;
	}

	public void setLOV_PollutantGroupID(Integer lOV_PollutantGroupID) {
		LOV_PollutantGroupID = lOV_PollutantGroupID;
	}

	public Integer getLOV_PollutantID() {
		return LOV_PollutantID;
	}

	public void setLOV_PollutantID(Integer lOV_PollutantID) {
		LOV_PollutantID = lOV_PollutantID;
	}

	public Integer getLOV_RiverBasinDistrictID() {
		return LOV_RiverBasinDistrictID;
	}

	public void setLOV_RiverBasinDistrictID(Integer lOV_RiverBasinDistrictID) {
		LOV_RiverBasinDistrictID = lOV_RiverBasinDistrictID;
	}

	public String getNACEActivityCode() {
		return NACEActivityCode;
	}

	public void setNACEActivityCode(String nACEActivityCode) {
		NACEActivityCode = nACEActivityCode;
	}

	public String getNACESectorCode() {
		return NACESectorCode;
	}

	public void setNACESectorCode(String nACESectorCode) {
		NACESectorCode = nACESectorCode;
	}

	public String getNACESubActivityCode() {
		return NACESubActivityCode;
	}

	public void setNACESubActivityCode(String nACESubActivityCode) {
		NACESubActivityCode = nACESubActivityCode;
	}

	public String getNUTSLevel2RegionCode() {
		return NUTSLevel2RegionCode;
	}

	public void setNUTSLevel2RegionCode(String nUTSLevel2RegionCode) {
		NUTSLevel2RegionCode = nUTSLevel2RegionCode;
	}

	public Integer getLOV_NACEActivityID() {
		return LOV_NACEActivityID;
	}

	public void setLOV_NACEActivityID(Integer lOV_NACEActivityID) {
		LOV_NACEActivityID = lOV_NACEActivityID;
	}

	public Integer getLOV_NACESectorID() {
		return LOV_NACESectorID;
	}

	public void setLOV_NACESectorID(Integer lOV_NACESectorID) {
		LOV_NACESectorID = lOV_NACESectorID;
	}

	public Integer getLOV_NACESubActivityID() {
		return LOV_NACESubActivityID;
	}

	public void setLOV_NACESubActivityID(Integer lOV_NACESubActivityID) {
		LOV_NACESubActivityID = lOV_NACESubActivityID;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public void setReportingYear(Integer reportingYear) {
		this.reportingYear = reportingYear;
	}

	public String getRiverBasinDistrictCode() {
		return riverBasinDistrictCode;
	}

	public void setRiverBasinDistrictCode(String riverBasinDistrictCode) {
		this.riverBasinDistrictCode = riverBasinDistrictCode;
	}

	public String getUnitCode() {
		return unitCode;
	}

	public void setUnitCode(String unitCode) {
		this.unitCode = unitCode;
	}

	public String getPollutantCode() {
		return pollutantCode;
	}

	public void setPollutantCode(String pollutantCode) {
		this.pollutantCode = pollutantCode;
	}

	public String getPollutantGroupCode() {
		return pollutantGroupCode;
	}

	public void setPollutantGroupCode(String pollutantGroupCode) {
		this.pollutantGroupCode = pollutantGroupCode;
	}

	public Double getQuantity() {
		return quantity;
	}

	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}
	
	
	
}
