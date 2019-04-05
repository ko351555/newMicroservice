FROM 10.112.159.88:40007/node/node:6.10.2

RUN useradd -u 1500 --create-home jenkins2 && \
    umask 002 && \
    mkdir -p /home/jenkins2/workspace && \
    chown -R jenkins2:jenkins2 /home/jenkins2/*

ENV NVM_NODEJS_ORG_MIRROR=https://nexus.sandbox.extranet.group/nexus/content/sites/binaries/node \
    NODE_TLS_REJECT_UNAUTHORIZED="0" \
		HTTP_PROXY=http://10.113.140.187:3128 \
		HTTPS_PROXY=http://10.113.140.187:3128 \
		http_proxy=http://10.113.140.187:3128 \
		https_proxy=http://10.113.140.187:3128 \
		no_proxy=mock-server,localhost,127.0.0.1,sandbox.local,lbg.eu-gb.mybluemix.net,lbg.eu-gb.bluemix.net,10.113.140.170,10.113.140.179,10.113.140.187,10.113.140.168,jenkins.sandbox.extranet.group,nexus.sandbox.extranet.group,gerrit.sandbox.extranet.group,sonar.sandbox.extranet.group,extranet.group

USER jenkins2
WORKDIR /home/jenkins2/workspace

RUN npm config set progress false && \
    npm config set registry https://nexus.sandbox.extranet.group/nexus/content/groups/npm-master/ && \
		npm config set strict-ssl false

COPY *.json ./
RUN npm i

COPY . ./

EXPOSE 3000
CMD [ "npm", "start" ]
