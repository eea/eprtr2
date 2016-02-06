package eea.eprtr.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import eea.eprtr.dao.StorageService;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"classpath:spring-mvc-config.xml"})

/**
 * Test the File storage controller.
 */
public class FileOpsControllerTest {

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;


    @Before
    public void setUp() throws Exception {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }


    /**
     * Check that file suffixes are handled correctly.
     */
    @Test
    public void docDownloads() throws Exception {
        seedFile(FileOpsController.DOC_SECTION, "uploaded-file.txt", "ABCDEF");
        seedFile(FileOpsController.DOC_SECTION, "uploaded-file.csv", "A,B,C,D,E,F");

        // Check that it is there.
        mockMvc.perform(get("/docs/uploaded-file.txt"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/docs/uploaded-file.doc"))
                .andExpect(status().isNotFound());
        mockMvc.perform(get("/docs/uploaded-file"))
                .andExpect(status().isNotFound());
    }

    /**
     * Check that file suffixes are handled correctly.
     */
    @Test
    public void rdfDownloads() throws Exception {
        seedFile(FileOpsController.RDF_SECTION, "uploaded-file.rdf", "ABCDEF");

        // Check that it is there.
        mockMvc.perform(get("/rdf/uploaded-file.rdf"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/rdf/uploaded-file.doc"))
                .andExpect(status().isNotFound());
        mockMvc.perform(get("/rdf/uploaded-file"))
                .andExpect(status().isNotFound());
    }

    /**
     * Helper method
     */
    private void seedFile(String section, String originalFilename, String content) throws Exception {
        StorageService storageService = wac.getBean("storageService", StorageService.class);

        MockMultipartFile mockFile = new MockMultipartFile("file", originalFilename, "text/plain", content.getBytes("UTF-8"));
        storageService.save(mockFile, section);
    }

    /**
     * Attempt to download a non-existent file.
     */
    @Test
    public void docNotFound() throws Exception {
        mockMvc.perform(get("/docs/no-such-file"))
                .andExpect(status().isNotFound());
    }

    /**
     * Attempt to download a non-existent RDF file.
     */
    @Test
    public void rdfNotFound() throws Exception {
        mockMvc.perform(get("/rdf/no-such-file"))
                .andExpect(status().isNotFound());
    }

}
