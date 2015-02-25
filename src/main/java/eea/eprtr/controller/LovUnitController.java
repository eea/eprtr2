package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.LovUnit;

@RestController
public class LovUnitController {

	@PersistenceContext
    private EntityManager em;

	@RequestMapping("/lovUnit/{unitCode}")
    public LovUnit getLovUnit(@RequestParam("Code") String unitCode) {
    	TypedQuery<LovUnit> query = em.createNamedQuery("LovUnit.findByCode", LovUnit.class);
    	query.setParameter("Code", unitCode);
    	return query.getSingleResult();
    }
	
}
