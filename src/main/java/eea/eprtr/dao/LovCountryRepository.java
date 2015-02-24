package eea.eprtr.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.LovCountry;

@Repository
public class LovCountryRepository {

	@PersistenceContext
    private EntityManager em;

	public LovCountry get(String countryCode) {
		
		TypedQuery<LovCountry> query = null;
		query = em.createNamedQuery("LovCountry.findByCountryCode", LovCountry.class);
		query.setParameter("CountryCode", countryCode);
		LovCountry results = query.getSingleResult();
		return results;
	}
}
