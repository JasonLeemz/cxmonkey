#!/bin/bash
start=`netstat -altnp|grep 3000`
if [ -z "$start" ]
then /home/www/cxmonkey/start.sh
fi

