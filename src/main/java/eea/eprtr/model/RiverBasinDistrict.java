package eea.eprtr.model;

import java.io.Serializable;

import javax.persistence.*;


/**
 * The persistent class for the LOV_RIVERBASINDISTRICT database table.
 * 
 */
@Entity
@Table(name="LOV_RIVERBASINDISTRICT")
@Cacheable(true)
@NamedQueries({
	@NamedQuery(name="RiverBasinDistrict.findByLOVCountryID", 
			query="SELECT r FROM RiverBasinDistrict r where r.LOV_CountryID = :LOV_CountryID"),
	@NamedQuery(name="RiverBasinDistrict.findByCode", 
			query="SELECT r FROM RiverBasinDistrict r where r.code = :RiverBasinCode")})
public class RiverBasinDistrict implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="Code")
	private String code;

	@Column(name="EndYear")
	private Integer endYear;

	private Integer LOV_CountryID;

	@Id
	private int LOV_RiverBasinDistrictID;

	@Column(name="Name")
	private String name;

	@Column(name="StartYear")
	private Integer startYear;

	public RiverBasinDistrict() {
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

	public int getLOV_RiverBasinDistrictID() {
		return this.LOV_RiverBasinDistrictID;
	}

	public void setLOV_RiverBasinDistrictID(int LOV_RiverBasinDistrictID) {
		this.LOV_RiverBasinDistrictID = LOV_RiverBasinDistrictID;
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