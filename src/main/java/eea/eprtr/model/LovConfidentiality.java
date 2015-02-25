package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the LOV_CONFIDENTIALITY database table.
 * 
 */
@Entity
@Table(name="LOV_CONFIDENTIALITY")
@NamedQuery(name="LovConfidentiality.findByCode", query="SELECT l FROM LovConfidentiality l where l.code = :ConfidentialCode")
public class LovConfidentiality implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="Code")
	private String code;

	@Column(name="EndYear")
	private Integer endYear;

	@Id
	private int LOV_ConfidentialityID;

	@Column(name="Name")
	private String name;

	@Column(name="StartYear")
	private Integer startYear;

	public LovConfidentiality() {
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Integer getEndYear() {
		return this.endYear;
	}

	public void setEndYear(Integer endYear) {
		this.endYear = endYear;
	}

	public int getLOV_ConfidentialityID() {
		return this.LOV_ConfidentialityID;
	}

	public void setLOV_ConfidentialityID(int LOV_ConfidentialityID) {
		this.LOV_ConfidentialityID = LOV_ConfidentialityID;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getStartYear() {
		return this.startYear;
	}

	public void setStartYear(Integer startYear) {
		this.startYear = startYear;
	}

}