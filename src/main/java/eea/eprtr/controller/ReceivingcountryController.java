package eea.eprtr.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.Receivingcountry;

@RestController
public class ReceivingcountryController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;

    @RequestMapping("/receivingCountry")
    public List<Receivingcountry> reportingYears() {
        TypedQuery<Receivingcountry> query = em.createNamedQuery("Receivingcountry.findAll", Receivingcountry.class);
        return query.getResultList();
    }
}
