package eea.eprtr.dao;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;
import eea.eprtr.model.Pollutantrelease;
import eea.eprtr.model.Pollutantrelease_;
import eea.eprtr.model.Pollutanttransfer;
import eea.eprtr.model.Pollutanttransfer_;
import eea.eprtr.model.Wastetransfer;
import eea.eprtr.model.WastetransferConfidential;
import eea.eprtr.model.WastetransferConfidential_;
import eea.eprtr.model.Wastetransfer_;


public class ReportingYearSearchFilter {
	
	private Integer reportingYear;

	public ReportingYearSearchFilter(Integer reportingYear) {
		this.reportingYear = reportingYear;
	}

	public Predicate buildWhereClause(CriteriaBuilder cb, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYear != null){
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.reportingYear), reportingYear));
		}
		else{
			whereClause.getExpressions().add(cb.greaterThan(qr.get(FacilitySearchAll_.reportingYear),2006));
		}
		return whereClause;
	}
	
	public Predicate buildWhereClausePollutantrelease(CriteriaBuilder cb, Root<Pollutantrelease> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYear != null){
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.reportingYear), reportingYear));
		}
		else{
			whereClause.getExpressions().add(cb.greaterThan(qr.get(Pollutantrelease_.reportingYear),2006));
		}
		return whereClause;
	}
	
	public Predicate buildWhereClausePollutanttransfer(CriteriaBuilder cb, Root<Pollutanttransfer> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYear != null){
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutanttransfer_.reportingYear), reportingYear));
		}
		else{
			whereClause.getExpressions().add(cb.greaterThan(qr.get(Pollutanttransfer_.reportingYear),2006));
		}
		return whereClause;
	}
	
	public Predicate buildWhereClauseWastetransfer(CriteriaBuilder cb, Root<Wastetransfer> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYear != null){
			whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.reportingYear), reportingYear));
		}
		else{
			whereClause.getExpressions().add(cb.greaterThan(qr.get(Wastetransfer_.reportingYear),2006));
		}
		return whereClause;
	}
	
	public Predicate buildWhereClauseWastetransferConfidential(CriteriaBuilder cb, Root<WastetransferConfidential> qr) {
		Predicate whereClause = cb.conjunction();
		if (reportingYear != null){
			whereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.reportingYear), reportingYear));
		}
		else{
			whereClause.getExpressions().add(cb.greaterThan(qr.get(WastetransferConfidential_.reportingYear),2006));
		}
		return whereClause;
	}
}
