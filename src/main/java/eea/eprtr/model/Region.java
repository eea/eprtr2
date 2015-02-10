package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the LOV_NUTSREGION database table.
 * 
 */
@Entity
@Table(name="LOV_NUTSREGION")
@NamedQuery(name="Region.findByLOVCountryID", query="SELECT r FROM Region r where r.LOV_CountryID = :LOV_CountryID and r.level = :level")
public class Region implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="Code")
	private String code;

	@Column(name="EndYear")
	private Integer endYear;

	@Column(name="Level")
	private Integer level;

	private int LOV_CountryID;

	@Id
	private int LOV_NUTSRegionID;

	@Column(name="Name")
	private String name;

	@Column(name="ParentID")
	private Integer parentID;

	@Column(name="StartYear")
	private Integer startYear;

	public Region() {
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

	public Integer getLevel() {
		return this.level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}

	public int getLOV_CountryID() {
		return this.LOV_CountryID;
	}

	public void setLOV_CountryID(int LOV_CountryID) {
		this.LOV_CountryID = LOV_CountryID;
	}

	public int getLOV_NUTSRegionID() {
		return this.LOV_NUTSRegionID;
	}

	public void setLOV_NUTSRegionID(int LOV_NUTSRegionID) {
		this.LOV_NUTSRegionID = LOV_NUTSRegionID;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getParentID() {
		return this.parentID;
	}

	public void setParentID(Integer parentID) {
		this.parentID = parentID;
	}

	public Integer getStartYear() {
		return this.startYear;
	}

	public void setStartYear(Integer startYear) {
		this.startYear = startYear;
	}

}