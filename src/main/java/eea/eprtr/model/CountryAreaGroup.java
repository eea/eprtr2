package eea.eprtr.model;

import java.io.Serializable;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.NamedQuery;
import javax.persistence.QueryHint;
import javax.persistence.Table;


/**
 * The persistent class for the LOV_COUNTRYAREAGROUP database table.
 *
 */
@Entity
@IdClass(CountryAreaGroupID.class)
@Cacheable(true)
@Table(name="LOV_COUNTRYAREAGROUP")
@NamedQuery(
        name = "CountryAreaGroup.findCountryIDsByAreaGroupID", query="SELECT l.LOV_CountryID FROM CountryAreaGroup l where l.LOV_AreaGroupID = :LOV_AreaGroupID",
        hints =  { @QueryHint(name = "org.hibernate.cacheable", value = "true") }
)
public class CountryAreaGroup implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(nullable=false)
    private int LOV_AreaGroupID;

    @Id
    @Column(nullable=false)
    private int LOV_CountryID;

    public CountryAreaGroup() {
    }

    public int getLOV_AreaGroupID() {
        return this.LOV_AreaGroupID;
    }

    public void setLOV_AreaGroupID(int LOV_AreaGroupID) {
        this.LOV_AreaGroupID = LOV_AreaGroupID;
    }

    public int getLOV_CountryID() {
        return this.LOV_CountryID;
    }

    public void setLOV_CountryID(int LOV_CountryID) {
        this.LOV_CountryID = LOV_CountryID;
    }

}
