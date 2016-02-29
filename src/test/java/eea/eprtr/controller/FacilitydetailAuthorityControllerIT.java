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
public class FacilitydetailAuthorityControllerIT {

    @Autowired
    private FacilitydetailAuthorityController controller;

    public FacilitydetailAuthorityControllerIT() {
    }

    @Test
    public void testGetFacilitydetailAuthority() throws Exception {

        MockMvc mock = MockMvcBuilders.standaloneSetup(controller).build();
        mock.perform(get("/facilitydetailAuthority/6314"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE
                        + ";charset=UTF-8"))
                .andExpect(content().encoding("UTF-8"))
                .andExpect(jsonPath("$.facilityReportID").value(6314));
    }

}
