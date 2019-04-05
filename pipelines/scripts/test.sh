#!/bin/bash

WORKSPACE=${WORKSPACE:-`pwd`}

source ${WORKSPACE}/pipelines/scripts/bootstrap.sh
export COMPOSE_HTTP_TIMEOUT=3600

docker-compose -p ${WORKSPACE} -f yml/test.yml rm -f || true
docker-compose -p ${WORKSPACE} -f yml/test.yml run --rm node-example-microservice bash -c "npm test"

find coverage/ -type f | xargs sed -i 's+/home/jenkins2/workspace/++g' || true
