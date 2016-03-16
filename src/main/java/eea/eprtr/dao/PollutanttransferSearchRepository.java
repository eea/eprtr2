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
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Predicate;

import org.springframework.stereotype.Repository;

import eea.eprtr.model.NumOfCountriesPrYear;
import eea.eprtr.model.PollutantConfidentiality;
import eea.eprtr.model.PollutanttransferCompare;
import eea.eprtr.model.PollutanttransferSeries;
import eea.eprtr.model.Pollutanttransfer_;
import eea.eprtr.model.Pollutanttransfer;

@Repository
public class PollutanttransferSearchRepository {

    @PersistenceContext(unitName="eprtr")
    private EntityManager em;
    
    public List<Pollutanttransfer> getPollutanttransfer(PollutanttransferSearchFilter filter) {
        
        CriteriaBuilder cb = em.getCriteriaBuilder();
        
        CriteriaQuery<Pollutanttransfer> cq = cb.createQuery(Pollutanttransfer.class);
        Root<Pollutanttransfer> qr = cq.from(Pollutanttransfer.class);
        cq.select(qr);
        cq.where(filter.buildWhereClause(cb, qr));

        TypedQuery<Pollutanttransfer> q = em.createQuery(cq);
        List<Pollutanttransfer> results = q.getResultList();
        return results;
    }
    
    
    public List<PollutanttransferSeries> getPollutanttransferSeries(PollutanttransferSearchFilter filter) {

        /*All except countries*/
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<PollutanttransferSeries> cq = cb.createQuery(PollutanttransferSeries.class);
        Root<Pollutanttransfer> qr = cq.from(Pollutanttransfer.class);

        cq.select(cb.construct(PollutanttransferSeries.class, 
                qr.get(Pollutanttransfer_.reportingYear),
                cb.count(qr.get(Pollutanttransfer_.facilityID)),
                cb.sum(qr.get(Pollutanttransfer_.quantity)))
                );
        cq.where(filter.buildWhereClause(cb, qr));
        cq.groupBy(qr.get(Pollutanttransfer_.reportingYear));
        cq.orderBy(cb.asc(qr.get(Pollutanttransfer_.reportingYear)));

        TypedQuery<PollutanttransferSeries> q = em.createQuery(cq);
        List<PollutanttransferSeries> results = q.getResultList();
        
        /*Countries*/
        CriteriaBuilder cb1 = em.getCriteriaBuilder();
        CriteriaQuery<NumOfCountriesPrYear> cq1 = cb1.createQuery(NumOfCountriesPrYear.class);
        Root<Pollutanttransfer> qr1 = cq1.from(Pollutanttransfer.class);

        cq1.select(cb1.construct(NumOfCountriesPrYear.class, 
                qr1.get(Pollutanttransfer_.reportingYear),
                qr1.get(Pollutanttransfer_.countryCode))
                );
        cq1.where(filter.buildWhereClause(cb1, qr1));
        cq1.groupBy(qr1.get(Pollutanttransfer_.reportingYear),qr1.get(Pollutanttransfer_.countryCode));
        cq1.orderBy(cb1.asc(qr1.get(Pollutanttransfer_.reportingYear)));

        TypedQuery<NumOfCountriesPrYear> q1 = em.createQuery(cq1);
        List<NumOfCountriesPrYear> results1 = q1.getResultList();
        
        LinkedHashMap<Integer, Integer> countries = new LinkedHashMap<Integer, Integer>();
        for (NumOfCountriesPrYear pc: results1) {
            Integer y = pc.getReportingYear();
            if (!countries.containsKey(y)) {
                countries.put(y, 1);
            }
            else{
                Integer coun = countries.get(y);
                coun++; 
                countries.put(y, coun);
            }
        }
        
        for (PollutanttransferSeries ps: results) {
            ps.setCountries((long)countries.get(ps.getReportingYear()));
        }
        return results;
    } 

