package eea.eprtr.model;

public class PollutantreleaseCompare {
	
	private final Integer reportingYear;
	private final Long facilitiesAll;
	private final Long facilitiesBoth;
	private final Double quantityAll;
	private final Double quantityBoth;
	private final Double accidentalAll;
	private final Double accidentalBoth;
/*	private final Double quantityWaterAll;
	private final Double quantityWaterBoth;
	private final Double accidentalWaterAll;
	private final Double accidentalWaterBoth;
	private final Double quantitySoilAll;
	private final Double quantitySoilBoth;
	private final Double accidentalSoilAll;
	private final Double accidentalSoilBoth;*/

	public PollutantreleaseCompare(Integer reportingYear, Long facilitiesAll, Long facilitiesBoth, 
			Double quantityAll, Double quantityBoth, Double accidentalAll, Double accidentalBoth) {
		this.reportingYear = reportingYear;
		this.facilitiesAll = facilitiesAll;
		this.facilitiesBoth = facilitiesBoth;
		this.quantityAll = quantityAll;
		this.quantityBoth = quantityBoth;
		this.accidentalAll = accidentalAll;
		this.accidentalBoth = accidentalBoth;
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
	
	public Double getAccidentalAll() {
		return accidentalAll;
	}
	
	public Double getAccidentalBoth() {
		return accidentalBoth;
	}

}
