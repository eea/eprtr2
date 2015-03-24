package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.LovAreagroup;

@RestController
public class LovAreaGroupController {

	@PersistenceContext
    private EntityManager em;

	
	@RequestMapping("/lovAreaGroup/{id}")
	public LovAreagroup getLovAreagroupByCode(
			@PathVariable(value = "id") Integer id) {
		TypedQuery<LovAreagroup> query = em.createQuery("SELECT l FROM LovAreagroup l where l.LOV_AreaGroupID = :Id", LovAreagroup.class);
    	query.setParameter("Id", id);
    	return query.getSingleResult();
	}


	
}
