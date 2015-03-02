package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the RECEIVINGCOUNTRY database table.
 * 
 */
@Entity
@Table(name="RECEIVINGCOUNTRY")
@NamedQuery(name="Receivingcountry.findAll", query="SELECT r FROM Receivingcountry r where r.endYear is null order by r.name")
public class Receivingcountry implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="Code")
	private String code;

	@Column(name="EndYear")
	private Integer endYear;

	@Id
	private int LOV_CountryID;

	@Column(name="Name")
	private String name;

	@Column(name="StartYear")
	private Integer startYear;

	public Receivingcountry() {
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

	public int getLOV_CountryID() {
		return this.LOV_CountryID;
	}

	public void setLOV_CountryID(int LOV_CountryID) {
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