package eea.eprtr.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.junit.runner.RunWith;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.util.NestedServletException;

//import com.github.springtestdbunit.annotation.DatabaseSetup;
//import com.github.springtestdbunit.annotation.DbUnitConfiguration;
import com.github.springtestdbunit.DbUnitTestExecutionListener;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-mvc-config.xml" })
//@DbUnitConfiguration(databaseConnection = {"dataSource", "dataSourceEprtrCms" })
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class,
        TransactionalTestExecutionListener.class,
        DbUnitTestExecutionListener.class })
//@DatabaseSetup(connection="dataSource", value="/StringResource-data.xml")

public class LovCountryControllerIT {

    @Autowired
    private LovCountryController controller;

    @Rule
    public ExpectedException exception = ExpectedException.none();

    /**
     * Test that lookup of code 59 is Denmark. Pre-seeded.
     */
    @Test
    public void testCode59ReturnsDenmark() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(get("/lovCountry/59"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            .andExpect(jsonPath("$.countryCode").value("DK"))
            .andExpect(jsonPath("$.lov_CountryID").value(59))
            .andExpect(jsonPath("$.countryName").value("Denmark"));

    }

    /**
     * Test that lookup of code 9000 is invalid.
     * FIXME: A real Rest API should return code 404.
     */
    @Test
    public void testNonexistantCode() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        exception.expect(NestedServletException.class);
        mockMvc.perform(get("/lovCountry/9000"));
            //.andExpect(status().is5xxServerError());
            //.andExpect(status().isNotFound());
    }

    /*
     * TODO: Test that an alphabetic (non-numeric) code is handled correctly.
     */
}
