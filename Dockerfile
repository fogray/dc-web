FROM tomcat:latest
 
RUN wget http://10.0.7.107:8082/remote.php/webdav/dc/dc.war?downloadStartSecret=lbtc9ywh57g --http-user=fogray --http-password=fogray -O dc.war
RUN unzip dc.war  -d /usr/local/tomcat/webapps/dc/
