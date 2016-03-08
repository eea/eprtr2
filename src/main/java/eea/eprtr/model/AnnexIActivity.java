package eea.eprtr.model;

import java.io.Serializable;

import javax.persistence.*;


/**
 * The persistent class for the LOV_ANNEXIACTIVITY database table.
 *
 */
@Entity
@Table(name="LOV_ANNEXIACTIVITY")
@Cacheable(true)
@NamedQueries({
        @NamedQuery(
                name = "AnnexIActivity.findRootActivities", query = "SELECT l FROM AnnexIActivity l where parentID is null and startYear >= :startYearEPRTR",
                hints = { @QueryHint(name = "org.hibernate.cacheable", value = "true") }
                ),
        @NamedQuery(
                name = "AnnexIActivity.findActivities", query = "SELECT l FROM AnnexIActivity l where parentID = :parentID and startYear >= :startYearEPRTR",
                hints = { @QueryHint(name = "org.hibernate.cacheable", value = "true") }
                )
        })
public class AnnexIActivity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name="Code")
    private String code;

    @Column(name="EndYear")
    private Integer endYear;

    private Integer eperAnnex3_ID;

    private String IPPCCode;

    @Id
    private int LOV_AnnexIActivityID;

    @Column(name="Name")
    private String name;

    @Column(name="ParentID")
    private Integer parentID;

    @Column(name="StartYear")
    private Integer startYear;

    public AnnexIActivity() {
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getEndYear() {
        return this.endYear;
    }

    public void setEndYear(Integer endYear) {
        this.endYear = endYear;
    }

    public Integer getEperAnnex3_ID() {
        return this.eperAnnex3_ID;
    }

    public void setEperAnnex3_ID(Integer eperAnnex3_ID) {
        this.eperAnnex3_ID = eperAnnex3_ID;
    }

    public String getIPPCCode() {
        return this.IPPCCode;
    }

    public void setIPPCCode(String IPPCCode) {
        this.IPPCCode = IPPCCode;
    }

    public int getLOV_AnnexIActivityID() {
        return this.LOV_AnnexIActivityID;
    }

    public void setLOV_AnnexIActivityID(int LOV_AnnexIActivityID) {
        this.LOV_AnnexIActivityID = LOV_AnnexIActivityID;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getParentID() {
        return this.parentID;
    }

    public void setParentID(Integer parentID) {
        this.parentID = parentID;
    }

    public Integer getStartYear() {
        return this.startYear;
    }

    public void setStartYear(Integer startYear) {
        this.startYear = startYear;
    }

}
