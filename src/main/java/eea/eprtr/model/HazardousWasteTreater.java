package eea.eprtr.model;

public class HazardousWasteTreater {

    private final String fromFacilityName;
    private final Boolean facilityConfidentialIndicator;
    private final String treaterName;
    private final String treaterAddress;
    private final String treaterCity;
    private final String treaterPostalCode;
    private final String treaterCountryCode;
    private final String treaterSiteAddress;
    private final String treaterSiteCity;
    private final String treaterSitePostalCode;
    private final String treaterSiteCountryCode;
    private final Double quantity;
    private final String unit;
    private final String treatment;
    private final Boolean confidentialIndicator;

    public HazardousWasteTreater(String fromFacilityName, Boolean facilityConfidentialIndicator,
            String treaterName, String treaterAddress, String treaterCity, String treaterPostalCode,
            String treaterCountryCode, String treaterSiteAddress, String treaterSiteCity,
            String treaterSitePostalCode, String treaterSiteCountryCode, Double quantity,
            String unit, String treatment, Boolean confidentialIndicator) {
        this.fromFacilityName = fromFacilityName;
        this.facilityConfidentialIndicator = facilityConfidentialIndicator;
        this.treaterName = treaterName;
        this.treaterAddress = treaterAddress;
        this.treaterCity = treaterCity;
        this.treaterPostalCode = treaterPostalCode;
        this.treaterCountryCode = treaterCountryCode;
        this.treaterSiteAddress = treaterSiteAddress;
        this.treaterSiteCity = treaterSiteCity;
        this.treaterSitePostalCode = treaterSitePostalCode;
        this.treaterSiteCountryCode = treaterSiteCountryCode;
        this.quantity = quantity;
        this.unit = unit;
        this.treatment = treatment;
        this.confidentialIndicator = confidentialIndicator;
    }

    public String getFromFacilityName() {
        return fromFacilityName;
    }
    public Boolean getFacilityConfidentialIndicator() { return facilityConfidentialIndicator; }
    public String getTreaterName() { return treaterName; }
    public String getTreaterAddress() { return treaterAddress; }
    public String getTreaterCity() { return treaterCity; }
    public String getTreaterPostalCode() { return treaterPostalCode; }
    public String getTreaterCountryCode() { return treaterCountryCode; }
    public String getTreaterSiteAddress() { return treaterSiteAddress; }
    public String getTreaterSiteCity() { return treaterSiteCity; }
    public String getTreaterSitePostalCode() { return treaterSitePostalCode; }
    public String getTreaterSiteCountryCode() { return treaterSiteCountryCode; }
    public Double getQuantity() { return quantity; }
    public String getUnit() { return unit; }
    public String getTreatment() { return treatment; }
    public Boolean getConfidentialIndicator() { return confidentialIndicator; }

}
