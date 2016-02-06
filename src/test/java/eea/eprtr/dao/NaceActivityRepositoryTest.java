package eea.eprtr.dao;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.Test;
import org.unitils.UnitilsJUnit4;
import org.unitils.dbunit.annotation.DataSet;
import org.unitils.spring.annotation.SpringApplicationContext;
import org.unitils.spring.annotation.SpringBean;
import org.unitils.database.annotations.Transactional;

import eea.eprtr.dao.NaceActivityRepository;
import eea.eprtr.model.NaceActivity;

@DataSet("NaceActivity-data.xml")
@SpringApplicationContext({"spring-mvc-config.xml"})
@Transactional(transactionManagerName="transactionManager")
public class NaceActivityRepositoryTest extends UnitilsJUnit4 {

    @SpringBean("naceActivityRepository")
    protected NaceActivityRepository repository;
    
    @Test
    public void testThatRepositoryListReturnsOnlyRootActivitiesWhenNullIsSpecified() {
        List<NaceActivity> results = repository.list(null);
        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals("Root Activity 1", results.get(0).getName());
        assertEquals("Root Activity 2", results.get(1).getName());
    }
    
    @Test
    public void testThatRepositoryListReturnsTheActivitiesThatHasAParentWithId1() {
        List<NaceActivity> results = repository.list(new Integer(1));
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Activity 1", results.get(0).getName());
    }
    
    @Test
    public void testThatRepositoryListReturnsTheActivitiesThatHasAParentWithId2() {
        List<NaceActivity> results = repository.list(new Integer(2));
        assertNotNull(results);
        assertEquals(0, results.size());
    }
    
    @Test
    public void testThatRepositoryGetReturnsTheActivitieThatHasCode01() {
        NaceActivity results = repository.get(1);
        assertNotNull(results);
        //assertEquals(1, results.size());
        assertEquals("Root Activity 1", results.getName());
    }

}