    public List<PollutanttransferCompare> getPollutanttransferCompare(PollutanttransferSearchFilter filter, Integer reportingYearStart, Integer reportingYearEnd) {
        
        /*List of FacilityIDs from Start year*/
        PollutanttransferSearchFilter ptsStart = new PollutanttransferSearchFilter(filter.getReportingYearSearchFilter(),
                filter.getLocationSearchFilter(), filter.getActivitySearchFilter(), filter.getPollutantSearchFilter(), filter.getFacilityItemSearchFilter());
        ReportingYearSearchFilter rysf = new ReportingYearSearchFilter(reportingYearStart);
        ptsStart.setReportingYearSearchFilter(rysf);

        CriteriaBuilder cb1 = em.getCriteriaBuilder();
        CriteriaQuery<Integer> cq1 = cb1.createQuery(Integer.class);
        Root<Pollutanttransfer> qr1 = cq1.from(Pollutanttransfer.class);

        cq1.select(qr1.get(Pollutanttransfer_.facilityID));
        cq1.where(ptsStart.buildWhereClause(cb1, qr1));
        cq1.groupBy(qr1.get(Pollutanttransfer_.facilityID));

        TypedQuery<Integer> q1 = em.createQuery(cq1);
        List<Integer> fidFrom = q1.getResultList();

        /*List of FacilityIDs from End year*/
        PollutanttransferSearchFilter ptsEnd = new PollutanttransferSearchFilter(filter.getReportingYearSearchFilter(),
                filter.getLocationSearchFilter(), filter.getActivitySearchFilter(), filter.getPollutantSearchFilter(), filter.getFacilityItemSearchFilter());
//      PollutanttransferSearchFilter ptsEnd = (PollutanttransferSearchFilter)filter.clone();
        ReportingYearSearchFilter ryse = new ReportingYearSearchFilter(reportingYearEnd);
        ptsEnd.setReportingYearSearchFilter(ryse);

        CriteriaBuilder cb2 = em.getCriteriaBuilder();
        CriteriaQuery<Integer> cq2 = cb2.createQuery(Integer.class);
        Root<Pollutanttransfer> qr2 = cq2.from(Pollutanttransfer.class);

        cq2.select(qr2.get(Pollutanttransfer_.facilityID));
        cq2.where(ptsEnd.buildWhereClause(cb2, qr2));
        cq2.groupBy(qr2.get(Pollutanttransfer_.facilityID));

        TypedQuery<Integer> q2 = em.createQuery(cq2);
        List<Integer> fidTo = q2.getResultList();
        
        //SELECT ALL DATA from Start
        CriteriaBuilder cb3 = em.getCriteriaBuilder();
        CriteriaQuery<PollutanttransferSeries> cq3 = cb3.createQuery(PollutanttransferSeries.class);
        Root<Pollutanttransfer> qr3 = cq3.from(Pollutanttransfer.class);

        cq3.select(cb3.construct(PollutanttransferSeries.class, 
                qr3.get(Pollutanttransfer_.reportingYear),
                cb3.count(qr3.get(Pollutanttransfer_.facilityID)),
                cb3.sum(qr3.get(Pollutanttransfer_.quantity)))
                );
        cq3.where(ptsStart.buildWhereClause(cb3, qr3));
        cq3.groupBy(qr3.get(Pollutanttransfer_.reportingYear));
        cq3.orderBy(cb3.asc(qr3.get(Pollutanttransfer_.reportingYear)));

        TypedQuery<PollutanttransferSeries> q3 = em.createQuery(cq3);
        List<PollutanttransferSeries> ptsAllStartList = q3.getResultList();
        PollutanttransferSeries ptsAllStart = new PollutanttransferSeries(reportingYearStart,(long)0,(double)0);
        if(!ptsAllStartList.isEmpty()) {
            // ignores multiple results
            ptsAllStart = ptsAllStartList.get(0);
        }
        
        //SELECT ALL DATA from End
        CriteriaBuilder cb4 = em.getCriteriaBuilder();
        CriteriaQuery<PollutanttransferSeries> cq4 = cb4.createQuery(PollutanttransferSeries.class);
        Root<Pollutanttransfer> qr4 = cq4.from(Pollutanttransfer.class);

        cq4.select(cb4.construct(PollutanttransferSeries.class, 
                qr4.get(Pollutanttransfer_.reportingYear),
                cb4.count(qr4.get(Pollutanttransfer_.facilityID)),
                cb4.sum(qr4.get(Pollutanttransfer_.quantity)))
                );
        cq4.where(ptsEnd.buildWhereClause(cb4, qr4));
        cq4.groupBy(qr4.get(Pollutanttransfer_.reportingYear));
        cq4.orderBy(cb4.asc(qr4.get(Pollutanttransfer_.reportingYear)));

        TypedQuery<PollutanttransferSeries> q4 = em.createQuery(cq4);
        //PollutanttransferSeries ptsAllEnd = q4.getSingleResult();
        List<PollutanttransferSeries> ptsAllEndList = q4.getResultList();
        PollutanttransferSeries ptsAllEnd = new PollutanttransferSeries(reportingYearEnd,(long)0,(double)0);
        if(!ptsAllEndList.isEmpty()) {
            // ignores multiple results
            ptsAllEnd = ptsAllEndList.get(0);
        }
        
        //SELECT IN BOTH YEARS from Start
        PollutanttransferSeries ptsBothStart = new PollutanttransferSeries(reportingYearStart,(long)0,(double)0);
        if (fidTo.size() > 0) {
            CriteriaBuilder cb5 = em.getCriteriaBuilder();
            CriteriaQuery<PollutanttransferSeries> cq5 = cb5.createQuery(PollutanttransferSeries.class);
            Root<Pollutanttransfer> qr5 = cq5.from(Pollutanttransfer.class);
    
            cq5.select(cb5.construct(PollutanttransferSeries.class, 
                    qr5.get(Pollutanttransfer_.reportingYear),
                    cb5.count(qr5.get(Pollutanttransfer_.facilityID)),
                    cb5.sum(qr5.get(Pollutanttransfer_.quantity)))
                    );
            
            Predicate whereBothStart = ptsStart.buildWhereClause(cb5, qr5);
            whereBothStart.getExpressions().add(qr5.get(Pollutanttransfer_.facilityID).in(fidTo));
            cq5.where(whereBothStart);
            cq5.groupBy(qr5.get(Pollutanttransfer_.reportingYear));
            cq5.orderBy(cb5.asc(qr5.get(Pollutanttransfer_.reportingYear)));
    
            TypedQuery<PollutanttransferSeries> q5 = em.createQuery(cq5);
            List<PollutanttransferSeries> ptsBothStartList = q5.getResultList();
            if(!ptsBothStartList.isEmpty()) {
                // ignores multiple results
                ptsBothStart = ptsBothStartList.get(0);
            }
        }

        //SELECT IN BOTH YEARS from End
        PollutanttransferSeries ptsBothEnd = new PollutanttransferSeries(reportingYearEnd,(long)0,(double)0);
        if (fidFrom.size() > 0) {
            CriteriaBuilder cb6 = em.getCriteriaBuilder();
            CriteriaQuery<PollutanttransferSeries> cq6 = cb6.createQuery(PollutanttransferSeries.class);
            Root<Pollutanttransfer> qr6 = cq6.from(Pollutanttransfer.class);
    
            cq6.select(cb6.construct(PollutanttransferSeries.class, 
                    qr6.get(Pollutanttransfer_.reportingYear),
                    cb6.count(qr6.get(Pollutanttransfer_.facilityID)),
                    cb6.sum(qr6.get(Pollutanttransfer_.quantity)))
                    );
            
            Predicate whereBothEnd = ptsEnd.buildWhereClause(cb6, qr6);
            whereBothEnd.getExpressions().add(qr6.get(Pollutanttransfer_.facilityID).in(fidFrom));
            cq6.where(whereBothEnd);
            cq6.groupBy(qr6.get(Pollutanttransfer_.reportingYear));
            cq6.orderBy(cb6.asc(qr6.get(Pollutanttransfer_.reportingYear)));
    
            TypedQuery<PollutanttransferSeries> q6 = em.createQuery(cq6);
            List<PollutanttransferSeries> ptsBothEndList = q6.getResultList();
            if(!ptsBothEndList.isEmpty()) {
                // ignores multiple results
                ptsBothEnd = ptsBothEndList.get(0);
            }
        }
        /*Create final collection*/
        List<PollutanttransferCompare> compares = new ArrayList<PollutanttransferCompare>();
        /*Start objects*/
        compares.add(new PollutanttransferCompare(reportingYearStart, 
                ptsAllStart.getFacilities(), ptsBothStart.getFacilities(), 
                ptsAllStart.getQuantity(), ptsBothStart.getQuantity()));
        compares.add(new PollutanttransferCompare(reportingYearEnd, 
                ptsAllEnd.getFacilities(), ptsBothEnd.getFacilities(), 
                ptsAllEnd.getQuantity(), ptsBothEnd.getQuantity()));

        return compares;

    } 

