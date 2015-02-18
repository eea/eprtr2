package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the FACILITYDETAIL_POLLUTANTRELEASE database table.
 * 
 */
@Entity
@Table(name="FACILITYDETAIL_POLLUTANTRELEASE")
@NamedQuery(name="FacilitydetailPollutantrelease.findAll", query="SELECT f FROM FacilitydetailPollutantrelease f")
public class FacilitydetailPollutantrelease implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="AccidentalQuantity")
	private double accidentalQuantity;

	@Column(name="AccidentalQuantityUnitCode")
	private String accidentalQuantityUnitCode;

	@Column(name="CAS")
	private String cas;

	@Column(name="ConfidentialCode")
	private String confidentialCode;

	@Column(name="ConfidentialIndicator")
	private boolean confidentialIndicator;

	@Column(name="FacilityID")
	private int facilityID;
	
	@Id
	@Column(name="FacilityReportID") private int facilityReportID;

	@Column(name="GroupCode")
	private String groupCode;

	private int LOV_ConfidentialityID;

	private int LOV_MediumID;

	private int LOV_MethodBasisID;

	private int LOV_PollutantGroupID;

	private int LOV_PollutantID;

	@Column(name="MethodCode")
	private String methodCode;

	@Column(name="MethodDesignation")
	private String methodDesignation;

	@Column(name="MethodListID")
	private int methodListID;

	@Column(name="MethodTypeCode")
	private String methodTypeCode;

	@Column(name="PollutantCode")
	private String pollutantCode;

	@Column(name="PollutantTo")
	private String pollutantTo;

	@Column(name="TotalQuantity")
	private double totalQuantity;

	@Column(name="TotalQuantityUnitCode")
	private String totalQuantityUnitCode;

	public FacilitydetailPollutantrelease() {
	}

	public double getAccidentalQuantity() {
		return this.accidentalQuantity;
	}

	public void setAccidentalQuantity(double accidentalQuantity) {
		this.accidentalQuantity = accidentalQuantity;
	}

	public String getAccidentalQuantityUnitCode() {
		return this.accidentalQuantityUnitCode;
	}

	public void setAccidentalQuantityUnitCode(String accidentalQuantityUnitCode) {
		this.accidentalQuantityUnitCode = accidentalQuantityUnitCode;
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

	public int getLOV_ConfidentialityID() {
		return this.LOV_ConfidentialityID;
	}

	public void setLOV_ConfidentialityID(int LOV_ConfidentialityID) {
		this.LOV_ConfidentialityID = LOV_ConfidentialityID;
	}

	public int getLOV_MediumID() {
		return this.LOV_MediumID;
	}

	public void setLOV_MediumID(int LOV_MediumID) {
		this.LOV_MediumID = LOV_MediumID;
	}

	public int getLOV_MethodBasisID() {
		return this.LOV_MethodBasisID;
	}

	public void setLOV_MethodBasisID(int LOV_MethodBasisID) {
		this.LOV_MethodBasisID = LOV_MethodBasisID;
	}

	public int getLOV_PollutantGroupID() {
		return this.LOV_PollutantGroupID;
	}

	public void setLOV_PollutantGroupID(int LOV_PollutantGroupID) {
		this.LOV_PollutantGroupID = LOV_PollutantGroupID;
	}

	public int getLOV_PollutantID() {
		return this.LOV_PollutantID;
	}

	public void setLOV_PollutantID(int LOV_PollutantID) {
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

	public int getMethodListID() {
		return this.methodListID;
	}

	public void setMethodListID(int methodListID) {
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

	public String getPollutantTo() {
		return this.pollutantTo;
	}

	public void setPollutantTo(String pollutantTo) {
		this.pollutantTo = pollutantTo;
	}

	public double getTotalQuantity() {
		return this.totalQuantity;
	}

	public void setTotalQuantity(double totalQuantity) {
		this.totalQuantity = totalQuantity;
	}

	public String getTotalQuantityUnitCode() {
		return this.totalQuantityUnitCode;
	}

	public void setTotalQuantityUnitCode(String totalQuantityUnitCode) {
		this.totalQuantityUnitCode = totalQuantityUnitCode;
	}

}