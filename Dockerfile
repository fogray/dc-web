FROM tomcat:latest

RUN wget http://10.0.7.107:8082/remote.php/webdav/dc/dc.war?downloadStartSecret=34ikij71jhh --http-user=fogray --http-password=fogray -O dc.war
RUN unzip dc.war  -d /usr/local/tomcat/webapps/dc/
