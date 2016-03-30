package eea.eprtr.model;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.*;


/**
 * The persistent class for the FACILITYDETAIL_POLLUTANTRELEASE database table.
 *
 */
@Entity
@IdClass(FacilitydetailPollutantreleasePK.class)
@Table(name="FACILITYDETAIL_POLLUTANTRELEASE")
@NamedQueries({
    @NamedQuery(name="FacilitydetailPollutantrelease.findAll", query="SELECT f FROM FacilitydetailPollutantrelease f"),
    @NamedQuery(name="FacilitydetailPollutantrelease.findByFacilityReportID", query="SELECT f FROM FacilitydetailPollutantrelease f where f.facilityReportID = :FacilityReportID")
})

public class FacilitydetailPollutantrelease implements Serializable {
    private static final long serialVersionUID = 1L;

/*  @GeneratedValue(strategy=GenerationType.AUTO)
    private int id;
*/
    public FacilitydetailPollutantrelease(Double accidentalQuantity, String accidentalQuantityUnitCode, String cas, 
    		String confidentialCode, boolean confidentialIndicator, Integer facilityID, Integer facilityReportID, 
    		String groupCode, Integer LOV_ConfidentialityID, Integer LOV_MediumID, Integer LOV_MethodBasisID, 
    		Integer LOV_PollutantGroupID, Integer LOV_PollutantID, String methodCode, String methodDesignation, 
    		Integer methodListID, String methodTypeCode, String pollutantCode, String pollutantTo, 
    		Double totalQuantity, String totalQuantityUnitCode){
    	this.accidentalQuantity = accidentalQuantity; 
    	this.accidentalQuantityUnitCode = accidentalQuantityUnitCode; 
    	this.cas = cas; 
    	this.confidentialCode = confidentialCode; 
    	this.facilityID = facilityID; 
    	this.facilityReportID = facilityReportID; 
    	this.groupCode = groupCode; 
    	this.LOV_ConfidentialityID = LOV_ConfidentialityID; 
    	this.LOV_MediumID = LOV_MediumID; 
    	this.LOV_MethodBasisID = LOV_MethodBasisID; 
    	this.LOV_PollutantGroupID = LOV_PollutantGroupID; 
    	this.LOV_PollutantID = LOV_PollutantID; 
    	this.methodCode = methodCode; 
    	this.methodDesignation = methodDesignation; 
    	this.methodListID = methodListID; 
    	this.methodTypeCode = methodTypeCode; 
    	this.pollutantCode = pollutantCode; 
    	this.pollutantTo = pollutantTo; 
    	this.totalQuantity = totalQuantity; 
    	this.totalQuantityUnitCode = totalQuantityUnitCode; 
    }
    
    @Column(name="AccidentalQuantity")
    private Double accidentalQuantity;

    @Column(name="AccidentalQuantityUnitCode")
    private String accidentalQuantityUnitCode;

    @Column(name="CAS")
    private String cas;

    @Column(name="ConfidentialCode")
    private String confidentialCode;

    @Column(name="ConfidentialIndicator")
    private boolean confidentialIndicator;

    @Column(name="FacilityID")
    private Integer facilityID;

    @Id
    @Column(name="FacilityReportID")
    private Integer facilityReportID;

    @Column(name="GroupCode")
    private String groupCode;

    private Integer LOV_ConfidentialityID;

    private Integer LOV_MediumID;

    private Integer LOV_MethodBasisID;

    private Integer LOV_PollutantGroupID;

    @Id
    private Integer LOV_PollutantID;

    @Column(name="MethodCode")
    private String methodCode;

    @Column(name="MethodDesignation")
    private String methodDesignation;

    @Column(name="MethodListID")
    private Integer methodListID;

    @Column(name="MethodTypeCode")
    private String methodTypeCode;

    @Column(name="PollutantCode")
    private String pollutantCode;

    @Column(name="PollutantTo")
    private String pollutantTo;

    @Column(name="TotalQuantity")
    private Double totalQuantity;

    @Column(name="TotalQuantityUnitCode")
    private String totalQuantityUnitCode;

    public FacilitydetailPollutantrelease() {
    }

/*  public Integer getId() {
        this.id += 1;
        return this.id;
    }*/

    public Double getAccidentalQuantity() {
        return this.accidentalQuantity;
    }

    public void setAccidentalQuantity(Double accidentalQuantity) {
        this.accidentalQuantity = accidentalQuantity;
    }

