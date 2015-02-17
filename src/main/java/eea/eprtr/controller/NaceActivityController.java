package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.NaceActivity;
import eea.eprtr.model.NaceActivity_;

@RestController
public class NaceActivityController {

	@PersistenceContext
    private EntityManager em;
	
	@RequestMapping("/naceActivity")
    public NaceActivity[] reportingCountries(
    		@RequestParam(value = "ParentID", required = false) Integer parentID) {
		
		Integer startYearEPRTR = new Integer(2007);
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<NaceActivity> cq = cb.createQuery(NaceActivity.class);
		Root<NaceActivity> qr = cq.from(NaceActivity.class);
		cq.select(qr);
		
		Predicate predIsEPRTR = cb.greaterThanOrEqualTo(qr.get(NaceActivity_.startYear), startYearEPRTR);
		if (parentID == null) {
			cq.where(cb.and(predIsEPRTR, cb.isNull(qr.get(NaceActivity_.parentID))));
		} else {
			cq.where(cb.and(predIsEPRTR, cb.equal(qr.get(NaceActivity_.parentID), parentID)));
		}
		cq.orderBy(cb.asc(qr.get(NaceActivity_.code)));
		
		TypedQuery<NaceActivity> q = em.createQuery(cq);
		return q.getResultList().toArray(new NaceActivity[0]);
    }
}
