package eea.eprtr.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.LovPollutant;
import eea.eprtr.model.LovPollutant_;

@Repository
public class LovPollutantRepository {


	@PersistenceContext
    private EntityManager em;

	public List<LovPollutant> getPollutants(Integer parentID) throws CloneNotSupportedException {

		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<LovPollutant> cq = cb.createQuery(LovPollutant.class);
		Root<LovPollutant> qr = cq.from(LovPollutant.class);
		cq.select(qr);
		
		Predicate whereClause = cb.conjunction();
/*		if (pollutantID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(LovPollutant_.LOV_PollutantID), pollutantID));
			whereClause.getExpressions().add(cb.isNull(qr.get(LovPollutant_.endYear)));
		}*/
		if (parentID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(LovPollutant_.parentID), parentID));
			
		}
		else{
			whereClause.getExpressions().add(cb.isNull(qr.get(LovPollutant_.parentID)));
		}
		
		cq.where(whereClause);
		cq.orderBy(cb.asc(qr.get(LovPollutant_.code)));
		TypedQuery<LovPollutant> q = em.createQuery(cq);
		List<LovPollutant> results = q.getResultList();
		
		List<LovPollutant> newlist = new ArrayList<LovPollutant>();  
		
		if (parentID != null) {
			/*GET CHILDREN*/
			for (LovPollutant lp: results){
				List<LovPollutant> childs = getPollutants(lp.getLOV_PollutantID());
				if(!childs.isEmpty()){
					for (LovPollutant clp: childs){
						if(clp.getEndYear() == null || clp.getEndYear() > 2007){
							newlist.add(clp);
						}
					}
				}
				else{
					if(lp.getEndYear() == null || lp.getEndYear() > 2007){
						newlist.add(lp);
					}
				}
			}
		}
		else{
			newlist = results;
		}
		
		Collections.sort(newlist, LovPollutant.LovPollutantByCodeComparator);
		return newlist;
	}

	public LovPollutant getPollutant(Integer id) {
		TypedQuery<LovPollutant> query = em.createQuery("SELECT l FROM LovPollutant l where l.LOV_PollutantID = :Id", LovPollutant.class);
    	query.setParameter("Id", id);
    	return query.getSingleResult();
	}
	
	/*private static List<LovPollutant> cloneList(List<LovPollutant> list) throws CloneNotSupportedException {
		List<LovPollutant> clone = new ArrayList<LovPollutant>(list.size());
	    for(LovPollutant item: list) clone.add((LovPollutant) item.clone());
	    return clone;
	}*/

}
