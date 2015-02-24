package eea.eprtr.dao;

import java.util.List;

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
	private Integer regionID;
	private Integer rbdID;
	private String facilityName;
	private String cityName;
	private ActivitySearchFilter activityFilter;
	private PollutantSearchFilter pollutantFilter;

	public FacilitySearchFilter(CountryAreaGroupRepository repository, Integer reportingYear, Integer countryID, Integer areaGroupID, Integer regionID, Integer rbdID, String facilityName, String cityName, ActivitySearchFilter activityFilter, PollutantSearchFilter pollutantFilter) {
		this.repository = repository;
		this.reportingYear = reportingYear;
		this.countryID = countryID;
		this.areaGroupID = areaGroupID;
		this.regionID = regionID; 
		this.rbdID = rbdID;
		this.facilityName = facilityName;
		this.cityName = cityName;
		this.activityFilter = activityFilter;
		this.pollutantFilter = pollutantFilter;
	}

	public Predicate buildWhereClause(CriteriaBuilder cb, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.conjunction();
		whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.reportingYear), reportingYear));
		if (areaGroupID != null) {
			List<Integer> countryIDs = repository.getCountryIDs(areaGroupID);
			whereClause.getExpressions().add(qr.get(FacilitySearchAll_.LOV_CountryID).in(countryIDs));
		} else if (countryID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_CountryID), countryID));
			if (regionID != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_NUTSRLevel2ID), regionID));
			} else if (rbdID != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.LOV_RiverBasinDistrictID), rbdID));
			}
		}
		if (facilityName != null) {
			whereClause.getExpressions().add(
					cb.or(
							cb.equal(qr.get(FacilitySearchAll_.facilitySearchName), facilityName),
							cb.equal(qr.get(FacilitySearchAll_.parentCompanySearchName), facilityName)
					)
			);
		}
		if (cityName != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.citySearchName), cityName));
		}
		Predicate activitySearchWhereClause = activityFilter.buildWhereClause(cb, qr);
		if (activitySearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(activitySearchWhereClause);
		}
		Predicate pollutantSearchWhereClause = pollutantFilter.buildWhereClause(cb, qr);
		if (pollutantSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(pollutantSearchWhereClause);
		}
		return whereClause;
	}
}
