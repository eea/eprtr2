package eea.eprtrcms.dao;

import eionet.rdfexport.GenerateRDF;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.sql.Connection;
import java.util.Properties;
import java.util.zip.GZIPOutputStream;
import javax.sql.DataSource;

/**
 * A service to generate RDF files from the data in the database.
 * UNFINISHED.
 */
class WriteRDFFiles {
    /**
     * The directory location where to store the uploaded files.
     */
    private String storageDir;

    public void setStorageDir(String storageDir) {
        this.storageDir = storageDir;
    }

    private DataSource dataSource;

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void writeAll() throws Exception {
        Properties props = new Properties();
        InputStream inputStream = WriteRDFFiles.class.getResourceAsStream("/rdfexport.properties");
        props.load(inputStream);
        inputStream.close();

        String[] filesToGenerate = getItems(props, "filenames");
        String[] tablesToExport = getItems(props, "tables");

        int fileInx = 0;
        for (String table : tablesToExport) {
            String fileName = filesToGenerate[fileInx];
            OutputStream outputStream = new FileOutputStream(fileName);
            GZIPOutputStream gzStream = new GZIPOutputStream(outputStream);
            GenerateRDF exporter = new GenerateRDF(gzStream, dataSource.getConnection(), props);
            exporter.exportTable(table);
            exporter.exportDocumentInformation();
            exporter.writeRdfFooter();
            gzStream.finish();
            gzStream.close();
            outputStream.close();
            fileInx++;
        }
    }

    private String[] getItems(Properties props, String set) {
        String filenamesProperty = props.getProperty(set);
        String[] filenames = {};
        if (filenamesProperty != null && !filenamesProperty.isEmpty()) {
            filenames = filenamesProperty.split("\\s+");
        }
        return filenames;
    }
}
