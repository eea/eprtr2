package eea.eprtr.model;

import java.io.Serializable;

import javax.persistence.*;


/**
 * The persistent class for the FACILITYDETAIL_WASTETRANSFER database table.
 * 
 */
@Entity
@Table(name="FACILITYDETAIL_WASTETRANSFER")
@NamedQueries({
	@NamedQuery(name="FacilitydetailWastetransfer.findAll", query="SELECT f FROM FacilitydetailWastetransfer f"),
	@NamedQuery(name="FacilitydetailWastetransfer.findByFacilityReportID", query="SELECT f FROM FacilitydetailWastetransfer f where f.facilityReportID = :FacilityReportID")
})
public class FacilitydetailWastetransfer implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="ConfidentialCode")
	private String confidentialCode;

	@Column(name="ConfidentialIndicator")
	private boolean confidentialIndicator;

	@Column(name="FacilityID")
	private Integer facilityID;

	@Id
	@Column(name="FacilityReportID")
	private Integer facilityReportID;

	private Integer LOV_ConfidentialityID;

	private Integer LOV_MethodBasisID;

	private Integer LOV_WasteTreatmentID;

	private Integer LOV_WasteTypeID;

	@Column(name="MethodCode")
	private String methodCode;

	@Column(name="MethodDesignation")
	private String methodDesignation;

	@Column(name="MethodTypeCode")
	private String methodTypeCode;

	@Column(name="Quantity")
	private Double quantity;

	@Column(name="UnitCode")
	private String unitCode;

	@Id
	@Column(name="WasteTransferID")
	private Integer wasteTransferID;

	@Column(name="WasteTreatmentCode")
	private String wasteTreatmentCode;

	@Column(name="WasteTypeCode")
	private String wasteTypeCode;

	private String WHPAddress;

	private String WHPCity;

	private String WHPCountryCode;

	private String WHPName;

	private String WHPPostalCode;

	private String WHPSiteAddress;

	private String WHPSiteCity;

	private String WHPSiteCountryCode;

	private String WHPSitePostalCode;

	public FacilitydetailWastetransfer() {
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

	public Integer getFacilityID() {
		return this.facilityID;
	}

	public void setFacilityID(Integer facilityID) {
		this.facilityID = facilityID;
	}

	public Integer getFacilityReportID() {
		return this.facilityReportID;
	}

	public void setFacilityReportID(Integer facilityReportID) {
		this.facilityReportID = facilityReportID;
	}

	public Integer getLOV_ConfidentialityID() {
		return this.LOV_ConfidentialityID;
	}

	public void setLOV_ConfidentialityID(Integer LOV_ConfidentialityID) {
		this.LOV_ConfidentialityID = LOV_ConfidentialityID;
	}

	public Integer getLOV_MethodBasisID() {
		return this.LOV_MethodBasisID;
	}

	public void setLOV_MethodBasisID(Integer LOV_MethodBasisID) {
		this.LOV_MethodBasisID = LOV_MethodBasisID;
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

	public String getMethodCode() {
		return this.methodCode;
	}

	public void setMethodCode(String methodCode) {
		this.methodCode = methodCode;
	}

	public String getMethodDesignation() {
		return this.methodDesignation;
	}

	public void setMethodDesignation(String methodDesignation) {
		this.methodDesignation = methodDesignation;
	}

	public String getMethodTypeCode() {
		return this.methodTypeCode;
	}

	public void setMethodTypeCode(String methodTypeCode) {
		this.methodTypeCode = methodTypeCode;
	}

	public Double getQuantity() {
		return this.quantity;
	}

	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}

	public String getUnitCode() {
		return this.unitCode;
	}

	public void setUnitCode(String unitCode) {
		this.unitCode = unitCode;
	}

	public Integer getWasteTransferID() {
		return this.wasteTransferID;
	}

	public void setWasteTransferID(Integer wasteTransferID) {
		this.wasteTransferID = wasteTransferID;
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