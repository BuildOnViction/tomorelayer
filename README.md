# Table of Contents

1.  [Introduction](#org836984f)
2.  [First](#org957d994)
    -  [Pre-requisite](#org168090e)
    -  [Setup](#orge4742dd)
    -  [Start hacking](#org30ae7c1)
        1.  [Frontend Development](#org7f062cc)
        2.  [Backend Development](#orga954538)
    -  [Development Roadmap](#roadmap)



<a id="org836984f"></a>

# Introduction

A Relayer Manager


<a id="org957d994"></a>

# Development


<a id="org168090e"></a>

### Pre-requisite
The following must be included in the development toolbelt:

-   Python 3.7 (recommended installing with pyenv)
-   pipenv
-   nvm
-   yarn
-   Docker

..then we go:

-   Install required & frontend dependencies

        $ yarn
-   Install backend dependencies

        $ pipenv install
-   Fireup database with Docker

        $ yarn db
-   Start the app

        $ yarn up

&#x2026;or you can start frontend and backend in two separate terminal windows

    $ yarn fe
    $ yarn be


<a id="org30ae7c1"></a>

### Start hacking

backend has the entry point called "app", frontend "index.tsx"
Those are where you get started.


<a id="org7f062cc"></a>

#### Frontend Development


-   Libraries for frontend development includes mainly React & BlueprintJS.
-   State Management & Code Splitting are handled using native React API instead of external libraries such as Redux and React-Loadable. This keeps the app minimal as it could be.
-   Stylesheet lang is SASS's SCSS
-   Generally, we are using **Typescript Compiler** for compiling ease & speed, also this helps eliminate the redundancy of babel
    plugins.
-   **Wretch** is used instead of Axios/Fetch. It provides smaller and more intuitive async code


<a id="orga954538"></a>

#### Backend Development

-   Checkout Python Tornado docs&#x2026;


<a id="roadmap"></a>
### Development Roadmap

1. Relayer Registration
   - [ ] Signing Relayer Contract
   - [ ] Storing Relayer Info off-chain (needed?)
   - [ ] Registering/Adding New Tokens
2. Showing & Updating all filled Orders from Relayers(OrderBook) in real time
   - [ ] List all filled orders
   - [ ] Showing Fill Order Details
3. Showing & Updating all supported token available for trading
4. Listing signed & verified Relayers
   - [ ] Counting filled orders
   - [ ] Network volume details
5. Make Portable/Reusable API Kit
