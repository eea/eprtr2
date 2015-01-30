package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.Region;

@RestController
public class RegionController {

	@PersistenceContext
    private EntityManager em;
	
	@RequestMapping("/regions")
    public Region[] reportingYears(@RequestParam("LOV_CountryID") Integer countryId) {
    	TypedQuery<Region> query = em.createNamedQuery("Region.findByLOVCountryID", Region.class);
    	query.setParameter("LOV_CountryID", countryId);
    	return query.getResultList().toArray(new Region[0]);
    }
}
