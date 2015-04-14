package eea.eprtr.dao;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;
import eea.eprtr.model.Pollutantrelease_;
import eea.eprtr.model.Wastetransfer;
import eea.eprtr.model.Wastetransfer_;

public class WasteSearchFilter {

	private List<String> wasteTypeCode;
	private List<String> wasteTreatmentCode;
	private Integer whpCountryID;

	public WasteSearchFilter(List<String> wasteTypeCode, List<String> wasteTreatmentCode, Integer whpCountryID) {
		this.wasteTypeCode = wasteTypeCode;
		this.wasteTreatmentCode = wasteTreatmentCode;
		this.whpCountryID = whpCountryID;
	}
	
	public Predicate buildWhereClause(CriteriaBuilder cb, Root<FacilitySearchAll> qr) {
		Predicate whereClause = cb.conjunction();
		if (wasteTypeCode != null) {
			whereClause.getExpressions().add(qr.get(FacilitySearchAll_.wasteTypeCode).in(wasteTypeCode));
		}
		if (wasteTreatmentCode != null) {
			whereClause.getExpressions().add(qr.get(FacilitySearchAll_.wasteTreatmentCode).in(wasteTreatmentCode));
		}
		if (whpCountryID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.WHPCountryID), whpCountryID));
		}
		return whereClause;
	}
	
	public Predicate buildWhereClauseWastetransfer(CriteriaBuilder cb, Root<Wastetransfer> qr) {
		Predicate whereClause = cb.conjunction();
		if (wasteTypeCode != null) {
		//	whereClause.getExpressions().add(qr.get(Wastetransfer_.wasteTypeCode).in(wasteTypeCode));
		}
		if (wasteTreatmentCode != null) {
			for(String code : wasteTreatmentCode)
			{
				switch (code.toUpperCase()) {
					case "R":
						whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.hasReportedRecovery), 0));
						break;
					case "U":
						whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.hasReportedUnspecified), 0));
						break;
					case "D":
						whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.hasReportedDisposal), 0));
						break;
					default:
						break;
				}
			}
		}
		if (whpCountryID != null) {
			//whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.WHPCountryID), whpCountryID));
		}
		return whereClause;
	}
}
