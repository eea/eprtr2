package eea.eprtr.controller;

import static org.hamcrest.Matchers.hasSize;
import org.junit.Test;
import org.junit.Rule;
import org.junit.rules.ExpectedException;
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
import org.springframework.web.util.NestedServletException;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring-mvc-config.xml")
public class PollutantControllerIT {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Autowired
    private PollutantController controller;

    public PollutantControllerIT() {
    }

    @Test
    public void testList() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutant"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(7)));
    }

    @Test
    public void testGetPollutantByCode() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutant/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(jsonPath("$.lov_PollutantID").value(1));
    }

    @Test
    public void testGetPollutantByCodeThatDoesNotExist() throws Exception {
        thrown.expect(NestedServletException.class);
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutant/1000000000"));
    }

}
