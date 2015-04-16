package eea.eprtr.dao;

public class NumOfCountriesPrYear {

	private final Integer releaseYear;
	private final String countries;
	
	public NumOfCountriesPrYear(Integer releaseYear, String countries) {
		this.releaseYear = releaseYear;
		this.countries = countries;
	}

	public Integer getReleaseYear() {
		return releaseYear;
	}

	public String getCountries() {
		return countries;
	}

}
