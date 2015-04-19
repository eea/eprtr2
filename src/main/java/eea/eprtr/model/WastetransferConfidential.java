package eea.eprtr.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;
@Entity
@Table(name="WASTETRANSFER_CONFIDENTIAL")
public class WastetransferConfidential implements Serializable{
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="FacilityReportID")
	private Integer facilityReportID;
	
	@Id
	@Column(name="ReportingYear")
	private Integer reportingYear;
	
	@Column(name="ConfidentialCode")
	private String confidentialCode;
	
	@Id
	@Column(name="WasteTypeCode")
	private String wasteTypeCode;
	
	@Column(name="CountryCode")
	private String countryCode;
	

	public Integer getFacilityReportID() {
		return facilityReportID;
	}

	public void setFacilityReportID(Integer facilityReportID) {
		this.facilityReportID = facilityReportID;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public void setReportingYear(Integer reportingYear) {
		this.reportingYear = reportingYear;
	}

	public String getConfidentialCode() {
		if(confidentialCode == null)
		{
			return "";
		}
		return confidentialCode;
	}

	public void setConfidentialCode(String confidentialCode) {
		
		this.confidentialCode = confidentialCode;
	}

	public String getWasteTypeCode() {
		if(wasteTypeCode == null)
		{
			return wasteTypeCode;
		}
		return wasteTypeCode;
	}

	public void setWasteTypeCode(String wasteTypeCode) {
		this.wasteTypeCode = wasteTypeCode;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}
	
}
