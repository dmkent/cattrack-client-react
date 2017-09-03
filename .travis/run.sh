#!/bin/bash
#
# Runs tests depending on OS

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    exit 1
else
    npm run build
fi
