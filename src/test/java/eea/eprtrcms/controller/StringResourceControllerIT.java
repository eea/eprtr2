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
import com.github.springtestdbunit.annotation.DatabaseSetup;
import com.github.springtestdbunit.annotation.DbUnitConfiguration;
import com.github.springtestdbunit.DbUnitTestExecutionListener;

import eea.eprtrcms.dao.StringResourceRepository;
import eea.eprtrcms.model.StringResource;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-mvc-config.xml"})
@DbUnitConfiguration(databaseConnection={"dataSource", "dataSourceEprtrCms"})
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class,
        TransactionalTestExecutionListener.class,
        DbUnitTestExecutionListener.class })
//@DatabaseSetup(connection="dataSourceEprtrCms", value="/StringResource-data.xml")

public class StringResourceControllerIT {
    
    @Autowired
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
    /*
     * For jsonPath see https://github.com/jayway/JsonPath
     */
    @Test
    public void testThatControllerListReturnsTheCorrectFormattedJson() throws Exception {
        //String expectedResponse = "[{\"key\":\"Static\",\"type\":\"AboutPageContent\",\"value\":\"About time\"}]";
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(get("/eprtrresource")
            .param("Type", "Static")
            .param("i18n", "en-GB")
            .param("Key", "AboutPageContent"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            //.andExpect(content().string(expectedResponse))
            //.andExpect(jsonPath("$[0].value").isString())
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
