package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.LovCountry;

@RestController
public class LovCountryController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;


    @RequestMapping("/lovCountry/{id}")
    public LovCountry getPollutantByCode(
            @PathVariable(value = "id") Integer id) {
        TypedQuery<LovCountry> query = em.createQuery("SELECT l FROM LovCountry l where l.LOV_CountryID = :Id", LovCountry.class);
        query.setParameter("Id", id);
        return query.getSingleResult();
    }



}
