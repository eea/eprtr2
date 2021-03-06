package eea.eprtr.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.LovPollutantRepository;
import eea.eprtr.model.LovPollutant;

@RestController
public class PollutantController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;

    @Autowired
    private LovPollutantRepository lovPollutantRepository;

    @RequestMapping("/pollutant")

    public List<LovPollutant> list(@RequestParam(value = "ParentID", required = false) Integer parentID) throws CloneNotSupportedException {
    /*  TypedQuery<LovPollutant> query = null;
        if (parentID == null) {
            query = em.createQuery("SELECT l FROM LovPollutant l where l.parentID is null order by l.code", LovPollutant.class);
        } else {
            query = em.createQuery("SELECT l FROM LovPollutant l where l.parentID = :parentID order by l.code", LovPollutant.class).setParameter("parentID", parentID);
        }
        return query.getResultList();*/
        return lovPollutantRepository.getPollutants(parentID);
    }

    @RequestMapping("/pollutant/{id}")
    public LovPollutant getPollutantByCode(
            @PathVariable(value = "id") Integer id) {
/*      TypedQuery<LovPollutant> query = em.createQuery("SELECT l FROM LovPollutant l where l.LOV_PollutantID = :Id", LovPollutant.class);
        query.setParameter("Id", id);
        return query.getSingleResult();*/
        return lovPollutantRepository.getPollutant(id);

    }

}
