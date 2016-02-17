package eea.eprtr.dao;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.List;

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
//@DatabaseSetup("/NaceActivity-data.xml")

//@Transactional(transactionManagerName="transactionManager")
public class NaceActivityRepositoryIT {

    @Autowired
    protected NaceActivityRepository repository;

    @Test
    public void testThatRepositoryListReturnsOnlyRootActivitiesWhenNullIsSpecified() {
        List<NaceActivity> results = repository.list(null);
        assertNotNull(results);
        assertEquals(88, results.size());
        assertEquals("Crop and animal production, hunting and related service activities", results.get(0).getName());
        assertEquals("Forestry and logging", results.get(1).getName());
    }

    @Test
    public void testThatRepositoryListReturnsTheActivitiesThatHasAParentWithId1() {
        List<NaceActivity> results = repository.list(new Integer(1));
        assertNotNull(results);
        assertEquals(7, results.size());
        assertEquals("Growing of non-perennial crops", results.get(0).getName());
    }

    @Test
    public void testThatRepositoryListReturnsTheActivitiesThatHasAParentWithId2() {
        List<NaceActivity> results = repository.list(new Integer(2));
        assertNotNull(results);
        assertEquals(4, results.size());
    }

    @Test
    public void testThatRepositoryGetReturnsTheActivitieThatHasCode01() {
        NaceActivity results = repository.get(1);
        assertNotNull(results);
        //assertEquals(1, results.size());
        assertEquals("Crop and animal production, hunting and related service activities", results.getName());
    }

}
