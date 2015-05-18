package eea.eprtr.dao;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import eea.eprtr.model.LovPollutant;
import eea.eprtr.model.MediumCode;
import eea.eprtr.model.NumOfCountriesPrYear;
import eea.eprtr.model.PollutantConfidentiality;
import eea.eprtr.model.Pollutantrelease;
import eea.eprtr.model.PollutantreleaseCompare;
import eea.eprtr.model.PollutantreleaseCounts;
import eea.eprtr.model.Pollutantrelease_;
import eea.eprtr.model.PollutantreleasesSeries;

@Repository
public class PollutantreleaseSearchRepository {

	@Autowired
	private PollutantSearchRepository pollutantSearchRepository;

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
		CriteriaQuery<NumOfCountriesPrYear> cq1 = cb1.createQuery(NumOfCountriesPrYear.class);
		Root<Pollutantrelease> qr1 = cq1.from(Pollutantrelease.class);

		cq1.select(cb1.construct(NumOfCountriesPrYear.class, 
				qr1.get(Pollutantrelease_.reportingYear),
				qr1.get(Pollutantrelease_.countryCode))
				);
		cq1.where(filter.buildWhereClause(cb1, qr1));
		cq1.groupBy(qr1.get(Pollutantrelease_.reportingYear),qr1.get(Pollutantrelease_.countryCode));
		cq1.orderBy(cb1.asc(qr1.get(Pollutantrelease_.reportingYear)));

		TypedQuery<NumOfCountriesPrYear> q1 = em.createQuery(cq1);
		List<NumOfCountriesPrYear> results1 = q1.getResultList();
		