    /**
     * Get confidential data for timeseries on aggregated level. If no confidentiality claims is found the list will be empty.
     * @param filter
     * @return List<PollutantConfidentiality>
     */
    public List<PollutantConfidentiality> GetConfidentialTimeSeries(PollutanttransferSearchFilter filter) {
        //Find data for confidential in the group of the pollutant
        PollutantSearchFilter pfilterorg = filter.getPollutantSearchFilter();
        //create new filter with confidential within group instead of pollutant itself
        PollutantSearchFilter pfilternew = new PollutantSearchFilter(pfilterorg.getPollutantGroupID(),
                null,pfilterorg.getMediumCode(),pfilterorg.getAccidental(),1);
        
        PollutanttransferSearchFilter ptfilternew = new PollutanttransferSearchFilter(filter.getReportingYearSearchFilter(), 
                filter.getLocationSearchFilter(), filter.getActivitySearchFilter(), pfilternew, filter.getFacilityItemSearchFilter()); 
        
        List<PollutanttransferSeries> groupresult = getPollutanttransferSeries(ptfilternew);

        if (!groupresult.isEmpty()) {
            //Find data for pollutant
            List<PollutanttransferSeries> pollutantresult = getPollutanttransferSeries(filter);

            //merge the two lists and return.
            return mergeList(pollutantresult, groupresult );
        }
 
        return new ArrayList<PollutantConfidentiality>();
    }

