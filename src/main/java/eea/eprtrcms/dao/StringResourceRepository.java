package eea.eprtrcms.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtrcms.model.StringResource;
import eea.eprtrcms.model.CmsResource;
import eea.eprtrcms.model.StringResource_;

@Repository
public class StringResourceRepository {
    
    @PersistenceContext(unitName="eprtrcms")
    private EntityManager emcms;

    public List<CmsResource> getStringResources(StringResourceFilter filter) {
        // TODO Auto-generated method stub
        
        /*Area groups*/
        CriteriaBuilder cb1 = emcms.getCriteriaBuilder();
        CriteriaQuery<CmsResource> cq1 = cb1.createQuery(CmsResource.class);
        Root<StringResource> qr1 = cq1.from(StringResource.class);

        cq1.select(cb1.construct(CmsResource.class, 
                qr1.get(StringResource_.type),
                qr1.get(StringResource_.key),
                qr1.get(StringResource_.val))
                );
        cq1.where(filter.buildWhereClause(cb1, qr1));
        TypedQuery<CmsResource> q1 = emcms.createQuery(cq1);
        List<CmsResource> stringResources = q1.getResultList();
        
        return stringResources;
    }

}
