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

A Relayer Manager Application



<a id="org957d994"></a>

## Development


<a id="org168090e"></a>

### Setup
The following must be included in the development toolbelt:

-   pyenv
-   Python 3.7 (recommended installing with pyenv)
-   Python 2.7 (recommended installing with pyenv, if not in the system yet)
-   pipenv
-   nvm
-   yarn
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

- Fire up database with Docker
``` sh
$ npm run dock
```

- Run Embark to compile all smart contracts. We are gonna need the contracts data ready first so Backend can interact
with. In development mode, Embark watches all the file changes and does the hot-reloading for us, so you should run the
following command in a separate terminal.
``` sh
$ npm run ebc
```

- All good, let's get Backend up and running, certainly in a different terminal from the Embark's
``` sh
$ npm run be
```

- Finally, the frontend, in another terminal also
``` sh
$ npm run fe
```

For any installation/running problem, check out [Troubleshooting](#trouble) guide



<a id="org30ae7c1"></a>

### Start hacking

backend has the entry point called "app", frontend "index.tsx"
Those are where you get started.

<a id="org7f062cc"></a>

#### Frontend Development

-   Libraries for frontend development includes mainly React & BlueprintJS.
-   State Management & Code Splitting are handled with `Redux-Zero` and native React v16-API
-   Stylesheet developed with SASS's SCSS, with Bootstrap's Grid-System and BlueprintJSS's configurable theming variables
-   Javascript development with **Typescript Compiler** for compiling ease & speed, also this helps eliminate the redundancy of babel
    plugins. Typing is totally optional.


<a id="orga954538"></a>

#### Backend Development

-   Checkout Python Tornado docs&#x2026;

<a id="roadmap"></a>



## Development Roadmap

1. Relayer Registration & Update
   - [x] Backend Database
   - [x] SmartContract
2. Showing & Updating all filled Orders from Relayers(OrderBook) in real time
   - [ ] List all filled orders
   - [ ] Showing Fill Order Details
3. Showing & Updating all supported token available for trading
4. Listing signed & verified Relayers
   - [ ] Counting filled orders
   - [ ] Network volume details
5. Make Portable/Reusable API Kit



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
development port (eg 8888). Just kill the port and restart the app as normal, using `npm run kp`
