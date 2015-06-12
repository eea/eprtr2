package eea.eprtr.model;

import java.io.Serializable;
import java.util.List;

public class ActivityPollutantQuantity implements Serializable,Cloneable{
	private static final long serialVersionUID = 1L;

	private String key;
	private Integer lov_iasectorid;
	private Integer lov_iaactivityid;
	private Integer lov_iasubactivityid;
	private String iasectorcode;
	private String iaactivitycode;
	private String iasubactivitycode;
	private Integer lov_pollutantgroupid;
	public List<PollutantQuantity> pollutantquantitys;
	public List<ActivityPollutantQuantity> data;

	public ActivityPollutantQuantity(String key, Integer iasectorid, String iasectorcode, Integer iaactivityid, String iaactivitycode, Integer iasubactivityid, String iasubactivitycode, Integer lov_pollutantgroupid, List<PollutantQuantity> pollutantquantitys, List<ActivityPollutantQuantity> data){
		this.key = key;
		this.lov_iaactivityid = iaactivityid;
		this.iaactivitycode = iaactivitycode;
		this.lov_iasectorid = iasectorid;
		this.iasectorcode = iasectorcode;
		this.lov_iasubactivityid = iasubactivityid;
		this.iasubactivitycode = iasubactivitycode;
		this.lov_pollutantgroupid = lov_pollutantgroupid;
		this.pollutantquantitys = pollutantquantitys;
		this.data = data;
	}
	
	public String getKey() {
		return  key;
	}

	public Integer getLov_PollutantGroupID() {
		return  lov_pollutantgroupid;
	}

	public Integer getIaSectorID() {
		return  lov_iasectorid;
	}

	public Integer getIaActivityID() {
		return  lov_iaactivityid;
	}

	public Integer getIaSubActivityID() {
		return  lov_iasubactivityid;
	}

	
	public String getIaSectorCode() {
		return  iasectorcode;
	}

	public String getIaActivityCode() {
		return  iaactivitycode;
	}

	public String getIaSubActivityCode() {
		return  iasubactivitycode;
	}

	public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

	/*
	public List<PollutantQuantity> getPollutantQuantitys() {
		return pollutantquantitys;
	}

	public void setPollutantQuantitys(List<PollutantQuantity> pollutantquantitys) {
		this.pollutantquantitys = pollutantquantitys;
	}

	public List<ActivityPollutantQuantity> getData() {
		return data;
	}

	public void setData(List<ActivityPollutantQuantity> data) {
		this.data = data;
	}*/



}
