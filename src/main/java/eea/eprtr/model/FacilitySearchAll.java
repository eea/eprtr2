package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the FACILITYSEARCH_ALL database table.
 * 
 */
@Entity
@Table(name="FACILITYSEARCH_ALL")
@NamedQuery(name="FacilitySearchAll.findAll", query="SELECT f FROM FacilitySearchAll f")
public class FacilitySearchAll implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="Address", length=511)
	private String address;

	@Column(name="CAS", length=20)
	private String cas;

	@Column(name="City", length=255)
	private String city;

	@Column(name="CitySearchName", length=255)
	private String citySearchName;

	@Column(name="ConfidentialCodeFacility", length=255)
	private String confidentialCodeFacility;

	@Column(name="ConfidentialCodePollutant", length=255)
	private String confidentialCodePollutant;

	@Column(name="ConfidentialCodeWaste", length=255)
	private String confidentialCodeWaste;

	@Column(name="ConfidentialIndicatorFacility", nullable=false)
	private boolean confidentialIndicatorFacility;

	@Column(name="ConfidentialIndicatorPollutant")
	private boolean confidentialIndicatorPollutant;

	@Column(name="ConfidentialIndicatorWaste")
	private boolean confidentialIndicatorWaste;

	@Column(name="CountryCode", length=255)
	private String countryCode;

	@Column(name="DistinctID", nullable=false)
	private boolean distinctID;

	@Column(name="FacilityID", nullable=false)
	private int facilityID;

	@Column(name="FacilityName", length=255)
	private String facilityName;

	@Id
	@Column(name="FacilityReportID", nullable=false)
	private int facilityReportID;

	@Column(name="FacilitySearchName", length=255)
	private String facilitySearchName;

	@Column(length=255)
	private String IAActivityCode;

	@Column(nullable=false, length=255)
	private String IAReportedActivityCode;

	@Column(length=255)
	private String IASectorCode;

	@Column(length=255)
	private String IASubActivityCode;

	private Integer IDWaste;
	
	private Integer accidental;

	@Column(length=255)
	private String IPPCActivityCode;

	@Column(length=255)
	private String IPPCReportedActivityCode;

	@Column(length=255)
	private String IPPCSectorCode;

	@Column(length=255)
	private String IPPCSubActivityCode;

	private Integer LOV_ConfidentialityIDFacility;

	private Integer LOV_ConfidentialityIDPollutant;

	private Integer LOV_ConfidentialityIDWaste;

	@Column(nullable=false)
	private int LOV_CountryID;

	private Integer LOV_IAActivityID;

	private Integer LOV_IASectorID;

	private Integer LOV_IASubActivityID;

	private Integer LOV_MediumID;

	private Integer LOV_NACEActivityID;

	private Integer LOV_NACESectorID;

	private Integer LOV_NACESubActivityID;

	private Integer LOV_NUTSRLevel1ID;

	private Integer LOV_NUTSRLevel2ID;

	private Integer LOV_NUTSRLevel3ID;

	private Integer LOV_PollutantGroupID;

	private Integer LOV_PollutantID;

	@Column(nullable=false)
	private int LOV_RiverBasinDistrictID;

	private Integer LOV_WasteTreatmentID;

	private Integer LOV_WasteTypeID;

	@Column(name="MediumCode", length=255)
	@Enumerated(EnumType.STRING)
	private MediumCode mediumCode;

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

	@Column(name="ObjectID", nullable=false)
	private int objectID;

	@Column(name="ParentCompanyName", length=255)
	private String parentCompanyName;

	@Column(name="ParentCompanySearchName", length=255)
	private String parentCompanySearchName;

	@Column(name="PollutantCode", length=255)
	private String pollutantCode;

	@Column(name="PollutantGroupCode", length=255)
	private String pollutantGroupCode;

	@Column(name="PostalCode", length=50)
	private String postalCode;

	@Column(name="ReportingYear", nullable=false)
	private int reportingYear;

	@Column(name="RiverBasinDistrictCode", nullable=false, length=255)
	private String riverBasinDistrictCode;

	@Column(name="WasteTreatmentCode", nullable=false, length=255)
	private String wasteTreatmentCode;

	@Column(name="WasteTypeCode", length=255)
	private String wasteTypeCode;

	@Column(length=255)
	private String WHPCountryCode;

	private Integer WHPCountryID;

	public FacilitySearchAll() {
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCas() {
		return this.cas;
	}

	public void setCas(String cas) {
		this.cas = cas;
	}

	public String getCity() {
		return this.city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCitySearchName() {
		return this.citySearchName;
	}

	public void setCitySearchName(String citySearchName) {
		this.citySearchName = citySearchName;
	}

	public String getConfidentialCodeFacility() {
		return this.confidentialCodeFacility;
	}

	public void setConfidentialCodeFacility(String confidentialCodeFacility) {
		this.confidentialCodeFacility = confidentialCodeFacility;
	}

	public String getConfidentialCodePollutant() {
		return this.confidentialCodePollutant;
	}

	public void setConfidentialCodePollutant(String confidentialCodePollutant) {
		this.confidentialCodePollutant = confidentialCodePollutant;
	}

	public String getConfidentialCodeWaste() {
		return this.confidentialCodeWaste;
	}

	public void setConfidentialCodeWaste(String confidentialCodeWaste) {
		this.confidentialCodeWaste = confidentialCodeWaste;
	}

	public boolean getConfidentialIndicatorFacility() {
		return this.confidentialIndicatorFacility;
	}

	public void setConfidentialIndicatorFacility(boolean confidentialIndicatorFacility) {
		this.confidentialIndicatorFacility = confidentialIndicatorFacility;
	}

	public boolean getConfidentialIndicatorPollutant() {
		return this.confidentialIndicatorPollutant;
	}

	public void setConfidentialIndicatorPollutant(boolean confidentialIndicatorPollutant) {
		this.confidentialIndicatorPollutant = confidentialIndicatorPollutant;
	}

	public boolean getConfidentialIndicatorWaste() {
		return this.confidentialIndicatorWaste;
	}

	public void setConfidentialIndicatorWaste(boolean confidentialIndicatorWaste) {
		this.confidentialIndicatorWaste = confidentialIndicatorWaste;
	}

	public String getCountryCode() {
		return this.countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public boolean getDistinctID() {
		return this.distinctID;
	}

	public void setDistinctID(boolean distinctID) {
		this.distinctID = distinctID;
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

	public int getFacilityReportID() {
		return this.facilityReportID;
	}

	public void setFacilityReportID(int facilityReportID) {
		this.facilityReportID = facilityReportID;
	}

	public String getFacilitySearchName() {
		return this.facilitySearchName;
	}

	public void setFacilitySearchName(String facilitySearchName) {
		this.facilitySearchName = facilitySearchName;
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

	public Integer getIDWaste() {
		return this.IDWaste;
	}

	public void setIDWaste(Integer IDWaste) {
		this.IDWaste = IDWaste;
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

	public Integer getLOV_ConfidentialityIDFacility() {
		return this.LOV_ConfidentialityIDFacility;
	}

	public void setLOV_ConfidentialityIDFacility(Integer LOV_ConfidentialityIDFacility) {
		this.LOV_ConfidentialityIDFacility = LOV_ConfidentialityIDFacility;
	}

	public Integer getLOV_ConfidentialityIDPollutant() {
		return this.LOV_ConfidentialityIDPollutant;
	}

	public void setLOV_ConfidentialityIDPollutant(Integer LOV_ConfidentialityIDPollutant) {
		this.LOV_ConfidentialityIDPollutant = LOV_ConfidentialityIDPollutant;
	}

	public Integer getLOV_ConfidentialityIDWaste() {
		return this.LOV_ConfidentialityIDWaste;
	}

	public void setLOV_ConfidentialityIDWaste(Integer LOV_ConfidentialityIDWaste) {
		this.LOV_ConfidentialityIDWaste = LOV_ConfidentialityIDWaste;
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

	public Integer getLOV_MediumID() {
		return this.LOV_MediumID;
	}

	public void setLOV_MediumID(Integer LOV_MediumID) {
		this.LOV_MediumID = LOV_MediumID;
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

	public Integer getLOV_PollutantGroupID() {
		return this.LOV_PollutantGroupID;
	}

	public void setLOV_PollutantGroupID(Integer LOV_PollutantGroupID) {
		this.LOV_PollutantGroupID = LOV_PollutantGroupID;
	}

	public Integer getLOV_PollutantID() {
		return this.LOV_PollutantID;
	}

	public void setLOV_PollutantID(Integer LOV_PollutantID) {
		this.LOV_PollutantID = LOV_PollutantID;
	}

	public int getLOV_RiverBasinDistrictID() {
		return this.LOV_RiverBasinDistrictID;
	}

	public void setLOV_RiverBasinDistrictID(int LOV_RiverBasinDistrictID) {
		this.LOV_RiverBasinDistrictID = LOV_RiverBasinDistrictID;
	}

	public Integer getLOV_WasteTreatmentID() {
		return this.LOV_WasteTreatmentID;
	}

	public void setLOV_WasteTreatmentID(Integer LOV_WasteTreatmentID) {
		this.LOV_WasteTreatmentID = LOV_WasteTreatmentID;
	}

	public Integer getLOV_WasteTypeID() {
		return this.LOV_WasteTypeID;
	}

	public void setLOV_WasteTypeID(Integer LOV_WasteTypeID) {
		this.LOV_WasteTypeID = LOV_WasteTypeID;
	}

	public MediumCode getMediumCode() {
		return this.mediumCode;
	}

	public void setMediumCode(MediumCode mediumCode) {
		this.mediumCode = mediumCode;
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

	public int getObjectID() {
		return this.objectID;
	}

	public void setObjectID(int objectID) {
		this.objectID = objectID;
	}

	public String getParentCompanyName() {
		return this.parentCompanyName;
	}

	public void setParentCompanyName(String parentCompanyName) {
		this.parentCompanyName = parentCompanyName;
	}

	public String getParentCompanySearchName() {
		return this.parentCompanySearchName;
	}

	public void setParentCompanySearchName(String parentCompanySearchName) {
		this.parentCompanySearchName = parentCompanySearchName;
	}

	public String getPollutantCode() {
		return this.pollutantCode;
	}

	public void setPollutantCode(String pollutantCode) {
		this.pollutantCode = pollutantCode;
	}

	public String getPollutantGroupCode() {
		return this.pollutantGroupCode;
	}

	public void setPollutantGroupCode(String pollutantGroupCode) {
		this.pollutantGroupCode = pollutantGroupCode;
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

	public String getWasteTreatmentCode() {
		return this.wasteTreatmentCode;
	}

	public void setWasteTreatmentCode(String wasteTreatmentCode) {
		this.wasteTreatmentCode = wasteTreatmentCode;
	}

	public String getWasteTypeCode() {
		return this.wasteTypeCode;
	}

	public void setWasteTypeCode(String wasteTypeCode) {
		this.wasteTypeCode = wasteTypeCode;
	}

	public String getWHPCountryCode() {
		return this.WHPCountryCode;
	}

	public void setWHPCountryCode(String WHPCountryCode) {
		this.WHPCountryCode = WHPCountryCode;
	}

	public Integer getWHPCountryID() {
		return this.WHPCountryID;
	}

	public void setWHPCountryID(Integer WHPCountryID) {
		this.WHPCountryID = WHPCountryID;
	}

	public Integer getAccidental() {
		return accidental;
	}

	public void setAccidental(Integer accidental) {
		this.accidental = accidental;
	}

}