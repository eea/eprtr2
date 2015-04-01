package eea.eprtr.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.Pollutantrelease;
import eea.eprtr.model.Pollutantrelease_;

@Repository
public class PollutantreleaseSearchRepository {

	@PersistenceContext
    private EntityManager em;

	public PollutantreleaseCounts getPollutantreleaseCounts(PollutantreleaseSearchFilter filter) {
		
		/*This is a bad workaround because you cannot have a subquery in the from statement*/	
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<PollutantreleaseCounts> cq = cb.createQuery(PollutantreleaseCounts.class);
		Root<Pollutantrelease> qr = cq.from(Pollutantrelease.class);
		
		cq.select(
				cb.construct(PollutantreleaseCounts.class, 
						cb.sum(qr.get(Pollutantrelease_.quantityAir)), 
						cb.sum(qr.get(Pollutantrelease_.quantitySoil)), 
						cb.sum(qr.get(Pollutantrelease_.quantityWater))));
		cq.where(filter.buildWhereClause(cb, qr));
		cq.groupBy(qr.get(Pollutantrelease_.facilityID));

		TypedQuery<PollutantreleaseCounts> q = em.createQuery(cq);
		List <PollutantreleaseCounts> result = q.getResultList();

		/*Need to filter result*/
		Double _quantityAir = (double) 0;
		Double _quantitySoil = (double) 0;
		Double _quantityWater =(double) 0;
		for (int i =0; i < result.size(); i++){
			PollutantreleaseCounts pc = result.get(i);
			if(pc.getQuantityAir() != null){
				_quantityAir ++;
			}
			if(pc.getQuantitySoil() != null){
				_quantitySoil ++;
			}
			if(pc.getQuantityWater() != null){
				_quantityWater ++;
			}
		} 
		PollutantreleaseCounts result_1 = new PollutantreleaseCounts(_quantityAir, _quantitySoil, _quantityWater) ;
		return result_1;
	}
	
	public List<Pollutantrelease> getPollutantreleases(PollutantreleaseSearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<Pollutantrelease> cq = cb.createQuery(Pollutantrelease.class);
		Root<Pollutantrelease> qr = cq.from(Pollutantrelease.class);
		cq.select(qr);
		cq.where(filter.buildWhereClause(cb, qr));

		TypedQuery<Pollutantrelease> q = em.createQuery(cq);
		List<Pollutantrelease> results = q.getResultList();
		return results;
	}
}
