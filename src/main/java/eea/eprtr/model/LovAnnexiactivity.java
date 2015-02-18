package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the LOV_ANNEXIACTIVITY database table.
 * 
 */
@Entity
@Table(name="LOV_ANNEXIACTIVITY")
@NamedQuery(name="LovAnnexiactivity.findAll", query="SELECT l FROM LovAnnexiactivity l")
public class LovAnnexiactivity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="Code")
	private String code;

	@Column(name="EndYear")
	private int endYear;

	private int eperAnnex3_ID;

	private String IPPCCode;
	
	@Id
	private int LOV_AnnexIActivityID;

	@Column(name="Name")
	private String name;

	@Column(name="ParentID")
	private int parentID;

	@Column(name="StartYear")
	private int startYear;

	public LovAnnexiactivity() {
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int getEndYear() {
		return this.endYear;
	}

	public void setEndYear(int endYear) {
		this.endYear = endYear;
	}

	public int getEperAnnex3_ID() {
		return this.eperAnnex3_ID;
	}

	public void setEperAnnex3_ID(int eperAnnex3_ID) {
		this.eperAnnex3_ID = eperAnnex3_ID;
	}

	public String getIPPCCode() {
		return this.IPPCCode;
	}

	public void setIPPCCode(String IPPCCode) {
		this.IPPCCode = IPPCCode;
	}

	public int getLOV_AnnexIActivityID() {
		return this.LOV_AnnexIActivityID;
	}

	public void setLOV_AnnexIActivityID(int LOV_AnnexIActivityID) {
		this.LOV_AnnexIActivityID = LOV_AnnexIActivityID;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getParentID() {
		return this.parentID;
	}

	public void setParentID(int parentID) {
		this.parentID = parentID;
	}

	public int getStartYear() {
		return this.startYear;
	}

	public void setStartYear(int startYear) {
		this.startYear = startYear;
	}

}