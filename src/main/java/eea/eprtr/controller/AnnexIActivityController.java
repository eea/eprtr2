package eea.eprtr.controller;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.dao.AnnexIActivityRepository;
import eea.eprtr.model.AnnexIActivity;

@RestController
public class AnnexIActivityController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;

    private AnnexIActivityRepository repository;

    @Autowired
    public AnnexIActivityController(AnnexIActivityRepository repository) {
        this.repository = repository;
    }

    @RequestMapping("/annexIActivity")
    public List<AnnexIActivity> list(
            @RequestParam(value = "ParentID", required = false) Integer parentID) {
        return repository.list(parentID);
    }

    @RequestMapping("/annexIActivity/{id}")
    public AnnexIActivity getAnnexIActivityByID(
            @PathVariable(value = "id") Integer id) {
        TypedQuery<AnnexIActivity> query = em.createQuery("SELECT l FROM AnnexIActivity l where l.LOV_AnnexIActivityID = :Id", AnnexIActivity.class);
        query.setParameter("Id", id);
        return query.getSingleResult();
    }
}
