package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
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

	@PersistenceContext(unitName="eprtr")
    private EntityManager em;
	
	public long getFacilityCount(FacilitySearchFilter filter) {
		long count = getFacilitySearchAllCount(filter);
		if (count > 0) {
			count = getFacilitySearchMainActivityCount(filter);
		}
		return count;
	}

	private long getFacilitySearchAllCount(FacilitySearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq = cb.createQuery(Long.class);
		Root<FacilitySearchAll> qr = cq.from(FacilitySearchAll.class);
		cq.select(cb.count(qr));
		cq.where(filter.buildWhereClause(cb, qr));
		
		long count = em.createQuery(cq).getSingleResult().longValue();
		return count;
	}
	
	private long getFacilitySearchMainActivityCount(FacilitySearchFilter filter) {
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq = cb.createQuery(Long.class);
		Root<FacilitySearchMainActivity> qr = cq.from(FacilitySearchMainActivity.class);
		cq.select(cb.count(qr));
		
		Subquery<Integer> sq = cq.subquery(Integer.class);
		Root<FacilitySearchAll> sqr = sq.from(FacilitySearchAll.class);
		sq.select(sqr.get(FacilitySearchAll_.facilityReportID));
		sq.where(filter.buildWhereClause(cb, sqr));
		
		cq.where(qr.get(FacilitySearchMainActivity_.facilityReportID).in(sq));
		
		long count = em.createQuery(cq).getSingleResult().longValue();
		return count;
	}
	
	public List<FacilitySearchMainActivity> getFacilities(FacilitySearchFilter filter, OrderBy orderBy, QueryPager pager) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<FacilitySearchMainActivity> cq = cb.createQuery(FacilitySearchMainActivity.class);
		Root<FacilitySearchMainActivity> qr = cq.from(FacilitySearchMainActivity.class);
		cq.select(qr);
		
		Subquery<Integer> sq = cq.subquery(Integer.class);
		Root<FacilitySearchAll> sqr = sq.from(FacilitySearchAll.class);
		sq.select(sqr.get(FacilitySearchAll_.facilityReportID));
		sq.where(filter.buildWhereClause(cb, sqr));
		
		cq.where(qr.get(FacilitySearchMainActivity_.facilityReportID).in(sq));
		if (orderBy != null){
			orderBy.apply(cb, cq, qr);
		}
		TypedQuery<FacilitySearchMainActivity> q = em.createQuery(cq);
		if (pager != null){
			pager.apply(q);
		}		
		List<FacilitySearchMainActivity> results = q.getResultList();
		return results;
	}
}
