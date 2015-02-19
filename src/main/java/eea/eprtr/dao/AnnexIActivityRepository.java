package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.AnnexIActivity;

@Repository
public class AnnexIActivityRepository {

	@PersistenceContext
    private EntityManager em;

	public List<AnnexIActivity> list(Integer parentID) {
		Integer startYearEPRTR = new Integer(2007);
		
		TypedQuery<AnnexIActivity> query = null;
		if (parentID == null) {
			query = em.createNamedQuery("AnnexIActivity.findRootActivities", AnnexIActivity.class);
		} else {
			query = em.createNamedQuery("AnnexIActivity.findActivities", AnnexIActivity.class);
			query.setParameter("parentID", parentID);
		}
		query.setParameter("startYearEPRTR", startYearEPRTR);
		List<AnnexIActivity> results = query.getResultList();
		return results;
	}

}
