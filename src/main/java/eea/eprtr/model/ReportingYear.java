package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the REPORTINGYEAR database table.
 * 
 */
@Entity
@Table(name="REPORTINGYEAR")
@NamedQuery(name="ReportingYear.findAll", query="SELECT r FROM ReportingYear r")
public class ReportingYear implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="Countries")
	private int countries;

	@Id
	@Column(name="Year")
	private int year;

	public ReportingYear() {
	}

	public int getCountries() {
		return this.countries;
	}

	public void setCountries(int countries) {
		this.countries = countries;
	}

	public int getYear() {
		return this.year;
	}

	public void setYear(int year) {
		this.year = year;
	}

}