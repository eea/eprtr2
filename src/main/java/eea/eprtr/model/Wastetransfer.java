package eea.eprtr.model;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

import javax.persistence.*;

/**
 * The persistent class for the POLLUTANTRELEASE database table.
 * 
 */
@Entity
@Table(name="WASTETRANSFER")
@NamedQuery(name="Wastetransfer.findAll", query="SELECT p FROM Wastetransfer p WHERE p.reportingYear > 2006")
public class Wastetransfer implements Serializable,Cloneable{
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="FacilityReportID")
	private Integer facilityReportID;
	
	
	@Column(name="FacilityName")
	private String facilityName;
	
	@Column(name="FacilityID")
	private Integer facilityID;
	
	@Column(name="ReportingYear")
	private Integer reportingYear;
	
	@Column(name="QuantityRecoveryNONHW")
	private Double quantityRecoveryNONHW;
	
	@Column(name="QuantityDisposalNONHW")
	private Double quantityDisposalNONHW;
	
	@Column(name="QuantityUnspecNONHW")
	private Double quantityUnspecNONHW;
	
	@Column(name="QuantityTotalNONHW")
	private Double quantityTotalNONHW;
	
	@Column(name="UnitCodeNONHW")
	private String unitCodeNONHW;
	
	@Column(name="QuantityRecoveryHWIC")
  	private Double quantityRecoveryHWIC;
  	
  	@Column(name="QuantityDisposalHWIC")
  	private Double quantityDisposalHWIC;
  	
  	@Column(name="QuantityUnspecHWIC")
  	private Double quantityUnspecHWIC;
  	
  	@Column(name="QuantityTotalHWIC")
  	private Double quantityTotalHWIC;
  	
  	@Column(name="UnitCodeHWIC")
  	private String unitCodeHWIC;
  	
	@Column(name="QuantityRecoveryHWOC")
	private Double quantityRecoveryHWOC;
	
	@Column(name="QuantityDisposalHWOC")
	private Double quantityDisposalHWOC;
	
	@Column(name="QuantityUnspecHWOC")
	private Double quantityUnspecHWOC;
	
	@Column(name="QuantityTotalHWOC")
	private Double quantityTotalHWOC;
	
	@Column(name="UnitCodeHWOC")
	private String unitCodeHWOC;
    	    		  
	@Column(name="CountryCode")
	private String countryCode;
	
	private Integer LOV_CountryID;
	
	@Column(name="RiverBasinDistrictCode")
	private String riverBasinDistrictCode;
	
	@Column(name="LOV_RiverBasinDistrictID")
	private Integer LOV_RiverBasinDistrictID;
	
	@Column(name="NUTSLevel2RegionCode")
	private String nutsLevel2RegionCode;
	
	@Column(name="LOV_NUTSRLevel1ID")
	private Integer LOV_NUTSRLevel1ID;
	
	@Column(name="LOV_NUTSRLevel2ID")
	private Integer LOV_NUTSRLevel2ID;
	
	@Column(name="LOV_NUTSRLevel3ID")
	private Integer LOV_NUTSRLevel3ID;
	
	@Column(name="IASectorCode")
	private String iaSectorCode;
	
	@Column(name="IAActivityCode")
	private String iaActivityCode;
	
	@Column(name="IASubActivityCode")
	private String iaSubActivityCode;
	
	@Column(name="IPPCSectorCode")
	private String ippCSectorCode;
	
	@Column(name="IPPCActivityCode")
	private String ippCActivityCode;
	
	@Column(name="IPPCSubActivityCode")
	private String ippCSubActivityCode;
	
	@Column(name="LOV_IASectorID")
	private Integer LOV_IASectorID;
	
	@Column(name="LOV_IAActivityID")
	private Integer LOV_IAActivityID;
	
	@Column(name="LOV_IASubActivityID")
	private Integer LOV_IASubActivityID;
	
	@Column(name="NACESectorCode")
	private String naceSectorCode;
	
	@Column(name="NACEActivityCode")
	private String naceActivityCode;
	
	@Column(name="NACESubActivityCode")
	private String naceSubActivityCode;
	
	@Column(name="LOV_NACESectorID")
	private Integer LOV_NACESectorID;
	
	@Column(name="LOV_NACEActivityID")
	private Integer LOV_NACEActivityID;
	
	@Column(name="LOV_NACESubActivityID")
	private Integer LOV_NACESubActivityID;

	@Column(name="HasReportedRecovery")
	private boolean hasReportedRecovery;
	
	@Column(name="HasReportedDisposal")
	private boolean hasReportedDisposal;
	
	@Column(name="HasReportedUnspecified")
	private boolean hasReportedUnspecified;
	
	@Column(name="ConfidentialIndicatorNONHW")
	private Boolean confidentialIndicatorNONHW;
	
	@Column(name="ConfidentialIndicatorHWIC")
	private Boolean confidentialIndicatorHWIC;
	
	@Column(name="ConfidentialIndicatorHWOC")
	private Boolean confidentialIndicatorHWOC;
	
	
	// extra data fields for grouping
	@Transient
	public String key;
	
	@Transient
	public List<Wastetransfer> data;
	
	@Transient
	public List<Wastetransfer> sublevel;
	
	@Transient
	public String wastetype = ""; 
	
	@Transient
	public int facilityCount = 0;
	
	@Transient
	public int facilityCountHW = 0;

	@Transient
	public int facilityCountNONHW = 0;

	@Transient
	public int facilityCountHWIC = 0;

	@Transient
	public int facilityCountHWOC = 0;

	@Transient
	public double quantityTotalHW = 0.0;
	
	@Transient
	public double quantityRecoveryHW = 0.0;
	
	@Transient
	public double quantityDisposalHW = 0.0;
	
	@Transient
	public double quantityUnspecHW = 0.0;

	@Transient
	public double quantityTotal = 0.0;
	
	@Transient
	public double quantityRecovery = 0.0;
	
	@Transient
	public double quantityDisposal = 0.0;
	
	@Transient
	public double quantityUnspec = 0.0;

