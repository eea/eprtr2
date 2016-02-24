package eea.eprtr.controller;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring-mvc-config.xml")
public class MapServiceUrlsControllerIT {

    @Autowired
    private MapServiceUrlsController controller;

    public MapServiceUrlsControllerIT() {
    }

    @Test
    public void testGetMapServiceUrls() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/mapurls")).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(jsonPath("$.facilitiesUrl")
                        .value("http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EprtrFacilities_Dyna_WGS84/FeatureServer/0"))
                .andExpect(jsonPath("$.emissionwaterUrl")
                        .value("http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EPRTRDiffuseEmissionsWater/MapServer"))
                .andExpect(jsonPath("$.emissionairUrl")
                        .value("http://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EPRTRDiffuseEmissionsAir_Dyna_WGS84/MapServer"))
                .andExpect(jsonPath("$.lcpUrl").
                        value("http://air.discomap.eea.europa.eu/arcgis/rest/services/EPRTR/EPRTR_LCP/MapServer"));
    }

}
