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
@ContextConfiguration("classpath:spring-mvc-config.xml")
public class WastetransferSearchControllerIT {

    @Autowired
    private WastetransferSearchController controller;

    public WastetransferSearchControllerIT() {
    }

    @Test
    public void testWastetransferSearch() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/wastetransferSearch"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(7)));
    }

    @Test
    public void testWastetransferCounter() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/wastetransferCounts"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$.quantityNONHW").value(1))
                .andExpect(jsonPath("$.quantityHWIC").value(1))
                .andExpect(jsonPath("$.quantityHWOC").value(1));
    }

    @Test
    public void testWastetransferSeries() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/wastetransferCounts"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$.quantityNONHW").value(1))
                .andExpect(jsonPath("$.quantityHWIC").value(1))
                .andExpect(jsonPath("$.quantityHWOC").value(1));
    }

    @Test
    public void testWastetransferCompare() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/wastetransferCompare")
                .param("ReportingYearStart", "1999")
                .param("ReportingYearEnd", "2016")
                .param("WasteType", "HWIC"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    public void testWastetransferConfidentialTS() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/wastetransferConfidentialTS")
                .param("ReportingYearStart", "1999")
                .param("ReportingYearEnd", "2016")
                .param("WasteType", "HWIC"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void testWastetransferIsConfidential() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/wastetransferIsConfidential"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").value(false));
    }

    @Test
    public void testGetWastetransferAreaCompare() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();

        mock.perform(get("/wastetransferAreaCompare")
                .param("WasteType", "HWIC"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(7)));
    }

    @Test
    public void testGetTransboundaryHazardousWaste() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();

        mock.perform(get("/transboundaryHazardousWaste")
                .param("WasteType", "HWIC"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    public void testGetWastetransferReceivingcountry() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();

        mock.perform(get("/wastetransferReceivingcountry")
                .param("WasteType", "HWIC"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    public void testGetHazardousWasteTreaterList() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();

        mock.perform(get("/wastetransferHazardousWasteTreater")
                .param("ReportingYear", "2008")
                .param("desc", "true")
                .param("limit", "6")
                .param("offset", "0")
                .param("order", "facilityName"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)));
    }

}
