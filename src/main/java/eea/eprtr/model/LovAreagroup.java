package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the LOV_AREAGROUP database table.
 *
 */
@Entity
@Table(name="LOV_AREAGROUP")
@NamedQuery(name="LovAreagroup.findAll", query="SELECT l FROM LovAreagroup l")
public class LovAreagroup implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name="Code")
    private String code;

    @Id
    private Integer LOV_AreaGroupID;

    @Column(name="Name")
    private String name;

    public LovAreagroup() {
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getLOV_AreaGroupID() {
        return this.LOV_AreaGroupID;
    }

    public void setLOV_AreaGroupID(Integer LOV_AreaGroupID) {
        this.LOV_AreaGroupID = LOV_AreaGroupID;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
