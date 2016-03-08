package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the LOV_COUNTRY database table.
 *
 */
@Entity
@Table(name="LOV_COUNTRY")
@NamedQuery(name="LovCountry.findByCountryCode", query="SELECT l FROM LovCountry l where l.countryCode = :CountryCode")
public class LovCountry implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name="Code")
    private String countryCode;

    @Column(name="EndYear")
    private Integer endYear;

    @Id
    private Integer LOV_CountryID;

    @Column(name="Name")
    private String countryName;

    @Column(name="StartYear")
    private Integer startYear;

    public LovCountry() {
    }

    public String getCountryCode() {
        return this.countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public Integer getEndYear() {
        return this.endYear;
    }

    public void setEndYear(Integer endYear) {
        this.endYear = endYear;
    }

    public Integer getLOV_CountryID() {
        return this.LOV_CountryID;
    }

    public void setLOV_CountryID(Integer LOV_CountryID) {
        this.LOV_CountryID = LOV_CountryID;
    }

    public String getCountryName() {
        return this.countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public Integer getStartYear() {
        return this.startYear;
    }

    public void setStartYear(Integer startYear) {
        this.startYear = startYear;
    }

}
