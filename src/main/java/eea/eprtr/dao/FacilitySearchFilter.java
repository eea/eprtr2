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
	private ConfidentialityFilter confidentialityFilter;
	private WasteSearchFilter wasteFilter;

	public FacilitySearchFilter(CountryAreaGroupRepository repository, Integer reportingYear, Integer countryID, Integer areaGroupID, Integer regionID, Integer rbdID, String facilityName, String cityName, ActivitySearchFilter activityFilter, PollutantSearchFilter pollutantFilter, WasteSearchFilter wasteFilter) {
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
		this.wasteFilter = wasteFilter;
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
		Predicate wasteSearchWhereClause = wasteFilter.buildWhereClause(cb, qr);
		if (wasteSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(wasteSearchWhereClause);
		}
		
		if (confidentialityFilter != null) {
			Predicate confidentialityWhereClause = confidentialityFilter.buildWhereClause(cb, qr);
			whereClause.getExpressions().add(confidentialityWhereClause);
		}
		
		return whereClause;
	}

	public FacilitySearchFilter createConfidentialityFilter() {
		FacilitySearchFilter filter = new FacilitySearchFilter(repository, reportingYear, countryID, areaGroupID, regionID, rbdID, facilityName, cityName, activityFilter, pollutantFilter, wasteFilter);
		filter.setConfidentialityFilter(new ConfidentialityFilter());
		return filter;
	}

	private void setConfidentialityFilter(ConfidentialityFilter confidentialityFilter) {
		this.confidentialityFilter = confidentialityFilter;
	}
}
