#!/bin/bash

set +ex

error_generate() {
  if ! [ "${exit_code}" == "" ];then
	  echo -e '\E[37;44m'"\033[1m${1}\033[0m"
	  echo $1 >> ${WORKSPACE}/failure.txt
	  exit 1
  fi
}

source ~/.bashrc

export HTTP_PROXY="http://10.113.140.187:3128"
export HTTPS_PROXY="http://10.113.140.187:3128"
export http_proxy="http://10.113.140.187:3128"
export https_proxy="http://10.113.140.187:3128"
export no_proxy=localhost,127.0.0.1,sandbox.local,lbg.eu-gb.mybluemix.net,lbg.eu-gb.bluemix.net,10.113.140.170,10.113.140.179,10.113.140.187,10.113.140.168,jenkins.sandbox.extranet.group,nexus.sandbox.extranet.group,gerrit.sandbox.extranet.group,sonar.sandbox.extranet.group

export SASS_BINARY_PATH=${SASS_BINARY_PATH:=~/linux-x64-46_binding.node}

export CC=/apps/tools/devtoolset-1.1/root/usr/bin/gcc
export CPP=/apps/tools/devtoolset-1.1/root/usr/bin/cpp
export CXX=/apps/tools/devtoolset-1.1/root/usr/bin/c++
export NVM_NODEJS_ORG_MIRROR=http://10.113.140.187/nexus/content/sites/binaries/node

export "PATH=/apps/tools/node6/bin:~/tools/:/usr/local/bin:/bin:${PATH}"

npm config delete proxy

npm set progress=false
npm set phantomjs_cdnurl="https://nexus.sandbox.extranet.group/nexus/content/repositories/binaries/phantomjs"
npm set prefix="/usr/local"
npm set registry="https://nexus.sandbox.extranet.group/nexus/content/groups/npm-master"
npm set tmp='~/tmp'

npm config set strict-ssl false
npm config set chromedriver_cdnurl https://nexus.sandbox.extranet.group/nexus/content/sites/binaries/chromedriver

set -ex
