# TABLE OF CONTENTS

1.  [Introduction](#org836984f)
2.  [Development](#org957d994)
    -  [Setup](#org168090e)
    -  [Start hacking](#org30ae7c1)
        1.  [Frontend Development](#org7f062cc)
        2.  [Backend Development](#orga954538)
3.  [Development Roadmap](#roadmap)
4.  [Troubleshooting](#trouble)

<a id="org836984f"></a>

## Introduction

A Relayer Manager Application, built with Python, Tornado, and React's Create-React-App



<a id="org957d994"></a>

## Development


<a id="org168090e"></a>

### Setup
The following must be included in the development toolbelt:

-   pyenv
-   Python 3.7.* (recommended installing with pyenv)
-   Python 2.7 (recommended installing with pyenv, if not in the system yet)
-   pipenv
-   nvm
-   Docker


Now, install dependencies and get the app started.

Note that generally, you should be prepared to have 3 terminals running in parallel:

- Install frontend & node scripts dependencies
``` sh
$ npm install
```

- Install backend dependencies
``` sh
$ pipenv install
```

- Export **Taskfile** alias
``` sh
$ echo 'alias task="./Taskfile.sh"' >> ~/.bashrc
$ eval 'alias task="./Taskfile.sh"'
```

- Fire up database with Docker
``` sh
$ task docker
```

- All good, let's get Backend up and running, certainly in a different terminal from the Embark's
``` sh
$ task backend
```

- Finally, the frontend, in another terminal also
``` sh
$ task frontend
```

For any installation/running problem, check out [Troubleshooting](#trouble) guide



<a id="org30ae7c1"></a>

### Development

backend has the entry point called "app", frontend "index.jsx"
Those are where you get started.

<a id="org7f062cc"></a>

#### Frontend Development

-   Made with *Create-React-App*
-   State Management with *Redux-Zero* for complete isolation of LOGIC from UI
-   Stylesheet developed with SASS's SCSS, with support from *Bootstrap's Grid-System*


<a id="orga954538"></a>

#### Backend Development

-   Checkout Python Tornado docs&#x2026;
-   Communicate with Frontend through 2 channels: one is Socket and one for Restful API, checkout `backend/route` for details

<a id="roadmap"></a>


## Deployment
Please refer to this short [Deployment Guideline](https://github.com/tomochain/relayerms/tree/master/deploy)


## Development Roadmap

1. Relayer Registration & Update
   - [x] Backend Database
   - [x] SmartContract
   - [x] Depovs Document & Deployment
2. Refactoring frontend structure, finalise bundling setup
   - [x] Refactor UI/UX
   - [x] Login
3. Showing & Updating all filled Orders from Relayers(OrderBook) in real time
   - [ ] List all filled orders
   - [ ] Showing Fill Order Details
4. Showing & Updating all supported token available for trading
5. Listing signed & verified Relayers
   - [ ] Counting filled orders
   - [ ] Network volume details
6. Make Portable/Reusable API Kit



<a id="trouble"></a>

## Troubleshooting

**1. I can't install `web3`, something went wrong with the `node-gyp` build process.**

Our project is using python 3.7.x, which is not yet supported by **node-gyp**. In order to install web3 correctly,
install **python2.7** (if not installed yet), and config your npm's python path to it
```sh
$ pyenv install 2.7
```
Inquire **python2.7** path, and copy it
```sh
$ which python2.7
```
Config npm's python path
```sh
$ npm config set python <your-python2.7-path>
```
Then you can re-install things by running `npm i`

**2. I can't get the Backend running, something is wrong with the 'Port already in use' warning.**

Probably your Backend's last working session encountered some error and the event-loop is still occupying the
development port (eg 8888). Just kill the port and restart the app as normal, using `task kill-port 8888`
