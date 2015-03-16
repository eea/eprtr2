package eea.eprtr.model;

import java.io.Serializable;

import javax.persistence.*;


/**
 * The persistent class for the FACILITYDETAIL_POLLUTANTTRANSFER database table.
 * 
 */
@Entity
@Table(name="FACILITYDETAIL_POLLUTANTTRANSFER")
@NamedQueries({
	@NamedQuery(name="FacilitydetailPollutanttransfer.findAll", query="SELECT f FROM FacilitydetailPollutanttransfer f"),
	@NamedQuery(name="FacilitydetailPollutanttransfer.findByFacilityReportID", query="SELECT f FROM FacilitydetailPollutanttransfer f where f.facilityReportID = :FacilityReportID")
})
public class FacilitydetailPollutanttransfer implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="CAS")
	private String cas;

	@Column(name="ConfidentialCode")
	private String confidentialCode;

	@Column(name="ConfidentialIndicator")
	private boolean confidentialIndicator;

	@Column(name="FacilityID")
	private int facilityID;

	@Id
	@Column(name="FacilityReportID")
	private int facilityReportID;

	@Column(name="GroupCode")
	private String groupCode;

	private Integer LOV_ConfidentialityID;

	private Integer LOV_MethodBasisID;

	private Integer LOV_PollutantGroupID;

	@Id
	private Integer LOV_PollutantID;

	@Column(name="MethodCode")
	private String methodCode;

	@Column(name="MethodDesignation")
	private String methodDesignation;

	@Column(name="MethodListID")
	private Integer methodListID;

	@Column(name="MethodTypeCode")
	private String methodTypeCode;

	@Column(name="PollutantCode")
	private String pollutantCode;

	@Column(name="Quantity")
	private Double quantity;

	@Column(name="UnitCode")
	private String unitCode;

	public FacilitydetailPollutanttransfer() {
	}

	public String getCas() {
		return this.cas;
	}

	public void setCas(String cas) {
		this.cas = cas;
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

	public int getFacilityID() {
		return this.facilityID;
	}

	public void setFacilityID(int facilityID) {
		this.facilityID = facilityID;
	}

	public int getFacilityReportID() {
		return this.facilityReportID;
	}

	public void setFacilityReportID(int facilityReportID) {
		this.facilityReportID = facilityReportID;
	}

	public String getGroupCode() {
		return this.groupCode;
	}

	public void setGroupCode(String groupCode) {
		this.groupCode = groupCode;
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

	public Integer getMethodListID() {
		return this.methodListID;
	}

	public void setMethodListID(Integer methodListID) {
		this.methodListID = methodListID;
	}

	public String getMethodTypeCode() {
		return this.methodTypeCode;
	}

	public void setMethodTypeCode(String methodTypeCode) {
		this.methodTypeCode = methodTypeCode;
	}

	public String getPollutantCode() {
		return this.pollutantCode;
	}

	public void setPollutantCode(String pollutantCode) {
		this.pollutantCode = pollutantCode;
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

}