E-PRTR 2
========

The application uses Liquibase to create and upgrade the database.  The database is in-memory for the production and file-based for test. You can therefore just drop the WAR file into Tomcat, and it will create tables, load demo data and launch.

Spring MVC provides decent API to build RESTful webservices on Tomcat: https://spring.io/guides/gs/rest-service/. A guide of how to use the services with AngularJS can be found here: https://spring.io/guides/gs/consuming-rest-angularjs/. In Spring it is possible to return Java object in preferred format by using @ResponseBody annotation in Controller method. It serializes the object to json or xml, if needed.

If you want to make the service more JEE compliant by allocating [JAX-RS spec](https://jax-rs-spec.java.net/), then it is possible to use [Jersey framework](https://jersey.java.net/). Spring and Jersey can also live in the same application. In this case you are using JAX-RS annotations to define and provide the services with Jersey and Spring takes care of the application context and other layers. This solution allows you to benefit from the Spring power of simplifying unit testing.


Testing
-------
There are test examples of both controllers and data access objects using the Spring test package. Note that loading demo data is part of the liquibase changelog, and the tests use that data instead of initialising with their own test data.

For AngularJS see http://www.tuesdaydeveloper.com/2013/06/angularjs-testing-with-karma-and-jasmine/

There is a blog post of how to invoke Karma from Maven: http://jamesnavin.net/2014/05/25/maven-karma-webjars/

Continuous JavaScript testing with Karma:
```
npm test
```

Deploying
---------

The following fragment must be added to context.xml for the web application before deploy the WAR archive.

<Resource name="jdbc/datasource" auth="Container" type="javax.sql.DataSource"
    	username="<username>"
    	password="<password>"
    	driverClassName="net.sourceforge.jtds.jdbc.Driver"
    	url="jdbc:jtds:sqlserver://<servername>;database=<databasename>"
    	maxActive="20"
    	maxIdle="10"
    	validationQuery="select 1" />

How to build
------------
You need Git to check the code out from the repository and to build you need Java and Maven.  All other dependencies will automatically be downloaded by Maven.

For Windows see the pages on:
* [Git for Windows](http://git-scm.com/downloads)
* [Maven for Windows](http://maven.apache.org/guides/getting-started/windows-prerequisites.html).
* [Node.js](http://nodejs.org/)
* [Git Shell](https://windows.github.com/)

Before building you need to install Node.js. 

To build you do (preferably from Git Shell if using Windows):
```
git clone https://github.com/eea/eprtr2.git
cd eprtr2
npm install
mvn.bat install
```

This will create a `target` subdirectory, build the code, run the tests and put a WAR file in target. You can then deploy this file to Tomcat. It contains an embedded database with demo data.

