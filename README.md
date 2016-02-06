E-PRTR 2
========

[![Build Status](http://ci.eionet.europa.eu/job/EPRTR2/badge/icon)](http://ci.eionet.europa.eu/job/EPRTR2/)

The application is available here: http://prtr-demo.eea.europa.eu/

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

The default configuration is to allow you to deploy to your own workstation directly. You install the target/eprtr-cms.war to Tomcat's webapps directory as cms.war. You can make it create an initial user with administrator rights by setting system properties to configure the application.

On a CentOS system you can start Tomcat with the environment variable CATALINA_OPTS set to some value or add lines to /etc/sysconfig/tomcat that looks like this:
```
CATALINA_OPTS="-Dcmsdb.url=jdbc:h2:tcp://localhost:8043//work/eprtrcms -Dstorage.dir=/work -Dupload.dir=/work"
```
These are the properties you can set:
```
cmsdb.driver
cmsdb.url
cmsdb.username
cmsdb.password
eprtrdb.driver
eprtrdb.url
eprtrdb.username
eprtrdb.password
storage.dir
```
The default values are in src/main/resources/application.properties

How to build
------------
You need Git to check the code out from the repository and to build you need Java and 
Maven.  All other dependencies will automatically be downloaded by Maven.

For Windows see the pages on:
* [Git for Windows](http://git-scm.com/downloads)
* [Maven for Windows](http://maven.apache.org/guides/getting-started/windows-prerequisites.html).
* [Node.js](http://nodejs.org/)

Before building you need to install Node.js. 

To build you do:
```
git clone https://github.com/eea/eprtr2.git
cd eprtr2
mvn.bat install
```

This will create a `target` subdirectory, build the code, run the tests and 
put a WAR file in target. You can then deploy this file to Tomcat. It contains 
an embedded database with demo data.

To build a completely minified version of the application do the following: 
```
grunt build
```

This will create a dist directory that contains the application fully minified.
To make a minified version of the war directory located at target\eprtr (and
assuming that `mvn install` and `grunt build` has been run) do the
following:

```
rmdir /s /q target\eprtr-min
mkdir target\eprtr-min
xcopy /s /q /i target\eprtr\bower_components target\eprtr-min\bower_components
xcopy /s /q /i target\eprtr\WEB-INF target\eprtr-min\WEB-INF
xcopy /s /q dist target\eprtr-min
```



### Dependencies for CentOS 7

Standard packages for CentOS 7 are Java 1.7, Tomcat 7, NPM 1.3.6 and Maven 3.0.5. To get NPM you need to install the Extra Packages for Enterprise Linux (epel-release).
```
yum install epel-release git npm java maven tomcat tomcat-native bzip2 unzip
```

For historical reasons the database is SQL Server. You can get a gratis JDBC driver from [Microsoft](http://msdn.microsoft.com/data/jdbc)
