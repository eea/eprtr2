package eea.eprtr.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.Wastetransfer;

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
}
