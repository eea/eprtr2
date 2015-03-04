package eea.eprtr.model;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the POLLUTANTRELEASE database table.
 * 
 */
@Entity
@Table(name="POLLUTANTRELEASE")
@NamedQuery(name="Pollutantrelease.findAll", query="SELECT p FROM Pollutantrelease p")
public class Pollutantrelease implements Serializable {
	private static final long serialVersionUID = 1L;

	@Column(name="CAS")
	private String cas;

	@Column(name="ConfidentialCodeAir")
	private String confidentialCodeAir;

	@Column(name="ConfidentialCodeSoil")
	private String confidentialCodeSoil;

	@Column(name="ConfidentialCodeWater")
	private String confidentialCodeWater;

	@Column(name="ConfidentialIndicator")
	private boolean confidentialIndicator;

	@Column(name="ConfidentialIndicatorFacility")
	private boolean confidentialIndicatorFacility;

	@Column(name="CountryCode")
	private String countryCode;

	@Column(name="FacilityID")
	private int facilityID;

	@Column(name="FacilityName")
	private String facilityName;

	@Id
	@Column(name="FacilityReportID")
	private int facilityReportID;

	private String IAActivityCode;

	private String IASectorCode;

	private String IASubActivityCode;

	private String IPPCActivityCode;

	private String IPPCSectorCode;

	private String IPPCSubActivityCode;

	private int LOV_ConfidentialityIDAir;

	private int LOV_ConfidentialityIDSoil;

	private int LOV_ConfidentialityIDWater;

	private int LOV_CountryID;

	private int LOV_IAActivityID;

	private int LOV_IASectorID;

	private int LOV_IASubActivityID;

	private int LOV_NACEActivityID;

	private int LOV_NACESectorID;

	private int LOV_NACESubActivityID;

	private int LOV_NUTSRLevel1ID;

	private int LOV_NUTSRLevel2ID;

	private int LOV_NUTSRLevel3ID;

	private int LOV_PollutantGroupID;

	private int LOV_PollutantID;

	private int LOV_RiverBasinDistrictID;

	@Column(name="MethodCodeAir")
	private String methodCodeAir;

	@Column(name="MethodCodeSoil")
	private String methodCodeSoil;

	@Column(name="MethodCodeWater")
	private String methodCodeWater;

	@Column(name="MethodTypeCodeAir")
	private String methodTypeCodeAir;

	@Column(name="MethodTypeCodeSoil")
	private String methodTypeCodeSoil;

	@Column(name="MethodTypeCodeWater")
	private String methodTypeCodeWater;

	@Column(name="MethodTypeDesignationAir")
	private String methodTypeDesignationAir;

	@Column(name="MethodTypeDesignationSoil")
	private String methodTypeDesignationSoil;

	@Column(name="MethodTypeDesignationWater")
	private String methodTypeDesignationWater;

	private String NACEActivityCode;

	private String NACESectorCode;

	private String NACESubActivityCode;

	private String NUTSLevel2RegionCode;

	@Column(name="PercentAccidentalAir")
	private double percentAccidentalAir;

	@Column(name="PercentAccidentalSoil")
	private double percentAccidentalSoil;

	@Column(name="PercentAccidentalWater")
	private double percentAccidentalWater;

	@Column(name="PollutantCode")
	private String pollutantCode;

	@Column(name="PollutantGroupCode")
	private String pollutantGroupCode;

	@Column(name="QuantityAccidentalAir")
	private double quantityAccidentalAir;

	@Column(name="QuantityAccidentalSoil")
	private double quantityAccidentalSoil;

	@Column(name="QuantityAccidentalWater")
	private double quantityAccidentalWater;

	@Column(name="QuantityAir")
	private double quantityAir;

	@Column(name="QuantitySoil")
	private double quantitySoil;

	@Column(name="QuantityWater")
	private double quantityWater;

	@Column(name="ReportingYear")
	private int reportingYear;

	@Column(name="RiverBasinDistrictCode")
	private String riverBasinDistrictCode;

	@Column(name="UnitAccidentalAir")
	private String unitAccidentalAir;

	@Column(name="UnitAccidentalSoil")
	private String unitAccidentalSoil;

	@Column(name="UnitAccidentalWater")
	private String unitAccidentalWater;

	@Column(name="UnitAir")
	private String unitAir;

	@Column(name="UnitSoil")
	private String unitSoil;

	@Column(name="UnitWater")
	private String unitWater;

	public Pollutantrelease() {
	}

	public String getCas() {
		return this.cas;
	}

	public void setCas(String cas) {
		this.cas = cas;
	}

	public String getConfidentialCodeAir() {
		return this.confidentialCodeAir;
	}

