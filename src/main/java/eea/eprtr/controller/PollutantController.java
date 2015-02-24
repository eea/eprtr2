package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.LovPollutant;

@RestController
public class PollutantController {

	@PersistenceContext
    private EntityManager em;

	@RequestMapping("/polutantMainGroups")
    public LovPollutant[] getMainPolutantGroups() {
		TypedQuery<LovPollutant> query = em.createQuery("SELECT l FROM LovPollutant l where l.parentID is null", LovPollutant.class);		
		LovPollutant[] result = query.getResultList().toArray(new LovPollutant[0]);
		return result;
    }

}