    /**
     * Merge a list of timeseries for pollutants and confidential in group. 
     * All years included in each of the two lists will be included in the merged list.
     *
     * @param pollutantdata - timeseries for pollutants
     * @param confidentialData - timeseries for confidential data
     * @return list of PollutantConfidentiality records
     */
    private List<PollutantConfidentiality> mergeList(
            List<PollutanttransferSeries> pollutantdata,
            List<PollutanttransferSeries> confidentialData ) {
        
        //take all pollutants and add confidential data where avaialable
        List<PollutantConfidentiality> poldata = new ArrayList<PollutantConfidentiality>();
        for (PollutanttransferSeries pd: pollutantdata) {
            Double QuantityGroup = null;
            for (PollutanttransferSeries pg: confidentialData) {
                if(pg.getReportingYear().equals(pd.getReportingYear())) {
                    QuantityGroup = pg.getQuantity();
                    break;
                }
            }
            poldata.add(new PollutantConfidentiality(pd.getReportingYear(),pd.getQuantity(),QuantityGroup));
        }
        //take all confidential data and add pollutant data where avaialable
        List<PollutantConfidentiality> confdata = new ArrayList<PollutantConfidentiality>();
        for (PollutanttransferSeries pg: confidentialData) {
            Integer reportingYear = null;
            Double quantity = null;
            Double quantityGroup = null;
            for (PollutanttransferSeries pd: pollutantdata) {
                if(pd.getReportingYear().equals(pg.getReportingYear())) {
                    reportingYear = pd.getReportingYear();
                    quantity = pd.getQuantity();
                    quantityGroup = pg.getQuantity();
                    break;
                }
            }
            if(reportingYear != null) {
                confdata.add(new PollutantConfidentiality(reportingYear,quantity,quantityGroup));
            }
        }
        
        Set<PollutantConfidentiality> set = new HashSet<>(poldata);
        set.addAll(confdata);
        poldata.clear();
        poldata.addAll(set);
//      List<PollutantConfidentiality> mergeList = new ArrayList<>(set);
        
        //List<PollutantConfidentiality> uniondata = ListUtils.union(poldata,confdata);
        //Combinde the two lists. Union will remove any dublets
        return poldata;
    }


    /// <summary>
    /// return true if confidentiality might effect result
    /// </summary>
    public Boolean IsAffectedByConfidentiality(PollutanttransferSearchFilter filter) {
        PollutantSearchFilter pfilterorg = filter.getPollutantSearchFilter();
        //create new filter with confidential within group instead of pollutant itself
        PollutantSearchFilter pfilternew = new PollutantSearchFilter(pfilterorg.getPollutantGroupID(),
                null,pfilterorg.getMediumCode(),pfilterorg.getAccidental(),1);//pfilterorg.getConfidentialIndicator()
        
        PollutanttransferSearchFilter ptfilternew = new PollutanttransferSearchFilter(filter.getReportingYearSearchFilter(), 
                filter.getLocationSearchFilter(), filter.getActivitySearchFilter(), pfilternew, filter.getFacilityItemSearchFilter()); 
        
        List<PollutanttransferSeries> result = getPollutanttransferSeries(ptfilternew);

        return !result.isEmpty(); 
    }
    
}
