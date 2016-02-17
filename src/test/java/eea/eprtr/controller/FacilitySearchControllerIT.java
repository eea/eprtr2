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

public class FacilitySearchControllerIT {

    @Autowired
    private FacilitySearchController controller;

    @Rule
    public ExpectedException exception = ExpectedException.none();

    /**
     * Test that lookup of 2013 returns one. Pre-seeded.
     */
    @Test
    public void test2013returnsOne() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(get("/facilityCount")
            .param("ReportingYear", "2013"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            .andExpect(jsonPath("$.facilityCount").value(1))
            .andExpect(jsonPath("$.facilityAccidentalCount").value(0));
    }

    /**
     * Test that lookup of code 9000 is invalid.
     * FIXME: A real Rest API should return code 404.
     */
    //@Test
    public void testNonexistantCode() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        //exception.expect(NestedServletException.class);
        mockMvc.perform(get("/facilityCount")
            .param("ReportingYear", "9000"))
            .andExpect(content().string("[]"));
            //.andExpect(status().isNotFound());
    }

    /**
     * Test that no code returns a 400.
     */
    @Test
    public void testNoParameter() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(get("/facilityCount"))
            .andExpect(status().isBadRequest());
    }

    /*
     * TODO: Figure out what an alphabetic (non-numeric) code should return.
     */
    //@Test
    public void testNonNumericCode() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        //exception.expect(NestedServletException.class);
        mockMvc.perform(get("/facilityCount")
            .param("ReportingYear", "DK"))
            .andExpect(content().string(""));
            //.andExpect(status().isNotFound());
    }

}
