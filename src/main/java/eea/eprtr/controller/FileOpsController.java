/*
 * The contents of this file are subject to the Mozilla Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS
 * IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 *
 * The Original Code is EPRTR 2.0
 *
 * The Initial Owner of the Original Code is European Environment
 * Agency. All Rights Reserved.
 *
 * Contributor(s):
 *        Soren Roug
 */
package eea.eprtr.controller;

import eea.eprtr.dao.StorageService;
import java.io.InputStream;
import java.io.IOException;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * File operations - just download.
 */
@Controller
public class FileOpsController {

    @Autowired
    private StorageService storageService;

    private Log logger = LogFactory.getLog(FileOpsController.class);

    static final String DOC_SECTION = "docs";

    static final String RDF_SECTION = "rdf";

    /**
     * Download a file.
     * Extension is stripped by Spring unless reconfigured.
     * @see <a href="http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-ann-requestmapping-suffix-pattern-match">Suffix Pattern Matching</a>
     * @see <a href="http://docs.spring.io/spring-framework/docs/current/spring-framework-reference/html/mvc.html#mvc-config-path-matching">21.16.11 Path Matching</a>
     */
    @RequestMapping(value = "/docs/{file_name}", method = RequestMethod.GET)
    public void downloadDocument(
        @PathVariable("file_name") String fileId, HttpServletResponse response) throws IOException {

        downloadFile(fileId, response, DOC_SECTION);
    }

    @RequestMapping(value = "/rdf/{file_name}", method = RequestMethod.GET)
    public void downloadRDF(
        @PathVariable("file_name") String fileId, HttpServletResponse response) throws IOException {

        downloadFile(fileId, response, RDF_SECTION);
    }

    private void downloadFile(String fileId, HttpServletResponse response, String section) throws IOException {
        long fileSize = 0;
        InputStream is = null;
        try {
            fileSize = storageService.getSizeById(fileId, section);
            is = storageService.getById(fileId, section);
        } catch (Exception e) {
            throw new FileNotFoundException(fileId);
        }
        response.setContentType("application/octet-stream");
        response.setHeader("Content-Length", Long.toString(fileSize));
        response.setHeader("Content-Disposition", "attachment; filename=" + fileId);

        org.apache.commons.io.IOUtils.copy(is, response.getOutputStream());
        response.flushBuffer();
        is.close();
    }

    @ExceptionHandler(FileNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "File not found on server")
    public void filenotFoundError() {
        // Nothing to do
    }

}

