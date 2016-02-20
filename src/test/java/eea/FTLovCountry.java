package eea;

import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import static org.junit.Assert.assertEquals;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;

/**
 * Simple class to make requests to a running application.
 * Only used when the application is started up in a container.
 */
public class FTLovCountry {

    @Rule
    public ExpectedException exception = ExpectedException.none();

    private static String context;

    @BeforeClass
    public static void start() {
        context = System.getProperty("tomcat.url");
        if (context == null) {
            System.err.println("No URL to application");
        }
    }

    /**
     * Test that download.gif is there.
     */
    @Test
    public void checkCountry59() throws Exception {
        if (context == null) {
            return;
        }

        URL obj = new URL(context + "lovCountry/59");
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        assertEquals(200, con.getResponseCode());
        assertEquals("application/json;charset=UTF-8", con.getContentType());

        String json = readStringContent(con);
        con.disconnect();
        Object document = Configuration.defaultConfiguration().jsonProvider().parse(json);
        assertEquals("DK", JsonPath.read(document, "$.countryCode"));
        assertEquals(59, JsonPath.read(document, "$.lov_CountryID"));
        assertEquals("Denmark", JsonPath.read(document, "$.countryName"));
    }

    private String readStringContent(HttpURLConnection con) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        return response.toString();
    }

}
