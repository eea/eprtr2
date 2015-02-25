package eea.eprtr.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.LovPollutant;
import eea.eprtr.model.Region;

@RestController
public class PollutantController {

	@PersistenceContext
    private EntityManager em;

	@RequestMapping("/pollutant")

    public List<LovPollutant> list(@RequestParam("ParentID") Integer parentID) {
		TypedQuery<LovPollutant> query = null;
		if (parentID == null) {
			query = em.createQuery("SELECT l FROM LovPollutant l where l.parentID is null", LovPollutant.class);		
		} else {
			query = em.createQuery("SELECT l FROM LovPollutant l where l.parentID = :parentID", LovPollutant.class).setParameter("parentID", parentID);
		}
		return query.getResultList();
    }

}
