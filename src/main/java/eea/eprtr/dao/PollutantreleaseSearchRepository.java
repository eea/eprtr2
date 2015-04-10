package eea.eprtr.dao;

import java.util.LinkedHashMap;
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
	
	public List<PollutantreleasesSeries> getPollutantreleasesSeries(PollutantreleaseSearchFilter filter) {

		/*All except countries*/
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<PollutantreleasesSeries> cq = cb.createQuery(PollutantreleasesSeries.class);
		Root<Pollutantrelease> qr = cq.from(Pollutantrelease.class);

		cq.select(cb.construct(PollutantreleasesSeries.class, 
				qr.get(Pollutantrelease_.reportingYear),
				cb.count(qr.get(Pollutantrelease_.facilityID)),
				cb.sum(qr.get(Pollutantrelease_.quantityAir)), 
				cb.sum(qr.get(Pollutantrelease_.quantityAccidentalAir)), 
				cb.sum(qr.get(Pollutantrelease_.quantityWater)),
				cb.sum(qr.get(Pollutantrelease_.quantityAccidentalWater)),
				cb.sum(qr.get(Pollutantrelease_.quantitySoil)), 
				cb.sum(qr.get(Pollutantrelease_.quantityAccidentalSoil)))
				);
		cq.where(filter.buildWhereClause(cb, qr));
		cq.groupBy(qr.get(Pollutantrelease_.reportingYear));
		cq.orderBy(cb.asc(qr.get(Pollutantrelease_.reportingYear)));

		TypedQuery<PollutantreleasesSeries> q = em.createQuery(cq);
		List<PollutantreleasesSeries> results = q.getResultList();
		
		/*Countries*/
		CriteriaBuilder cb1 = em.getCriteriaBuilder();
		CriteriaQuery<PollutantreleasesCountries> cq1 = cb1.createQuery(PollutantreleasesCountries.class);
		Root<Pollutantrelease> qr1 = cq1.from(Pollutantrelease.class);

		cq1.select(cb1.construct(PollutantreleasesCountries.class, 
				qr1.get(Pollutantrelease_.reportingYear),
				qr1.get(Pollutantrelease_.countryCode))
				);
		cq1.where(filter.buildWhereClause(cb1, qr1));
		cq1.groupBy(qr1.get(Pollutantrelease_.reportingYear),qr1.get(Pollutantrelease_.countryCode));
		cq1.orderBy(cb1.asc(qr1.get(Pollutantrelease_.reportingYear)));

		TypedQuery<PollutantreleasesCountries> q1 = em.createQuery(cq1);
		List<PollutantreleasesCountries> results1 = q1.getResultList();
		
		LinkedHashMap<Integer, Integer> countries = new LinkedHashMap<Integer, Integer>();
		for (int i =0; i < results1.size(); i++){
			PollutantreleasesCountries pc = results1.get(i);
			Integer y = pc.getReleaseYear();
			if (!countries.containsKey(y)){
				countries.put(y, 1);
			}
			else{
				Integer coun = (Integer)countries.get(y);
				coun++; 
				countries.put(y, coun);
			}
		}
		
		for (int i =0; i < results.size(); i++){
			PollutantreleasesSeries ps = results.get(i);
			ps.setCountries((long)countries.get(ps.getReleaseYear()));
		}
		return results;
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
