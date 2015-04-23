package eea.eprtr.model;

public class WasteTransferConfidentialTS {
    
	private final Integer reportingYear;
	private final Integer countTotal;
	private final Integer countConfTotal;
	private final Integer countConfQuantity;
	private final Integer countConfTreatment;

	public WasteTransferConfidentialTS(Integer reportingYear, Integer countTotal, Integer countConfTotal, Integer countConfQuantity, Integer countConfTreatment) {
		this.reportingYear = reportingYear;
		this.countTotal = countTotal;
		this.countConfTotal = countConfTotal;
		this.countConfQuantity = countConfQuantity;
		this.countConfTreatment = countConfTreatment;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public Integer getCountTotal() {
		return countTotal;
	}

	public Integer getCountConfTotal() {
		return countConfTotal;
	}

	public Integer getCountConfQuantity() {
		return countConfQuantity;
	}

	public Integer getCountConfTreatment() {
		return countConfTreatment;
	}

    
}
