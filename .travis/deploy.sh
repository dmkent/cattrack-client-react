#!/bin/bash

if [ "master" = "${TRAVIS_BRANCH}" ] ;
then
    DEST=""
else
    DEST="stage/"
fi

if [ -z "${DEPLOY_USER}" ] ;
then
    echo "DEPLOY_USER not set."
    exit 1
fi
if [ -z "${DEPLOY_HOST}" ] ;
then
    echo "DEPLOY_HOST not set."
    exit 1
fi
if [ -z "${DEPLOY_SSH_PORT}" ] ;
then
    echo "DEPLOY_SSH_PORT not set."
    exit 1
fi

rsync -e "ssh -p ${DEPLOY_SSH_PORT} -i .travis/deploy_key" -avz dist/ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEST}
