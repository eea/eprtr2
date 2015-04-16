package eea.eprtr.dao;

public class PollutanttransferSeries {

	private final Integer releaseYear;
	private final Long facilities;
	private Long countries;
	private final Double quantity;
	
	public PollutanttransferSeries(Integer releaseYear, Long facilities, Double quantity) {
		this.releaseYear = releaseYear;
		this.facilities = facilities;
		//this.countries = countries;
		this.quantity = quantity;
	}

	public Integer getReleaseYear() {
		return releaseYear;
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
