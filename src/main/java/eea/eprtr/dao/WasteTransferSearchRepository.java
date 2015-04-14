package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.Wastetransfer;

@Repository
public class WasteTransferSearchRepository {
	
	@PersistenceContext
    private EntityManager em;
	
	public List<Wastetransfer> getWastetransfer(WastetransferSearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<Wastetransfer> cq = cb.createQuery(Wastetransfer.class);
		Root<Wastetransfer> qr = cq.from(Wastetransfer.class);
		cq.select(qr);
		cq.where(filter.buildWhereClause(cb, qr));

		TypedQuery<Wastetransfer> q = em.createQuery(cq);
		List<Wastetransfer> results = q.getResultList();
		return results;
	}
}
