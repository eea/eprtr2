package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.Pollutantrelease;
import eea.eprtr.model.Pollutantrelease_;

@Repository
public class PollutantreleaseSearchRepository {

	@PersistenceContext
    private EntityManager em;

	public PollutantreleaseCounts getPollutantreleaseCounts(PollutantreleaseSearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<PollutantreleaseCounts> cq = cb.createQuery(PollutantreleaseCounts.class);
		Root<Pollutantrelease> qr = cq.from(Pollutantrelease.class);
		cq.select(
				cb.construct(PollutantreleaseCounts.class, 
						cb.count(qr.get(Pollutantrelease_.quantityAir)), 
						cb.count(qr.get(Pollutantrelease_.quantitySoil)), 
						cb.count(qr.get(Pollutantrelease_.quantityWater))));
		cq.where(filter.buildWhereClause(cb, qr));

		TypedQuery<PollutantreleaseCounts> q = em.createQuery(cq);
		PollutantreleaseCounts result = q.getSingleResult();
		return result;
	}
	
	public List<Pollutantrelease> getPollutantreleases(PollutantreleaseSearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<Pollutantrelease> cq = cb.createQuery(Pollutantrelease.class);
		Root<Pollutantrelease> qr = cq.from(Pollutantrelease.class);
		cq.select(qr);
		cq.where(filter.buildWhereClause(cb, qr));

		TypedQuery<Pollutantrelease> q = em.createQuery(cq);
		List<Pollutantrelease> results = q.getResultList();
		return results;
	}
}
