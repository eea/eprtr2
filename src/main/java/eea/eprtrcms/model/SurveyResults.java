package eea.eprtrcms.model;

import java.io.Serializable;

import javax.persistence.*;


/**
 * The persistent class for the StringResource database table.
 * 
 */
@Entity
@Table(name="SurveyResults")
public class SurveyResults implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Basic(optional = false)
	@Column(name="SurveyResultID")
	private Integer surveyResultID;

	@Column(name="SurveyResult")
	private String surveyResult;

	public SurveyResults() {
	}

	public Integer getSurveyResultID() {
		return this.surveyResultID;
	}

	public String getSurveyResult() {
		return this.surveyResult;
	}

	public void setSurveyResult(String surveyResult) {
		this.surveyResult = surveyResult;
	}

}