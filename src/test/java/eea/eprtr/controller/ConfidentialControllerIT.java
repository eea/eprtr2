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
public class ConfidentialControllerIT {

    @Autowired
    private ConfidentialController controller;

    public ConfidentialControllerIT() {

    }

    @Test
    public void testConfindustrialactivitySearch() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/confindustrialactivitySearch"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    public void testWastetransferConfidentialCounts() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/wastetransferConfidentialCounts"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$.quantityNONHW").value(0))
                .andExpect(jsonPath("$.quantityHWIC").value(0))
                .andExpect(jsonPath("$.quantityHWOC").value(0));
    }

    @Test
    public void testGetWasteConfidentialReason() throws Exception {
        

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/wastetransferConfidentialCounts"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$.quantityNONHW").value(0))
                .andExpect(jsonPath("$.quantityHWIC").value(0))
                .andExpect(jsonPath("$.quantityHWOC").value(0));
    }

}
