package eea.eprtr.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.FacilitydetailPollutantreleaseRepository;
import eea.eprtr.model.FacilitydetailPollutantrelease;

@RestController
public class FacilitydetailPollutantreleaseController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;

    @Autowired
    private FacilitydetailPollutantreleaseRepository facilitydetailPollutantreleaseRepository;

    @RequestMapping("/facilitydetailPollutantrelease")
    public List<FacilitydetailPollutantrelease> getFacilitydetailPollutantrelease(@RequestParam(value = "FacilityReportID") Integer facilityReportID){

        List<FacilitydetailPollutantrelease> results = facilitydetailPollutantreleaseRepository.getFacilitydetailPollutantreleases(facilityReportID);
/*      TypedQuery<FacilitydetailPollutantrelease> query = em.createNamedQuery("FacilitydetailPollutantrelease.findByFacilityReportID", FacilitydetailPollutantrelease.class);
        query.setParameter("FacilityReportID", facilityReportID);
        return query.getResultList().toArray(new FacilitydetailPollutantrelease[0]);*/
        return results;
    }

}
