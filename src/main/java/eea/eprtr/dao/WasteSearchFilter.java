package eea.eprtr.dao;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;

import eea.eprtr.model.FacilitySearchAll;
import eea.eprtr.model.FacilitySearchAll_;
import eea.eprtr.model.Wastetransfer;
import eea.eprtr.model.WastetransferConfidential;
import eea.eprtr.model.WastetransferConfidential_;
import eea.eprtr.model.WastetransferHazardoustreater;
import eea.eprtr.model.WastetransferHazardoustreater_;
import eea.eprtr.model.WastetransferReceivingcountry;
import eea.eprtr.model.WastetransferReceivingcountry_;
import eea.eprtr.model.Wastetransfer_;


public class WasteSearchFilter {

	@Autowired
	private LovPollutantRepository lovPollutantRepository;

	private List<String> wasteTypeCode;
	private List<String> wasteTreatmentCode;
	private String whpCountryCode;
	private Integer confidentialIndicatorNONHW;
	private Integer confidentialIndicatorHWIC;
	private Integer confidentialIndicatorHWOC;
	private Integer confidentialIndicator;
	private Integer hasReportedRecovery;
	private Integer hasReportedDisposal;
	private Integer hasReportedUnspecified;
	
	public WasteSearchFilter(List<String> wasteTypeCode, List<String> wasteTreatmentCode, String whpCountryCode, Integer confidentialIndicator) {
		this.wasteTypeCode = wasteTypeCode;
		this.wasteTreatmentCode = wasteTreatmentCode;
		this.whpCountryCode = whpCountryCode;
		this.confidentialIndicator = confidentialIndicator;
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
		if (whpCountryCode != null) {
			whereClause.getExpressions().add(cb.equal(qr.get(FacilitySearchAll_.WHPCountryCode), whpCountryCode));
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
		if (whpCountryCode != null) {
			//whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.whpCountryCode), whpCountryCode));
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
		if(confidentialIndicator !=null)
		{
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.confidentialIndicatorNONHW),confidentialIndicator));
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.confidentialIndicatorHWIC),confidentialIndicator));
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.confidentialIndicatorHWOC),confidentialIndicator));
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
/*			if (whpCountryCode != null) {
				//whereClause.getExpressions().add(cb.equal(qr.get(Wastetransfer_.whpCountryCode), whpCountryCode));
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
	public Predicate buildWhereClauseWastetransferReceivingcountry(CriteriaBuilder cb, Root<WastetransferReceivingcountry> qr) {
		Predicate whereClause = cb.conjunction();
/*		if (wasteTypeCode != null) {
			Predicate wasteTypeWhereClause = cb.disjunction();
			for(String code : wasteTypeCode)
			{
				switch (code) {
					case "NONHW":
						wasteTypeWhereClause.getExpressions().add(cb.greaterThan(qr.get(WastetransferReceivingcountry_. quantityTotalNONHW), 0.0));
						break;
					case "HWIC":
						wasteTypeWhereClause.getExpressions().add(cb.greaterThan(qr.get(WastetransferReceivingcountry_.quantityTotalHWIC), 0.0));
						break;
					case "HWOC":
						wasteTypeWhereClause.getExpressions().add(cb.greaterThan(qr.get(WastetransferReceivingcountry_.quantityTotalHWOC), 0.0));
						break;
					case "HW":
						wasteTypeWhereClause.getExpressions().add(cb.or(cb.greaterThan(qr.get(WastetransferReceivingcountry_.quantityTotalNONHW), 0.0)
								,cb.greaterThan(qr.get(WastetransferReceivingcountry_.quantityTotalNONHW), 0.0)));
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
			
		}*/
		if (wasteTreatmentCode != null) {
			for(String code : wasteTreatmentCode)
			{
				switch (code.toUpperCase()) {
					case "R":
						whereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.hasReportedRecovery), 0));
						break;
					case "U":
						whereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.hasReportedUnspecified), 0));
						break;
					case "D":
						whereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.hasReportedDisposal), 0));
						break;
					default:
						break;
				}
			}
		}
		if (whpCountryCode != null) {
			//whereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.whpCountryCode), whpCountryCode));
		}
		Predicate confidentialWhereClause = cb.disjunction();
		/*if(confidentialIndicatorNONHW !=null)
		{
			//cb.or(
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.confidentialIndicatorNONHW),confidentialIndicatorNONHW));
		}
		if(confidentialIndicatorHWIC !=null)
		{
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.confidentialIndicatorHWIC),confidentialIndicatorHWIC));
		}
		if(confidentialIndicatorHWOC !=null)
		{
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.confidentialIndicatorHWOC),confidentialIndicatorHWOC));
		}*/
		if(confidentialIndicator !=null)
		{
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.confidentialIndicator),confidentialIndicator));
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.confidentialIndicatorFacility),confidentialIndicator));
		}
		Predicate confidentialReportedWhereClause = cb.disjunction();
		if(hasReportedRecovery !=null)
		{
			confidentialReportedWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.hasReportedRecovery),hasReportedRecovery));
		}
		if(hasReportedDisposal !=null)
		{
			confidentialReportedWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.hasReportedDisposal),hasReportedDisposal));
		}
		if(hasReportedUnspecified !=null)
		{
			confidentialReportedWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferReceivingcountry_.hasReportedUnspecified),hasReportedUnspecified));
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
	public Predicate buildWhereClauseWastetransferHazardoustreater(
			CriteriaBuilder cb, Root<WastetransferHazardoustreater> qr) {
		Predicate whereClause = cb.conjunction();
		Predicate confidentialWhereClause = cb.disjunction();
		if (whpCountryCode != null) {
			/*LovPollutant pol = lovPollutantRepository.getPollutant(whpCountryCode);
			//if (pol != null) {
				whereClause.getExpressions().add(cb.equal(qr.get(WastetransferHazardoustreater_.whpCountryCode), pol.getCode()));
			}*/
			whereClause.getExpressions().add(cb.equal(qr.get(WastetransferHazardoustreater_.WHPCountryCode), whpCountryCode));
		}
		if(confidentialIndicator !=null)
		{
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferHazardoustreater_.confidentialIndicator),confidentialIndicator));
			confidentialWhereClause.getExpressions().add(cb.equal(qr.get(WastetransferHazardoustreater_.confidentialIndicatorFacility),confidentialIndicator));
		}
		Predicate confidentialReportedWhereClause = cb.disjunction();
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
}
