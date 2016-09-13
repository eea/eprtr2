package eea.eprtrcms.dao;

import java.util.List;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import eea.eprtrcms.model.SimpleDoc;
import org.junit.Test;
import org.junit.Ignore;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertNotNull;

public class SimpleDocServiceIT {

    @Test
    public void simpleTest() {
        //Get the Spring Context
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring-mvc-config.xml");

        //Get the SimpleDocService Bean from the context.
        SimpleDocService simpledocService = ctx.getBean("simpleDocService", SimpleDocService.class);

        //Run some tests for JDBC CRUD operations
        SimpleDoc doc = new SimpleDoc();
        doc.setResourceValueID(9);
        doc.setTitle("Test Page");
        doc.setContent("Java Developer");

        //Read
        SimpleDoc doc1 = simpledocService.getByResourceValueID(3);
        assertNotNull(doc1);

        //Get All
        List<SimpleDoc> docList = simpledocService.getAll();
        assertTrue(docList.size() > 0);

        //Close Spring Context
        ctx.close();
    }

    @Test
    public void bulgarianContent() {
        String bulgaria = "Български";

        //Get the Spring Context
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("spring-mvc-config.xml");

        //Get the SimpleDocService Bean from the context.
        SimpleDocService simpledocService = ctx.getBean("simpleDocService", SimpleDocService.class);

        //Run some tests for JDBC CRUD operations
        SimpleDoc doc = new SimpleDoc();
        doc.setResourceValueID(1176);
        doc.setTitle("Test Page");
        doc.setContent(bulgaria);
        simpledocService.save(doc);

        //Read
        SimpleDoc doc1 = simpledocService.getByResourceValueID(1176);
        assertNotNull(doc1);
        assertEquals(bulgaria, doc1.getContent());

        //Get All
        List<SimpleDoc> docList = simpledocService.getAll();
        assertTrue(docList.size() > 0);

        //Close Spring Context
        ctx.close();
    }

}
