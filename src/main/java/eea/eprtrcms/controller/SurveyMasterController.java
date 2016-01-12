package eea.eprtrcms.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtrcms.dao.SurveyMasterRepository;
import eea.eprtrcms.model.SurveyMaster;

@RestController
public class SurveyMasterController {

	@Autowired
	private SurveyMasterRepository surveyMasterRepository;

	
	@RequestMapping("/eprtrsurveyquestions")
    public List<SurveyMaster> surveyMasterSearch(
    		HttpServletResponse response
    		) {
		
		List<SurveyMaster> surveyQuestions = surveyMasterRepository.getSurveyQuestions();
		
		return surveyQuestions;
	
	}
}	