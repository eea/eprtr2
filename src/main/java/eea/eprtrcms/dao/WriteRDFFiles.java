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
 */
public class WriteRDFFiles {
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

    /**
     * Write the RDF files.
     */
    public void writeAll() throws Exception {
        Properties props = new Properties();
        InputStream inputStream = WriteRDFFiles.class.getResourceAsStream("/rdfexport.properties");
        props.load(inputStream);
        inputStream.close();

        String[] filesToGenerate = getItems(props, "files");
        for (String fileName : filesToGenerate) {
            writeFile(fileName, props);
        }

    }

    /**
     * Write one RDF file, which can contain several tables.
     */
    private void writeFile(String fileName, Properties props) throws Exception {
        OutputStream outputStream = new FileOutputStream(fileName);
        GZIPOutputStream gzStream = new GZIPOutputStream(outputStream);
        GenerateRDF exporter = new GenerateRDF(gzStream, dataSource.getConnection(), props);
        String[] tablesToExport = getItems(props, "file." + fileName);
        for (String table : tablesToExport) {
            exporter.exportTable(table);
        }
        exporter.exportDocumentInformation();
        exporter.writeRdfFooter();
        gzStream.finish();
        gzStream.close();
        outputStream.close();
    }

    /**
     * Split a property value into several items on whitespace.
     *
     * @param props - The properties hash table
     * @param set - the key.
     */
    private String[] getItems(Properties props, String set) {
        String filenamesProperty = props.getProperty(set);
        String[] filenames = {};
        if (filenamesProperty != null && !filenamesProperty.isEmpty()) {
            filenames = filenamesProperty.split("\\s+");
        }
        return filenames;
    }
}
