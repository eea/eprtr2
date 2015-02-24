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
@NamedQuery(name="FacilitydetailDetail.findByFacilityReportID", query="SELECT f FROM FacilitydetailDetail f where f.facilityReportID = :FacilityReportID")
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
	private int confidentialIndicatorPollutantRelease;

	@Column(name="ConfidentialIndicatorPollutantTransfer")
	private int confidentialIndicatorPollutantTransfer;

	@Column(name="ConfidentialIndicatorWaste")
	private int confidentialIndicatorWaste;

	@Column(name="Coordinates")
	private String coordinates;

	@Column(name="CoordinateStatusCode")
	private String coordinateStatusCode;

	@Column(name="CountryCode")
	private String countryCode;

	@Column(name="FacilityID")
	private int facilityID;

	@Column(name="FacilityName")
	private String facilityName;

	@Id
	@Column(name="FacilityReportID")
	private int facilityReportID;

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
	private int operatingHours;

	@Column(name="ParentCompanyName")
	private String parentCompanyName;

	@Column(name="PostalCode")
	private String postalCode;

	@Column(name="ProductionVolumeProductName")
	private String productionVolumeProductName;

	@Column(name="ProductionVolumeQuantity")
	private double productionVolumeQuantity;

	@Column(name="ProductionVolumeUnitCode")
	private String productionVolumeUnitCode;

	@Column(name="PublicInformation")
	private String publicInformation;

	@Column(name="Published")
	private Timestamp published;

	@Column(name="ReportingYear")
	private int reportingYear;

	@Column(name="RiverBasinDistrictCode")
	private String riverBasinDistrictCode;

	@Column(name="RiverBasinDistrictSourceCode")
	private String riverBasinDistrictSourceCode;

	@Column(name="TotalEmployeeQuantity")
	private int totalEmployeeQuantity;

	@Column(name="TotalIPPCInstallationQuantity")
	private int totalIPPCInstallationQuantity;

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

	public int getConfidentialIndicatorPollutantRelease() {
		return this.confidentialIndicatorPollutantRelease;
	}

	public void setConfidentialIndicatorPollutantRelease(int confidentialIndicatorPollutantRelease) {
		this.confidentialIndicatorPollutantRelease = confidentialIndicatorPollutantRelease;
	}

	public int getConfidentialIndicatorPollutantTransfer() {
		return this.confidentialIndicatorPollutantTransfer;
	}

	public void setConfidentialIndicatorPollutantTransfer(int confidentialIndicatorPollutantTransfer) {
		this.confidentialIndicatorPollutantTransfer = confidentialIndicatorPollutantTransfer;
	}

	public int getConfidentialIndicatorWaste() {
		return this.confidentialIndicatorWaste;
	}

	public void setConfidentialIndicatorWaste(int confidentialIndicatorWaste) {
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

	public int getOperatingHours() {
		return this.operatingHours;
	}

	public void setOperatingHours(int operatingHours) {
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

	public double getProductionVolumeQuantity() {
		return this.productionVolumeQuantity;
	}

	public void setProductionVolumeQuantity(double productionVolumeQuantity) {
		this.productionVolumeQuantity = productionVolumeQuantity;
	}

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

	public String getRiverBasinDistrictSourceCode() {
		return this.riverBasinDistrictSourceCode;
	}

	public void setRiverBasinDistrictSourceCode(String riverBasinDistrictSourceCode) {
		this.riverBasinDistrictSourceCode = riverBasinDistrictSourceCode;
	}

	public int getTotalEmployeeQuantity() {
		return this.totalEmployeeQuantity;
	}

	public void setTotalEmployeeQuantity(int totalEmployeeQuantity) {
		this.totalEmployeeQuantity = totalEmployeeQuantity;
	}

	public int getTotalIPPCInstallationQuantity() {
		return this.totalIPPCInstallationQuantity;
	}

	public void setTotalIPPCInstallationQuantity(int totalIPPCInstallationQuantity) {
		this.totalIPPCInstallationQuantity = totalIPPCInstallationQuantity;
	}

	public String getWebsiteCommunication() {
		return this.websiteCommunication;
	}

	public void setWebsiteCommunication(String websiteCommunication) {
		this.websiteCommunication = websiteCommunication;
	}

}