package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.FacilitydetailPollutantrelease;
import eea.eprtr.model.FacilitydetailPollutantrelease_;

@Repository
public class FacilitydetailPollutantreleaseRepository {

	@PersistenceContext(unitName="eprtr")
    private EntityManager em;
	
	public List<FacilitydetailPollutantrelease> getFacilitydetailPollutantreleases(Integer facilityReportID) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<FacilitydetailPollutantrelease> cq = cb.createQuery(FacilitydetailPollutantrelease.class);
		Root<FacilitydetailPollutantrelease> qr = cq.from(FacilitydetailPollutantrelease.class);
		//cq.select(qr);
		
		cq.select(cb.construct(FacilitydetailPollutantrelease.class, 
                qr.get(FacilitydetailPollutantrelease_.accidentalQuantity),
                qr.get(FacilitydetailPollutantrelease_.accidentalQuantityUnitCode),
                qr.get(FacilitydetailPollutantrelease_.cas),
                qr.get(FacilitydetailPollutantrelease_.confidentialCode),
                qr.get(FacilitydetailPollutantrelease_.confidentialIndicator),
                qr.get(FacilitydetailPollutantrelease_.facilityID),
                qr.get(FacilitydetailPollutantrelease_.facilityReportID),
                qr.get(FacilitydetailPollutantrelease_.groupCode),
                qr.get(FacilitydetailPollutantrelease_.LOV_ConfidentialityID),
                qr.get(FacilitydetailPollutantrelease_.LOV_MediumID),
                qr.get(FacilitydetailPollutantrelease_.LOV_MethodBasisID),
                qr.get(FacilitydetailPollutantrelease_.LOV_PollutantGroupID),
                qr.get(FacilitydetailPollutantrelease_.LOV_PollutantID),
                qr.get(FacilitydetailPollutantrelease_.methodCode),
                //qr.get(FacilitydetailPollutantrelease_.methodDesignation),
                cb.selectCase().when(
                		cb.isNotNull(qr.get(FacilitydetailPollutantrelease_.methodDesignation)),
                					cb.function("REPLACE", String.class, qr.get(FacilitydetailPollutantrelease_.methodDesignation),cb.literal("\\\""),cb.literal("&quot;"))).otherwise(qr.get(FacilitydetailPollutantrelease_.methodDesignation)),
                qr.get(FacilitydetailPollutantrelease_.methodListID),
                qr.get(FacilitydetailPollutantrelease_.methodTypeCode),
                qr.get(FacilitydetailPollutantrelease_.pollutantCode),
                qr.get(FacilitydetailPollutantrelease_.pollutantTo),
                qr.get(FacilitydetailPollutantrelease_.totalQuantity),
                qr.get(FacilitydetailPollutantrelease_.totalQuantityUnitCode))
                ).distinct(true);
		
		cq.where(cb.equal(qr.get(FacilitydetailPollutantrelease_.facilityReportID),facilityReportID));
		TypedQuery<FacilitydetailPollutantrelease> q = em.createQuery(cq);
		List<FacilitydetailPollutantrelease> results = q.getResultList();
		return results;
	}

	
}
