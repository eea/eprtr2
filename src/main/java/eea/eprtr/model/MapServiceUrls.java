package eea.eprtr.model;

public class MapServiceUrls {

    private String facilitiesurl;//: http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EprtrReviewFacilities_Dyna_WGS84/FeatureServer
    private String emissionwaterurl;//: http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EPRTRDiffuseEmissionsWater/MapServer
    private String emissionairurl;//: http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EPRTRDiffuseEmissionsAir_Dyna_WGS84/MapServer
    private String lcpurl;//: http://air.discomap.eea.europa.eu/arcgis/rest/services/EPRTR/EPRTR_LCP/MapServer

    public MapServiceUrls() {
        super();
    }

    public MapServiceUrls(String facilitiesurl, String emissionwaterurl, String emissionairurl, String lcpurl) {
        this.facilitiesurl = facilitiesurl;
        this.emissionwaterurl = emissionwaterurl;
        this.emissionairurl =emissionairurl;
        this.lcpurl = lcpurl;
    }

    public String getFacilitiesUrl() {
        return this.facilitiesurl;
    }

    public void setFacilitiesUrl(String facilitiesurl) {
        this.facilitiesurl = facilitiesurl;
    }

    public String getEmissionwaterUrl() {
        return this.emissionwaterurl;
    }

    public void setEmissionwaterUrl(String emissionwaterurl) {
        this.emissionwaterurl = emissionwaterurl;
    }

    public String getEmissionairUrl() {
        return this.emissionairurl;
    }

    public void setEmissionairUrl(String emissionairurl) {
        this.emissionairurl = emissionairurl;
    }

    public String getLcpUrl() {
        return this.lcpurl;
    }

    public void setLcpUrl(String lcpurl) {
        this.lcpurl = lcpurl;
    }

}
