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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.unitils.UnitilsJUnit4;
import org.unitils.dbunit.annotation.DataSet;
import org.unitils.spring.annotation.SpringApplicationContext;
import org.unitils.spring.annotation.SpringBean;

import eea.eprtr.dao.NaceActivityRepository;
import eea.eprtr.model.NaceActivity;

@DataSet("NaceActivity-data.xml")
@SpringApplicationContext({"spring-mvctest-config.xml", "spring-dbtest-config.xml"})
public class NaceActivityControllerTest extends UnitilsJUnit4 {
	
	@SpringBean("naceActivityController")
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
}