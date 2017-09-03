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
if [ -z "${DEPLOY_HOST_FINGER}" ] ;
then
    echo "DEPLOY_HOST_FINGER not set."
    exit 1
fi

# Ensure is in known hosts.
if [ -z "$( grep "${DEPLOY_HOST}" ~/.ssh/known_hosts)" ] ;
then
    echo "[${DEPLOY_HOST}]:${DEPLOY_SSH_PORT} ecdsa-sha2-nistp256 ${DEPLOY_HOST_FINGER}" >> ~/.ssh/known_hosts
fi

rsync -e "ssh -o BatchMode=yes -p ${DEPLOY_SSH_PORT} -i ./.travis/deploy_key" -avz dist/ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEST}
