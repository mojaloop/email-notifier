# email-notifier
Stand-alone email service that consumes messages from kafka topic, produced by the central-notifications service.
The central-notificattions repo is available [here](https://github.com/mojaloop/central-notifications/tree/master)
The email-notifier flow is available [here](https://github.com/mojaloop/central-notifications/tree/master#Notifierflowseparateservice)

## Mac OS installation problems

If you have this or similar error during installation:

```
\> node-rdkafka@2.4.2 install /Users/georgi/mb/mojaloop/email-notifier/node_modules/node-rdkafka
> node-gyp rebuild
clang: error: linker command failed with exit code 1 (use -v to see invocation)
make[2]: *** [librdkafka.1.dylib] Error 1
make[1]: *** [libs] Error 2
make: *** [11a9e3388a67e1ca5c31c1d8da49cb6d2714eb41.intermediate] Error 2
rm 11a9e3388a67e1ca5c31c1d8da49cb6d2714eb41.intermediate
gyp ERR! build error
gyp ERR! stack Error: `make` failed with exit code: 2
gyp ERR! stack     at ChildProcess.onExit (/Users/georgi/.nvm/versions/node/v10.15.1/lib/node_modules/node-gyp/lib/build.js:262:23)
gyp ERR! stack     at ChildProcess.emit (events.js:189:13)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:248:12)
gyp ERR! System Darwin 18.5.0
gyp ERR! command "/Users/georgi/.nvm/versions/node/v10.15.1/bin/node" "/Users/georgi/.nvm/versions/node/v10.15.1/lib/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /Users/georgi/mb/mojaloop/email-notifier/node_modules/node-rdkafka
gyp ERR! node -v v10.15.1
gyp ERR! node-gyp -v v4.0.0
gyp ERR! not ok
npm WARN ajv-keywords@2.1.1 requires a peer of ajv@^5.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN eslint-plugin-react@6.4.1 requires a peer of eslint@^2.0.0 || ^3.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN The package tape is included as both a dev and production dependency.
npm WARN The package tapes is included as both a dev and production dependency.

npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! node-rdkafka@2.4.2 install: `node-gyp rebuild`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the node-rdkafka@2.4.2 install script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/georgi/.npm/_logs/2019-04-30T10_05_32_579Z-debug.log
```

add the following environmental variables: 
```
export CPPFLAGS=-I/usr/local/opt/openssl/include
export LDFLAGS=-L/usr/local/opt/openssl/lib
```

## Config

Whole config is located [here](config/default.json)

The email settings are: 

```
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

Those can be passed as the following environmental variables: 

```
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

}  ```
