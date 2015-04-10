package eea.eprtr.dao;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;

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
			whereClause.getExpressions().add(cb.not(qr.get(FacilitySearchAll_.wasteTypeCode).in(wasteTypeCode)));
		}
		if (wasteTreatmentCode != null) {
			whereClause.getExpressions().add(cb.not(qr.get(FacilitySearchAll_.wasteTreatmentCode).in(wasteTreatmentCode)));
		}
		if (whpCountryID != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.WHPCountryID), whpCountryID));
		}
		return whereClause;
	}
}
