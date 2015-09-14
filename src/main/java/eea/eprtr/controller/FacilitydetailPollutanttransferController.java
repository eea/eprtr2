package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.FacilitydetailPollutanttransfer;

@RestController
public class FacilitydetailPollutanttransferController {

	@PersistenceContext(unitName="eprtr")
    private EntityManager em;

	@RequestMapping("/facilitydetailPollutanttransfer")
    public FacilitydetailPollutanttransfer[] getFacilitydetailPollutanttransfer(@RequestParam(value = "FacilityReportID") Integer facilityReportID){
    	TypedQuery<FacilitydetailPollutanttransfer> query = em.createNamedQuery("FacilitydetailPollutanttransfer.findByFacilityReportID", FacilitydetailPollutanttransfer.class);
    	query.setParameter("FacilityReportID", facilityReportID);
    	return query.getResultList().toArray(new FacilitydetailPollutanttransfer[0]);
    }
	

	
}
