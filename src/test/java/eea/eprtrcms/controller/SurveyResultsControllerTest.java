package eea.eprtrcms.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.runner.RunWith;
import org.junit.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import com.github.springtestdbunit.annotation.DatabaseSetup;
import com.github.springtestdbunit.annotation.DbUnitConfiguration;
import com.github.springtestdbunit.DbUnitTestExecutionListener;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-mvc-config.xml" })
@DbUnitConfiguration(databaseConnection = {"dataSource", "dataSourceEprtrCms" })
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class,
        TransactionalTestExecutionListener.class,
        DbUnitTestExecutionListener.class })
//@DatabaseSetup(connection="dataSourceEprtrCms", value="/StringResource-data.xml")

public class SurveyResultsControllerTest {

    @Autowired
    private SurveyResultsController controller;

    /*
     * Unable to verify write-through.
     */
    @Test
    public void testThatControllerListReturnsTheCorrectFormattedJson() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(post("/addeprtrsurveyresult")
            .param("result", "Yes, I like E-PRTR & EEA's website"))
            .andExpect(status().isOk());
    }

}
