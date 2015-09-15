package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.ReportingYear;

@RestController
public class ReportingYearController {

	@PersistenceContext(unitName="eprtr")
    private EntityManager em;
	
	@RequestMapping("/reportingYears")
    public ReportingYear[] reportingYears() {
    	TypedQuery<ReportingYear> query = em.createNamedQuery("ReportingYear.findAll", ReportingYear.class);
    	return query.getResultList().toArray(new ReportingYear[0]);
    }
}
