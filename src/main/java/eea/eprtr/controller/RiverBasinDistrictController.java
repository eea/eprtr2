package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.RiverBasinDistrict;

@RestController
public class RiverBasinDistrictController {

	@PersistenceContext
    private EntityManager em;
	
	@RequestMapping("/riverBasinDistricts")
    public RiverBasinDistrict[] reportingYears(@RequestParam("LOV_CountryID") Integer countryId) {
    	TypedQuery<RiverBasinDistrict> query = em.createNamedQuery("RiverBasinDistrict.findByLOVCountryID", RiverBasinDistrict.class);
    	query.setParameter("LOV_CountryID", countryId);
    	return query.getResultList().toArray(new RiverBasinDistrict[0]);
    }
}
