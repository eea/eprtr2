package eea.eprtr.dao;

import static org.junit.Assert.assertEquals;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import eea.eprtr.model.MapServiceUrls;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring-mvc-config.xml"})
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class,
        TransactionalTestExecutionListener.class })

public class MapServiceUrlsRepositoryIT {

    @Autowired
    @Qualifier("mapurlService")
    protected MapServiceUrlsRepository repository;

    /**
     * Test that the "test" profile returns the expected. It is actually used in production for the "review" site.
     */
    @Test
    public void testThatRepositoryReturnsTestFacilities() {
        repository.setProfile("test");
        MapServiceUrls results = repository.getMapUrls();
        String expected = "https://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EPRTRreviewFacilities_Dyna_WGS84/FeatureServer/0";

        assertEquals(expected, results.getFacilitiesUrl());
    }

    /**
     * Test that the "prod" profile returns the expected.
     */
    @Test
    public void testThatRepositoryReturnsProdFacilities() {
        repository.setProfile("prod");
        MapServiceUrls results = repository.getMapUrls();
        String expected = "https://air.discomap.eea.europa.eu/arcgis/rest/services/Air/EprtrFacilities_Dyna_WGS84/FeatureServer/0";

        assertEquals(expected, results.getFacilitiesUrl());
    }

}
