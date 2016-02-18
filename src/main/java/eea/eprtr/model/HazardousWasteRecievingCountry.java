
package eea.eprtr.model;

public class HazardousWasteRecievingCountry {
	private final Integer reportingYear;
	private final Integer facilities;
	private final String recievingCountryCode;
	private final Double quantityTotal;
	private final Double quantityRecovery;
	private final Double quantityDisposal;
	private final Double quantityUnspec;
	private String quantityCommonUnit;
//	private Boolean showAsLink;

	public HazardousWasteRecievingCountry(Integer reportingYear, Integer facilities, String recievingCountryCode,
			Double quantityTotal, Double quantityRecovery, Double quantityDisposal, 
			Double quantityUnspec, String unitCode) {
		this.reportingYear = reportingYear;
		this.facilities = facilities;
		this.recievingCountryCode = recievingCountryCode;
		this.quantityTotal = quantityTotal;
		this.quantityRecovery = quantityRecovery;
		this.quantityDisposal = quantityDisposal;
		this.quantityUnspec = quantityUnspec;
		this.quantityCommonUnit = unitCode;
		//this.showAsLink = showAsLink;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public Integer getFacilities() {
		return facilities;
	}

	public String getRecievingCountryCode(){
		return recievingCountryCode;
	}

	public Double getQuantityTotal() {
		return quantityTotal;
	}

	public Double getQuantityRecovery() {
		return quantityRecovery;
	}
	
	public Double getQuantityDisposal() {
		return quantityDisposal;
	}

	public Double getQuantityUnspec() {
		return quantityUnspec;
	}

	public String getQuantityCommonUnit() {
		return quantityCommonUnit;
	}

	public void setQuantityCommonUnit(String quantityCommonUnit) {
		this.quantityCommonUnit = quantityCommonUnit;
	}

	public Boolean getShowAsLink() {
		return (recievingCountryCode == null)?false:true;//showAsLink;
	}
	
}
