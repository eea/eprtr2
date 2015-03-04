package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.FacilitydetailDetail;

@RestController
public class FacilitydetailDetailController {
	
	@PersistenceContext
    private EntityManager em;

	
/*	@RequestMapping("/facilitydetailDetails")
    public FacilitydetailDetail[] reportingYears(@RequestParam("FacilityId") Integer facilityID) {
    	TypedQuery<FacilitydetailDetail> query = em.createNamedQuery("FacilitydetailDetail.findByFacilityID", FacilitydetailDetail.class);
    	query.setParameter("FacilityId", facilityID);
    	return query.getResultList().toArray(new FacilitydetailDetail[0]);
    }
*/	
	
	@RequestMapping("/facilitydetailDetails")
	public FacilitydetailDetail[] getByFacilityIDAndYear(
    		@RequestParam(value = "FacilityID") Integer facilityID,
    		@RequestParam(value = "ReportingYear") Integer reportingYear){

		TypedQuery<FacilitydetailDetail> query = null;
		
		query = em.createNamedQuery("FacilitydetailDetail.findByFacilityIDAndYear", FacilitydetailDetail.class);
		query.setParameter("FacilityID", facilityID);
		query.setParameter("ReportingYear", reportingYear);
		
		return query.getResultList().toArray(new FacilitydetailDetail[0]);
	}
	
	@RequestMapping("/facilitydetailDetails/{facilityReportID}")
	public FacilitydetailDetail getByFacilityReportID(
			@PathVariable(value = "facilityReportID") Integer facilityReportID) {
		TypedQuery<FacilitydetailDetail> query = em.createNamedQuery("FacilitydetailDetail.findByFacilityReportID", FacilitydetailDetail.class);
    	query.setParameter("FacilityReportID", facilityReportID);
    	return query.getSingleResult();
	}




	
	
}
