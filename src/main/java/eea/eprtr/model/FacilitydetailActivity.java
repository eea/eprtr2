package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the FACILITYDETAIL_ACTIVITY database table.
 * 
 */
@Entity
@Table(name="FACILITYDETAIL_ACTIVITY")
@NamedQuery(name="FacilitydetailActivity.findByFacilityReportID", query="SELECT f FROM FacilitydetailActivity f where f.facilityReportID = :FacilityReportID")
public class FacilitydetailActivity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="ActivityCode")
	private String activityCode;

	@Column(name="ActivityIPPCCode")
	private String activityIPPCCode;

	@Column(name="FacilityReportID")
	private Integer facilityReportID;

	private String IAReportedActivityCode;

	private String IPPCReportedActivityCode;

	@Column(name="MainActivityIndicator")
	private boolean mainActivityIndicator;

	@Column(name="RankingNumeric")
	private Integer rankingNumeric;

	@Column(name="SectorCode")
	private String sectorCode;

	@Column(name="SubActivityCode")
	private String subActivityCode;

	@Column(name="SubActivityIPPCCode")
	private String subActivityIPPCCode;

	public FacilitydetailActivity() {
	}

	public String getActivityCode() {
		return this.activityCode;
	}

	public void setActivityCode(String activityCode) {
		this.activityCode = activityCode;
	}

	public String getActivityIPPCCode() {
		return this.activityIPPCCode;
	}

	public void setActivityIPPCCode(String activityIPPCCode) {
		this.activityIPPCCode = activityIPPCCode;
	}

	public Integer getFacilityReportID() {
		return this.facilityReportID;
	}

	public void setFacilityReportID(Integer facilityReportID) {
		this.facilityReportID = facilityReportID;
	}

	public String getIAReportedActivityCode() {
		return this.IAReportedActivityCode;
	}

	public void setIAReportedActivityCode(String IAReportedActivityCode) {
		this.IAReportedActivityCode = IAReportedActivityCode;
	}

	public String getIPPCReportedActivityCode() {
		return this.IPPCReportedActivityCode;
	}

	public void setIPPCReportedActivityCode(String IPPCReportedActivityCode) {
		this.IPPCReportedActivityCode = IPPCReportedActivityCode;
	}

	public boolean getMainActivityIndicator() {
		return this.mainActivityIndicator;
	}

	public void setMainActivityIndicator(boolean mainActivityIndicator) {
		this.mainActivityIndicator = mainActivityIndicator;
	}

	public Integer getRankingNumeric() {
		return this.rankingNumeric;
	}

	public void setRankingNumeric(Integer rankingNumeric) {
		this.rankingNumeric = rankingNumeric;
	}

	public String getSectorCode() {
		return this.sectorCode;
	}

	public void setSectorCode(String sectorCode) {
		this.sectorCode = sectorCode;
	}

	public String getSubActivityCode() {
		return this.subActivityCode;
	}

	public void setSubActivityCode(String subActivityCode) {
		this.subActivityCode = subActivityCode;
	}

	public String getSubActivityIPPCCode() {
		return this.subActivityIPPCCode;
	}

	public void setSubActivityIPPCCode(String subActivityIPPCCode) {
		this.subActivityIPPCCode = subActivityIPPCCode;
	}

}