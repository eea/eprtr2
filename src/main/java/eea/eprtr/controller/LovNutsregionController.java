package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.LovNutsregion;

@RestController
public class LovNutsregionController {

	@PersistenceContext
    private EntityManager em;
	
	@RequestMapping("/nutsRegion/{id}")
	public LovNutsregion getLovNutsregionById(
			@PathVariable(value = "id") Integer id) {
		TypedQuery<LovNutsregion> query = em.createQuery("SELECT l FROM LovNutsregion l where l.LOV_NUTSRegionID = :Id", LovNutsregion.class);
    	query.setParameter("Id", id);
    	return query.getSingleResult();
	}
	
}
