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

// TODO: ask(roug) for data
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring-mvc-config.xml")
public class PollutanttransferSearchControllerIT {

    @Autowired
    private PollutanttransferSearchController controller;

    public PollutanttransferSearchControllerIT() {
    }

    @Test
    public void testPollutanttransferSearch() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutanttransferSearch"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void testPollutanttransferSeries() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutanttransferSeries"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void testPollutanttransferCompare() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutanttransferCompare")
                .param("ReportingYearStart", "2000")
                .param("ReportingYearEnd", "2015"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    public void testPollutanttransferConfidentialityTS() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutanttransferConfidentialityTS"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void testPollutanttransferIsConfidential() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutanttransferIsConfidential"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").value(false));
    }

    @Test
    public void testPollutanttransferAreaoverview() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutanttransferAreaoverview"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

}
