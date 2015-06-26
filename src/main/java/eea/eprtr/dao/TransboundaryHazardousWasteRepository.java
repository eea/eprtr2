package eea.eprtr.dao;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.HazardousWasteTreater;
import eea.eprtr.model.Receivingcountry;
import eea.eprtr.model.Receivingcountry_;
import eea.eprtr.model.Reportingcountry;
import eea.eprtr.model.Reportingcountry_;
import eea.eprtr.model.TransboundaryHazardousWasteData;
import eea.eprtr.model.WastetransferHazardoustreater;
import eea.eprtr.model.WastetransferHazardoustreater_;
import eea.eprtr.model.WastetransferReceivingcountry;
import eea.eprtr.model.WastetransferReceivingcountry_;

@Repository
public class TransboundaryHazardousWasteRepository {

	@PersistenceContext
    private EntityManager em;
	
	public List<TransboundaryHazardousWasteData> GetTransboundaryHazardousWasteData(WastetransferSearchFilter filter, Boolean aggregateOthers) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		List<TransboundaryHazardousWasteData> thwd = new ArrayList<TransboundaryHazardousWasteData>(); 

		CriteriaQuery<TransboundaryHazardousWasteData> cq = cb.createQuery(TransboundaryHazardousWasteData.class);
		
		Root<WastetransferReceivingcountry> qr = cq.from(WastetransferReceivingcountry.class);

		
		/*Expected arguments are: int, long, java.lang.String, java.lang.String, double, double, double, double [select new eea.eprtr.model.TransboundaryHazardousWasteData(generatedAlias0.reportingYear, count(generatedAlias0.facilityID), generatedAlias0.receivingCountryCode, generatedAlias0.countryCode, sum(generatedAlias0.quantityTotal), sum(generatedAlias0.quantityRecovery), sum(generatedAlias0.quantityDisposal), sum(generatedAlias0.quantityUnspec))
		*/
		
		
		if(aggregateOthers == null || !aggregateOthers){
			cq.select(cb.construct(TransboundaryHazardousWasteData.class, 
					qr.get(WastetransferReceivingcountry_.reportingYear),
					cb.countDistinct(qr.get(WastetransferReceivingcountry_.facilityReportID)).as(Integer.class),
					cb.<String>selectCase().when(cb.isNull(qr.get(WastetransferReceivingcountry_.receivingCountryCode))
							, "CONF").otherwise(qr.get(WastetransferReceivingcountry_.receivingCountryCode)),
					qr.get(WastetransferReceivingcountry_.countryCode),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityTotal)),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityRecovery)),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityDisposal)),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityUnspec))));
			cq.where(filter.buildWhereClauseWastetransferReceivingcountry(cb, qr));
			cq.groupBy(qr.get(WastetransferReceivingcountry_.reportingYear),
					qr.get(WastetransferReceivingcountry_.receivingCountryCode),
					qr.get(WastetransferReceivingcountry_.countryCode));
			cq.orderBy(cb.asc(qr.get(WastetransferReceivingcountry_.reportingYear)),
					cb.asc(qr.get(WastetransferReceivingcountry_.receivingCountryCode)),
					cb.asc(qr.get(WastetransferReceivingcountry_.countryCode)));

			TypedQuery<TransboundaryHazardousWasteData> q = em.createQuery(cq);
			thwd = q.getResultList();
			
		}
		else
		{
			
			CriteriaBuilder cbrc = em.getCriteriaBuilder();
			CriteriaQuery<String> cqrc = cbrc.createQuery(String.class);
			
			Root<Receivingcountry> rootcc = cqrc.from(Receivingcountry.class);
			
			Subquery<String> subquery = cqrc.subquery(String.class);
			Root<Reportingcountry> rootrpc = subquery.from(Reportingcountry.class);
			subquery.select(rootrpc.get(Reportingcountry_.code)); // field to map with main-query

			cqrc.select(rootcc.get(Receivingcountry_.code));
			cqrc.where(cbrc.not(rootcc.get(Receivingcountry_.code).in(subquery)));
			
			TypedQuery<String> q1 = em.createQuery(cqrc);
			List<String> otherCountries = q1.getResultList();
			
			
			//aggregate per receiving countries are E-PRTR reporters
			cq.select(cb.construct(TransboundaryHazardousWasteData.class, 
					qr.get(WastetransferReceivingcountry_.reportingYear),
					cb.countDistinct(qr.get(WastetransferReceivingcountry_.facilityReportID)).as(Integer.class),
					qr.get(WastetransferReceivingcountry_.receivingCountryCode),
					qr.get(WastetransferReceivingcountry_.countryCode),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityTotal)),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityRecovery)),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityDisposal)),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityUnspec))));

			Predicate notinother = filter.buildWhereClauseWastetransferReceivingcountry(cb, qr);
			notinother.getExpressions().add(cb.not(qr.get(WastetransferReceivingcountry_.receivingCountryCode).in(otherCountries)));
			cq.where(notinother);
			
			cq.groupBy(qr.get(WastetransferReceivingcountry_.reportingYear),
					qr.get(WastetransferReceivingcountry_.receivingCountryCode),
					qr.get(WastetransferReceivingcountry_.countryCode));
			cq.orderBy(cb.asc(qr.get(WastetransferReceivingcountry_.reportingYear)),
					cb.asc(qr.get(WastetransferReceivingcountry_.receivingCountryCode)),
					cb.asc(qr.get(WastetransferReceivingcountry_.countryCode)));

			TypedQuery<TransboundaryHazardousWasteData> qe = em.createQuery(cq);
			List<TransboundaryHazardousWasteData> eprtr = qe.getResultList();

			//aggregate all receiving countries are not E-PRTR reporter as one. Include confidential receivers (i.e. receving cod is null)
			cq.select(cb.construct(TransboundaryHazardousWasteData.class, 
					qr.get(WastetransferReceivingcountry_.reportingYear),
					cb.countDistinct(qr.get(WastetransferReceivingcountry_.facilityReportID)).as(Integer.class),
					cb.literal("OTH"),
					qr.get(WastetransferReceivingcountry_.countryCode),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityTotal)),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityRecovery)),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityDisposal)),
					cb.sum(qr.get(WastetransferReceivingcountry_.quantityUnspec))));

			Predicate inother = filter.buildWhereClauseWastetransferReceivingcountry(cb, qr);
			//Where(c => otherCountries.Contains(c.ReceivingCountryCode) || c.ReceivingCountryCode.Equals(null))
			inother.getExpressions().add(cb.or((qr.get(WastetransferReceivingcountry_.receivingCountryCode).in(otherCountries)),
					(cb.isNull(qr.get(WastetransferReceivingcountry_.receivingCountryCode)))));
			cq.where(inother);
			
			cq.groupBy(qr.get(WastetransferReceivingcountry_.reportingYear),
					//qr.get(WastetransferReceivingcountry_.receivingCountryCode),
					qr.get(WastetransferReceivingcountry_.countryCode));
			cq.orderBy(cb.asc(qr.get(WastetransferReceivingcountry_.reportingYear)),
					//cb.asc(qr.get(WastetransferReceivingcountry_.receivingCountryCode)),
					cb.asc(qr.get(WastetransferReceivingcountry_.countryCode)));

			TypedQuery<TransboundaryHazardousWasteData> qo = em.createQuery(cq);
			List<TransboundaryHazardousWasteData> other = qo.getResultList();

			eprtr.addAll(other);
			
			thwd = eprtr;
        }
		
		return thwd;
	}
