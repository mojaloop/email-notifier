# Onboarding

>*Note:* Before completing this guide, make sure you have completed the _general_ onboarding guide in the [base mojaloop repository](https://github.com/mojaloop/mojaloop/blob/main/onboarding.md#mojaloop-onboarding).

## Contents

<!-- vscode-markdown-toc -->
1. [Prerequisites](#Prerequisites)
2. [Installing and Building](#InstallingandBuilding)
3. [Running Locally](#RunningLocally)
4. [Running Inside Docker](#RunningInsideDocker)
5. [Testing](#Testing)
6. [Common Errors/FAQs](#CommonErrorsFAQs)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

#  1. <a name='Prerequisites'></a>Prerequisites

If you have followed the [general onboarding guide](https://github.com/mojaloop/mojaloop/blob/main/onboarding.md#mojaloop-onboarding), you should already have the following cli tools installed:

* `brew` (macOS), [todo: windows package manager]
* `curl`, `wget`
* `docker` + `docker-compose`
* `node`, `npm` and (optionally) `nvm`

In addition to the above cli tools, you will need to install the following to build and run the `email-notifier`:


###  1.1. <a name='macOS'></a>macOS
```bash
#none - you have everything you need!
```

###  1.2. <a name='Linux'></a>Linux

[todo]

###  1.3. <a name='Windows'></a>Windows

[todo]


##  2. <a name='InstallingandBuilding'></a>Installing and Building

Firstly, clone your fork of the `email-notifier` onto your local machine:
```bash
git clone https://github.com/<your_username>/email-notifier.git
```

Then `cd` into the directory and install the node modules:
```bash
cd email-notifier
npm install
```

> If you run into problems running `npm install`, make sure to check out the [Common Errors/FAQs](#CommonErrorsFAQs) below.

##  3. <a name='RunningLocally'></a>Running Locally (with dependencies inside of docker)

In this method, we will run core dependencies (`kafka`) inside of docker containers, while running the `email-notifier` server on your local machine.

> Alternatively, you can run the `email-notifier` inside of `docker-compose` with the rest of the dependencies to make the setup a little easier: [Running Inside Docker](#RunningInsideDocker).

**1. Run the dependencies in `docker-compose`:**

```bash
# start the dependencies inside of docker
docker-compose up kafka

```

**3. Configure the default files and run the server**
```bash
# start the server
npm run start
```

Upon running `npm run start`, your output should look similar to:

```bash

> email-notifier@6.2.0 start /<path_to>/email-notifier
> WITH_SASL=0&&LD_LIBRARY_PATH=$PWD/node_modules/node-rdkafka/build/deps&& node app.js

2019-06-03T07:23:27.850Z - info: Connection with database succeeded.
2019-06-03T07:23:27.863Z - info: CreateHandle::connect - creating Consumer for topics: [topic-notification-event]
2019-06-03T07:23:28.116Z - info: CreateHandle::connect - successful connected to topics: [topic-notification-event]
healthcheck is listening on port 3080

```

##  4. <a name='RunningInsideDocker'></a>Running Inside Docker

We use `docker-compose` to manage and run the `email-notifier` along with its dependencies with one command.

>*Note:* Before starting all of the containers however, start the `mysql` container alone, to give it some more time to set up the necessary permissions (this only needs to be done once). This is a short-term workaround because the `central-ledger` (which is a dependency of `email-notifier`) doesn't retry it's connection to MySQL.


**1. First run the mysql container, then run the test of the containers**
```bash
docker-compose up mysql #first time only - the initial mysql load takes a while, and if it's not up in time, the central-ledger will just crash

npm run docker:up
```

This will do the following:
* `docker pull` down any dependencies defined in the `docker-compose.yml` file
* `docker build` the `email-notifier` image based on the `Dockerfile` defined in this repo
* run all of the containers together (`central-ledger`, `ml-api-adapter`, `central-event-processor`, `email-notifier`)


### 4.1 Handy Docker Compose Tips

You can run `docker-compose` in 'detached' mode as follows:

```bash
npm run docker:up -- -d
```

And then attach to the logs with:
```bash
docker-compose logs -f
```

When you're done, don't forget to stop your containers however:
```bash
npm run docker:stop
```

##  5. <a name='Testing'></a>Testing

We use `npm` scripts as a common entrypoint for running the tests.
```bash
# unit tests:
npm run test:unit

# check test coverage
npm run test:coverage
```

### 5.1 Testing the `email-notifier` API with Postman

>Note: Make sure you have installed Postman and cloned the `mojaloop/postman` repo, which contains all the required collections and environments. You can find detailed instructions for this in the [general onboarding guide](https://github.com/mojaloop/mojaloop/blob/main/onboarding.md#2-postman).


#### Prerequisites:
* `ml-api-adapter` and `central-ledger` services running (follow the [Running Inside Docker guide](#RunningInsideDocker) to get these services up and running)
* _Optionally_, run `central-timeout` , `cental-settlement` as well.

##  6. <a name='CommonErrorsFAQs'></a>Common Errors/FAQs

#### 6.1 `sodium v1.2.3` can't compile during npm install

Resolved by installing v2.0.3 `npm install sodium@2.0.3`


#### 6.2 `./src/argon2_node.cpp:6:10: fatal error: 'tuple' file not found` 

Resolved by running `CXX='clang++ -std=c++11 -stdlib=libc++' npm rebuild`


#### 6.3 On macOS, `npm install` fails with the following error
```
Undefined symbols for architecture x86_64:
  "_CRYPTO_cleanup_all_ex_data", referenced from:
      _rd_kafka_transport_ssl_term in rdkafka_transport.o
  "_CRYPTO_num_locks", referenced from:
  ........
  ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation) 
```

Resolved by installing openssl `brew install openssl` and then running: 
  ```bash
  export CFLAGS=-I/usr/local/opt/openssl/include 
  export LDFLAGS=-L/usr/local/opt/openssl/lib 
  npm install
  ``` 
