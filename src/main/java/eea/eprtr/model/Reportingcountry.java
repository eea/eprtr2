package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the REPORTINGCOUNTRY database table.
 * 
 */
@Entity
@Table(name="REPORTINGCOUNTRY")
@NamedQuery(name="Reportingcountry.findAll", query="SELECT r FROM Reportingcountry r")
public class Reportingcountry implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="Code")
	private String code;

	@Column(name="EndYear")
	private Integer endYear;

	private Integer LOV_CountryID;

	@Column(name="Name")
	private String name;

	@Column(name="StartYear")
	private Integer startYear;

	public Reportingcountry() {
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

	public Integer getLOV_CountryID() {
		return this.LOV_CountryID;
	}

	public void setLOV_CountryID(Integer LOV_CountryID) {
		this.LOV_CountryID = LOV_CountryID;
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