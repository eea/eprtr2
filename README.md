E-PRTR 2
========

The application uses Liquibase to create and upgrade the database.  The database is in-memory for the production and file-based for test. You can therefore just drop the WAR file into Tomcat, and it will create tables, load demo data and launch.

Spring MVC provides decent API to build RESTful webservices on Tomcat: https://spring.io/guides/gs/rest-service/. A guide of how to use the services with AngularJS can be found here: https://spring.io/guides/gs/consuming-rest-angularjs/. In Spring it is possible to return Java object in preferred format by using @ResponseBody annotation in Controller method. It serializes the object to json or xml, if needed.

If you want to make the service more JEE compliant by allocating [JAX-RS spec](https://jax-rs-spec.java.net/), then it is possible to use [Jersey framework](https://jersey.java.net/). Spring and Jersey can also live in the same application. In this case you are using JAX-RS annotations to define and provide the services with Jersey and Spring takes care of the application context and other layers. This solution allows you to benefit from the Spring power of simplifying unit testing.


Testing
-------

For AngularJS see http://www.tuesdaydeveloper.com/2013/06/angularjs-testing-with-karma-and-jasmine/

There is a blog post of how to invoke Karma from Maven: http://jamesnavin.net/2014/05/25/maven-karma-webjars/
