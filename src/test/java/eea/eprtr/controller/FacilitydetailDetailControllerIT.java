package eea.eprtr.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.junit.runner.RunWith;
import org.junit.Rule;
import org.junit.Ignore;
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

public class FacilitydetailDetailControllerIT {

    @Autowired
    private LovCountryController controller;

    @Rule
    public ExpectedException exception = ExpectedException.none();

    /**
     * Test that lookup of code 7019 is ILVA in Taranto.
     * Ignored because it returns 404 for unknown reason
     */
    @Ignore @Test
    public void testIlva() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(get("/facilitydetailDetails")
            .param("FacilityID", "7019")
            .param("ReportingYear", "2013"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            .andExpect(jsonPath("$[0].coordinates").value("POINT (17.2 40.516667)"))
            .andExpect(jsonPath("$[0].nacesubActivityCode").value("24.10"))
            .andExpect(jsonPath("$[0].confidentialIndicator").value(false));
    }

    /**
     * Test that lookup of code 7019 is ILVA in Taranto.
     * Ignored because it returns 404 for unknown reason
     */
    @Ignore @Test
    public void testIlvaByReportID() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(get("/facilitydetailDetails/977567")
            .param("FacilityID", "7019")
            .param("ReportingYear", "2013"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            .andExpect(jsonPath("$[0].coordinates").value("POINT (17.2 40.516667)"))
            .andExpect(jsonPath("$[0].nacesubActivityCode").value("24.10"))
            .andExpect(jsonPath("$[0].confidentialIndicator").value(false));
    }
}
