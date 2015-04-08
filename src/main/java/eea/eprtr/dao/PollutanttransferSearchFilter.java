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
	
	public PollutanttransferSearchFilter(ReportingYearSearchFilter reportingYearFilter,
			LocationSearchFilter locationFilter, ActivitySearchFilter activityFilter, PollutantSearchFilter pollutantFilter) {
			this.reportingYearFilter = reportingYearFilter;
			this.locationFilter = locationFilter;
			this.activityFilter = activityFilter;
			this.pollutantFilter = pollutantFilter;
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
