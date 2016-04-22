package eea.eprtr.controller;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.Reportingcountry;

@RestController
public class ReportingCountryController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;

    @RequestMapping("/reportingCountries")
    public Reportingcountry[] reportingCountries() {

        TypedQuery<Reportingcountry> query = em.createNamedQuery("Reportingcountry.findAll", Reportingcountry.class);
        return query.getResultList().toArray(new Reportingcountry[0]);

        /*TypedQuery<Reportingcountry> query = em.createQuery("SELECT r FROM Reportingcountry r", Reportingcountry.class);
        return query.getResultList();//.toArray(new Reportingcountry[0]);*/
    }
}
