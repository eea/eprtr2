package eea.eprtr.dao;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.NumOfCountriesPrYear;
import eea.eprtr.model.Wastetransfer;
import eea.eprtr.model.WastetransferCompare;
import eea.eprtr.model.WastetransferConfidential;
import eea.eprtr.model.WastetransferConfidential_;
import eea.eprtr.model.WastetransferCounts;
import eea.eprtr.model.WastetransferSeries;
import eea.eprtr.model.Wastetransfer_;
import eea.eprtr.model.WasteType;

@Repository
public class WasteTransferSearchRepository {
	
	@PersistenceContext
    private EntityManager em;
	
	public List<Wastetransfer> getWastetransfer(WastetransferSearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<Wastetransfer> cq = cb.createQuery(Wastetransfer.class);
		Root<Wastetransfer> qr = cq.from(Wastetransfer.class);
		cq.select(qr);
		cq.where(filter.buildWhereClause(cb, qr));

		TypedQuery<Wastetransfer> q = em.createQuery(cq);
		List<Wastetransfer> results = q.getResultList();
		return results;
	}
	
	public List<WastetransferConfidential> getWastetransferConfidentialCodes(WasteTransferConfidentialSearchFilter filter) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<WastetransferConfidential> cq = cb.createQuery(WastetransferConfidential.class);
		Root<WastetransferConfidential> qr = cq.from(WastetransferConfidential.class);
		cq.select(qr).distinct(true);
		cq.where(filter.buildWhereClause(cb, qr));

