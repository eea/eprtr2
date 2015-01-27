package eea.eprtr.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.ReportingYear;

@RestController
public class ReportingYearController {

	@PersistenceContext
    private EntityManager em;
	
	@RequestMapping("/reportingYears")
    public int[] reportingYears() {
    	TypedQuery<ReportingYear> query = em.createNamedQuery("ReportingYear.findAll", ReportingYear.class);
    	List<ReportingYear> results = query.getResultList();
    	int[] resultArray = new int[results.size()];
    	for (int i = 0; i < results.size(); i++) {
    		resultArray[i] = results.get(i).getYear();
    	}
    	return resultArray;
    }
}
