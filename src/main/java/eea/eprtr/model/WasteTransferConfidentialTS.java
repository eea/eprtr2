package eea.eprtr.model;

public class WasteTransferConfidentialTS {
    
	private final Integer reportingYear;
	private long countTotal;
	private  long countConfTotal;
	private  long countConfQuantity;
	private  long countConfTreatment;

	public WasteTransferConfidentialTS(Integer reportingYear, long countConfTotal, long countConfQuantity, long countConfTreatment) {
		this.reportingYear = reportingYear;
		this.countConfTotal = countConfTotal;
		this.countConfQuantity = countConfQuantity;
		this.countConfTreatment = countConfTreatment;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public long getCountTotal() {
		return countTotal;
	}

	public void setCountTotal(long countTotal) {
		this.countTotal = countTotal;
	}

	public long getCountConfTotal() {
		return countConfTotal;
	}

	public void setCountConfTotal(long countConfTotal) {
		this.countConfTotal = countConfTotal;
	}

	public long getCountConfQuantity() {
		return countConfQuantity;
	}

	public void setCountConfQuantity(long countConfQuantity) {
		this.countConfQuantity = countConfQuantity;
	}

	public long getCountConfTreatment() {
		return countConfTreatment;
	}

	public void setCountConfTreatment(long countConfTreatment) {
		this.countConfTreatment = countConfTreatment;
	}

    
}
