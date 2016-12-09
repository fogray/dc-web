FROM tomcat:latest

RUN echo "Asia/shanghai" > /etc/timezone
RUN wget http://10.0.7.107:8082/remote.php/webdav/dc/dc-v1.war --http-user=fogray --http-password=fogray --no-cache --no-dns-cache -O dc-v1.war
RUN unzip dc-v1.war -d /usr/local/tomcat/webapps/dc/
