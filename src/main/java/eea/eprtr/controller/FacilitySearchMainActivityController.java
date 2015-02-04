package eea.eprtr.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.AbstractQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;
import eea.eprtr.model.FacilitySearchMainActivity;
import eea.eprtr.model.FacilitySearchMainActivity_;

@RestController
public class FacilitySearchMainActivityController {

	@PersistenceContext
    private EntityManager em;
	
	@RequestMapping("/facilitySearchMainActivities")
    public FacilitySearchMainActivity[] facilitySearchMainActivities(
    		@RequestParam("ReportingYear") Integer reportingYear,
    		@RequestParam(value = "LOV_CountryID", required = false) Integer countryID,
    		@RequestParam(value = "AreaGroupID", required = false) Integer areaGroupID) {
		
		CriteriaBuilder criteriaBuilder = em.getCriteriaBuilder();
		
		CriteriaQuery<Long> criteriaQueryCountAllFacilities = criteriaBuilder.createQuery(Long.class);
		Root<FacilitySearchAll> allFacilities = criteriaQueryCountAllFacilities.from(FacilitySearchAll.class);
		criteriaQueryCountAllFacilities.select(criteriaBuilder.count(allFacilities));
		filter(criteriaBuilder, criteriaQueryCountAllFacilities, allFacilities, reportingYear);
		
		Long count = em.createQuery(criteriaQueryCountAllFacilities).getSingleResult();
		if (count.longValue() > 0) {
			CriteriaQuery<FacilitySearchMainActivity> criteriaQueryFacilitiesMainActivity = criteriaBuilder.createQuery(FacilitySearchMainActivity.class);
			Root<FacilitySearchMainActivity> mainActivities = criteriaQueryFacilitiesMainActivity.from(FacilitySearchMainActivity.class);
			criteriaQueryFacilitiesMainActivity.select(mainActivities);
			
			Subquery<Integer> subquery = criteriaQueryFacilitiesMainActivity.subquery(Integer.class);
			allFacilities = subquery.from(FacilitySearchAll.class);
			subquery.select(allFacilities.get(FacilitySearchAll_.facilityReportID));
			filter(criteriaBuilder, subquery, allFacilities, reportingYear);
			criteriaQueryFacilitiesMainActivity.where(mainActivities.get(FacilitySearchMainActivity_.facilityReportID).in(subquery));
			
			List<FacilitySearchMainActivity> results = em.createQuery(criteriaQueryFacilitiesMainActivity).getResultList();
			return results.toArray(new FacilitySearchMainActivity[0]);
		}
		
		return new FacilitySearchMainActivity[0];
    }

	private void filter(CriteriaBuilder criteriaBuilder, AbstractQuery<?> criteriaQuery, Root<FacilitySearchAll> facilities, 
			Integer reportingYear) {
		criteriaQuery.where(criteriaBuilder.equal(facilities.get(FacilitySearchAll_.reportingYear), reportingYear));
	}
}
