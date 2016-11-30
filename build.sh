#!/bin/bash
 
#1 创建构建日志文件
buildlog=/var/owncloud/data/fogray/files/dc/logs/build.log
touch $buildlog
echo "*******************start**************" >> $buildlog
date >> $buildlog
 
#2 获取已经在运行的dc的container ID
CID=$(docker ps | grep "dc" | awk '{print $1}')
echo "正在运行的dc容器ID$CID" >> $buildlog

#3 构建image
docker build -t dc . | tee -a $buildlog
RESULT=$(cat $buildlog | tail -n 1)
if [["$RESULT" != *Successfully*]];then
#4 构建image失败，跳出脚本
  exit -1
fi

#5 停止并删除正在运行的dc container
if [ "$CID" != "" ];then
  echo '>>停止正在运行的dc容器' >> $buildlog
  docker stop $CID | tee -a $buildlog
  echo '>>删除正在运行的dc容器' >> $buildlog
  docker rm $CID | tee -a $buildlog
fi
 
#6 运行构建好的dc image
#挂载jdbc.properties文件，动态配置数据源
docker run -d -p 10060:8080 --add-host=7_107:10.0.7.107 --add-host=7_108:10.0.7.108 --add-host=7_105:10.0.7.105  dc | tee -a $buildlog

echo "*******************end**************" >> $buildlog
