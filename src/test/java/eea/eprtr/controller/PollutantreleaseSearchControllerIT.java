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
public class PollutantreleaseSearchControllerIT {

    @Autowired
    private PollutantreleaseSearchController controller;

    public PollutantreleaseSearchControllerIT() {
    }

    @Test
    public void testPollutantreleaseSearch() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutantreleaseSearch"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(173)));
    }

    @Test
    public void testPollutantreleaseConfidentialityTS() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutantreleaseConfidentialityTS").param("Medium", "AIR"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void testPollutantreleaseIsConfidential() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutantreleaseIsConfidential"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(jsonPath("$").value(false));
    }

    @Test
    public void testPollutantreleaseAreaoverview() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutantreleaseAreaoverview")
                .param("Medium", "AIR"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)));
    }

}
