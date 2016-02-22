package eea;

import java.net.HttpURLConnection;
import java.net.URL;
import static org.junit.Assert.assertEquals;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

/**
 * Simple class to make requests to a running application.
 * Only used when the application is started up in a container.
 */
public class FTStaticFiles {

    @Rule
    public ExpectedException exception = ExpectedException.none();

    private String context;

    @Before
    public void start() {
        context = System.getProperty("tomcat.url");
        if (context == null) {
            System.err.println("No URL to application");
        }
    }

    /**
     * Test that download.gif is there.
     */
    @Test
    public void testDownloadGif() throws Exception {
        if (context == null) {
            return;
        }
        URL obj = new URL(context + "images/download.gif");
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        assertEquals(200, con.getResponseCode());
        assertEquals("image/gif", con.getContentType());
    }

    /**
     * Test that app.js is there.
     */
    @Test
    public void testAppJS() throws Exception {
        if (context == null) {
            return;
        }
        URL obj = new URL(context + "app.js");
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        assertEquals(200, con.getResponseCode());
        assertEquals("application/javascript", con.getContentType());
    }

}