		TypedQuery<WastetransferConfidential> q = em.createQuery(cq);
		List<WastetransferConfidential> results = q.getResultList();
		return results;
	}

	/*public List<WasteTransferConfidentialTS> getWasteTransferConfidentialTS(WasteTransferConfidentialSearchFilter filter, WasteType wastetype) {
		
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<WastetransferConfidential> cq = cb.createQuery(WastetransferConfidential.class);
		Root<WastetransferConfidential> qr = cq.from(WastetransferConfidential.class);

		cq.select(
				cb.construct(WastetransferConfidential.class, 
						cb.sum(qr.get(WastetransferConfidential_.)), 
						cb.sum(qr.get(WastetransferConfidential_.quantityTotalHWIC)), 
						cb.sum(qr.get(WastetransferConfidential_.quantityTotalHWOC))));
		cq.where(filter.buildWhereClause(cb, qr));
		cq.groupBy(qr.get(Wastetransfer_.facilityID));

		
		
		cq.select(qr);
		cq.where(filter.buildWhereClause(cb, qr));

		TypedQuery<WastetransferConfidential> q = em.createQuery(cq);
		List<WastetransferConfidential> res = q.getResultList();

		
		List<WasteTransferConfidentialTS> results = null;
		return results;
	}
*/
	
	public WastetransferCounts getWastetransferCounts(WastetransferSearchFilter filter) {
		
		/*This is a bad workaround because you cannot have a subquery in the from statement*/	
		CriteriaBuilder cb = em.getCriteriaBuilder();
		
		CriteriaQuery<WastetransferCounts> cq = cb.createQuery(WastetransferCounts.class);
		Root<Wastetransfer> qr = cq.from(Wastetransfer.class);
		
		cq.select(
				cb.construct(WastetransferCounts.class, 
						cb.sum(qr.get(Wastetransfer_.quantityTotalNONHW)), 
						cb.sum(qr.get(Wastetransfer_.quantityTotalHWIC)), 
						cb.sum(qr.get(Wastetransfer_.quantityTotalHWOC))));
		cq.where(filter.buildWhereClause(cb, qr));
		cq.groupBy(qr.get(Wastetransfer_.facilityID));

		TypedQuery<WastetransferCounts> q = em.createQuery(cq);
		List <WastetransferCounts> result = q.getResultList();

		/*Need to filter result*/
		Double _quantityNONHW = (double) 0;
		Double _quantityHWIC = (double) 0;
		Double _quantityHWOC =(double) 0;
		for (int i =0; i < result.size(); i++){
			WastetransferCounts pc = result.get(i);
			if(pc.getQuantityNONHW() != null){
				_quantityNONHW ++;
			}
			if(pc.getQuantityHWIC() != null){
				_quantityHWIC ++;
			}
			if(pc.getQuantityHWOC() != null){
				_quantityHWOC ++;
			}
		} 
		WastetransferCounts result_1 = new WastetransferCounts(_quantityNONHW, _quantityHWIC, _quantityHWOC) ;
		return result_1;
	}

	public List<WastetransferSeries> getWastetransferSeries(WastetransferSearchFilter filter, WasteType wastetype) {

		/*All except countries*/
		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<WastetransferSeries> cq = cb.createQuery(WastetransferSeries.class);
		Root<Wastetransfer> qr = cq.from(Wastetransfer.class);

		switch (wastetype) {
		case NONHW:
			cq.select(cb.construct(WastetransferSeries.class, 
					qr.get(Wastetransfer_.reportingYear),
					cb.count(qr.get(Wastetransfer_.facilityID)),
					cb.sum(qr.get(Wastetransfer_.quantityTotalNONHW)), 
					cb.sum(qr.get(Wastetransfer_.quantityRecoveryNONHW)), 
					cb.sum(qr.get(Wastetransfer_.quantityDisposalNONHW)),
					cb.sum(qr.get(Wastetransfer_.quantityUnspecNONHW)))
					);
			break;
		case HWIC:
			cq.select(cb.construct(WastetransferSeries.class, 
					qr.get(Wastetransfer_.reportingYear),
					cb.count(qr.get(Wastetransfer_.facilityID)),
					cb.sum(qr.get(Wastetransfer_.quantityTotalHWIC)), 
					cb.sum(qr.get(Wastetransfer_.quantityRecoveryHWIC)), 
					cb.sum(qr.get(Wastetransfer_.quantityDisposalHWIC)),
					cb.sum(qr.get(Wastetransfer_.quantityUnspecHWIC)))
					);
			break;
		case HWOC:
			cq.select(cb.construct(WastetransferSeries.class, 
					qr.get(Wastetransfer_.reportingYear),
					cb.count(qr.get(Wastetransfer_.facilityID)),
					cb.sum(qr.get(Wastetransfer_.quantityTotalHWOC)), 
					cb.sum(qr.get(Wastetransfer_.quantityRecoveryHWOC)), 
					cb.sum(qr.get(Wastetransfer_.quantityDisposalHWOC)),
					cb.sum(qr.get(Wastetransfer_.quantityUnspecHWOC)))
					);
			break;
		default:
			break;
		}
			
		cq.where(filter.buildWhereClause(cb, qr));
		cq.groupBy(qr.get(Wastetransfer_.reportingYear));
		cq.orderBy(cb.asc(qr.get(Wastetransfer_.reportingYear)));

		TypedQuery<WastetransferSeries> q = em.createQuery(cq);
		List<WastetransferSeries> results = q.getResultList();
		
		/*Countries*/
		CriteriaBuilder cb1 = em.getCriteriaBuilder();
		CriteriaQuery<NumOfCountriesPrYear> cq1 = cb1.createQuery(NumOfCountriesPrYear.class);
		Root<Wastetransfer> qr1 = cq1.from(Wastetransfer.class);

		cq1.select(cb1.construct(NumOfCountriesPrYear.class, 
				qr1.get(Wastetransfer_.reportingYear),
				qr1.get(Wastetransfer_.countryCode))
				);
		cq1.where(filter.buildWhereClause(cb1, qr1));
		cq1.groupBy(qr1.get(Wastetransfer_.reportingYear),qr1.get(Wastetransfer_.countryCode));
		cq1.orderBy(cb1.asc(qr1.get(Wastetransfer_.reportingYear)));

		TypedQuery<NumOfCountriesPrYear> q1 = em.createQuery(cq1);
		List<NumOfCountriesPrYear> results1 = q1.getResultList();
		
		LinkedHashMap<Integer, Integer> countries = new LinkedHashMap<Integer, Integer>();
		for (int i =0; i < results1.size(); i++){
			NumOfCountriesPrYear pc = results1.get(i);
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
			WastetransferSeries ps = results.get(i);
			ps.setCountries((long)countries.get(ps.getReportingYear()));
			ps.setWasteType(wastetype);
		}
		return results;
	} 
	
	public List<WastetransferCompare> getWastetransferCompare(WastetransferSearchFilter filter, Integer reportingYearStart, Integer reportingYearEnd, WasteType wastetype){
		
		/*List of FacilityIDs from Start year*/
		WastetransferSearchFilter prsStart = new WastetransferSearchFilter(filter.getReportingYearSearchFilter(),
				filter.getLocationSearchFilter(), filter.getActivitySearchFilter(), filter.getWasteSearchFilter());
		ReportingYearSearchFilter rysf = new ReportingYearSearchFilter(reportingYearStart);
		prsStart.setReportingYearSearchFilter(rysf);

		CriteriaBuilder cb1 = em.getCriteriaBuilder();
		CriteriaQuery<Integer> cq1 = cb1.createQuery(Integer.class);
		Root<Wastetransfer> qr1 = cq1.from(Wastetransfer.class);

		cq1.select(qr1.get(Wastetransfer_.facilityID));
		cq1.where(prsStart.buildWhereClause(cb1, qr1));
		cq1.groupBy(qr1.get(Wastetransfer_.facilityID));

		TypedQuery<Integer> q1 = em.createQuery(cq1);
		List<Integer> fidFrom = q1.getResultList();

		/*List of FacilityIDs from End year*/
		WastetransferSearchFilter prsEnd = new WastetransferSearchFilter(filter.getReportingYearSearchFilter(),
				filter.getLocationSearchFilter(), filter.getActivitySearchFilter(), filter.getWasteSearchFilter());
//		WastetransferearchFilter prsEnd = (WastetransferearchFilter)filter.clone();
		ReportingYearSearchFilter ryse = new ReportingYearSearchFilter(reportingYearEnd);
		prsEnd.setReportingYearSearchFilter(ryse);

		CriteriaBuilder cb2 = em.getCriteriaBuilder();
		CriteriaQuery<Integer> cq2 = cb2.createQuery(Integer.class);
		Root<Wastetransfer> qr2 = cq2.from(Wastetransfer.class);

		cq2.select(qr2.get(Wastetransfer_.facilityID));
		cq2.where(prsEnd.buildWhereClause(cb2, qr2));
		cq2.groupBy(qr2.get(Wastetransfer_.facilityID));

		TypedQuery<Integer> q2 = em.createQuery(cq2);
		List<Integer> fidTo = q2.getResultList();
		
		//SELECT ALL DATA from Start
		CriteriaBuilder cb3 = em.getCriteriaBuilder();
		CriteriaQuery<WastetransferSeries> cq3 = cb3.createQuery(WastetransferSeries.class);
		Root<Wastetransfer> qr3 = cq3.from(Wastetransfer.class);

/*		cq3.select(cb3.construct(WastetransferSeries.class, 
				qr3.get(Wastetransfer_.reportingYear),
				cb3.count(qr3.get(Wastetransfer_.facilityID)),
				cb3.sum(qr3.get(Wastetransfer_.quantityAir)), 
				cb3.sum(qr3.get(Wastetransfer_.quantityAccidentalAir)), 
				cb3.sum(qr3.get(Wastetransfer_.quantityWater)),
				cb3.sum(qr3.get(Wastetransfer_.quantityAccidentalWater)),
				cb3.sum(qr3.get(Wastetransfer_.quantitySoil)), 
				cb3.sum(qr3.get(Wastetransfer_.quantityAccidentalSoil)))
				);*/

		switch (wastetype) {
		case NONHW:
			cq3.select(cb3.construct(WastetransferSeries.class, 
					qr3.get(Wastetransfer_.reportingYear),
					cb3.count(qr3.get(Wastetransfer_.facilityID)),
					cb3.sum(qr3.get(Wastetransfer_.quantityTotalNONHW)), 
					cb3.sum(qr3.get(Wastetransfer_.quantityRecoveryNONHW)), 
					cb3.sum(qr3.get(Wastetransfer_.quantityDisposalNONHW)),
					cb3.sum(qr3.get(Wastetransfer_.quantityUnspecNONHW)))
					);
			break;
		case HWIC:
			cq3.select(cb3.construct(WastetransferSeries.class, 
					qr3.get(Wastetransfer_.reportingYear),
					cb3.count(qr3.get(Wastetransfer_.facilityID)),
					cb3.sum(qr3.get(Wastetransfer_.quantityTotalHWIC)), 
					cb3.sum(qr3.get(Wastetransfer_.quantityRecoveryHWIC)), 
					cb3.sum(qr3.get(Wastetransfer_.quantityDisposalHWIC)),
					cb3.sum(qr3.get(Wastetransfer_.quantityUnspecHWIC)))
					);
			break;
		case HWOC:
			cq3.select(cb3.construct(WastetransferSeries.class, 
					qr3.get(Wastetransfer_.reportingYear),
					cb3.count(qr3.get(Wastetransfer_.facilityID)),
					cb3.sum(qr3.get(Wastetransfer_.quantityTotalHWOC)), 
					cb3.sum(qr3.get(Wastetransfer_.quantityRecoveryHWOC)), 
					cb3.sum(qr3.get(Wastetransfer_.quantityDisposalHWOC)),
					cb3.sum(qr3.get(Wastetransfer_.quantityUnspecHWOC)))
					);
			break;
		default:
			break;
		}
		
		cq3.where(prsStart.buildWhereClause(cb3, qr3));
		cq3.groupBy(qr3.get(Wastetransfer_.reportingYear));
		cq3.orderBy(cb3.asc(qr3.get(Wastetransfer_.reportingYear)));

		TypedQuery<WastetransferSeries> q3 = em.createQuery(cq3);
		List<WastetransferSeries> prsAllStartList = q3.getResultList();
		WastetransferSeries prsAllStart = new WastetransferSeries(reportingYearStart,(long)0,(double)0,(double)0,(double)0,(double)0);
		if(!prsAllStartList.isEmpty()){
		    // ignores multiple results
			prsAllStart = prsAllStartList.get(0);
		}
		
		//SELECT ALL DATA from End
		CriteriaBuilder cb4 = em.getCriteriaBuilder();
		CriteriaQuery<WastetransferSeries> cq4 = cb4.createQuery(WastetransferSeries.class);
		Root<Wastetransfer> qr4 = cq4.from(Wastetransfer.class);

		switch (wastetype) {
		case NONHW:
			cq4.select(cb4.construct(WastetransferSeries.class, 
					qr4.get(Wastetransfer_.reportingYear),
					cb4.count(qr4.get(Wastetransfer_.facilityID)),
					cb4.sum(qr4.get(Wastetransfer_.quantityTotalNONHW)), 
					cb4.sum(qr4.get(Wastetransfer_.quantityRecoveryNONHW)), 
					cb4.sum(qr4.get(Wastetransfer_.quantityDisposalNONHW)),
					cb4.sum(qr4.get(Wastetransfer_.quantityUnspecNONHW)))
					);
			break;
		case HWIC:
			cq4.select(cb4.construct(WastetransferSeries.class, 
					qr4.get(Wastetransfer_.reportingYear),
					cb4.count(qr4.get(Wastetransfer_.facilityID)),
					cb4.sum(qr4.get(Wastetransfer_.quantityTotalHWIC)), 
					cb4.sum(qr4.get(Wastetransfer_.quantityRecoveryHWIC)), 
					cb4.sum(qr4.get(Wastetransfer_.quantityDisposalHWIC)),
					cb4.sum(qr4.get(Wastetransfer_.quantityUnspecHWIC)))
					);
			break;
		case HWOC:
			cq4.select(cb4.construct(WastetransferSeries.class, 
					qr4.get(Wastetransfer_.reportingYear),
					cb4.count(qr4.get(Wastetransfer_.facilityID)),
					cb4.sum(qr4.get(Wastetransfer_.quantityTotalHWOC)), 
					cb4.sum(qr4.get(Wastetransfer_.quantityRecoveryHWOC)), 
					cb4.sum(qr4.get(Wastetransfer_.quantityDisposalHWOC)),
					cb4.sum(qr4.get(Wastetransfer_.quantityUnspecHWOC)))
					);
			break;
		default:
			break;
		}
		cq4.where(prsEnd.buildWhereClause(cb4, qr4));
		cq4.groupBy(qr4.get(Wastetransfer_.reportingYear));
		cq4.orderBy(cb4.asc(qr4.get(Wastetransfer_.reportingYear)));

		TypedQuery<WastetransferSeries> q4 = em.createQuery(cq4);
		//WastetransferSeries prsAllEnd = q4.getSingleResult();
		List<WastetransferSeries> prsAllEndList = q4.getResultList();
		WastetransferSeries prsAllEnd = new WastetransferSeries(reportingYearEnd,(long)0,(double)0,(double)0,(double)0,(double)0);
		if(!prsAllEndList.isEmpty()){
		    // ignores multiple results
			prsAllEnd = prsAllEndList.get(0);
		}
		
		//SELECT IN BOTH YEARS from Start
		WastetransferSeries prsBothStart = new WastetransferSeries(reportingYearStart,(long)0,(double)0,(double)0,(double)0,(double)0);
		if (fidTo.size() > 0){
			CriteriaBuilder cb5 = em.getCriteriaBuilder();
			CriteriaQuery<WastetransferSeries> cq5 = cb5.createQuery(WastetransferSeries.class);
			Root<Wastetransfer> qr5 = cq5.from(Wastetransfer.class);
	
			switch (wastetype) {
			case NONHW:
				cq5.select(cb5.construct(WastetransferSeries.class, 
						qr5.get(Wastetransfer_.reportingYear),
						cb5.count(qr5.get(Wastetransfer_.facilityID)),
						cb5.sum(qr5.get(Wastetransfer_.quantityTotalNONHW)), 
						cb5.sum(qr5.get(Wastetransfer_.quantityRecoveryNONHW)), 
						cb5.sum(qr5.get(Wastetransfer_.quantityDisposalNONHW)),
						cb5.sum(qr5.get(Wastetransfer_.quantityUnspecNONHW)))
						);
				break;
			case HWIC:
				cq5.select(cb5.construct(WastetransferSeries.class, 
						qr5.get(Wastetransfer_.reportingYear),
						cb5.count(qr5.get(Wastetransfer_.facilityID)),
						cb5.sum(qr5.get(Wastetransfer_.quantityTotalHWIC)), 
						cb5.sum(qr5.get(Wastetransfer_.quantityRecoveryHWIC)), 
						cb5.sum(qr5.get(Wastetransfer_.quantityDisposalHWIC)),
						cb5.sum(qr5.get(Wastetransfer_.quantityUnspecHWIC)))
						);
				break;
			case HWOC:
				cq5.select(cb5.construct(WastetransferSeries.class, 
						qr5.get(Wastetransfer_.reportingYear),
						cb5.count(qr5.get(Wastetransfer_.facilityID)),
						cb5.sum(qr5.get(Wastetransfer_.quantityTotalHWOC)), 
						cb5.sum(qr5.get(Wastetransfer_.quantityRecoveryHWOC)), 
						cb5.sum(qr5.get(Wastetransfer_.quantityDisposalHWOC)),
						cb5.sum(qr5.get(Wastetransfer_.quantityUnspecHWOC)))
						);
				break;
			default:
				break;
			}
			
			Predicate whereBothStart = prsStart.buildWhereClause(cb5, qr5);
			whereBothStart.getExpressions().add(qr5.get(Wastetransfer_.facilityID).in(fidTo));
			cq5.where(whereBothStart);
			cq5.groupBy(qr5.get(Wastetransfer_.reportingYear));
			cq5.orderBy(cb5.asc(qr5.get(Wastetransfer_.reportingYear)));
	
			TypedQuery<WastetransferSeries> q5 = em.createQuery(cq5);
			List<WastetransferSeries> prsBothStartList = q5.getResultList();
			if(!prsBothStartList.isEmpty()){
			    // ignores multiple results
				prsBothStart = prsBothStartList.get(0);
			}
		}

		//SELECT IN BOTH YEARS from End
		WastetransferSeries prsBothEnd = new WastetransferSeries(reportingYearEnd,(long)0,(double)0,(double)0,(double)0,(double)0);
		if (fidFrom.size() > 0){
			CriteriaBuilder cb6 = em.getCriteriaBuilder();
			CriteriaQuery<WastetransferSeries> cq6 = cb6.createQuery(WastetransferSeries.class);
			Root<Wastetransfer> qr6 = cq6.from(Wastetransfer.class);
	
			switch (wastetype) {
			case NONHW:
				cq6.select(cb6.construct(WastetransferSeries.class, 
						qr6.get(Wastetransfer_.reportingYear),
						cb6.count(qr6.get(Wastetransfer_.facilityID)),
						cb6.sum(qr6.get(Wastetransfer_.quantityTotalNONHW)), 
						cb6.sum(qr6.get(Wastetransfer_.quantityRecoveryNONHW)), 
						cb6.sum(qr6.get(Wastetransfer_.quantityDisposalNONHW)),
						cb6.sum(qr6.get(Wastetransfer_.quantityUnspecNONHW)))
						);
				break;
			case HWIC:
				cq6.select(cb6.construct(WastetransferSeries.class, 
						qr6.get(Wastetransfer_.reportingYear),
						cb6.count(qr6.get(Wastetransfer_.facilityID)),
						cb6.sum(qr6.get(Wastetransfer_.quantityTotalHWIC)), 
						cb6.sum(qr6.get(Wastetransfer_.quantityRecoveryHWIC)), 
						cb6.sum(qr6.get(Wastetransfer_.quantityDisposalHWIC)),
						cb6.sum(qr6.get(Wastetransfer_.quantityUnspecHWIC)))
						);
				break;
			case HWOC:
				cq6.select(cb6.construct(WastetransferSeries.class, 
						qr6.get(Wastetransfer_.reportingYear),
						cb6.count(qr6.get(Wastetransfer_.facilityID)),
						cb6.sum(qr6.get(Wastetransfer_.quantityTotalHWOC)), 
						cb6.sum(qr6.get(Wastetransfer_.quantityRecoveryHWOC)), 
						cb6.sum(qr6.get(Wastetransfer_.quantityDisposalHWOC)),
						cb6.sum(qr6.get(Wastetransfer_.quantityUnspecHWOC)))
						);
				break;
			default:
				break;
			}			
			Predicate whereBothEnd = prsEnd.buildWhereClause(cb6, qr6);
			whereBothEnd.getExpressions().add(qr6.get(Wastetransfer_.facilityID).in(fidFrom));
			cq6.where(whereBothEnd);
			cq6.groupBy(qr6.get(Wastetransfer_.reportingYear));
			cq6.orderBy(cb6.asc(qr6.get(Wastetransfer_.reportingYear)));
	
			TypedQuery<WastetransferSeries> q6 = em.createQuery(cq6);
			List<WastetransferSeries> prsBothEndList = q6.getResultList();
			if(!prsBothEndList.isEmpty()){
			    // ignores multiple results
				prsBothEnd = prsBothEndList.get(0);
			}
		}
		/*Create final collection*/
		List<WastetransferCompare> compares = new ArrayList<WastetransferCompare>();
		compares.add(new WastetransferCompare(reportingYearStart, 
				prsAllStart.getFacilities(), prsBothStart.getFacilities(), 
				prsAllStart.getQuantityTotal(), prsBothStart.getQuantityTotal(),
				prsAllStart.getQuantityRecovery(), prsBothStart.getQuantityRecovery(),
				prsAllStart.getQuantityDisposal(), prsBothStart.getQuantityDisposal(),
				prsAllStart.getQuantityUnspec(), prsBothStart.getQuantityUnspec()));
		compares.add(new WastetransferCompare(reportingYearEnd, 
				prsAllEnd.getFacilities(), prsBothEnd.getFacilities(), 
				prsAllEnd.getQuantityTotal(), prsBothEnd.getQuantityTotal(),
				prsAllEnd.getQuantityRecovery(), prsBothEnd.getQuantityRecovery(),
				prsAllEnd.getQuantityDisposal(), prsBothEnd.getQuantityDisposal(),
				prsAllEnd.getQuantityUnspec(), prsBothEnd.getQuantityUnspec()));

		return compares;

	} 

}