    public String getAccidentalQuantityUnitCode() {
        return this.accidentalQuantityUnitCode;
    }

    public void setAccidentalQuantityUnitCode(String accidentalQuantityUnitCode) {
        this.accidentalQuantityUnitCode = accidentalQuantityUnitCode;
    }

    public String getCas() {
        return this.cas;
    }


    public void setCas(String cas) {
        this.cas = cas;
    }

    public String getConfidentialCode() {
        return this.confidentialCode;
    }

    public void setConfidentialCode(String confidentialCode) {
        this.confidentialCode = confidentialCode;
    }

    public boolean getConfidentialIndicator() {
        return this.confidentialIndicator;
    }

    public void setConfidentialIndicator(boolean confidentialIndicator) {
        this.confidentialIndicator = confidentialIndicator;
    }

    public Integer getFacilityID() {
        return this.facilityID;
    }

    public void setFacilityID(Integer facilityID) {
        this.facilityID = facilityID;
    }

    public Integer getFacilityReportID() {
        return this.facilityReportID;
    }

    public void setFacilityReportID(Integer facilityReportID) {
        this.facilityReportID = facilityReportID;
    }

    public String getGroupCode() {
        return this.groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public Integer getLOV_ConfidentialityID() {
        return this.LOV_ConfidentialityID;
    }

    public void setLOV_ConfidentialityID(Integer LOV_ConfidentialityID) {
        this.LOV_ConfidentialityID = LOV_ConfidentialityID;
    }

    public Integer getLOV_MediumID() {
        return this.LOV_MediumID;
    }

    public void setLOV_MediumID(Integer LOV_MediumID) {
        this.LOV_MediumID = LOV_MediumID;
    }

    public Integer getLOV_MethodBasisID() {
        return this.LOV_MethodBasisID;
    }

    public void setLOV_MethodBasisID(Integer LOV_MethodBasisID) {
        this.LOV_MethodBasisID = LOV_MethodBasisID;
    }

    public Integer getLOV_PollutantGroupID() {
        return this.LOV_PollutantGroupID;
    }

    public void setLOV_PollutantGroupID(Integer LOV_PollutantGroupID) {
        this.LOV_PollutantGroupID = LOV_PollutantGroupID;
    }

    public Integer getLOV_PollutantID() {
        return this.LOV_PollutantID;
    }

    public void setLOV_PollutantID(Integer LOV_PollutantID) {
        this.LOV_PollutantID = LOV_PollutantID;
    }

    public String getMethodCode() {
        return this.methodCode;
    }

    public void setMethodCode(String methodCode) {
        this.methodCode = methodCode;
    }

    public String getMethodDesignation() {
        return this.methodDesignation;
    }

    public void setMethodDesignation(String methodDesignation) {
        this.methodDesignation = methodDesignation;
    }

    public Integer getMethodListID() {
        return this.methodListID;
    }

    public void setMethodListID(Integer methodListID) {
        this.methodListID = methodListID;
    }

    public String getMethodTypeCode() {
        return this.methodTypeCode;
    }

    public void setMethodTypeCode(String methodTypeCode) {
        this.methodTypeCode = methodTypeCode;
    }

    public String getPollutantCode() {
        return this.pollutantCode;
    }

    public void setPollutantCode(String pollutantCode) {
        this.pollutantCode = pollutantCode;
    }

    public String getPollutantTo() {
        return this.pollutantTo;
    }

    public void setPollutantTo(String pollutantTo) {
        this.pollutantTo = pollutantTo;
    }

    public Double getTotalQuantity() {
        return this.totalQuantity;
    }

    public void setTotalQuantity(Double totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public String getTotalQuantityUnitCode() {
        return this.totalQuantityUnitCode;
    }

    public void setTotalQuantityUnitCode(String totalQuantityUnitCode) {
        this.totalQuantityUnitCode = totalQuantityUnitCode;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 71 * hash + Objects.hashCode(this.facilityReportID);
        hash = 71 * hash + Objects.hashCode(this.LOV_PollutantID);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final FacilitydetailPollutantrelease other = (FacilitydetailPollutantrelease) obj;
        if (!Objects.equals(this.facilityReportID, other.facilityReportID)) {
            return false;
        }
        if (!Objects.equals(this.LOV_PollutantID, other.LOV_PollutantID)) {
            return false;
        }
        return true;
    }

    
    
    
}
