package eea.eprtr.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.hamcrest.Matchers.hasSize;
import org.junit.Rule;
import org.junit.rules.ExpectedException;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import org.springframework.web.util.NestedServletException;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring-mvc-config.xml")
public class AnnexIActivityControllerIT {

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Autowired
    private AnnexIActivityController controller;

    @Test
    public void testList() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/annexIActivity")).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8")).andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(9)));
    }

    @Test
    public void testGetAnnexIActivityByID() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/annexIActivity/1")).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$.code").value("1"));
    }

    // TODO: Ask(roug) why WS throws exception instead of returning 404
    @Test
    public void testGetAnnexIActivityByIDNotExists() throws Exception {
        thrown.expect(NestedServletException.class);
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/annexIActivity/99999"));
    }

}
