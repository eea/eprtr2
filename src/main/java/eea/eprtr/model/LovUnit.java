package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the LOV_UNIT database table.
 * 
 */
@Entity
@Table(name="LOV_UNIT")
@NamedQuery(name="LovUnit.findByCode", query="SELECT l FROM LovUnit l where l.code = :UnitCode")
public class LovUnit implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="Code")
	private String code;

	@Column(name="EndYear")
	private Integer endYear;

	@Id
	private int LOV_UnitID;

	@Column(name="Name")
	private String name;

	@Column(name="StartYear")
	private Integer startYear;

	public LovUnit() {
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

	public int getLOV_UnitID() {
		return this.LOV_UnitID;
	}

	public void setLOV_UnitID(int LOV_UnitID) {
		this.LOV_UnitID = LOV_UnitID;
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