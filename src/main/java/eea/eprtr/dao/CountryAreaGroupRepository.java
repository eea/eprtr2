package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;

@Repository
public class CountryAreaGroupRepository {

	@PersistenceContext(unitName="eprtr")
    private EntityManager em;
	
	public List<Integer> getCountryIDs(Integer areaGroupID) {
		TypedQuery<Integer> query = em.createNamedQuery("CountryAreaGroup.findCountryIDsByAreaGroupID", Integer.class);
		query.setParameter("LOV_AreaGroupID", areaGroupID);
		List<Integer> results = query.getResultList();
		return results;
	}
}
