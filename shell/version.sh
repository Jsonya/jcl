#!/usr/bin/env bash

OPTION=$1
VERSION="$(npm --no-git-tag-version version $OPTION)"
npm run changelog
git add ./package.json
git commit -m "release: $VERSION"
git push origin master
npm publish
echo
echo "version: $VERSION"
