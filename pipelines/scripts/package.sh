#!/bin/bash

WORKSPACE=${WORKSPACE:-`pwd`}

source ${WORKSPACE}/pipelines/scripts/bootstrap.sh
export COMPOSE_HTTP_TIMEOUT=3600

artifact=$1
version=$2

COMMAND="touch -c *; \
  echo -e \"\nartifact_version=$version\" >> /home/jenkins2/workspace/microservice.metadata; \
  npm prune --production && \
  rm -rf j2 && mkdir -p j2  && \
  tar --warning=no-file-removed \
    --warning=no-file-changed \
    --dereference \
    --ignore-failed-read \
    --exclude='*.tar.gz' \
    --exclude='.cfignore' \
    --exclude='.git*' \
    --exclude='.eslint*' \
    --exclude='pipelines' \
    --exclude='Jenkinsfile' \
    --exclude='specs' \
    --exclude='Dockerfile.*' \
    --exclude='docker-*.*' \
    --exclude='.dockerignore' \
    --exclude='.apiconnect' \
    --exclude='*.log' \
    --exclude='log' \
    --exclude='logs' \
    --exclude='component-test' \
    --exclude='coverage' \
    --exclude='j2' \
    -zcf j2/${artifact} \
    . || true "

docker-compose -p ${WORKSPACE} -f yml/test.yml rm -f || true
docker-compose -p ${WORKSPACE} -f yml/test.yml run --rm node-example-microservice bash -c "${COMMAND}"
