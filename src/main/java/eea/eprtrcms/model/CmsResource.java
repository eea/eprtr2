package eea.eprtrcms.model;

import java.io.Serializable;

public class CmsResource implements Serializable,Cloneable{
	private static final long serialVersionUID = 1L;

	private String key;
	private String type;
	private String val;

	public CmsResource(String key,String type,String val) {
		this.key = key;
		this.type = type;
		this.val = val;
	}

	public String getKey() {
		return this.key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getValue() {
		return this.val;
	}

	public void setValue(String value) {
		this.val = value;
	}

}