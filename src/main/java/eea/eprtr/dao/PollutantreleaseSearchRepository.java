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

@Repository
public class PollutantreleaseSearchRepository {

	@PersistenceContext
    private EntityManager em;
	
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
