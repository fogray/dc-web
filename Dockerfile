FROM tomcat:latest
 
RUN wget http://10.0.7.107:8082/remote.php/webdav/dc/dc_v1.war --http-user=fogray --http-password=fogray --no-cache --no-dns-cache -O dc.war
RUN unzip dc_v1.war -d /usr/local/tomcat/webapps/dc/
