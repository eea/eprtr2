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
import eea.eprtr.model.WastetransferHazardoustreater;
import eea.eprtr.model.WastetransferHazardoustreater_;
import eea.eprtr.model.WastetransferReceivingcountry;
import eea.eprtr.model.WastetransferReceivingcountry_;
import eea.eprtr.model.Wastetransfer_;

public class FacilityItemSearchFilter {

	private Integer facilityReportID;
	private Integer facilityID;
	private Integer reportingYear;

	public FacilityItemSearchFilter(
			Integer facilityReportID,
			Integer facilityID,
			Integer reportingYear
) {
		this.facilityReportID = facilityReportID;
		this.facilityID = facilityID;
		this.reportingYear = reportingYear;
	}
	
	public Integer getFacilityReportID(){
		return facilityReportID;
	}

	public Predicate buildWhereClauseFacilitySearch(CriteriaBuilder cb, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.conjunction();
		if (facilityReportID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.facilityReportID), facilityReportID));
		} else if (facilityID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.facilityID), facilityID));
			if (reportingYear != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.reportingYear), reportingYear));
			}
		}
		return whereClause;
	}
	
	public Predicate buildWhereClausePollutantrelease(CriteriaBuilder cb, Root<Pollutantrelease> qr) {
		Predicate whereClause = cb.conjunction();
		if (facilityReportID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.facilityReportID), facilityReportID));
		} else if (facilityID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.facilityID), facilityID));
			if (reportingYear != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(Pollutantrelease_.reportingYear), reportingYear));
			}
		}
		return whereClause;
	}
	
	public Predicate buildWhereClausePollutanttransfer(CriteriaBuilder cb, Root<Pollutanttransfer> qr) {
		Predicate whereClause = cb.conjunction();
		if (facilityReportID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutanttransfer_.facilityReportID), facilityReportID));
		} else if (facilityID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Pollutanttransfer_.facilityID), facilityID));
			if (reportingYear != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(Pollutanttransfer_.reportingYear), reportingYear));
			}
		}
		return whereClause;
	}
	
	public Predicate buildWhereClauseWastetransfer(CriteriaBuilder cb, Root<Wastetransfer> qr) {
		Predicate whereClause = cb.conjunction();
		if (facilityReportID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.facilityReportID), facilityReportID));
		} else if (facilityID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.facilityID), facilityID));
			if (reportingYear != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.reportingYear), reportingYear));
			}
		}
		return whereClause;
	}

	public Predicate buildWhereClauseWastetransferConfidential(
			CriteriaBuilder cb, Root<WastetransferConfidential> qr) {
		Predicate whereClause = cb.conjunction();
		if (facilityReportID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.facilityReportID), facilityReportID));
		}
		return whereClause;
	}

	public Predicate buildWhereClauseWastetransferReceivingcountry(
			CriteriaBuilder cb, Root<WastetransferReceivingcountry> qr) {
		Predicate whereClause = cb.conjunction();
		if (facilityReportID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.facilityReportID), facilityReportID));
		} else if (facilityID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.facilityID), facilityID));
			if (reportingYear != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.reportingYear), reportingYear));
			}
		}
		return whereClause;
	}

	public Predicate buildWhereClauseWastetransferHazardoustreater(
			CriteriaBuilder cb, Root<WastetransferHazardoustreater> qr) {
	Predicate whereClause = cb.conjunction();
	if (facilityReportID != null) {
		whereClause.getExpressions().add(cb.equal(qr.get(WastetransferHazardoustreater_.facilityReportID), facilityReportID));
	} else if (facilityID != null) {
		whereClause.getExpressions().add(cb.equal(qr.get(WastetransferHazardoustreater_.facilityID), facilityID));
		if (reportingYear != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(WastetransferHazardoustreater_.reportingYear), reportingYear));
		}
	}
	return whereClause;	}
	
}
