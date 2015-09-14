package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.FacilitydetailWastetransfer;

@RestController
public class FacilitydetailWastetransferController {

	@PersistenceContext(unitName="eprtr")
    private EntityManager em;

	@RequestMapping("/facilitydetailWastetransfer")
    public FacilitydetailWastetransfer[] getFacilitydetailWastetransfer(@RequestParam(value = "FacilityReportID") Integer facilityReportID){
    	TypedQuery<FacilitydetailWastetransfer> query = em.createNamedQuery("FacilitydetailWastetransfer.findByFacilityReportID", FacilitydetailWastetransfer.class);
    	query.setParameter("FacilityReportID", facilityReportID);
    	return query.getResultList().toArray(new FacilitydetailWastetransfer[0]);
    }
	
}
