package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.NaceActivity;

@Repository
public class NaceActivityRepository {

	@PersistenceContext(unitName="eprtr")
    private EntityManager em;

	public List<NaceActivity> list(Integer parentID) {
		Integer startYearEPRTR = new Integer(2007);
		
		TypedQuery<NaceActivity> query = null;
		
		if (parentID == null) {
			query = em.createNamedQuery("NaceActivity.findRootActivities", NaceActivity.class);
		} else {
			query = em.createNamedQuery("NaceActivity.findActivities", NaceActivity.class);
			query.setParameter("parentID", parentID);
		}
		query.setParameter("startYearEPRTR", startYearEPRTR);
		List<NaceActivity> results = query.getResultList();
		return results;
	}

	public NaceActivity get(Integer id) {
		
		TypedQuery<NaceActivity> query = null;
		query = em.createNamedQuery("NaceActivity.findByID", NaceActivity.class);
		query.setParameter("Id", id);
		NaceActivity results = query.getSingleResult();
		return results;
	}

}