		LinkedHashMap<Integer, Integer> countries = new LinkedHashMap<Integer, Integer>();
		for (int i =0; i < results1.size(); i++){
			NumOfCountriesPrYear pc = results1.get(i);
			Integer y = pc.getReportingYear();
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
			ps.setCountries((long)countries.get(ps.getReportingYear()));
		}
		return results;
	} 
	
	public List<PollutantreleaseCompare> getPollutantreleaseCompare(PollutantreleaseSearchFilter filter, Integer reportingYearStart, Integer reportingYearEnd, MediumCode medium){
		
		/*List of FacilityIDs from Start year*/
		PollutantreleaseSearchFilter prsStart = new PollutantreleaseSearchFilter(filter.getReportingYearSearchFilter(),
				filter.getLocationSearchFilter(), filter.getActivitySearchFilter(), filter.getPollutantSearchFilter());
		ReportingYearSearchFilter rysf = new ReportingYearSearchFilter(reportingYearStart);
		prsStart.setReportingYearSearchFilter(rysf);

		CriteriaBuilder cb1 = em.getCriteriaBuilder();
		CriteriaQuery<Integer> cq1 = cb1.createQuery(Integer.class);
		Root<Pollutantrelease> qr1 = cq1.from(Pollutantrelease.class);

		cq1.select(qr1.get(Pollutantrelease_.facilityID));
		cq1.where(prsStart.buildWhereClause(cb1, qr1));
		cq1.groupBy(qr1.get(Pollutantrelease_.facilityID));

		TypedQuery<Integer> q1 = em.createQuery(cq1);
		List<Integer> fidFrom = q1.getResultList();

		/*List of FacilityIDs from End year*/
		PollutantreleaseSearchFilter prsEnd = new PollutantreleaseSearchFilter(filter.getReportingYearSearchFilter(),
				filter.getLocationSearchFilter(), filter.getActivitySearchFilter(), filter.getPollutantSearchFilter());
//		PollutantreleaseSearchFilter prsEnd = (PollutantreleaseSearchFilter)filter.clone();
		ReportingYearSearchFilter ryse = new ReportingYearSearchFilter(reportingYearEnd);
		prsEnd.setReportingYearSearchFilter(ryse);

		CriteriaBuilder cb2 = em.getCriteriaBuilder();
		CriteriaQuery<Integer> cq2 = cb2.createQuery(Integer.class);
		Root<Pollutantrelease> qr2 = cq2.from(Pollutantrelease.class);

		cq2.select(qr2.get(Pollutantrelease_.facilityID));
		cq2.where(prsEnd.buildWhereClause(cb2, qr2));
		cq2.groupBy(qr2.get(Pollutantrelease_.facilityID));

		TypedQuery<Integer> q2 = em.createQuery(cq2);
		List<Integer> fidTo = q2.getResultList();
		
		//SELECT ALL DATA from Start
		CriteriaBuilder cb3 = em.getCriteriaBuilder();
		CriteriaQuery<PollutantreleasesSeries> cq3 = cb3.createQuery(PollutantreleasesSeries.class);
		Root<Pollutantrelease> qr3 = cq3.from(Pollutantrelease.class);

		cq3.select(cb3.construct(PollutantreleasesSeries.class, 
				qr3.get(Pollutantrelease_.reportingYear),
				cb3.count(qr3.get(Pollutantrelease_.facilityID)),
				cb3.sum(qr3.get(Pollutantrelease_.quantityAir)), 
				cb3.sum(qr3.get(Pollutantrelease_.quantityAccidentalAir)), 
				cb3.sum(qr3.get(Pollutantrelease_.quantityWater)),
				cb3.sum(qr3.get(Pollutantrelease_.quantityAccidentalWater)),
				cb3.sum(qr3.get(Pollutantrelease_.quantitySoil)), 
				cb3.sum(qr3.get(Pollutantrelease_.quantityAccidentalSoil)))
				);
		cq3.where(prsStart.buildWhereClause(cb3, qr3));
		cq3.groupBy(qr3.get(Pollutantrelease_.reportingYear));
		cq3.orderBy(cb3.asc(qr3.get(Pollutantrelease_.reportingYear)));

		TypedQuery<PollutantreleasesSeries> q3 = em.createQuery(cq3);
		List<PollutantreleasesSeries> prsAllStartList = q3.getResultList();
		PollutantreleasesSeries prsAllStart = new PollutantreleasesSeries(reportingYearStart,(long)0,(double)0,(double)0,(double)0,(double)0,(double)0,(double)0);
		if(!prsAllStartList.isEmpty()){
		    // ignores multiple results
			prsAllStart = prsAllStartList.get(0);
		}
		
		//SELECT ALL DATA from End
		CriteriaBuilder cb4 = em.getCriteriaBuilder();
		CriteriaQuery<PollutantreleasesSeries> cq4 = cb4.createQuery(PollutantreleasesSeries.class);
		Root<Pollutantrelease> qr4 = cq4.from(Pollutantrelease.class);

		cq4.select(cb4.construct(PollutantreleasesSeries.class, 
				qr4.get(Pollutantrelease_.reportingYear),
				cb4.count(qr4.get(Pollutantrelease_.facilityID)),
				cb4.sum(qr4.get(Pollutantrelease_.quantityAir)), 
				cb4.sum(qr4.get(Pollutantrelease_.quantityAccidentalAir)), 
				cb4.sum(qr4.get(Pollutantrelease_.quantityWater)),
				cb4.sum(qr4.get(Pollutantrelease_.quantityAccidentalWater)),
				cb4.sum(qr4.get(Pollutantrelease_.quantitySoil)), 
				cb4.sum(qr4.get(Pollutantrelease_.quantityAccidentalSoil)))
				);
		cq4.where(prsEnd.buildWhereClause(cb4, qr4));
		cq4.groupBy(qr4.get(Pollutantrelease_.reportingYear));
		cq4.orderBy(cb4.asc(qr4.get(Pollutantrelease_.reportingYear)));

		TypedQuery<PollutantreleasesSeries> q4 = em.createQuery(cq4);
		//PollutantreleasesSeries prsAllEnd = q4.getSingleResult();
		List<PollutantreleasesSeries> prsAllEndList = q4.getResultList();
		PollutantreleasesSeries prsAllEnd = new PollutantreleasesSeries(reportingYearEnd,(long)0,(double)0,(double)0,(double)0,(double)0,(double)0,(double)0);
		if(!prsAllEndList.isEmpty()){
		    // ignores multiple results
			prsAllEnd = prsAllEndList.get(0);
		}
		
		//SELECT IN BOTH YEARS from Start
		PollutantreleasesSeries prsBothStart = new PollutantreleasesSeries(reportingYearStart,(long)0,(double)0,(double)0,(double)0,(double)0,(double)0,(double)0);
		if (fidTo.size() > 0){
			CriteriaBuilder cb5 = em.getCriteriaBuilder();
			CriteriaQuery<PollutantreleasesSeries> cq5 = cb5.createQuery(PollutantreleasesSeries.class);
			Root<Pollutantrelease> qr5 = cq5.from(Pollutantrelease.class);
	
			cq5.select(cb5.construct(PollutantreleasesSeries.class, 
					qr5.get(Pollutantrelease_.reportingYear),
					cb5.count(qr5.get(Pollutantrelease_.facilityID)),
					cb5.sum(qr5.get(Pollutantrelease_.quantityAir)), 
					cb5.sum(qr5.get(Pollutantrelease_.quantityAccidentalAir)), 
					cb5.sum(qr5.get(Pollutantrelease_.quantityWater)),
					cb5.sum(qr5.get(Pollutantrelease_.quantityAccidentalWater)),
					cb5.sum(qr5.get(Pollutantrelease_.quantitySoil)), 
					cb5.sum(qr5.get(Pollutantrelease_.quantityAccidentalSoil)))
					);
			
			Predicate whereBothStart = prsStart.buildWhereClause(cb5, qr5);
			whereBothStart.getExpressions().add(qr5.get(Pollutantrelease_.facilityID).in(fidTo));
			cq5.where(whereBothStart);
			cq5.groupBy(qr5.get(Pollutantrelease_.reportingYear));
			cq5.orderBy(cb5.asc(qr5.get(Pollutantrelease_.reportingYear)));
	
			TypedQuery<PollutantreleasesSeries> q5 = em.createQuery(cq5);
			List<PollutantreleasesSeries> prsBothStartList = q5.getResultList();
			if(!prsBothStartList.isEmpty()){
			    // ignores multiple results
				prsBothStart = prsBothStartList.get(0);
			}
		}

		//SELECT IN BOTH YEARS from End
		PollutantreleasesSeries prsBothEnd = new PollutantreleasesSeries(reportingYearEnd,(long)0,(double)0,(double)0,(double)0,(double)0,(double)0,(double)0);
		if (fidFrom.size() > 0){
			CriteriaBuilder cb6 = em.getCriteriaBuilder();
			CriteriaQuery<PollutantreleasesSeries> cq6 = cb6.createQuery(PollutantreleasesSeries.class);
			Root<Pollutantrelease> qr6 = cq6.from(Pollutantrelease.class);
	
			cq6.select(cb6.construct(PollutantreleasesSeries.class, 
					qr6.get(Pollutantrelease_.reportingYear),
					cb6.count(qr6.get(Pollutantrelease_.facilityID)),
					cb6.sum(qr6.get(Pollutantrelease_.quantityAir)), 
					cb6.sum(qr6.get(Pollutantrelease_.quantityAccidentalAir)), 
					cb6.sum(qr6.get(Pollutantrelease_.quantityWater)),
					cb6.sum(qr6.get(Pollutantrelease_.quantityAccidentalWater)),
					cb6.sum(qr6.get(Pollutantrelease_.quantitySoil)), 
					cb6.sum(qr6.get(Pollutantrelease_.quantityAccidentalSoil)))
					);
			
			Predicate whereBothEnd = prsEnd.buildWhereClause(cb6, qr6);
			whereBothEnd.getExpressions().add(qr6.get(Pollutantrelease_.facilityID).in(fidFrom));
			cq6.where(whereBothEnd);
			cq6.groupBy(qr6.get(Pollutantrelease_.reportingYear));
			cq6.orderBy(cb6.asc(qr6.get(Pollutantrelease_.reportingYear)));
	
			TypedQuery<PollutantreleasesSeries> q6 = em.createQuery(cq6);
			List<PollutantreleasesSeries> prsBothEndList = q6.getResultList();
			if(!prsBothEndList.isEmpty()){
			    // ignores multiple results
				prsBothEnd = prsBothEndList.get(0);
			}
		}
		/*Create final collection*/
		List<PollutantreleaseCompare> compares = new ArrayList<PollutantreleaseCompare>();
		//PollutantreleaseCompare prc = null;
		/*Start objects*/
		
		switch (medium) {
			case AIR:
				/*prc = ;
				Integer year = reportingYearStart;
				Long fidAll =  prsAllStart.getFacilities();
				Long fidBoth =  prsBothStart.getFacilities();
				Double quantAll = prsAllStart.getQuantityAir();
				Double quantBoth =  prsBothStart.getQuantityAir();
				Double accAll = prsAllStart.getAccidentalAir();
				Double accBoth = prsBothStart.getAccidentalAir();
				PollutantreleaseCompare airStart = new PollutantreleaseCompare(year, fidAll, fidBoth, quantAll, quantBoth, accAll, accBoth);*/
				PollutantreleaseCompare airStart = new PollutantreleaseCompare(reportingYearStart, 
						prsAllStart.getFacilities(), prsBothStart.getFacilities(), 
						prsAllStart.getQuantityAir(), prsBothStart.getQuantityAir(),
						prsAllStart.getAccidentalAir(), prsBothStart.getAccidentalAir());
				compares.add(airStart);
				compares.add(new PollutantreleaseCompare(reportingYearEnd, 
						prsAllEnd.getFacilities(), prsBothEnd.getFacilities(), 
						prsAllEnd.getQuantityAir(), prsBothEnd.getQuantityAir(),
						prsAllEnd.getAccidentalAir(), prsBothEnd.getAccidentalAir()));
				//compares.add(prc));
				break;
	
			case SOIL:
				compares.add(new PollutantreleaseCompare(reportingYearStart, 
						prsAllStart.getFacilities(), prsBothStart.getFacilities(), 
						prsAllStart.getQuantitySoil(), prsBothStart.getQuantitySoil(),
						prsAllStart.getAccidentalSoil(), prsBothStart.getAccidentalSoil()));
				compares.add(new PollutantreleaseCompare(reportingYearEnd, 
						prsAllEnd.getFacilities(), prsBothEnd.getFacilities(), 
						prsAllEnd.getQuantitySoil(), prsBothEnd.getQuantitySoil(),
						prsAllEnd.getAccidentalSoil(), prsBothEnd.getAccidentalSoil()));
				break;
	
			case WATER:
				compares.add(new PollutantreleaseCompare(reportingYearStart, 
						prsAllStart.getFacilities(), prsBothStart.getFacilities(), 
						prsAllStart.getQuantityWater(), prsBothStart.getQuantityWater(),
						prsAllStart.getAccidentalWater(), prsBothStart.getAccidentalWater()));
				compares.add(new PollutantreleaseCompare(reportingYearEnd, 
						prsAllEnd.getFacilities(), prsBothEnd.getFacilities(), 
						prsAllEnd.getQuantityWater(), prsBothEnd.getQuantityWater(),
						prsAllEnd.getAccidentalWater(), prsBothEnd.getAccidentalWater()));
				break;
			default:
				break;
		}

		return compares;

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

	/// <summary>
    /// return true if confidentiality might effect result
    /// </summary>
	public Boolean IsAffectedByConfidentiality(
			PollutantreleaseSearchFilter filter) {
    	PollutantSearchFilter pfilterorg = filter.getPollutantSearchFilter();
        //create new filter with confidential within group instead of pollutant itself
		Integer polGroup = pfilterorg.getPollutantGroupID();
		if (polGroup == null){
			List<LovPollutant> pollutants = pollutantSearchRepository.getLovPollutants(new PollutantSearchFilter(pfilterorg.getPollutantID(), null, null, null, null));
			if (!pollutants.isEmpty()){
				polGroup = pollutants.get(0).getParentID();
			}
		}
    	PollutantSearchFilter pfilternew = new PollutantSearchFilter(polGroup,
    			null,pfilterorg.getMediumCode(),pfilterorg.getAccidental(),1);
    	
    	PollutantreleaseSearchFilter prfilternew = new PollutantreleaseSearchFilter(filter.getReportingYearSearchFilter(), 
    			filter.getLocationSearchFilter(), filter.getActivitySearchFilter(), pfilternew); 
    	
    	List<PollutantreleasesSeries> result = getPollutantreleasesSeries(prfilternew);

        return !result.isEmpty(); 
	}

	/**
	 * Get confidential data for timeseries on aggregated level. If no confidentiality claims is found the list will be empty.
	 * @param filter
	 * @return List<PollutantConfidentiality>
	 */
	public List<PollutantConfidentiality> GetConfidentialTimeSeries(
			PollutantreleaseSearchFilter filter, MediumCode medium) {
        //Find data for confidential in the group of the pollutant
    	PollutantSearchFilter pfilterorg = filter.getPollutantSearchFilter();
		Integer polGroup = pfilterorg.getPollutantGroupID();
		if (polGroup == null){
			List<LovPollutant> pollutants = pollutantSearchRepository.getLovPollutants(new PollutantSearchFilter(pfilterorg.getPollutantID(), null, null, null, null));
			if (!pollutants.isEmpty()){
				polGroup = pollutants.get(0).getParentID();
			}
		}
	
        //create new filter with confidential within group instead of pollutant itself
    	PollutantSearchFilter pfilternew = new PollutantSearchFilter(polGroup,
    			null,pfilterorg.getMediumCode(),pfilterorg.getAccidental(),1);
    	
    	PollutantreleaseSearchFilter prfilternew = new PollutantreleaseSearchFilter(filter.getReportingYearSearchFilter(), 
    			filter.getLocationSearchFilter(), filter.getActivitySearchFilter(), pfilternew); 
    	
    	List<PollutantreleasesSeries> groupresult = getPollutantreleasesSeries(prfilternew);

        if (!groupresult.isEmpty())
        {
            //Find data for pollutant
        	List<PollutantreleasesSeries> pollutantresult = getPollutantreleasesSeries(filter);

            //merge the two lists and return.
            return mergeList(pollutantresult, groupresult,medium );
        }
 
        return new ArrayList<PollutantConfidentiality>();
	}
	
	
    private List<PollutantConfidentiality> mergeList(
			List<PollutantreleasesSeries> pollutantdata,
			List<PollutantreleasesSeries> confidentialData, MediumCode medium ) {
    	
    	//take all pollutants and add confidential data where avaialable
    	List<PollutantConfidentiality> poldata = new ArrayList<PollutantConfidentiality>();
		for (PollutantreleasesSeries pd: pollutantdata){
			Double quantityGroup = null;
			Double quantity = null;
			for (PollutantreleasesSeries pg: confidentialData){
				if(pg.getReportingYear().equals(pd.getReportingYear())){
					switch (medium) {
						case AIR:
							quantity = pd.getQuantityAir();
							quantityGroup = pg.getQuantityAir();
							break;
						case WATER:
							quantity = pd.getQuantityWater();
							quantityGroup = pg.getQuantityWater();
							break;
						case SOIL:
							quantity = pd.getQuantitySoil();
							quantityGroup = pg.getQuantitySoil();
							break;
						default:
							break;
					}
					break;
				}
			}
			poldata.add(new PollutantConfidentiality(pd.getReportingYear(),quantity,quantityGroup));
		}
		//take all confidential data and add pollutant data where avaialable
	   	List<PollutantConfidentiality> confdata = new ArrayList<PollutantConfidentiality>();
		for (PollutantreleasesSeries pg: confidentialData){
			Integer reportingYear = null;
			Double quantity = null;
			Double quantityGroup = null;
			for (PollutantreleasesSeries pd: pollutantdata){
				if(pd.getReportingYear().equals(pg.getReportingYear())){
					reportingYear = pd.getReportingYear();
					switch (medium) {
						case AIR:
							quantity = pd.getQuantityAir();
							quantityGroup = pg.getQuantityAir();
							break;
						case WATER:
							quantity = pd.getQuantityWater();
							quantityGroup = pg.getQuantityWater();
							break;
						case SOIL:
							quantity = pd.getQuantitySoil();
							quantityGroup = pg.getQuantitySoil();
							break;
						default:
							break;
					}
					break;
				}
			}
			if(reportingYear != null){
				confdata.add(new PollutantConfidentiality(reportingYear,quantity,quantityGroup));
			}
		}
		
		Set<PollutantConfidentiality> set = new HashSet<>(poldata);
		set.addAll(confdata);
		poldata.clear();
		poldata.addAll(set);
		return poldata;
	}

    
    
}