	public void setConfidentialCodeAir(String confidentialCodeAir) {
		this.confidentialCodeAir = confidentialCodeAir;
	}

	public String getConfidentialCodeSoil() {
		return this.confidentialCodeSoil;
	}

	public void setConfidentialCodeSoil(String confidentialCodeSoil) {
		this.confidentialCodeSoil = confidentialCodeSoil;
	}

	public String getConfidentialCodeWater() {
		return this.confidentialCodeWater;
	}

	public void setConfidentialCodeWater(String confidentialCodeWater) {
		this.confidentialCodeWater = confidentialCodeWater;
	}

	public boolean getConfidentialIndicator() {
		return this.confidentialIndicator;
	}

	public void setConfidentialIndicator(boolean confidentialIndicator) {
		this.confidentialIndicator = confidentialIndicator;
	}

	public boolean getConfidentialIndicatorFacility() {
		return this.confidentialIndicatorFacility;
	}

	public void setConfidentialIndicatorFacility(boolean confidentialIndicatorFacility) {
		this.confidentialIndicatorFacility = confidentialIndicatorFacility;
	}

	public String getCountryCode() {
		return this.countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public int getFacilityID() {
		return this.facilityID;
	}

	public void setFacilityID(int facilityID) {
		this.facilityID = facilityID;
	}

	public String getFacilityName() {
		return this.facilityName;
	}

	public void setFacilityName(String facilityName) {
		this.facilityName = facilityName;
	}

	public int getFacilityReportID() {
		return this.facilityReportID;
	}

	public void setFacilityReportID(int facilityReportID) {
		this.facilityReportID = facilityReportID;
	}

	public String getIAActivityCode() {
		return this.IAActivityCode;
	}

	public void setIAActivityCode(String IAActivityCode) {
		this.IAActivityCode = IAActivityCode;
	}

	public String getIASectorCode() {
		return this.IASectorCode;
	}

	public void setIASectorCode(String IASectorCode) {
		this.IASectorCode = IASectorCode;
	}

	public String getIASubActivityCode() {
		return this.IASubActivityCode;
	}

	public void setIASubActivityCode(String IASubActivityCode) {
		this.IASubActivityCode = IASubActivityCode;
	}

	public String getIPPCActivityCode() {
		return this.IPPCActivityCode;
	}

	public void setIPPCActivityCode(String IPPCActivityCode) {
		this.IPPCActivityCode = IPPCActivityCode;
	}

	public String getIPPCSectorCode() {
		return this.IPPCSectorCode;
	}

	public void setIPPCSectorCode(String IPPCSectorCode) {
		this.IPPCSectorCode = IPPCSectorCode;
	}

	public String getIPPCSubActivityCode() {
		return this.IPPCSubActivityCode;
	}

	public void setIPPCSubActivityCode(String IPPCSubActivityCode) {
		this.IPPCSubActivityCode = IPPCSubActivityCode;
	}

	public int getLOV_ConfidentialityIDAir() {
		return this.LOV_ConfidentialityIDAir;
	}

	public void setLOV_ConfidentialityIDAir(int LOV_ConfidentialityIDAir) {
		this.LOV_ConfidentialityIDAir = LOV_ConfidentialityIDAir;
	}

	public int getLOV_ConfidentialityIDSoil() {
		return this.LOV_ConfidentialityIDSoil;
	}

	public void setLOV_ConfidentialityIDSoil(int LOV_ConfidentialityIDSoil) {
		this.LOV_ConfidentialityIDSoil = LOV_ConfidentialityIDSoil;
	}

	public int getLOV_ConfidentialityIDWater() {
		return this.LOV_ConfidentialityIDWater;
	}

	public void setLOV_ConfidentialityIDWater(int LOV_ConfidentialityIDWater) {
		this.LOV_ConfidentialityIDWater = LOV_ConfidentialityIDWater;
	}

	public int getLOV_CountryID() {
		return this.LOV_CountryID;
	}

	public void setLOV_CountryID(int LOV_CountryID) {
		this.LOV_CountryID = LOV_CountryID;
	}

	public int getLOV_IAActivityID() {
		return this.LOV_IAActivityID;
	}

	public void setLOV_IAActivityID(int LOV_IAActivityID) {
		this.LOV_IAActivityID = LOV_IAActivityID;
	}

	public int getLOV_IASectorID() {
		return this.LOV_IASectorID;
	}

	public void setLOV_IASectorID(int LOV_IASectorID) {
		this.LOV_IASectorID = LOV_IASectorID;
	}

	public int getLOV_IASubActivityID() {
		return this.LOV_IASubActivityID;
	}

	public void setLOV_IASubActivityID(int LOV_IASubActivityID) {
		this.LOV_IASubActivityID = LOV_IASubActivityID;
	}

	public int getLOV_NACEActivityID() {
		return this.LOV_NACEActivityID;
	}

	public void setLOV_NACEActivityID(int LOV_NACEActivityID) {
		this.LOV_NACEActivityID = LOV_NACEActivityID;
	}

	public int getLOV_NACESectorID() {
		return this.LOV_NACESectorID;
	}

	public void setLOV_NACESectorID(int LOV_NACESectorID) {
		this.LOV_NACESectorID = LOV_NACESectorID;
	}

	public int getLOV_NACESubActivityID() {
		return this.LOV_NACESubActivityID;
	}

	public void setLOV_NACESubActivityID(int LOV_NACESubActivityID) {
		this.LOV_NACESubActivityID = LOV_NACESubActivityID;
	}

	public int getLOV_NUTSRLevel1ID() {
		return this.LOV_NUTSRLevel1ID;
	}

	public void setLOV_NUTSRLevel1ID(int LOV_NUTSRLevel1ID) {
		this.LOV_NUTSRLevel1ID = LOV_NUTSRLevel1ID;
	}

	public int getLOV_NUTSRLevel2ID() {
		return this.LOV_NUTSRLevel2ID;
	}

	public void setLOV_NUTSRLevel2ID(int LOV_NUTSRLevel2ID) {
		this.LOV_NUTSRLevel2ID = LOV_NUTSRLevel2ID;
	}

	public int getLOV_NUTSRLevel3ID() {
		return this.LOV_NUTSRLevel3ID;
	}

	public void setLOV_NUTSRLevel3ID(int LOV_NUTSRLevel3ID) {
		this.LOV_NUTSRLevel3ID = LOV_NUTSRLevel3ID;
	}

	public int getLOV_PollutantGroupID() {
		return this.LOV_PollutantGroupID;
	}

	public void setLOV_PollutantGroupID(int LOV_PollutantGroupID) {
		this.LOV_PollutantGroupID = LOV_PollutantGroupID;
	}

	public int getLOV_PollutantID() {
		return this.LOV_PollutantID;
	}

	public void setLOV_PollutantID(int LOV_PollutantID) {
		this.LOV_PollutantID = LOV_PollutantID;
	}

	public int getLOV_RiverBasinDistrictID() {
		return this.LOV_RiverBasinDistrictID;
	}

	public void setLOV_RiverBasinDistrictID(int LOV_RiverBasinDistrictID) {
		this.LOV_RiverBasinDistrictID = LOV_RiverBasinDistrictID;
	}

	public String getMethodCodeAir() {
		return this.methodCodeAir;
	}

	public void setMethodCodeAir(String methodCodeAir) {
		this.methodCodeAir = methodCodeAir;
	}

	public String getMethodCodeSoil() {
		return this.methodCodeSoil;
	}

	public void setMethodCodeSoil(String methodCodeSoil) {
		this.methodCodeSoil = methodCodeSoil;
	}

	public String getMethodCodeWater() {
		return this.methodCodeWater;
	}

	public void setMethodCodeWater(String methodCodeWater) {
		this.methodCodeWater = methodCodeWater;
	}

	public String getMethodTypeCodeAir() {
		return this.methodTypeCodeAir;
	}

	public void setMethodTypeCodeAir(String methodTypeCodeAir) {
		this.methodTypeCodeAir = methodTypeCodeAir;
	}

	public String getMethodTypeCodeSoil() {
		return this.methodTypeCodeSoil;
	}

	public void setMethodTypeCodeSoil(String methodTypeCodeSoil) {
		this.methodTypeCodeSoil = methodTypeCodeSoil;
	}

	public String getMethodTypeCodeWater() {
		return this.methodTypeCodeWater;
	}

	public void setMethodTypeCodeWater(String methodTypeCodeWater) {
		this.methodTypeCodeWater = methodTypeCodeWater;
	}

	public String getMethodTypeDesignationAir() {
		return this.methodTypeDesignationAir;
	}

	public void setMethodTypeDesignationAir(String methodTypeDesignationAir) {
		this.methodTypeDesignationAir = methodTypeDesignationAir;
	}

	public String getMethodTypeDesignationSoil() {
		return this.methodTypeDesignationSoil;
	}

	public void setMethodTypeDesignationSoil(String methodTypeDesignationSoil) {
		this.methodTypeDesignationSoil = methodTypeDesignationSoil;
	}

	public String getMethodTypeDesignationWater() {
		return this.methodTypeDesignationWater;
	}

	public void setMethodTypeDesignationWater(String methodTypeDesignationWater) {
		this.methodTypeDesignationWater = methodTypeDesignationWater;
	}

	public String getNACEActivityCode() {
		return this.NACEActivityCode;
	}

	public void setNACEActivityCode(String NACEActivityCode) {
		this.NACEActivityCode = NACEActivityCode;
	}

	public String getNACESectorCode() {
		return this.NACESectorCode;
	}

	public void setNACESectorCode(String NACESectorCode) {
		this.NACESectorCode = NACESectorCode;
	}

	public String getNACESubActivityCode() {
		return this.NACESubActivityCode;
	}

	public void setNACESubActivityCode(String NACESubActivityCode) {
		this.NACESubActivityCode = NACESubActivityCode;
	}

	public String getNUTSLevel2RegionCode() {
		return this.NUTSLevel2RegionCode;
	}

	public void setNUTSLevel2RegionCode(String NUTSLevel2RegionCode) {
		this.NUTSLevel2RegionCode = NUTSLevel2RegionCode;
	}

	public double getPercentAccidentalAir() {
		return this.percentAccidentalAir;
	}

	public void setPercentAccidentalAir(double percentAccidentalAir) {
		this.percentAccidentalAir = percentAccidentalAir;
	}

	public double getPercentAccidentalSoil() {
		return this.percentAccidentalSoil;
	}

	public void setPercentAccidentalSoil(double percentAccidentalSoil) {
		this.percentAccidentalSoil = percentAccidentalSoil;
	}

	public double getPercentAccidentalWater() {
		return this.percentAccidentalWater;
	}

	public void setPercentAccidentalWater(double percentAccidentalWater) {
		this.percentAccidentalWater = percentAccidentalWater;
	}

	public String getPollutantCode() {
		return this.pollutantCode;
	}

	public void setPollutantCode(String pollutantCode) {
		this.pollutantCode = pollutantCode;
	}

	public String getPollutantGroupCode() {
		return this.pollutantGroupCode;
	}

	public void setPollutantGroupCode(String pollutantGroupCode) {
		this.pollutantGroupCode = pollutantGroupCode;
	}

	public double getQuantityAccidentalAir() {
		return this.quantityAccidentalAir;
	}

	public void setQuantityAccidentalAir(double quantityAccidentalAir) {
		this.quantityAccidentalAir = quantityAccidentalAir;
	}

	public double getQuantityAccidentalSoil() {
		return this.quantityAccidentalSoil;
	}

	public void setQuantityAccidentalSoil(double quantityAccidentalSoil) {
		this.quantityAccidentalSoil = quantityAccidentalSoil;
	}

	public double getQuantityAccidentalWater() {
		return this.quantityAccidentalWater;
	}

	public void setQuantityAccidentalWater(double quantityAccidentalWater) {
		this.quantityAccidentalWater = quantityAccidentalWater;
	}

	public double getQuantityAir() {
		return this.quantityAir;
	}

	public void setQuantityAir(double quantityAir) {
		this.quantityAir = quantityAir;
	}

	public double getQuantitySoil() {
		return this.quantitySoil;
	}

	public void setQuantitySoil(double quantitySoil) {
		this.quantitySoil = quantitySoil;
	}

	public double getQuantityWater() {
		return this.quantityWater;
	}

	public void setQuantityWater(double quantityWater) {
		this.quantityWater = quantityWater;
	}

	public int getReportingYear() {
		return this.reportingYear;
	}

	public void setReportingYear(int reportingYear) {
		this.reportingYear = reportingYear;
	}

	public String getRiverBasinDistrictCode() {
		return this.riverBasinDistrictCode;
	}

	public void setRiverBasinDistrictCode(String riverBasinDistrictCode) {
		this.riverBasinDistrictCode = riverBasinDistrictCode;
	}

	public String getUnitAccidentalAir() {
		return this.unitAccidentalAir;
	}

	public void setUnitAccidentalAir(String unitAccidentalAir) {
		this.unitAccidentalAir = unitAccidentalAir;
	}

	public String getUnitAccidentalSoil() {
		return this.unitAccidentalSoil;
	}

	public void setUnitAccidentalSoil(String unitAccidentalSoil) {
		this.unitAccidentalSoil = unitAccidentalSoil;
	}

	public String getUnitAccidentalWater() {
		return this.unitAccidentalWater;
	}

	public void setUnitAccidentalWater(String unitAccidentalWater) {
		this.unitAccidentalWater = unitAccidentalWater;
	}

	public String getUnitAir() {
		return this.unitAir;
	}

	public void setUnitAir(String unitAir) {
		this.unitAir = unitAir;
	}

	public String getUnitSoil() {
		return this.unitSoil;
	}

	public void setUnitSoil(String unitSoil) {
		this.unitSoil = unitSoil;
	}

	public String getUnitWater() {
		return this.unitWater;
	}

	public void setUnitWater(String unitWater) {
		this.unitWater = unitWater;
	}

}