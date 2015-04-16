package eea.eprtr.dao;

public class PollutanttransferCompare {

	private final Integer reportingYear;
	private final Long facilitiesAll;
	private final Long facilitiesBoth;
	private final Double quantityAll;
	private final Double quantityBoth;
/*	private final Double accidentalAll;
	private final Double accidentalBoth;
*/

	public PollutanttransferCompare(Integer reportingYear, Long facilitiesAll, Long facilitiesBoth, 
			Double quantityAll, Double quantityBoth) {
		this.reportingYear = reportingYear;
		this.facilitiesAll = facilitiesAll;
		this.facilitiesBoth = facilitiesBoth;
		this.quantityAll = quantityAll;
		this.quantityBoth = quantityBoth;
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

	public Double getQuantityAll() {
		return quantityAll;
	}

	public Double getQuantityBoth() {
		return quantityBoth;
	}
	
}
