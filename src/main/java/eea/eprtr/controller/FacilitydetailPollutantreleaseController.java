package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.FacilitydetailPollutantrelease;

@RestController
public class FacilitydetailPollutantreleaseController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;

    @RequestMapping("/facilitydetailPollutantrelease")
    public FacilitydetailPollutantrelease[] getFacilitydetailPollutantrelease(@RequestParam(value = "FacilityReportID") Integer facilityReportID){
        TypedQuery<FacilitydetailPollutantrelease> query = em.createNamedQuery("FacilitydetailPollutantrelease.findByFacilityReportID", FacilitydetailPollutantrelease.class);
        query.setParameter("FacilityReportID", facilityReportID);
        return query.getResultList().toArray(new FacilitydetailPollutantrelease[0]);
    }
    

    
}
