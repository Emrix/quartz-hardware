#!/bin/bash

echo "Waiting for START SERVICE"
while [ "$varname" != "START SERVICE" ];
do
	read varname
	echo $varname
done

echo "Started Service.  Wating for for STOP SERVICE"

read varname

while [ "$varname" != "STOP SERVICE" ];
do
#	echo $varname &
	read varname
done

echo "Service Stopped"