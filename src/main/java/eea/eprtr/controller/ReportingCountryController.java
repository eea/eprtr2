package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.ReportingCountry;

@RestController
public class ReportingCountryController {

	@PersistenceContext
    private EntityManager em;
	
	@RequestMapping("/reportingCountries")
    public ReportingCountry[] reportingCountries() {
		TypedQuery<ReportingCountry> query = em.createNamedQuery("ReportingCountry.findAll", ReportingCountry.class);
		return query.getResultList().toArray(new ReportingCountry[0]);
    }
}
