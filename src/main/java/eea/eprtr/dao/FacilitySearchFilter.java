package eea.eprtr.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;

public class FacilitySearchFilter {

	private String facilityName;
	private String cityName;
	private ReportingYearSearchFilter reportingYearFilter;
	private LocationSearchFilter locationFilter;
	private ActivitySearchFilter activityFilter;
	private PollutantSearchFilter pollutantFilter;
	private ConfidentialityFilter confidentialityFilter;
	private WasteSearchFilter wasteFilter;

	public FacilitySearchFilter(String facilityName, String cityName, ReportingYearSearchFilter reportingYearFilter, LocationSearchFilter locationFilter, ActivitySearchFilter activityFilter, PollutantSearchFilter pollutantFilter, WasteSearchFilter wasteFilter) {
		this.facilityName = facilityName;
		this.cityName = cityName;
		this.reportingYearFilter = reportingYearFilter;
		this.locationFilter = locationFilter;
		this.activityFilter = activityFilter;
		this.pollutantFilter = pollutantFilter;
		this.wasteFilter = wasteFilter;
	}

	public Predicate buildWhereClause(CriteriaBuilder cb, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.conjunction();
		Predicate reportingYearSearchWhereClause = reportingYearFilter.buildWhereClause(cb, qr);
		if (reportingYearSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(reportingYearSearchWhereClause);
		}
		Predicate locationSearchWhereClause = locationFilter.buildWhereClause(cb, qr);
		if (locationSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(locationSearchWhereClause);
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
		FacilitySearchFilter filter = new FacilitySearchFilter(facilityName, cityName, reportingYearFilter, locationFilter, activityFilter, pollutantFilter, wasteFilter);
		filter.setConfidentialityFilter(new ConfidentialityFilter());
		return filter;
	}

	private void setConfidentialityFilter(ConfidentialityFilter confidentialityFilter) {
		this.confidentialityFilter = confidentialityFilter;
	}
}
