package eea.eprtr.model;

public class WastetransferCompare {
	private final Integer reportingYear;
	private final Long facilitiesAll;
	private final Long facilitiesBoth;
	private final Double quantityTotalAll;
	private final Double quantityTotalBoth;
	private final Double quantityRecoveryAll;
	private final Double quantityRecoveryBoth;
	private final Double quantityDisposalAll;
	private final Double quantityDisposalBoth;
	private final Double quantityUnspecAll;
	private final Double quantityUnspecBoth;

	public WastetransferCompare(Integer reportingYear, Long facilitiesAll, Long facilitiesBoth, 
			Double quantityTotalAll, Double quantityTotalBoth, 
			Double quantityRecoveryAll, Double quantityRecoveryBoth,
			Double quantityDisposalAll, Double quantityDisposalBoth, 
			Double quantityUnspecAll, Double quantityUnspecBoth) {
		this.reportingYear = reportingYear;
		this.facilitiesAll = facilitiesAll;
		this.facilitiesBoth = facilitiesBoth;
		this.quantityTotalAll = quantityTotalAll;
		this.quantityTotalBoth = quantityTotalBoth;
		this.quantityRecoveryAll = quantityRecoveryAll;
		this.quantityRecoveryBoth = quantityRecoveryBoth;
		this.quantityDisposalAll = quantityDisposalAll;
		this.quantityDisposalBoth = quantityDisposalBoth;
		this.quantityUnspecAll = quantityUnspecAll;
		this.quantityUnspecBoth = quantityUnspecBoth;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public Long getFacilitiesAll() {
		return facilitiesAll;
	}

	public Long getFacilitiesBoth() {
		return facilitiesBoth;
	}

	public Double getQuantityTotalAll() {
		return quantityTotalAll;
	}

	public Double getQuantityTotalBoth() {
		return quantityTotalBoth;
	}
	
	public Double getQuantityRecoveryAll() {
		return quantityRecoveryAll;
	}
	
	public Double getQuantityRecoveryBoth() {
		return quantityRecoveryBoth;
	}

	public Double getQuantityDisposalAll() {
		return quantityDisposalAll;
	}

	public Double getQuantityDisposalBoth() {
		return quantityDisposalBoth;
	}
	
	public Double getQuantityUnspecAll() {
		return quantityUnspecAll;
	}
	
	public Double getQuantityUnspecBoth() {
		return quantityUnspecBoth;
	}

}
