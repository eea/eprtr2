package eea.eprtr.model;

import java.io.Serializable;

public class LocationList  implements Serializable,Cloneable{
	private static final long serialVersionUID = 1L;
	
	private Integer countryId;
	private Integer groupId;
	private Integer id;
	private String name;
	
	public LocationList(Integer countryId, Integer groupId, Integer id, String name){
		this.countryId = countryId;
		this.groupId = groupId;
		this.id = id;
		this.name = name;
	}

	public Integer getCountryId() {
		return countryId;
	}

	public void  setCountryId(Integer countryId) {
		this.countryId = countryId;
	}

	public Integer getGroupId() {
		return groupId;
	}

	public void  setGroupId(Integer groupId) {
		this.groupId = groupId;
	}

	public Integer getId() {
		return id;
	}

	public void  setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void  setName(String name) {
		this.name = name;
	}

	
}
