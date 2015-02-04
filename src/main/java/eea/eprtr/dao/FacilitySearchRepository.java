package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;
import eea.eprtr.model.FacilitySearchMainActivity;
import eea.eprtr.model.FacilitySearchMainActivity_;

@Repository
public class FacilitySearchRepository {

	@PersistenceContext
    private EntityManager em;
	
	public long getFacilityCount(FacilitySearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq = cb.createQuery(Long.class);
		Root<FacilitySearchAll> qr = cq.from(FacilitySearchAll.class);
		cq.select(cb.count(qr));
		filter.apply(cb, cq, qr);
		
		Long count = em.createQuery(cq).getSingleResult();
		return count.longValue();
	}
	
	public List<FacilitySearchMainActivity> getFacilities(FacilitySearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<FacilitySearchMainActivity> cq = cb.createQuery(FacilitySearchMainActivity.class);
		Root<FacilitySearchMainActivity> qr = cq.from(FacilitySearchMainActivity.class);
		cq.select(qr);
		
		Subquery<Integer> sq = cq.subquery(Integer.class);
		Root<FacilitySearchAll> sqr = sq.from(FacilitySearchAll.class);
		sq.select(sqr.get(FacilitySearchAll_.facilityReportID));
		filter.apply(cb, sq, sqr);
		
		cq.where(qr.get(FacilitySearchMainActivity_.facilityReportID).in(sq));
		
		List<FacilitySearchMainActivity> results = em.createQuery(cq).getResultList();
		return results;
	}
}
