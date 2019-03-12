#!/bin/sh

BUILD_ENV=${1:-prod}
BUILD_ID=${2:-1}
BUILD_ID_BASE="0"
VERSION="${BUILD_ENV}-v${BUILD_ID_BASE}.${BUILD_ID}"

#frontend
cd frontend
npm i
npm run ${BUILD_ENV}
cd ..

#copy release
mkdir ~/.ssh
chmod 700 ~/.ssh
if ! grep -Fxq "kalaus.ru" my_list.txt
then
echo "Host kalaus" >> ~/.ssh/config
echo " Hostname kalaus.ru" >> ~/.ssh/config
echo " Port 2222" >> ~/.ssh/config
echo " HostKeyChecking no" >> ~/.ssh/config
fi
cp ./ssh/id_rsa ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
mkdir .release
cd .release
git init
git remote add origin ssh://git@kalaus.ru:2222/kalaus/tokdeck-release.git
git config core.autocrlf true
git config user.name "gitlab"
git config user.email "sergey.kalaus+gitlab@gmail.com"
#git fetch origin ${BUILD_ENV}
#git checkout ${BUILD_ENV}
git checkout -b ${BUILD_ENV}
git rm -rf .
git clean -fxd
cd ..
cp -R bin config docker express graphql lib model node_modules service ssl view Makefile package.json public .release
cd .release
git add .
git commit -am ${VERSION}
git tag ${VERSION}
git push origin ${BUILD_ENV}
git push origin ${VERSION}
