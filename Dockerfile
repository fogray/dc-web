FROM tomcat:latest

RUN echo "Asia/shanghai" > /etc/timezone
RUN wget http://10.110.1.99:8082/remote.php/webdav/dc/dc-v2.war --http-user=fogray --http-password=fogray --no-cache --no-dns-cache -O dc.war
RUN unzip dc.war -d /usr/local/tomcat/webapps/dc/
