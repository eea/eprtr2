package eea.eprtr.model;

public class NumOfCountriesPrYear {

	private final Integer reportingYear;
	private final String countries;
	
	public NumOfCountriesPrYear(Integer reportingYear, String countries) {
		this.reportingYear = reportingYear;
		this.countries = countries;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public String getCountries() {
		return countries;
	}

}
