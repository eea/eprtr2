package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the LOV_NACEACTIVITY database table.
 * 
 */
@Entity
@Table(name="LOV_NACEACTIVITY")
@NamedQuery(name="NaceActivity.findAllSectors", query="SELECT l FROM NaceActivity l where parentID is null and startYear >= :startYearEPRTR")
public class NaceActivity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="Code")
	private String code;

	@Column(name="EndYear")
	private Integer endYear;

	@Id
	private int LOV_NACEActivityID;

	@Column(name="Name")
	private String name;

	@Column(name="ParentID")
	private Integer parentID;

	@Column(name="StartYear")
	private Integer startYear;

	public NaceActivity() {
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

	public int getLOV_NACEActivityID() {
		return this.LOV_NACEActivityID;
	}

	public void setLOV_NACEActivityID(int LOV_NACEActivityID) {
		this.LOV_NACEActivityID = LOV_NACEActivityID;
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