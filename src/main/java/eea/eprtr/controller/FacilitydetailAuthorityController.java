package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.FacilitydetailAuthority;

@RestController
public class FacilitydetailAuthorityController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;

    @RequestMapping("/facilitydetailAuthority/{facilityReportID}")
    public FacilitydetailAuthority getFacilitydetailAuthority(@PathVariable(value = "facilityReportID") Integer facilityReportID){
        TypedQuery<FacilitydetailAuthority> query = em.createNamedQuery("FacilitydetailAuthority.findByFacilityReportID", FacilitydetailAuthority.class);
        query.setParameter("FacilityReportID", facilityReportID);
        return query.getSingleResult();
    }
    
}
