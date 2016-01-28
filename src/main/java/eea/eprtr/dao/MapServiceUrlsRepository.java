package eea.eprtr.dao;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import eea.eprtr.model.MapServiceUrls;

@Component
@Repository
public class MapServiceUrlsRepository{

	@Value("${profile}")
	private String profile;

	@Value("${mapsource.prod.facilitiesurl}")
	private String prodfacilitiesurl;
	
	@Value("${mapsource.prod.emissionwaterurl}")
	private String prodemissionwaterurl;
	
	@Value("${mapsource.prod.emissionairurl}")
	private String prodemissionairurl;
	
	@Value("${mapsource.prod.lcpurl}")
	private String prodlcpurl;
	
	@Value("${mapsource.test.facilitiesurl}")
	private String testfacilitiesurl;
	
	@Value("${mapsource.test.emissionwaterurl}")
	private String testemissionwaterurl;
	
	@Value("${mapsource.test.emissionairurl}")
	private String testemissionairurl;
	
	@Value("${mapsource.test.lcpurl}")
	private String testlcpurl;

    public MapServiceUrls getMapUrls(){
    	if (this.profile.contains("test")){
    		return new MapServiceUrls(testfacilitiesurl, testemissionwaterurl, testemissionairurl, testlcpurl);
    	}
    	else{
    		return new MapServiceUrls(prodfacilitiesurl, prodemissionwaterurl, prodemissionairurl, prodlcpurl);
    	}
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }
    
    public String getProdFacilitiesUrl() {
        return this.prodfacilitiesurl;
    }

    public void setProdFacilitiesUrl(String prodfacilitiesurl) {
        this.prodfacilitiesurl = prodfacilitiesurl;
    }

    public String getProdEmissionWaterUrl() {
        return this.prodemissionwaterurl;
    }

    public void setProdEmissionWaterUrl(String prodemissionwaterurl) {
        this.prodemissionwaterurl = prodemissionwaterurl;
    }

    public String getProdEmissionAirUrl() {
        return this.prodemissionairurl;
    }

    public void setProdEmissionAirUrl(String prodemissionairurl) {
        this.prodemissionairurl = prodemissionairurl;
    }
    
    public String getProdLcpUrl() {
        return this.prodlcpurl;
    }

    public void setProdLcpUrl(String prodlcpurl) {
        this.prodlcpurl = prodlcpurl;
    }
    
    public String getTestFacilitiesUrl() {
        return this.testfacilitiesurl;
    }

    public void setTestFacilitiesUrl(String testfacilitiesurl) {
        this.testfacilitiesurl = testfacilitiesurl;
    }

    public String getTestEmissionWaterUrl() {
        return this.testemissionwaterurl;
    }

    public void setTestEmissionWaterUrl(String testemissionwaterurl) {
        this.testemissionwaterurl = testemissionwaterurl;
    }

    public String getTestEmissionAirUrl() {
        return this.testemissionairurl;
    }

    public void setTestEmissionAirUrl(String testemissionairurl) {
        this.testemissionairurl = testemissionairurl;
    }

    public String getTestLcpUrl() {
        return this.testlcpurl;
    }

    public void setTestLcpUrl(String testlcpurl) {
        this.testlcpurl = testlcpurl;
    }
    
    
    


}