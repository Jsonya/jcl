#!/usr/bin/env bash

OPTION=$1
VERSION="$(npm --no-git-tag-version version $OPTION)"
git add ./package.json ./package-lock.json
git commit -m "release: $VERSION"
git push origin master
npm publish
echo
echo "version: $VERSION"
