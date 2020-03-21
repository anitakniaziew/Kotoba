FROM node:dubnium
RUN npm install -g firebase-tools

ENTRYPOINT ["/usr/local/bin/firebase"]
