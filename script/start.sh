#!/bin/sh
set -eu

cd ${0%/*}

docker-compose -p $(yq -o y '.name' ../docker_compose/main.json) down
docker-compose -f ../docker_compose/main.json up -d --build