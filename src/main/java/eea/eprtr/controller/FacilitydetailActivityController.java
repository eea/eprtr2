package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.FacilitydetailActivity;

@RestController
public class FacilitydetailActivityController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;


/*  @RequestMapping("/facilitydetailDetails")
    public FacilitydetailDetail[] reportingYears(@RequestParam("FacilityId") Integer facilityID) {
        TypedQuery<FacilitydetailDetail> query = em.createNamedQuery("FacilitydetailDetail.findByFacilityID", FacilitydetailDetail.class);
        query.setParameter("FacilityId", facilityID);
        return query.getResultList().toArray(new FacilitydetailDetail[0]);
    }
*/

    @RequestMapping("/facilitydetailActivity")
    public FacilitydetailActivity[] getByFacilityReportID(
            @RequestParam(value = "FacilityReportID") Integer facilityReportID){

        TypedQuery<FacilitydetailActivity> query = null;

        query = em.createNamedQuery("FacilitydetailActivity.findByFacilityReportID", FacilitydetailActivity.class);
        query.setParameter("FacilityReportID", facilityReportID);

        return query.getResultList().toArray(new FacilitydetailActivity[0]);
    }

}
