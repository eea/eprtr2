package eea.eprtr.controller;

import static org.hamcrest.Matchers.hasSize;
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
@ContextConfiguration(locations = {"classpath:spring-mvc-config.xml"})
public class FacilitydetailActivityControllerIT {
    
    @Autowired
    private FacilitydetailActivityController controller;
    
    public FacilitydetailActivityControllerIT() {
    }

    @Test
    public void testGetByFacilityReportID() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/facilitydetailActivity")
                .param("FacilityReportID", "6314"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(5)));
    }
    
}
