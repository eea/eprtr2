package eea.eprtr.controller;

import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Rule;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import org.springframework.web.util.NestedServletException;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring-mvc-config.xml")
public class LovAreaGroupControllerIT {

    @Rule
    public ExpectedException thrown = ExpectedException.none();
    
    @Autowired
    private LovAreaGroupController controller;

    public LovAreaGroupControllerIT() {
    }

    @Test
    public void testGetLovAreagroupByCode() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/lovAreaGroup/1"))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";CHARSET=UTF-8"))
                .andExpect(jsonPath("$.lov_AreaGroupID").value(1));
    }

    
    @Test
    public void testGetLovAreagroupByCodeWithCodeThatDoesNotExist() throws Exception {
        thrown.expect(NestedServletException.class);
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/lovAreaGroup/1000000"))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";CHARSET=UTF-8"));
    }
}
