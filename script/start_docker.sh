#!/bin/sh
set -eu

cd ${0%/*}

readonly file=../docker_compose/main.json

docker-compose -p $(yq -o y '.name' ${file}) down
docker-compose -f ${file} up -d --build