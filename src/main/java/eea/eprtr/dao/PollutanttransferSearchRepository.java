package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.Pollutanttransfer;

@Repository
public class PollutanttransferSearchRepository {

	@PersistenceContext
    private EntityManager em;
	
	public List<Pollutanttransfer> getPollutanttransfer(PollutanttransferSearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<Pollutanttransfer> cq = cb.createQuery(Pollutanttransfer.class);
		Root<Pollutanttransfer> qr = cq.from(Pollutanttransfer.class);
		cq.select(qr);
		cq.where(filter.buildWhereClause(cb, qr));

		TypedQuery<Pollutanttransfer> q = em.createQuery(cq);
		List<Pollutanttransfer> results = q.getResultList();
		return results;
	}
	
}
