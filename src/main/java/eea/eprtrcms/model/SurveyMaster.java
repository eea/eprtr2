package eea.eprtrcms.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;


/**
 * The persistent class for the StringResource database table.
 * 
 */
@Entity
@Table(name="SurveyMaster")
@NamedQuery(name="SurveyMaster.findAll", query="SELECT s FROM SurveyMaster s")
public class SurveyMaster implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="SurveyID")
	private Integer surveyID;

	@Column(name="SurveyText")
	private String surveyText;

	@Column(name="SurveyLabel")
	private String surveyLabel;
	
	@Column(name="ListIndex")
	private Integer index;
	
	public SurveyMaster() {
	}
	
	@Transient	
	private List<SurveyItems> surveyItems;

	public Integer getSurveyID() {
		return this.surveyID;
	}

	public String getSurveyLabel() {
		return this.surveyLabel;
	}

	public String getSurveyText() {
		return this.surveyText;
	}

	public Integer getIndex() {
		return this.index;
	}

	public List<SurveyItems> getSurveyItems(){
		return this.surveyItems;
	}
	
	public void setSurveyItems(List<SurveyItems> surveyItems) {
		this.surveyItems = surveyItems;
	}

	public void addSurveyItem(SurveyItems surveyItem) {
		this.surveyItems.add(surveyItem);
	}

}