package eea.eprtr.dao;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.HazardousWasteRecievingCountry;
import eea.eprtr.model.WastetransferReceivingcountry;
import eea.eprtr.model.WastetransferReceivingcountry_;

@Repository
public class WastetransferReceivingcountryRepository {
	
	@PersistenceContext
    private EntityManager em;
	
	public List<HazardousWasteRecievingCountry> GetWastetransferReceivingcountry(WastetransferSearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		List<HazardousWasteRecievingCountry> data = new ArrayList<HazardousWasteRecievingCountry>(); 

		CriteriaQuery<HazardousWasteRecievingCountry> cq = cb.createQuery(HazardousWasteRecievingCountry.class);
		
		Root<WastetransferReceivingcountry> qr = cq.from(WastetransferReceivingcountry.class);

		cq.select(cb.construct(HazardousWasteRecievingCountry.class, 
				qr.get(WastetransferReceivingcountry_.reportingYear),
				cb.countDistinct(qr.get(WastetransferReceivingcountry_.facilityReportID)).as(Integer.class),
				//qr.get(WastetransferReceivingcountry_.receivingCountryCode),
				cb.<String>selectCase().when(cb.isNull(qr.get(WastetransferReceivingcountry_.receivingCountryCode))
						, "CONF").otherwise(qr.get(WastetransferReceivingcountry_.receivingCountryCode)),
				cb.sum(qr.get(WastetransferReceivingcountry_.quantityTotal)),
				cb.sum(qr.get(WastetransferReceivingcountry_.quantityRecovery)),
				cb.sum(qr.get(WastetransferReceivingcountry_.quantityDisposal)),
				cb.sum(qr.get(WastetransferReceivingcountry_.quantityUnspec))));
		
		cq.where(filter.buildWhereClauseWastetransferReceivingcountry(cb, qr));
		cq.groupBy(qr.get(WastetransferReceivingcountry_.reportingYear),
				qr.get(WastetransferReceivingcountry_.receivingCountryCode));
		cq.orderBy(cb.desc(qr.get(WastetransferReceivingcountry_.reportingYear)),
				cb.desc(cb.<Integer>selectCase().when(
						cb.isNull(qr.get(WastetransferReceivingcountry_.receivingCountryCode))
						, 0).otherwise(1)),
				cb.asc(qr.get(WastetransferReceivingcountry_.receivingCountryCode)));

		TypedQuery<HazardousWasteRecievingCountry> q = em.createQuery(cq);
		data = q.getResultList();
	//find totals grouped by receiving country. Will be ordered by receiving country but with NULL always last
    
		cq.select(cb.construct(HazardousWasteRecievingCountry.class, 
				qr.get(WastetransferReceivingcountry_.reportingYear),
				cb.countDistinct(qr.get(WastetransferReceivingcountry_.facilityReportID)).as(Integer.class),
				cb.literal("TOTAL_KEY"),
				/*cb.<String>selectCase().when(cb.isNull(qr.get(WastetransferReceivingcountry_.receivingCountryCode))
						, "UKN").otherwise(qr.get(WastetransferReceivingcountry_.receivingCountryCode)),*/
				cb.sum(qr.get(WastetransferReceivingcountry_.quantityTotal)),
				cb.sum(qr.get(WastetransferReceivingcountry_.quantityRecovery)),
				cb.sum(qr.get(WastetransferReceivingcountry_.quantityDisposal)),
				cb.sum(qr.get(WastetransferReceivingcountry_.quantityUnspec))));
		
		cq.where(filter.buildWhereClauseWastetransferReceivingcountry(cb, qr));
		cq.groupBy(qr.get(WastetransferReceivingcountry_.reportingYear));
		cq.orderBy(cb.desc(qr.get(WastetransferReceivingcountry_.reportingYear)));

		TypedQuery<HazardousWasteRecievingCountry> q2 = em.createQuery(cq);
		HazardousWasteRecievingCountry total = q2.getSingleResult();
	
		data.add(total);
		return data;
	}
}
