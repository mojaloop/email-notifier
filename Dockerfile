FROM node:10.15.3-alpine
USER root

WORKDIR /opt/email-notifier

RUN apk --no-cache add git
RUN apk add --no-cache -t build-dependencies make gcc g++ python libtool autoconf automake \
    && cd $(npm root -g)/npm \
    && npm config set unsafe-perm true \
    && npm install -g node-gyp

COPY package.json package-lock.json* /opt/email-notifier/
RUN npm install --production && \
  npm uninstall -g npm

RUN apk del build-dependencies

COPY src /opt/email-notifier/src
COPY config /opt/email-notifier/config
COPY app.js /opt/email-notifier/
COPY templates /opt/email-notifier/templates

EXPOSE 3081
CMD node app.js