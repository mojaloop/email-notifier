# email-notifier
[![Git Commit](https://img.shields.io/github/last-commit/mojaloop/email-notifier.svg?style=flat)](https://github.com/mojaloop/email-notifier/commits/master)
[![Git Releases](https://img.shields.io/github/release/mojaloop/email-notifier.svg?style=flat)](https://github.com/mojaloop/email-notifier/releases)
[![Docker pulls](https://img.shields.io/docker/pulls/mojaloop/email-notifier.svg?style=flat)](https://hub.docker.com/r/mojaloop/email-notifier)
[![CircleCI](https://circleci.com/gh/mojaloop/email-notifier.svg?style=svg)](https://app.circleci.com/pipelines/github/mojaloop/email-notifier)

Email Notifier is a stand-alone email service that consumes messages from kafka topic, produced by the central-event-processor service.
The central-event-processor repo is available [here](https://github.com/mojaloop/central-event-processor/tree/master)
The email-notifier flow is available [here](https://github.com/mojaloop/central-event-processor/tree/master#Notifierflowseparateservice)

## Contents

- [email-notifier](#email-notifier)
  - [Contents](#contents)
  - [Todo](#todo)
  - [Config](#config)
  - [Troubleshooting `npm install` on MacOS](#troubleshooting-npm-install-on-macos)
  - [Auditing Dependencies](#auditing-dependencies)
  - [Container Scans](#container-scans)

## Todo

- Improve code-coverage to 90% across the board: [.nycrc.yml](./.nycrc.yml). Don't forget to un-comment out the branches code-coverage rule.

## Config

Refer to [`./config/default.json`](config/default.json) for a detailed look at the configuration options.

For configuring email:

```json
  "emailSettings": {
    "smtpConfig": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secureConnection": false,
      "tls": {
        "ciphers":"SSLv3"
     },
      "auth": {
        "user": "modusboxnotifier@gmail.com",
        "pass": "m0dusb0xn0t1f13r"
      }
    }
  }
```

Those can be passed as the following environment variables:

```json
{
  "emailSettings": {
    "smtpConfig": {
      "host": "MAIL_NOTIF_SMTP_HOST",
      "port": "MAIL_NOTIF_SMTP_PORT",
      "secureConnection": "MAIL_NOTIF_SMTP_SECURE_FLAG",
      "tls": {
        "ciphers":"MAIL_NOTIF_SMTP_TLS_CIPHERS"
     },
      "auth": {
        "user": "MAIL_NOTIF_SMTP_USER",
        "pass": "MAIL_NOTIF_SMTP_PASS"
      }
    }
  }
}
```

## Troubleshooting `npm install` on MacOS

If you have this or similar error during installation:

```bash
npm install
> node-gyp rebuild
clang: error: linker command failed with exit code 1
```

add the following environment variables:
```bash
export CPPFLAGS=-I/usr/local/opt/openssl/include
export LDFLAGS=-L/usr/local/opt/openssl/lib
```

## Auditing Dependencies

We use `npm-audit-resolver` along with `npm audit` to check dependencies for node vulnerabilities, and keep track of resolved dependencies with an `audit-resolve.json` file.

To start a new resolution process, run:

```bash
npm run audit:resolve
```

You can then check to see if the CI will pass based on the current dependencies with:

```bash
npm run audit:check
```

And commit the changed `audit-resolve.json` to ensure that CircleCI will build correctly.
## Container Scans

As part of our CI/CD process, we use anchore-cli to scan our built docker container for vulnerabilities upon release.

If you find your release builds are failing, refer to the [container scanning](https://github.com/mojaloop/ci-config#container-scanning) in our shared Mojaloop CI config repo. There is a good chance you simply need to update the `mojaloop-policy-generator.js` file and re-run the circleci workflow.

For more information on anchore and anchore-cli, refer to:

- [Anchore CLI](https://github.com/anchore/anchore-cli)
- [Circle Orb Registry](https://circleci.com/orbs/registry/orb/anchore/anchore-engine)

## Automated Releases

As part of our CI/CD process, we use a combination of CircleCI, standard-version
npm package and github-release CircleCI orb to automatically trigger our releases
and image builds. This process essentially mimics a manual tag and release.
On a merge to master, CircleCI is configured to use the mojaloopci github account
to push the latest generated CHANGELOG and package version number.
Once those changes are pushed, CircleCI will pull the updated master, tag and
push a release triggering another subsequent build that also publishes a docker image.
### Potential problems
*   There is a case where the merge to master workflow will resolve successfully, triggering
    a release. Then that tagged release workflow subsequently failing due to the image scan,
    audit check, vulnerability check or other "live" checks.
    This will leave master without an associated published build. Fixes that require
    a new merge will essentially cause a skip in version number or require a clean up
    of the master branch to the commit before the CHANGELOG and bump.
    This may be resolved by relying solely on the previous checks of the
    merge to master workflow to assume that our tagged release is of sound quality.
    We are still mulling over this solution since catching bugs/vulnerabilities/etc earlier
    is a boon.
*   It is unknown if a race condition might occur with multiple merges with master in
    quick succession, but this is a suspected edge case.