/*	@Transient
	public double total = 0.0;
	
	@Transient
	public double recovery = 0.0;
	
	@Transient
	public double disposal = 0.0;
	
	@Transient
	public double unspec = 0.0;
	*/
	
	
	public Integer getFacilityReportID() {
		return facilityReportID;
	}

	public void setFacilityReportID(Integer facilityReportID) {
		this.facilityReportID = facilityReportID;
	}

	public String getFacilityName() {
		return facilityName;
	}

	public void setFacilityName(String facilityName) {
		this.facilityName = facilityName;
	}

	public Integer getFacilityID() {
		return facilityID;
	}

	public void setFacilityID(Integer facilityID) {
		this.facilityID = facilityID;
	}

	public Integer getReportingYear() {
		return reportingYear;
	}

	public void setReportingYear(Integer reportingYear) {
		this.reportingYear = reportingYear;
	}

	public Double getQuantityRecoveryNONHW() {
		if(quantityRecoveryNONHW== null)
		{
			return 0.0;
		}
		return quantityRecoveryNONHW;
	}

	public void setQuantityRecoveryNONHW(Double quantityRecoveryNONHW) {
		this.quantityRecoveryNONHW = quantityRecoveryNONHW;
	}

	public Double getQuantityDisposalNONHW() {
		if(quantityDisposalNONHW== null)
		{
			return 0.0;
		}
		return quantityDisposalNONHW;
	}

	public void setQuantityDisposalNONHW(Double quantityDisposalNONHW) {
		this.quantityDisposalNONHW = quantityDisposalNONHW;
	}

	public Double getQuantityUnspecNONHW() {
		if(quantityUnspecNONHW== null)
		{
			return 0.0;
		}
		return quantityUnspecNONHW;
	}

	public void setQuantityUnspecNONHW(Double quantityUnspecNONHW) {
		this.quantityUnspecNONHW = quantityUnspecNONHW;
	}

	public Double getQuantityTotalNONHW() {
		if(quantityTotalNONHW== null)
		{
			return 0.0;
		}
		return quantityTotalNONHW;
	}

	public void setQuantityTotalNONHW(Double quantityTotalNONHW) {
		this.quantityTotalNONHW = quantityTotalNONHW;
	}

	public String getUnitCodeNONHW() {
		return unitCodeNONHW;
	}

	public void setUnitCodeNONHW(String unitCodeNONHW) {
		this.unitCodeNONHW = unitCodeNONHW;
	}

	public Double getQuantityRecoveryHWIC() {
		if(quantityRecoveryHWIC== null)
		{
			return 0.0;
		}
		return quantityRecoveryHWIC;
	}

	public void setQuantityRecoveryHWIC(Double quantityRecoveryHWIC) {
		this.quantityRecoveryHWIC = quantityRecoveryHWIC;
	}

	public Double getQuantityDisposalHWIC() {
		if(quantityDisposalHWIC== null)
		{
			return 0.0;
		}
		return quantityDisposalHWIC;
	}

	public void setQuantityDisposalHWIC(Double quantityDisposalHWIC) {
		this.quantityDisposalHWIC = quantityDisposalHWIC;
	}

	public Double getQuantityUnspecHWIC() {
		if(quantityUnspecHWIC== null)
		{
			return 0.0;
		}
		return quantityUnspecHWIC;
	}

	public void setQuantityUnspecHWIC(Double quantityUnspecHWIC) {
		this.quantityUnspecHWIC = quantityUnspecHWIC;
	}

	public Double getQuantityTotalHWIC() {
		if(quantityTotalHWIC== null)
		{
			return 0.0;
		}
		return quantityTotalHWIC;
	}

	public void setQuantityTotalHWIC(Double quantityTotalHWIC) {
		this.quantityTotalHWIC = quantityTotalHWIC;
	}

	public String getUnitCodeHWIC() {
		return unitCodeHWIC;
	}

	public void setUnitCodeHWIC(String unitCodeHWIC) {
		this.unitCodeHWIC = unitCodeHWIC;
	}

	public Double getQuantityRecoveryHWOC() {
		if(quantityRecoveryHWOC== null)
		{
			return 0.0;
		}
		return quantityRecoveryHWOC;
	}

	public void setQuantityRecoveryHWOC(Double quantityRecoveryHWOC) {
		this.quantityRecoveryHWOC = quantityRecoveryHWOC;
	}

	public Double getQuantityDisposalHWOC() {
		if(quantityDisposalHWOC == null)
		{
			return 0.0;
		}
		return quantityDisposalHWOC;
	}

	public void setQuantityDisposalHWOC(Double quantityDisposalHWOC) {
		this.quantityDisposalHWOC = quantityDisposalHWOC;
	}

	public Double getQuantityUnspecHWOC() {
		if(quantityUnspecHWOC== null)
		{
			return 0.0;
		}
		return quantityUnspecHWOC;
	}

	public void setQuantityUnspecHWOC(Double quantityUnspecHWOC) {
		this.quantityUnspecHWOC = quantityUnspecHWOC;
	}

	public Double getQuantityTotalHWOC() {
		if(quantityTotalHWOC== null)
		{
			return 0.0;
		}
		return quantityTotalHWOC;
	}

	public void setQuantityTotalHWOC(Double quantityTotalHWOC) {
		this.quantityTotalHWOC = quantityTotalHWOC;
	}

	public String getUnitCodeHWOC() {
		return unitCodeHWOC;
	}

	public void setUnitCodeHWOC(String unitCodeHWOC) {
		this.unitCodeHWOC = unitCodeHWOC;
	}

	
	/**
	 * Extended Start
	 * */
	public double getQuantityRecoveryHW() {
		this.quantityRecoveryHW = getQuantityRecoveryHWIC() + getQuantityRecoveryHWOC();
		return quantityRecoveryHW;
	}

	public double getQuantityDisposalHW() {
		this.quantityDisposalHW = getQuantityDisposalHWIC() + getQuantityDisposalHWOC();
		return quantityDisposalHW;
	}

	public double getQuantityUnspecHW() {
		this.quantityUnspecHW = getQuantityUnspecHWIC() + getQuantityUnspecHWOC();
		return quantityUnspecHW;
	}

	public double getQuantityTotalHW() {
		this.quantityTotalHW = getQuantityTotalHWIC() + getQuantityTotalHWOC();
		return quantityTotalHW;
	}
	/**
	 * Extended End
	 * */

	
	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public Integer getLOV_CountryID() {
		return LOV_CountryID;
	}

	public void setLOV_CountryID(Integer lOV_CountryID) {
		LOV_CountryID = lOV_CountryID;
	}

	public String getRiverBasinDistrictCode() {
		return riverBasinDistrictCode;
	}

	public void setRiverBasinDistrictCode(String riverBasinDistrictCode) {
		this.riverBasinDistrictCode = riverBasinDistrictCode;
	}

	public Integer getLov_RiverBasinDistrictID() {
		return LOV_RiverBasinDistrictID;
	}

	public void setLov_RiverBasinDistrictID(Integer lov_RiverBasinDistrictID) {
		this.LOV_RiverBasinDistrictID = lov_RiverBasinDistrictID;
	}

	public String getNutsLevel2RegionCode() {
		return nutsLevel2RegionCode;
	}

	public void setNutsLevel2RegionCode(String nutsLevel2RegionCode) {
		this.nutsLevel2RegionCode = nutsLevel2RegionCode;
	}

	public Integer getLov_NUTSRLevel1ID() {
		return LOV_NUTSRLevel1ID;
	}

	public void setLov_NUTSRLevel1ID(Integer lov_NUTSRLevel1ID) {
		this.LOV_NUTSRLevel1ID = lov_NUTSRLevel1ID;
	}

	public Integer getLov_NUTSRLevel2ID() {
		return LOV_NUTSRLevel2ID;
	}

	public void setLov_NUTSRLevel2ID(Integer lov_NUTSRLevel2ID) {
		this.LOV_NUTSRLevel2ID = lov_NUTSRLevel2ID;
	}

	public Integer getLov_NUTSRLevel3ID() {
		return LOV_NUTSRLevel3ID;
	}

	public void setLov_NUTSRLevel3ID(Integer lov_NUTSRLevel3ID) {
		this.LOV_NUTSRLevel3ID = lov_NUTSRLevel3ID;
	}

	public String getIaSectorCode() {
		return iaSectorCode;
	}

	public void setIaSectorCode(String iaSectorCode) {
		this.iaSectorCode = iaSectorCode;
	}

	public String getIaActivityCode() {
		return iaActivityCode;
	}

	public void setIaActivityCode(String iaActivityCode) {
		this.iaActivityCode = iaActivityCode;
	}

	public String getIaSubActivityCode() {
		return iaSubActivityCode;
	}

	public void setIaSubActivityCode(String iaSubActivityCode) {
		this.iaSubActivityCode = iaSubActivityCode;
	}

	public String getIppCSectorCode() {
		return ippCSectorCode;
	}

	public void setIppCSectorCode(String ippCSectorCode) {
		this.ippCSectorCode = ippCSectorCode;
	}

	public String getIppCActivityCode() {
		return ippCActivityCode;
	}

	public void setIppCActivityCode(String ippCActivityCode) {
		this.ippCActivityCode = ippCActivityCode;
	}

	public String getIppCSubActivityCode() {
		return ippCSubActivityCode;
	}

	public void setIppCSubActivityCode(String ippCSubActivityCode) {
		this.ippCSubActivityCode = ippCSubActivityCode;
	}

	public Integer getLov_IASectorID() {
		return LOV_IASectorID;
	}

	public void setLov_IASectorID(Integer lov_IASectorID) {
		this.LOV_IASectorID = lov_IASectorID;
	}

	public Integer getLov_IAActivityID() {
		return LOV_IAActivityID;
	}

	public void setLov_IAActivityID(Integer lov_IAActivityID) {
		this.LOV_IAActivityID = lov_IAActivityID;
	}

	public Integer getLov_IASubActivityID() {
		return LOV_IASubActivityID;
	}

	public void setLov_IASubActivityID(Integer lov_IASubActivityID) {
		this.LOV_IASubActivityID = lov_IASubActivityID;
	}

	public String getNaceSectorCode() {
		return naceSectorCode;
	}

	public void setNaceSectorCode(String naceSectorCode) {
		this.naceSectorCode = naceSectorCode;
	}

	public String getNaceActivityCode() {
		return naceActivityCode;
	}

	public void setNaceActivityCode(String naceActivityCode) {
		this.naceActivityCode = naceActivityCode;
	}

	public String getNaceSubActivityCode() {
		return naceSubActivityCode;
	}

	public void setNaceSubActivityCode(String naceSubActivityCode) {
		this.naceSubActivityCode = naceSubActivityCode;
	}

	public Integer getLov_NACESectorID() {
		return LOV_NACESectorID;
	}

	public void setLov_NACESectorID(Integer lov_NACESectorID) {
		this.LOV_NACESectorID = lov_NACESectorID;
	}

	public Integer getLov_NACEActivityID() {
		return LOV_NACEActivityID;
	}

	public void setLov_NACEActivityID(Integer lov_NACEActivityID) {
		this.LOV_NACEActivityID = lov_NACEActivityID;
	}

	public Integer getLov_NACESubActivityID() {
		return LOV_NACESubActivityID;
	}

	public void setLov_NACESubActivityID(Integer lov_NACESubActivityID) {
		this.LOV_NACESubActivityID = lov_NACESubActivityID;
	}

	public boolean isHasReportedRecovery() {
		return hasReportedRecovery;
	}

	public void setHasReportedRecovery(boolean hasReportedRecovery) {
		this.hasReportedRecovery = hasReportedRecovery;
	}

	public boolean isHasReportedDisposal() {
		return hasReportedDisposal;
	}

	public void setHasReportedDisposal(boolean hasReportedDisposal) {
		this.hasReportedDisposal = hasReportedDisposal;
	}

	public boolean isHasReportedUnspecified() {
		return hasReportedUnspecified;
	}

	public void setHasReportedUnspecified(boolean hasReportedUnspecified) {
		this.hasReportedUnspecified = hasReportedUnspecified;
	}
	
	
	
    public boolean isConfidentialIndicatorNONHW() {
		if(confidentialIndicatorNONHW == null)
		{
			return false;
		}
    	return confidentialIndicatorNONHW;
	}

	public void setConfidentialIndicatorNONHW(Boolean confidentialIndicatorNONHW) {
		this.confidentialIndicatorNONHW = confidentialIndicatorNONHW;
	}

	public boolean isConfidentialIndicatorHWIC() {
		if(confidentialIndicatorHWIC == null)
		{
			return false;
		}
		return confidentialIndicatorHWIC;
	}

	public void setConfidentialIndicatorHWIC(Boolean confidentialIndicatorHWIC) {	
			this.confidentialIndicatorHWIC = confidentialIndicatorHWIC;
	}

	public boolean isConfidentialIndicatorHWOC() {
		if(confidentialIndicatorHWOC == null)
		{
			return false;
		}
		return confidentialIndicatorHWOC;
	}

	public void setConfidentialIndicatorHWOC(Boolean confidentialIndicatorHWOC) {
		this.confidentialIndicatorHWOC = confidentialIndicatorHWOC;
	}

	public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
	
	public void setQuantityTotal(){
		this.quantityTotal =  getQuantityTotalHWIC() + getQuantityTotalHWOC() + getQuantityTotalNONHW(); 
	}
	
	public void setQuantityRecovery(){
		this.quantityRecovery =  getQuantityRecoveryHWIC() + getQuantityRecoveryHWOC() + getQuantityRecoveryNONHW(); 
	}
	
	public void setQuantityDisposal(){
		this.quantityDisposal =  getQuantityDisposalHWIC() + getQuantityDisposalHWOC() + getQuantityDisposalNONHW(); 
	}

	public void setQuantityUnspec(){
		this.quantityUnspec = getQuantityUnspecHWIC() + getQuantityUnspecHWOC() + getQuantityUnspecNONHW(); 
	}

}
