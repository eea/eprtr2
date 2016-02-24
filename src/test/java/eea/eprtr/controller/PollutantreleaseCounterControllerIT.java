package eea.eprtr.controller;

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
public class PollutantreleaseCounterControllerIT {

    @Autowired
    private PollutantreleaseCounterController controller;

    public PollutantreleaseCounterControllerIT() {
    }

    @Test
    public void testPollutantreleaseSearch() throws Exception {
        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/pollutantreleasecounts")
                .param("ReportingYear", "2013")
                .param("LOV_AreaGroupID", "1")
                .param("LOV_PollutantID", "9"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$.quantityAir").value(0.0))
                .andExpect(jsonPath("$.quantitySoil").value(0.0))
                .andExpect(jsonPath("$.quantityWater").value(0.0));
    }

}
