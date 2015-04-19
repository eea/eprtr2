package eea.eprtr.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.WastetransferConfidential;

public class WasteTransferConfidentialSearchFilter {
	private ReportingYearSearchFilter reportingYearFilter;
	
	public WasteTransferConfidentialSearchFilter(ReportingYearSearchFilter reportingYearFilter)
	{
		this.reportingYearFilter = reportingYearFilter;
	}
	
	public Predicate buildWhereClause(CriteriaBuilder cb, Root<WastetransferConfidential> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYearFilter != null){
			Predicate reportingYearSearchWhereClause = reportingYearFilter.buildWhereClauseWastetransferConfidential(cb, qr);
			if (reportingYearSearchWhereClause.getExpressions().size() > 0) {
				whereClause.getExpressions().add(reportingYearSearchWhereClause);
			}
		}
		return whereClause;
	}
}
