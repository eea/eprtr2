package eea.eprtr.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.junit.runner.RunWith;
import org.junit.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-mvc-config.xml" })
public class FacilitydetailDetailControllerIT {

    @Autowired
    private FacilitydetailDetailController controller;

    @Test
    public void testIlva() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(get("/facilitydetailDetails")
            .param("FacilityID", "7019")
            .param("ReportingYear", "2013"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            .andExpect(jsonPath("$[0].coordinates").value("POINT (17.2 40.516667)"))
            .andExpect(jsonPath("$[0].coordinates").value("POINT (17.2 40.516667)"))
            .andExpect(jsonPath("$[0].nacesubActivityCode").value("24.10"))
            .andExpect(jsonPath("$[0].confidentialIndicator").value(false));
    }

    @Test
    public void testIlvaByReportID() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(get("/facilitydetailDetails/977567")
            .param("FacilityID", "7019")
            .param("ReportingYear", "2013"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            .andExpect(jsonPath("$.coordinates").value("POINT (17.2 40.516667)"))
            .andExpect(jsonPath("$.nacesubActivityCode").value("24.10"))
            .andExpect(jsonPath("$.confidentialIndicator").value(false));
    }
}
