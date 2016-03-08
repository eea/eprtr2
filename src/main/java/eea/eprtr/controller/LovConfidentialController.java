package eea.eprtr.controller;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.LovConfidentiality;

@RestController
public class LovConfidentialController {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;

    @RequestMapping("/lovConfidential/{confidentialCode}")
    public LovConfidentiality getLovUnit(@PathVariable(value = "confidentialCode") String confidentialCode){
        TypedQuery<LovConfidentiality> query = em.createNamedQuery("LovConfidentiality.findByCode", LovConfidentiality.class);
        query.setParameter("ConfidentialCode", confidentialCode);
        return query.getSingleResult();
    }

}
