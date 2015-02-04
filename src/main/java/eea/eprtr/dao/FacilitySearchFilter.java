package eea.eprtr.dao;

import java.util.List;

import javax.persistence.criteria.AbstractQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;

public class FacilitySearchFilter {

	private CountryAreaGroupRepository repository;
	private Integer reportingYear;
	private Integer countryID;
	private Integer areaGroupID;

	public FacilitySearchFilter(CountryAreaGroupRepository repository, Integer reportingYear, Integer countryID, Integer areaGroupID) {
		this.repository = repository;
		this.reportingYear = reportingYear;
		this.countryID = countryID;
		this.areaGroupID = areaGroupID; 
	}

	public void apply(CriteriaBuilder cb, AbstractQuery<?> q, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.equal(qr.get(FacilitySearchAll_.reportingYear), reportingYear);
		if (areaGroupID != null) {
			List<Integer> countryIDs = repository.getCountryIDs(areaGroupID);
			whereClause = cb.and(whereClause, qr.get(FacilitySearchAll_.LOV_CountryID).in(countryIDs));
		} else if (countryID != null) {
			whereClause = cb.and(whereClause, cb.equal(qr.get(FacilitySearchAll_.LOV_CountryID), countryID));
		}
		q.where(whereClause);
	}
}
