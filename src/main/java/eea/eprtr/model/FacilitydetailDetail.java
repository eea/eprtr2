package eea.eprtr.model;

import java.io.Serializable;

import javax.persistence.*;

import java.sql.Timestamp;


/**
 * The persistent class for the FACILITYDETAIL_DETAIL database table.
 * 
 */
@Entity
@Table(name="FACILITYDETAIL_DETAIL")
@NamedQueries({
	@NamedQuery(name="FacilitydetailDetail.findByFacilityReportID", query="SELECT f FROM FacilitydetailDetail f where f.facilityReportID = :FacilityReportID"),
	@NamedQuery(name="FacilitydetailDetail.findByFacilityIDAndYear", 
		query="SELECT f FROM FacilitydetailDetail f where f.facilityID = :FacilityID AND f.reportingYear = :ReportingYear"),	
	@NamedQuery(name="FacilitydetailDetail.findByFacilityID", 
		query="SELECT f FROM FacilitydetailDetail f where f.facilityID = :FacilityID")
})
public class FacilitydetailDetail implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="Address")
	private String address;

	@Column(name="City")
	private String city;

	@Column(name="ConfidentialIndicator")
	private boolean confidentialIndicator;

	@Column(name="ConfidentialIndicatorCode")
	private String confidentialIndicatorCode;

	@Column(name="ConfidentialIndicatorPollutantRelease")
	private Integer confidentialIndicatorPollutantRelease;

	@Column(name="ConfidentialIndicatorPollutantTransfer")
	private Integer confidentialIndicatorPollutantTransfer;

	@Column(name="ConfidentialIndicatorWaste")
	private Integer confidentialIndicatorWaste;

	@Column(name="Coordinates")
	private String coordinates;

	@Column(name="CoordinateStatusCode")
	private String coordinateStatusCode;

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

	private String NACEActivityCode;

	private String NACESectorCode;

	private String NACESubActivityCode;

	@Column(name="NationalID")
	private String nationalID;

	private String NUTSRegionLevel1Code;

	private String NUTSRegionLevel2Code;

	private String NUTSRegionLevel3Code;

	private String NUTSRegionSourceCode;

	@Column(name="OperatingHours")
	private Integer operatingHours;

	@Column(name="ParentCompanyName")
	private String parentCompanyName;

	@Column(name="PostalCode")
	private String postalCode;

	@Column(name="ProductionVolumeProductName")
	private String productionVolumeProductName;

	@Column(name="ProductionVolumeQuantity")
	private Double productionVolumeQuantity;

	@Column(name="ProductionVolumeUnitCode")
	private String productionVolumeUnitCode;

	@Column(name="PublicInformation")
	private String publicInformation;

	@Column(name="Published")
	private Timestamp published;

	@Column(name="ReportingYear")
	private Integer reportingYear;

	@Column(name="RiverBasinDistrictCode")
	private String riverBasinDistrictCode;

	@Column(name="RiverBasinDistrictSourceCode")
	private String riverBasinDistrictSourceCode;

	@Column(name="TotalEmployeeQuantity")
	private Integer totalEmployeeQuantity;

	@Column(name="TotalIPPCInstallationQuantity")
	private Integer totalIPPCInstallationQuantity;

	@Column(name="WebsiteCommunication")
	private String websiteCommunication;

	public FacilitydetailDetail() {
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

	public boolean getConfidentialIndicator() {
		return this.confidentialIndicator;
	}

	public void setConfidentialIndicator(boolean confidentialIndicator) {
		this.confidentialIndicator = confidentialIndicator;
	}

	public String getConfidentialIndicatorCode() {
		return this.confidentialIndicatorCode;
	}

	public void setConfidentialIndicatorCode(String confidentialIndicatorCode) {
		this.confidentialIndicatorCode = confidentialIndicatorCode;
	}

	public Integer getConfidentialIndicatorPollutantRelease() {
		return this.confidentialIndicatorPollutantRelease;
	}

	public void setConfidentialIndicatorPollutantRelease(Integer confidentialIndicatorPollutantRelease) {
		this.confidentialIndicatorPollutantRelease = confidentialIndicatorPollutantRelease;
	}

	public Integer getConfidentialIndicatorPollutantTransfer() {
		return this.confidentialIndicatorPollutantTransfer;
	}

	public void setConfidentialIndicatorPollutantTransfer(Integer confidentialIndicatorPollutantTransfer) {
		this.confidentialIndicatorPollutantTransfer = confidentialIndicatorPollutantTransfer;
	}

	public Integer getConfidentialIndicatorWaste() {
		return this.confidentialIndicatorWaste;
	}

	public void setConfidentialIndicatorWaste(Integer confidentialIndicatorWaste) {
		this.confidentialIndicatorWaste = confidentialIndicatorWaste;
	}

	public String getCoordinates() {
		return this.coordinates;
	}

	public void setCoordinates(String coordinates) {
		this.coordinates = coordinates;
	}

	public String getCoordinateStatusCode() {
		return this.coordinateStatusCode;
	}

	public void setCoordinateStatusCode(String coordinateStatusCode) {
		this.coordinateStatusCode = coordinateStatusCode;
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

	public String getNationalID() {
		return this.nationalID;
	}

	public void setNationalID(String nationalID) {
		this.nationalID = nationalID;
	}

	public String getNUTSRegionLevel1Code() {
		return this.NUTSRegionLevel1Code;
	}

	public void setNUTSRegionLevel1Code(String NUTSRegionLevel1Code) {
		this.NUTSRegionLevel1Code = NUTSRegionLevel1Code;
	}

	public String getNUTSRegionLevel2Code() {
		return this.NUTSRegionLevel2Code;
	}

	public void setNUTSRegionLevel2Code(String NUTSRegionLevel2Code) {
		this.NUTSRegionLevel2Code = NUTSRegionLevel2Code;
	}

	public String getNUTSRegionLevel3Code() {
		return this.NUTSRegionLevel3Code;
	}

	public void setNUTSRegionLevel3Code(String NUTSRegionLevel3Code) {
		this.NUTSRegionLevel3Code = NUTSRegionLevel3Code;
	}

	public String getNUTSRegionSourceCode() {
		return this.NUTSRegionSourceCode;
	}

	public void setNUTSRegionSourceCode(String NUTSRegionSourceCode) {
		this.NUTSRegionSourceCode = NUTSRegionSourceCode;
	}

	public Integer getOperatingHours() {
		return this.operatingHours;
	}

	public void setOperatingHours(Integer operatingHours) {
		this.operatingHours = operatingHours;
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

	public String getProductionVolumeProductName() {
		return this.productionVolumeProductName;
	}

	public void setProductionVolumeProductName(String productionVolumeProductName) {
		this.productionVolumeProductName = productionVolumeProductName;
	}

	public Double getProductionVolumeQuantity() {
		return this.productionVolumeQuantity;
		//return Double.parseDouble(this.productionVolumeQuantity);
	}

	public void setProductionVolumeQuantity(Double productionVolumeQuantity) {
		this.productionVolumeQuantity = productionVolumeQuantity;
	}

	
/*	public void setProductionVolumeQuantity(String productionVolumeQuantity) {
		if (productionVolumeQuantity != null && productionVolumeQuantity != "" ){
			this.productionVolumeQuantity = productionVolumeQuantity;
		}
		else{
			this.productionVolumeQuantity = "-1"; 
		}
	}*/

	public String getProductionVolumeUnitCode() {
		return this.productionVolumeUnitCode;
	}

	public void setProductionVolumeUnitCode(String productionVolumeUnitCode) {
		this.productionVolumeUnitCode = productionVolumeUnitCode;
	}

	public String getPublicInformation() {
		return this.publicInformation;
	}

	public void setPublicInformation(String publicInformation) {
		this.publicInformation = publicInformation;
	}

	public Timestamp getPublished() {
		return this.published;
	}

	public void setPublished(Timestamp published) {
		this.published = published;
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

	public String getRiverBasinDistrictSourceCode() {
		return this.riverBasinDistrictSourceCode;
	}

	public void setRiverBasinDistrictSourceCode(String riverBasinDistrictSourceCode) {
		this.riverBasinDistrictSourceCode = riverBasinDistrictSourceCode;
	}

	public Integer getTotalEmployeeQuantity() {
		return this.totalEmployeeQuantity;
	}

	public void setTotalEmployeeQuantity(Integer totalEmployeeQuantity) {
		this.totalEmployeeQuantity = totalEmployeeQuantity;
	}

	public Integer getTotalIPPCInstallationQuantity() {
		return this.totalIPPCInstallationQuantity;
	}

	public void setTotalIPPCInstallationQuantity(Integer totalIPPCInstallationQuantity) {
		this.totalIPPCInstallationQuantity = totalIPPCInstallationQuantity;
	}

	public String getWebsiteCommunication() {
		return this.websiteCommunication;
	}

	public void setWebsiteCommunication(String websiteCommunication) {
		this.websiteCommunication = websiteCommunication;
	}

}