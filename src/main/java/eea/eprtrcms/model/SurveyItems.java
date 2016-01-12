package eea.eprtrcms.model;

import java.io.Serializable;

import javax.persistence.*;


/**
 * The persistent class for the StringResource database table.
 * 
 */
@Entity
@Table(name="SurveyItems")
@NamedQuery(name="SurveyItems.findAll", query="SELECT s FROM SurveyItems s")
public class SurveyItems implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="SurveyItemID")
	private Integer surveyItemID;

	@Column(name="FK_SurveyID")
	private Integer fkSurveyID;

	@Column(name="SurveyItem")
	private String surveyItem;

	@Column(name="SurveyItemResultID")
	private String surveyItemResultID;

	@Column(name="ListIndex")
	private Integer index;

	public SurveyItems() {
	}

	public Integer getSurveyItemID() {
		return this.surveyItemID;
	}

	public Integer getFKSurveyID() {
		return this.fkSurveyID;
	}

	public String getSurveyItem() {
		return this.surveyItem;
	}

	public String getSurveyItemResultID() {
		return this.surveyItemResultID;
	}

	public Integer getIndex() {
		return this.index;
	}

	
}