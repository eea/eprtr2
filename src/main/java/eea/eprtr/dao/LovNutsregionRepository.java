package eea.eprtr.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.LovNutsregion;

@Repository
public class LovNutsregionRepository {

	@PersistenceContext
    private EntityManager em;

	public LovNutsregion get(String code) {
		
		TypedQuery<LovNutsregion> query = null;
		query = em.createNamedQuery("LovNutsregion.findByCode", LovNutsregion.class);
		query.setParameter("Code", code);
		LovNutsregion results = query.getSingleResult();
		return results;
	}
}
