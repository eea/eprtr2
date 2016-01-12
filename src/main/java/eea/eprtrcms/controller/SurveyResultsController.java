package eea.eprtrcms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtrcms.dao.SurveyResultsRepository;
import eea.eprtrcms.model.SurveyResults;

@RestController
public class SurveyResultsController {

	@Autowired
	private SurveyResultsRepository surveyResultsRepository;

	
	@RequestMapping(value = "/addeprtrsurveyresult", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.OK)
	void addSurveyResult(String result) {
		SurveyResults sresult = new SurveyResults();
		sresult.setSurveyResult(result);
		surveyResultsRepository.addSurveyResult(sresult);
	}
}	