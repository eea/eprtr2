package eea.eprtr.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eea.eprtr.model.Greeting;

/**
 * Example of implementing a REST controller in Spring 4.
 */
@RestController
public class GreetingController {

    private static final String template = "Hello, %s!";

    /**
     * Request a greeting. Takes an optional parameter called "name".
     *
     * @param name - Name to greet. Default value is "World".
     */
    @RequestMapping("/greeting")
    public Greeting greeting(@RequestParam(value="name", defaultValue="World") String name) {
        return new Greeting(1L, String.format(template, name));
    }
}
