package eea.eprtr.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.FacilitydetailDetail;

@Repository
public class FacilityDetailsDetailsRepository {

	@PersistenceContext
    private EntityManager em;

	public FacilitydetailDetail getByFacilityReportID(Integer facilityReportID) {
		
		TypedQuery<FacilitydetailDetail> query = null;
		query = em.createNamedQuery("FacilitydetailDetail.findByFacilityReportID", FacilitydetailDetail.class);
		query.setParameter("FacilityReportID", facilityReportID);
		FacilitydetailDetail results = query.getSingleResult();
		return results;
	}
	
	public FacilitydetailDetail getByFacilityIDAndYear(Integer facilityID, Integer reportingYear) {
		
		TypedQuery<FacilitydetailDetail> query = null;
		query = em.createNamedQuery("FacilitydetailDetail.findByFacilityIDAndYear", FacilitydetailDetail.class);
		query.setParameter("facilityID", facilityID);
		query.setParameter("reportingYear", reportingYear);
		FacilitydetailDetail results = query.getSingleResult();
		return results;
	}

}
