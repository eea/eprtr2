package eea.eprtr.dao;

import eea.eprtr.model.WasteType;

public class WastetransferSeries {

	private final Integer reportingYear;
	private final Long facilities;
	private WasteType wasteType;
	private Long countries;
	private final Double quantityTotal;
	private final Double quantityRecovery;
	private final Double quantityDisposal;
	private final Double quantityUnspec;
	
	public WastetransferSeries(Integer reportingYear, Long facilities, Double quantityTotal, Double quantityRecovery, Double quantityDisposal, Double quantityUnspec) {
		this.reportingYear = reportingYear;
		this.facilities = facilities;
		this.quantityTotal = quantityTotal;
		this.quantityRecovery = quantityRecovery;
		this.quantityDisposal = quantityDisposal;
		this.quantityUnspec = quantityUnspec;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public Long getFacilities() {
		return facilities;
	}

	public WasteType getWasteType() {
		return wasteType;
	}

	public void setWasteType(WasteType wasteType) {
		this.wasteType = wasteType;
	}

	public Long getCountries() {
		return countries;
	}

	public void setCountries(Long countries) {
		this.countries = countries;
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

}
