package eea.eprtr.dao;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;
import eea.eprtr.model.Wastetransfer;
import eea.eprtr.model.WastetransferConfidential;
import eea.eprtr.model.WastetransferConfidential_;
import eea.eprtr.model.Wastetransfer_;

public class WasteSearchFilter {

	private List<String> wasteTypeCode;
	private List<String> wasteTreatmentCode;
	private Integer whpCountryID;
	private Integer confidentialIndicatorNONHW;
	private Integer confidentialIndicatorHWIC;
	private Integer confidentialIndicatorHWOC;
	private Integer hasReportedRecovery;
	private Integer hasReportedDisposal;
	private Integer hasReportedUnspecified;
	
	public WasteSearchFilter(List<String> wasteTypeCode, List<String> wasteTreatmentCode, Integer whpCountryID) {
		this.wasteTypeCode = wasteTypeCode;
		this.wasteTreatmentCode = wasteTreatmentCode;
		this.whpCountryID = whpCountryID;
	}
	public WasteSearchFilter(Integer confidentialIndicatorNONHW, Integer confidentialIndicatorHWIC,Integer confidentialIndicatorHWOC,
			Integer hasReportedRecovery, Integer hasReportedDisposal, Integer hasReportedUnspecified) {
		this.confidentialIndicatorNONHW = confidentialIndicatorNONHW;
		this.confidentialIndicatorHWIC = confidentialIndicatorHWIC;
		this.confidentialIndicatorHWOC = confidentialIndicatorHWOC;
		this.hasReportedRecovery = hasReportedRecovery;
		this.hasReportedDisposal = hasReportedDisposal;
		this.hasReportedUnspecified = hasReportedUnspecified;
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
			Predicate wasteTypeWhereClause = cb.disjunction();
			for(String code : wasteTypeCode)
			{
				switch (code) {
					case "NONHW":
						wasteTypeWhereClause.getExpressions().add(cb.greaterThan(qr.get(Wastetransfer_.quantityTotalNONHW), 0.0));
						break;
					case "HWIC":
						wasteTypeWhereClause.getExpressions().add(cb.greaterThan(qr.get(Wastetransfer_.quantityTotalHWIC), 0.0));
						break;
					case "HWOC":
						wasteTypeWhereClause.getExpressions().add(cb.greaterThan(qr.get(Wastetransfer_.quantityTotalHWOC), 0.0));
						break;
					case "HW":
						wasteTypeWhereClause.getExpressions().add(cb.or(cb.greaterThan(qr.get(Wastetransfer_.quantityTotalNONHW), 0.0)
								,cb.greaterThan(qr.get(Wastetransfer_.quantityTotalNONHW), 0.0)));
						break;
					default:
						break;
				}
			}
			if (wasteTypeWhereClause.getExpressions().size() > 0) {
				whereClause.getExpressions().add(wasteTypeWhereClause);
			} else {
				whereClause.getExpressions().add(cb.or());
			}

			
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
		Predicate confidentialWhereClause = cb.disjunction();
		if(confidentialIndicatorNONHW !=null)
		{
			//cb.or(
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.confidentialIndicatorNONHW),confidentialIndicatorNONHW));
		}
		if(confidentialIndicatorHWIC !=null)
		{
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.confidentialIndicatorHWIC),confidentialIndicatorHWIC));
		}
		if(confidentialIndicatorHWOC !=null)
		{
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.confidentialIndicatorHWOC),confidentialIndicatorHWOC));
		}
		Predicate confidentialReportedWhereClause = cb.disjunction();
		if(hasReportedRecovery !=null)
		{
			confidentialReportedWhereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.hasReportedRecovery),hasReportedRecovery));
		}
		if(hasReportedDisposal !=null)
		{
			confidentialReportedWhereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.hasReportedDisposal),hasReportedDisposal));
		}
		if(hasReportedUnspecified !=null)
		{
			confidentialReportedWhereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.hasReportedUnspecified),hasReportedUnspecified));
		}
		if(confidentialWhereClause.getExpressions().size() > 0)
		{
			whereClause.getExpressions().add(confidentialWhereClause);
		}
		if(confidentialReportedWhereClause.getExpressions().size() > 0)
		{
			whereClause.getExpressions().add(confidentialReportedWhereClause);
		}
		
		
		return whereClause;
	}
	public Predicate buildWhereClauseWastetransferConfidential(
			CriteriaBuilder cb, Root<WastetransferConfidential> qr) {
			Predicate whereClause = cb.conjunction();
			if (wasteTypeCode != null) {
			//	whereClause.getExpressions().add(qr.get(Wastetransfer_.wasteTypeCode).in(wasteTypeCode));
			}
			if (wasteTreatmentCode != null) {
				for(String code : wasteTreatmentCode)
				{
					switch (code.toUpperCase()) {
						case "R":
							whereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.hasReportedRecovery), 0));
							break;
						case "U":
							whereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.hasReportedUnspecified), 0));
							break;
						case "D":
							whereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.hasReportedDisposal), 0));
							break;
						default:
							break;
					}
				}
			}
/*			if (whpCountryID != null) {
				//whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.WHPCountryID), whpCountryID));
			}
			Predicate confidentialWhereClause = cb.disjunction();
			if(confidentialIndicatorNONHW !=null)
			{
				//cb.or(
				confidentialWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.confidentialIndicatorNONHW),confidentialIndicatorNONHW));
			}
			if(confidentialIndicatorHWIC !=null)
			{
				confidentialWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.confidentialIndicatorHWIC),confidentialIndicatorHWIC));
			}
			if(confidentialIndicatorHWOC !=null)
			{
				confidentialWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.confidentialIndicatorHWOC),confidentialIndicatorHWOC));
			}*/
			Predicate confidentialReportedWhereClause = cb.disjunction();
			if(hasReportedRecovery !=null)
			{
				confidentialReportedWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.hasReportedRecovery),hasReportedRecovery));
			}
			if(hasReportedDisposal !=null)
			{
				confidentialReportedWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.hasReportedDisposal),hasReportedDisposal));
			}
			if(hasReportedUnspecified !=null)
			{
				confidentialReportedWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferConfidential_.hasReportedUnspecified),hasReportedUnspecified));
			}
			/*if(confidentialWhereClause.getExpressions().size() > 0)
			{
				whereClause.getExpressions().add(confidentialWhereClause);
			}*/
			if(confidentialReportedWhereClause.getExpressions().size() > 0)
			{
				whereClause.getExpressions().add(confidentialReportedWhereClause);
			}
			
			
			return whereClause;
	}
}
