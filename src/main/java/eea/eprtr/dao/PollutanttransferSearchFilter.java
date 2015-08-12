package eea.eprtr.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.Pollutanttransfer;

public class PollutanttransferSearchFilter {

	private ReportingYearSearchFilter reportingYearFilter;
	private LocationSearchFilter locationFilter;
	private ActivitySearchFilter activityFilter;
	private PollutantSearchFilter pollutantFilter;
	private FacilityItemSearchFilter facilityItemSearchFilter;
	
	public PollutanttransferSearchFilter(ReportingYearSearchFilter reportingYearFilter,
			LocationSearchFilter locationFilter, ActivitySearchFilter activityFilter, PollutantSearchFilter pollutantFilter, FacilityItemSearchFilter facilityItemSearchFilter
) {
			this.reportingYearFilter = reportingYearFilter;
			this.locationFilter = locationFilter;
			this.activityFilter = activityFilter;
			this.pollutantFilter = pollutantFilter;
			this.facilityItemSearchFilter = facilityItemSearchFilter;
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

	public FacilityItemSearchFilter getFacilityItemSearchFilter() {
		return facilityItemSearchFilter;
	}

	public void setFacilityItemSearchFilter(FacilityItemSearchFilter facilityItemSearchFilter) {
		this.facilityItemSearchFilter = facilityItemSearchFilter;
	}

	
	public Predicate buildWhereClause(CriteriaBuilder cb, Root<Pollutanttransfer> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYearFilter != null){
			Predicate reportingYearSearchWhereClause = reportingYearFilter.buildWhereClausePollutanttransfer(cb, qr);
			if (reportingYearSearchWhereClause.getExpressions().size() > 0) {
				whereClause.getExpressions().add(reportingYearSearchWhereClause);
			}
		}
		
		Predicate locationSearchWhereClause = locationFilter.buildWhereClausePollutanttransfer(cb, qr);
		if (locationSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(locationSearchWhereClause);
		}

		Predicate facilityItemSearchWhereClause = facilityItemSearchFilter.buildWhereClausePollutanttransfer(cb, qr);
		if (facilityItemSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(facilityItemSearchWhereClause);
		}

		Predicate activitySearchWhereClause = activityFilter.buildWhereClausePollutanttransfer(cb, qr);
		if (activitySearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(activitySearchWhereClause);
		}
		
		Predicate pollutantSearchWhereClause = pollutantFilter.buildWhereClausePollutanttransfer(cb, qr);
		if (pollutantSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(pollutantSearchWhereClause);
		}
		return whereClause;
	}
	
}
