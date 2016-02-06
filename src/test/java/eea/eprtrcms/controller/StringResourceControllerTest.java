package eea.eprtrcms.controller;

import static org.junit.Assert.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.unitils.UnitilsJUnit4;
import org.unitils.dbunit.annotation.DataSet;
import org.unitils.spring.annotation.SpringApplicationContext;
import org.unitils.spring.annotation.SpringBean;
import org.unitils.database.annotations.Transactional;

import eea.eprtrcms.dao.StringResourceRepository;
import eea.eprtrcms.model.StringResource;

/* There seems to be a bug in dbunit. It doesn't see the AllowHTML column in the database.
 */
@DataSet("StringResource-data.xml")
@SpringApplicationContext({"spring-mvc-config.xml"})
@Transactional(transactionManagerName="transactionManagerCms")
public class StringResourceControllerTest extends UnitilsJUnit4 {
    
    @SpringBean("stringResourceController")
    private StringResourceController controller;

/*
    @Test
    public void testThatControllerListReturnsTheSameAsRepositoryList() {
        StringResourceRepository repository = mock(StringResourceRepository.class);
        StringResourceController controller = new StringResourceController(repository);
        Integer parentID = new Integer(5);
        List<StringResource> listReturnedByRepository = new ArrayList<StringResource>();
        when(repository.list(parentID)).thenReturn(listReturnedByRepository);
        List<StringResource> list = controller.list(parentID);
        assertSame(list, listReturnedByRepository);
    }
*/
    @Test
    public void testThatControllerListReturnsTheCorrectFormattedJson() throws Exception {
        String expectedResponse = "[{\"key\":\"Static\",\"type\":\"AboutPageContent\",\"value\":\"About time\"}]";
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(get("/eprtrresource")
            .param("Type", "Static")
            .param("i18n", "en-GB")
            .param("Key", "AboutPageContent"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            //.andExpect(content().string(expectedResponse))
            .andExpect(jsonPath("$[0].value").value("About time"))
            .andExpect(jsonPath("$[0].type").value("AboutPageContent"));
    }

/*
    @Test
    public void testThatControllerGetReturnsTheSameAsRepositoryGet() {
        StringResourceRepository repository = mock(StringResourceRepository.class);
        StringResourceController controller = new StringResourceController(repository);
        Integer id = new Integer(1);
        StringResource getItemReturnedByRepository = new StringResource();
        when(repository.get(id)).thenReturn(getItemReturnedByRepository);
        StringResource item = controller.get(id);
        assertSame(item, getItemReturnedByRepository);
    }
*/
}
