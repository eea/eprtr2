package eea.eprtr.model;

import java.io.Serializable;
import java.util.Comparator;

import javax.persistence.*;


/**
 * The persistent class for the LOV_POLLUTANT database table.
 * 
 */

@Entity
@Table(name="LOV_POLLUTANT")
@NamedQuery(name="LovPollutant.findPolutants", query="SELECT l FROM LovPollutant l where l.parentID = :parentID")
public class LovPollutant implements Serializable, Cloneable {
	private static final long serialVersionUID = 1L;

	@Column(name="CAS")
	private String cas;

	@Column(name="Code")
	private String code;

	@Column(name="CodeEPER")
	private String codeEPER;

	@Column(name="EndYear", nullable=true)
	private Integer endYear;

	private Integer eperPollutant_ID;

	@Id
	@Column(name="LOV_PollutantID") private int LOV_PollutantID;

	@Column(name="Name")
	private String name;

	@Column(name="ParentID")
	private Integer parentID;

	@Column(name="StartYear")
	private Integer startYear;

	public LovPollutant() {
	}

	public String getCas() {
		return this.cas;
	}

	public void setCas(String cas) {
		this.cas = cas;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCodeEPER() {
		return this.codeEPER;
	}

	public void setCodeEPER(String codeEPER) {
		this.codeEPER = codeEPER;
	}

	public Integer getEndYear() {
		return this.endYear;
	}

	public void setEndYear(Integer endYear) {
		this.endYear = endYear;
	}

	public Integer getEperPollutant_ID() {
		return this.eperPollutant_ID;
	}

	public void setEperPollutant_ID(Integer eperPollutant_ID) {
		this.eperPollutant_ID = eperPollutant_ID;
	}

	public int getLOV_PollutantID() {
		return this.LOV_PollutantID;
	}

	public void setLOV_PollutantID(int LOV_PollutantID) {
		this.LOV_PollutantID = LOV_PollutantID;
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
	
	public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
	
	public static Comparator<LovPollutant> LovPollutantByCodeComparator = new Comparator<LovPollutant>() {

	public int compare(LovPollutant s1, LovPollutant s2) {
	   String Code1 = s1.getCode().toUpperCase();
	   String Code2 = s2.getCode().toUpperCase();

	   //ascending order
	   return Code1.compareTo(Code2);

	   //descending order
	   //return StudentName2.compareTo(StudentName1);
    }};

}
