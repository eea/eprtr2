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

@Repository
public class StringResourceRepository {
	
	@PersistenceContext(unitName="eprtrcms")
    private EntityManager emcms;

	public List<StringResource> getStringResources(StringResourceFilter filter) {
		// TODO Auto-generated method stub
		
		/*Area groups*/
		CriteriaBuilder cb1 = emcms.getCriteriaBuilder();
		CriteriaQuery<StringResource> cq1 = cb1.createQuery(StringResource.class);
		Root<StringResource> qr1 = cq1.from(StringResource.class);
		cq1.select(qr1);
		cq1.where(filter.buildWhereClause(cb1, qr1));
		TypedQuery<StringResource> q1 = emcms.createQuery(cq1);
		List<StringResource> stringResources = q1.getResultList();
		
		return stringResources;
	}

}
