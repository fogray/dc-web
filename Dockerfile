FROM tomcat:latest

RUN echo "Asia/shanghai" > /etc/timezone
RUN wget http://10.0.7.107:8082/remote.php/webdav/dc/dc.war --http-user=fogray --http-password=fogray --no-cache --no-dns-cache -O dc.war
RUN unzip dc.war -d /usr/local/tomcat/webapps/dc/ 
