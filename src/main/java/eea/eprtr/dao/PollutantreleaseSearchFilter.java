package eea.eprtr.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.Pollutantrelease;

public class PollutantreleaseSearchFilter {

	private ReportingYearSearchFilter reportingYearFilter;
	private LocationSearchFilter locationFilter;
	private ActivitySearchFilter activityFilter;
	private PollutantSearchFilter pollutantFilter;

	public PollutantreleaseSearchFilter(
			ReportingYearSearchFilter reportingYearFilter,
			LocationSearchFilter locationFilter, ActivitySearchFilter activityFilter, PollutantSearchFilter pollutantFilter) {
		this.reportingYearFilter = reportingYearFilter;
		this.locationFilter = locationFilter;
		this.activityFilter = activityFilter;
		this.pollutantFilter = pollutantFilter;
	}
	
	public ReportingYearSearchFilter getReportingYearSearchFilter() {
		return reportingYearFilter;
	}

	public void setReportingYearSearchFilter(ReportingYearSearchFilter reportingYearFilter) {
		this.reportingYearFilter = reportingYearFilter;
	}

	public LocationSearchFilter getLocationSearchFilter() {
		return locationFilter;
	}

	public void setLocationSearchFilter(LocationSearchFilter locationFilter) {
		this.locationFilter = locationFilter;
	}

	public ActivitySearchFilter getActivitySearchFilter() {
		return activityFilter;
	}

	public void setActivitySearchFilter(ActivitySearchFilter activityFilter) {
		this.activityFilter = activityFilter;
	}
	
	public PollutantSearchFilter getPollutantSearchFilter() {
		return pollutantFilter;
	}

	public void setPollutantSearchFilter(PollutantSearchFilter pollutantFilter) {
		this.pollutantFilter = pollutantFilter;
	}


	public Predicate buildWhereClause(CriteriaBuilder cb, Root<Pollutantrelease> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYearFilter != null){
			Predicate reportingYearSearchWhereClause = reportingYearFilter.buildWhereClausePollutantrelease(cb, qr);
			if (reportingYearSearchWhereClause.getExpressions().size() > 0) {
				whereClause.getExpressions().add(reportingYearSearchWhereClause);
			}
		}
		Predicate locationSearchWhereClause = locationFilter.buildWhereClausePollutantrelease(cb, qr);
		if (locationSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(locationSearchWhereClause);
		}
		Predicate activitySearchWhereClause = activityFilter.buildWhereClausePollutantrelease(cb, qr);
		if (activitySearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(activitySearchWhereClause);
		}
		Predicate pollutantSearchWhereClause = pollutantFilter.buildWhereClausePollutantrelease(cb, qr);
		if (pollutantSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(pollutantSearchWhereClause);
		}
		return whereClause;
	}
	

}
