package eea.eprtr.controller;

import static org.junit.Assert.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
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
import com.github.springtestdbunit.DbUnitTestExecutionListener;

import eea.eprtr.dao.NaceActivityRepository;
import eea.eprtr.model.NaceActivity;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-mvc-config.xml"})
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class,
        TransactionalTestExecutionListener.class,
        DbUnitTestExecutionListener.class })
@DatabaseSetup("/NaceActivity-data.xml")
public class NaceActivityControllerTest {

    @Autowired
    private NaceActivityController controller;

    @Test
    public void testThatControllerListReturnsTheSameAsRepositoryList() {
        NaceActivityRepository repository = mock(NaceActivityRepository.class);
        NaceActivityController controller = new NaceActivityController(repository);
        Integer parentID = new Integer(5);
        List<NaceActivity> listReturnedByRepository = new ArrayList<NaceActivity>();
        when(repository.list(parentID)).thenReturn(listReturnedByRepository);
        List<NaceActivity> list = controller.list(parentID);
        assertSame(list, listReturnedByRepository);
    }

    @Test
    public void testThatControllerListReturnsTheCorrectFormattedJson() throws Exception {
        String expectedResponse = "[{\"code\":\"01\",\"endYear\":null,\"name\":\"Root Activity 1\",\"parentID\":null,\"startYear\":2007,\"lov_NACEActivityID\":1},"
                + "{\"code\":\"02\",\"endYear\":null,\"name\":\"Root Activity 2\",\"parentID\":null,\"startYear\":2007,\"lov_NACEActivityID\":2}]";
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        mockMvc.perform(get("/naceActivity"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            .andExpect(content().string(expectedResponse));
    }

    @Test
    public void testThatControllerGetReturnsTheSameAsRepositoryGet() {
        NaceActivityRepository repository = mock(NaceActivityRepository.class);
        NaceActivityController controller = new NaceActivityController(repository);
        Integer id = new Integer(1);
        NaceActivity getItemReturnedByRepository = new NaceActivity();
        when(repository.get(id)).thenReturn(getItemReturnedByRepository);
        NaceActivity item = controller.get(id);
        assertSame(item, getItemReturnedByRepository);
    }
}
