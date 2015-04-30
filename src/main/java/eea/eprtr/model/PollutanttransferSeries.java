package eea.eprtr.model;

public class PollutanttransferSeries {

	private final Integer reportingYear;
	private final Long facilities;
	private Long countries;
	private final Double quantity;
	
	public PollutanttransferSeries(Integer reportingYear, Long facilities, Double quantity) {
		this.reportingYear = reportingYear;
		this.facilities = facilities;
		//this.countries = countries;
		this.quantity = quantity;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public Long getFacilities() {
		return facilities;
	}
	public Long getCountries() {
		return countries;
	}

	public void setCountries(Long countries) {
		this.countries = countries;
	}

	public Double getQuantity() {
		return quantity;
	}
	
}
