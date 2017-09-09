#!/bin/bash
#
# Runs tests depending on OS
set -e

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    exit 1
else
    npm run test:cov
    npm run build
fi
