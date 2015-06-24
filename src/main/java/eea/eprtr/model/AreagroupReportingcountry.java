package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the AREAGROUP_REPORTINGCOUNTRY database table.
 * 
 */
@Entity
@Table(name="AREAGROUP_REPORTINGCOUNTRY")
@NamedQuery(name="AreagroupReportingcountry.findAll", query="SELECT a FROM AreagroupReportingcountry a")
public class AreagroupReportingcountry implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="CountryId")
	private Integer countryId;

	@Column(name="GroupId")
	private Integer groupId;

	@Id
	@Column(name="Id")
	private long id;

	@Column(name="Name")
	private String name;

	public AreagroupReportingcountry() {
	}

	public Integer getCountryId() {
		return this.countryId;
	}

	public void setCountryId(Integer countryId) {
		this.countryId = countryId;
	}

	public Integer getGroupId() {
		return this.groupId;
	}

	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}

	public long getId() {
		return this.id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

}