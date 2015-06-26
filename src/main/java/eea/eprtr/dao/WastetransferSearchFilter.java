package eea.eprtr.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.Wastetransfer;
import eea.eprtr.model.WastetransferConfidential;
import eea.eprtr.model.WastetransferHazardoustreater;
import eea.eprtr.model.WastetransferReceivingcountry;

public class WastetransferSearchFilter {

	private ReportingYearSearchFilter reportingYearFilter;
	private LocationSearchFilter locationFilter;
	private ActivitySearchFilter activityFilter;
	private WasteSearchFilter wasteFilter;
	
	public WastetransferSearchFilter(ReportingYearSearchFilter reportingYearFilter,
			LocationSearchFilter locationFilter, ActivitySearchFilter activityFilter,WasteSearchFilter wasteFilter)
	{
		this.reportingYearFilter = reportingYearFilter;
		this.locationFilter = locationFilter;
		this.activityFilter = activityFilter;
		this.wasteFilter = wasteFilter;
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
	
	public WasteSearchFilter getWasteSearchFilter() {
		return wasteFilter;
	}

	public void setWasteSearchFilter(WasteSearchFilter wasteFilter) {
		this.wasteFilter = wasteFilter;
	}


	
	public Predicate buildWhereClause(CriteriaBuilder cb, Root<Wastetransfer> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYearFilter != null){
			Predicate reportingYearSearchWhereClause = reportingYearFilter.buildWhereClauseWastetransfer(cb, qr);
			if (reportingYearSearchWhereClause.getExpressions().size() > 0) {
				whereClause.getExpressions().add(reportingYearSearchWhereClause);
			}
		}
		Predicate locationSearchWhereClause = locationFilter.buildWhereClauseWastetransfer(cb, qr);
		if (locationSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(locationSearchWhereClause);
		}
		Predicate activitySearchWhereClause = activityFilter.buildWhereClauseWastetransfer(cb, qr);
		if (activitySearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(activitySearchWhereClause);
		}
		Predicate wasteSearchWhereClause = wasteFilter.buildWhereClauseWastetransfer(cb, qr);
		if (wasteSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(wasteSearchWhereClause);
		}
		return whereClause;
	}
	
	public Predicate buildWhereClauseWastetransferConfidential(CriteriaBuilder cb, Root<WastetransferConfidential> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYearFilter != null){
			Predicate reportingYearSearchWhereClause = reportingYearFilter.buildWhereClauseWastetransferConfidential(cb, qr);
			if (reportingYearSearchWhereClause.getExpressions().size() > 0) {
				whereClause.getExpressions().add(reportingYearSearchWhereClause);
			}
		}
		Predicate locationSearchWhereClause = locationFilter.buildWhereClauseWastetransferConfidential(cb, qr);
		if (locationSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(locationSearchWhereClause);
		}
		Predicate activitySearchWhereClause = activityFilter.buildWhereClauseWastetransferConfidential(cb, qr);
		if (activitySearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(activitySearchWhereClause);
		}
		Predicate wasteSearchWhereClause = wasteFilter.buildWhereClauseWastetransferConfidential(cb, qr);
		if (wasteSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(wasteSearchWhereClause);
		}
		return whereClause;
	}

	public Predicate buildWhereClauseWastetransferReceivingcountry(CriteriaBuilder cb, Root<WastetransferReceivingcountry> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYearFilter != null){
			Predicate reportingYearSearchWhereClause = reportingYearFilter.buildWhereClauseWastetransferReceivingcountry(cb, qr);
			if (reportingYearSearchWhereClause.getExpressions().size() > 0) {
				whereClause.getExpressions().add(reportingYearSearchWhereClause);
			}
		}
		Predicate locationSearchWhereClause = locationFilter.buildWhereClauseWastetransferReceivingcountry(cb, qr);
		if (locationSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(locationSearchWhereClause);
		}
		Predicate activitySearchWhereClause = activityFilter.buildWhereClauseWastetransferReceivingcountry(cb, qr);
		if (activitySearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(activitySearchWhereClause);
		}
		Predicate wasteSearchWhereClause = wasteFilter.buildWhereClauseWastetransferReceivingcountry(cb, qr);
		if (wasteSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(wasteSearchWhereClause);
		}
		return whereClause;
	}


	public Predicate buildWhereClauseWastetransferHazardoustreater(
			CriteriaBuilder cb, Root<WastetransferHazardoustreater> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYearFilter != null){
			Predicate reportingYearSearchWhereClause = reportingYearFilter.buildWhereClauseWastetransferHazardoustreater(cb, qr);
			if (reportingYearSearchWhereClause.getExpressions().size() > 0) {
				whereClause.getExpressions().add(reportingYearSearchWhereClause);
			}
		}
		Predicate locationSearchWhereClause = locationFilter.buildWhereClauseWastetransferHazardoustreater(cb, qr);
		if (locationSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(locationSearchWhereClause);
		}
		Predicate activitySearchWhereClause = activityFilter.buildWhereClauseWastetransferHazardoustreater(cb, qr);
		if (activitySearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(activitySearchWhereClause);
		}
		Predicate wasteSearchWhereClause = wasteFilter.buildWhereClauseWastetransferHazardoustreater(cb, qr);
		if (wasteSearchWhereClause.getExpressions().size() > 0) {
			whereClause.getExpressions().add(wasteSearchWhereClause);
		}
		return whereClause;
	}

}
