package eea.eprtr.model;

public class TransboundaryHazardousWasteData {
	private final Integer reportingYear;
	private final Integer facilities;
	private final String transferto;
	private final String transferfrom;
	private final Double quantityTotal;
	private final Double quantityRecovery;
	private final Double quantityDisposal;
	private final Double quantityUnspec;

	public TransboundaryHazardousWasteData(Integer reportingYear, Integer facilities, String transferTo, String transferFrom, 
			Double quantityTotal, Double quantityRecovery, Double quantityDisposal, 
			Double quantityUnspec) {
		this.reportingYear = reportingYear;
		this.facilities = facilities;
		this.transferto = transferTo;
		this.transferfrom = transferFrom;
		this.quantityTotal = quantityTotal;
		this.quantityRecovery = quantityRecovery;
		this.quantityDisposal = quantityDisposal;
		this.quantityUnspec = quantityUnspec;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public Integer getFacilities() {
		return facilities;
	}

	public String getTransferTo(){
		return transferto;
	}

	public String getTransferFrom(){
		return transferfrom;
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
