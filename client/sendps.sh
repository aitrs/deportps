#!/bin/sh
set -e
confile="/etc/monitor/conf.json"
perl ./jsonps.pl > /tmp/ps.json 
curl -d @/tmp/ps.json -H "Content-Type: application/json" -X POST http://90.73.60.243:1312/deportps/register