/**
 * Remember to set the whpCountryID in the WasteSearchFilter 
 * @param WastetransferSearchFilter
 * @param orderBy
 * @param pager
 * @return List<HazardousWasteTreater>
 */
	public List<HazardousWasteTreater> getHazardousWasteTreaterList(WastetransferSearchFilter filter, OrderBy orderBy, QueryPager pager){
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<HazardousWasteTreater> cq = cb.createQuery(HazardousWasteTreater.class);
		Root<WastetransferHazardoustreater> qr = cq.from(WastetransferHazardoustreater.class);
		
		/*new HazardousWasteTreater(
		 * 		fromFacilityName, 
		 * 		facilityConfidentialIndicator, 
		 * 		treaterName, 
		 * 		treaterAddress, 
		 * 		treaterCity, 
		 * 		treaterPostalCode, 
		 * 		treaterCountryCode, 
		 * 		treaterSiteAddress, 
		 * 		treaterSiteCity, 
		 * 		treaterSitePostalCode, 
		 * 		treaterSiteCountryCode,
		 * 		quantity, 
		 * 		unit, 
		 * 		treatment, 
		 * 		confidentialIndicator);*/
		cq.select(cb.construct(HazardousWasteTreater.class, 
				qr.get(WastetransferHazardoustreater_.facilityName),
				qr.get(WastetransferHazardoustreater_.confidentialIndicatorFacility),
				qr.get(WastetransferHazardoustreater_.WHPName),
				qr.get(WastetransferHazardoustreater_.WHPAddress),
				qr.get(WastetransferHazardoustreater_.WHPCity),
				qr.get(WastetransferHazardoustreater_.WHPPostalCode),
				qr.get(WastetransferHazardoustreater_.WHPCountryCode),
				qr.get(WastetransferHazardoustreater_.WHPSiteAddress),
				qr.get(WastetransferHazardoustreater_.WHPSiteCity),
				qr.get(WastetransferHazardoustreater_.WHPSitePostalCode),
				qr.get(WastetransferHazardoustreater_.WHPSiteCountryCode),
				qr.get(WastetransferHazardoustreater_.quantity),
				qr.get(WastetransferHazardoustreater_.unitCode),
				qr.get(WastetransferHazardoustreater_.wasteTreatmentCode),
				qr.get(WastetransferHazardoustreater_.confidentialIndicator)));
		
		/*Predicate myfilter = ;
		myfilter.getExpressions().add(cb.equal(qr.get(WastetransferHazardoustreater_.WHPCountryCode),receivingCountryCode));*/
		cq.where(filter.buildWhereClauseWastetransferHazardoustreater(cb, qr));
		
		orderBy.apply(cb, cq, qr);
		TypedQuery<HazardousWasteTreater> q = em.createQuery(cq);
		pager.apply(q);

		List<HazardousWasteTreater> data = q.getResultList();
		return data;
	}

	/**
	 * Remember to set the whpCountryID in the WasteSearchFilter 
	 * @param WastetransferSearchFilter
	 * @return Integer
	 */
		public Integer getHazardousWasteTreaterCount(WastetransferSearchFilter filter){
			
			CriteriaBuilder cb = em.getCriteriaBuilder();
			
			CriteriaQuery<Integer> cq = cb.createQuery(Integer.class);
			Root<WastetransferHazardoustreater> qr = cq.from(WastetransferHazardoustreater.class);
			
			cq.select(cb.construct(Integer.class, 
					cb.count(qr.get(WastetransferHazardoustreater_.facilityName))));
			
			cq.where(filter.buildWhereClauseWastetransferHazardoustreater(cb, qr));
			
			TypedQuery<Integer> q = em.createQuery(cq);

			Integer data = q.getSingleResult();
			return data;
		}

}
	