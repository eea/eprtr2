E-PRTR 2
========

[![Build Status](http://ci.eionet.europa.eu/job/EPRTR2/badge/icon)](http://ci.eionet.europa.eu/job/EPRTR2/)

The application is available here: http://prtrproto.cloudapp.net/

Structure
---------

The project is structured as a Maven project, and can be built by Maven command 
line.

The Java code is located at src/main/java and the web site files (js, html, 
css, etc.) is located at src/main/webapp.

`bower.json` defines all JavaScript dependencies for the JavaScript application
code and the dependencies added to this file will automatically be reflected in 
index.html (in src/main/webapp) and karma.conf.js in the `bower:js` and 
`bower:css` sections if you are using `Eclipse` or executing 
`mvn copy-resources`.

`Gruntfile.js` is the Grunt build file.

`karma.conf.js` and `karma.ci.conf.js` is JavaScript unittest 
configuration files (`karma.ci.conf.js` is for the CI server only). 

`package.json` defines all JavaScript dependencies needed to build the 
JavaScript application code.

The application is based on a single page MVC web site consisting of a number
of views each using a number of components.

The views are located at src/main/webapp/views and the components are located
at src/main/webapp/components.

The main page is located at src/main/webapp/index.html.

Testing
-------
There are test examples of both controllers and data access objects using the Spring test package. Note that loading
demo data is part of the liquibase changelog, and the tests use that data instead of initialising with their own
test data.

Continuous JavaScript testing with Karma:
```
npm test
```

Deploying
---------

One of the following Resource fragments must be added to context.xml for the web application before deploying the WAR archive.
You must also install the relevant JDBC driver jar file to /usr/share/tomcat/lib.

```
&lt;Resource name="jdbc/datasource" auth="Container" type="javax.sql.DataSource"
        username="<username>"
        password="<password>"
    	driverClassName="com.microsoft.sqlserver.jdbc.SQLServerDriver"
    	url="jdbc:sqlserver://<instance>.database.windows.net:1433;database=<databasename>;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30"
    	maxActive="20"
    	maxIdle="10"
    	validationQuery="select 1" /&gt;

&lt;Resource name="jdbc/datasource" auth="Container" type="javax.sql.DataSource"
        username="<username>"
        password="<password>"
        driverClassName="net.sourceforge.jtds.jdbc.Driver"
        url="jdbc:jtds:sqlserver://<servername>;database=<databasename>"
    	maxActive="20"
    	maxIdle="10"
    	validationQuery="select 1" /&gt;
```

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

### Dependencies for CentOS 7

Standard packages for CentOS 7 are Java 1.7, Tomcat 7, NPM 1.3.6 and Maven 3.0.5. To get NPM you need to install the Extra Packages for Enterprise Linux (epel-release).
```
yum install epel-release git npm java maven tomcat tomcat-native bzip2 unzip
```

For historical reasons the database is SQL Server. You can get a gratis JDBC driver from [Microsoft](http://msdn.microsoft.com/data/jdbc)
