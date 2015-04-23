package eea.eprtr.model;

public class PollutantreleasesSeries {

	private final Integer releaseYear;
	private final Long facilities;
	private Long countries;
	private final Double quantityAir;
	private final Double accidentalAir;
	private final Double quantityWater;
	private final Double accidentalWater;
	private final Double quantitySoil;
	private final Double accidentalSoil;
	
	public PollutantreleasesSeries(Integer releaseYear, Long facilities, Double quantityAir, Double accidentalAir, Double quantityWater, Double accidentalWater, Double quantitySoil, Double accidentalSoil) {
		this.releaseYear = releaseYear;
		this.facilities = facilities;
		//this.countries = countries;
		this.quantityAir = quantityAir;
		this.accidentalAir = accidentalAir;
		this.quantityWater = quantityWater;
		this.accidentalWater = accidentalWater;
		this.quantitySoil = quantitySoil;
		this.accidentalSoil = accidentalSoil;
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

	public Double getQuantityAir() {
		return quantityAir;
	}
	public Double getAccidentalAir() {
		return accidentalAir;
	}
	public Double getQuantityWater() {
		return quantityWater;
	}
	public Double getAccidentalWater() {
		return accidentalWater;
	}
	public Double getQuantitySoil() {
		return quantitySoil;
	}
	public Double getAccidentalSoil() {
		return accidentalSoil;
	}

	
}
