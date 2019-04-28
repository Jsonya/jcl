#!/usr/bin/env bash

OPTION=$1
VERSION="$(npm --no-git-tag-version version $OPTION)"
git add ./package.json ./package-lock.json
git commit -m "release: $VERSION"
git push origin master
git tag -a $VERSION -m "chore: $VERSION"
git push origin $VERSION
npm publish
echo
echo "version: $VERSION"
