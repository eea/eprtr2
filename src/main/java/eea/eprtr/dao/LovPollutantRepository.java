package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.LovPollutant;

@Repository
public class LovPollutantRepository {


	@PersistenceContext
    private EntityManager em;

	public List<LovPollutant> getPollutants(Integer parentID) {
		TypedQuery<LovPollutant> query = null;
		if (parentID == null) {
			query = em.createQuery("SELECT l FROM LovPollutant l where l.parentID is null order by l.code", LovPollutant.class);		
		} else {
			query = em.createQuery("SELECT l FROM LovPollutant l where l.parentID = :parentID order by l.code", LovPollutant.class).setParameter("parentID", parentID);
		}

		List<LovPollutant> results = query.getResultList();
		return results;
	}

	public LovPollutant getPollutant(Integer id) {
		TypedQuery<LovPollutant> query = em.createQuery("SELECT l FROM LovPollutant l where l.LOV_PollutantID = :Id", LovPollutant.class);
    	query.setParameter("Id", id);
    	return query.getSingleResult();
	}

}
