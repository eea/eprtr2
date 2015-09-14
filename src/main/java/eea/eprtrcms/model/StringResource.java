package eea.eprtrcms.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the StringResource database table.
 * 
 */
@Entity
@NamedQuery(name="StringResource.findAll", query="SELECT s FROM StringResource s")
public class StringResource implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="CultureCode")
	private String cultureCode;

	@Id
	@Column(name="ResourceKey")
	private String resourceKey;

	@Id
	@Column(name="ResourceType")
	private String resourceType;

	@Column(name="ResourceValue")
	private String resourceValue;

	public StringResource() {
	}

	public String getCultureCode() {
		return this.cultureCode;
	}

	public void setCultureCode(String cultureCode) {
		this.cultureCode = cultureCode;
	}

	public String getResourceKey() {
		return this.resourceKey;
	}

	public void setResourceKey(String resourceKey) {
		this.resourceKey = resourceKey;
	}

	public String getResourceType() {
		return this.resourceType;
	}

	public void setResourceType(String resourceType) {
		this.resourceType = resourceType;
	}

	public String getResourceValue() {
		return this.resourceValue;
	}

	public void setResourceValue(String resourceValue) {
		this.resourceValue = resourceValue;
	}

}