package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.LovPollutant;


@Repository
public class PollutantSearchRepository {

	@PersistenceContext(unitName="eprtr")
    private EntityManager em;
	
	public List<LovPollutant> getLovPollutants(PollutantSearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<LovPollutant> cq = cb.createQuery(LovPollutant.class);
		Root<LovPollutant> qr = cq.from(LovPollutant.class);
		cq.select(qr);
		cq.where(filter.buildWhereClauseLOVPollutant(cb, qr));

		TypedQuery<LovPollutant> q = em.createQuery(cq);
		List<LovPollutant> results = q.getResultList();
		return results;
	}
	
}
