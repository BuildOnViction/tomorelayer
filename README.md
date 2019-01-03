# Table of Contents

1.  [Introduction](#org836984f)
2.  [First](#org957d994)
    1.  [Pre-requisite](#org168090e)
    2.  [Setup](#orge4742dd)
    3.  [Start hacking](#org30ae7c1)
        1.  [Frontend Development](#org7f062cc)
        2.  [Backend Development](#orga954538)



<a id="org836984f"></a>

# Introduction

A Relayer Manager, spawning custom relayer to tomochain blockchain infrastructure at will


<a id="org957d994"></a>

# First


<a id="org168090e"></a>

## Pre-requisite

-   Python 3.7 (recommended installing with pyenv)
-   pipenv
-   nvm
-   yarn
-   Docker


<a id="orge4742dd"></a>

## Setup

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

## Start hacking

backend has the entry point called "app", frontend "index.tsx"
Those are where you get started.


<a id="org7f062cc"></a>

### Frontend Development

-   Libraries for frontend development includes mainly React & BlueprintJS.
-   State Management & Code Splitting are handled using native React API instead of external libraries such as Redux and React-Loadable. This keeps the app minimal as
    it could be.
-   Stylesheet lang is SASS's SCSS
-   Generally, we are using **Typescript Compiler** for compiling ease & speed, also this helps eliminate the redundancy of babel
    plugins. Technically there is nothing change with React Development, except file extension now should be **"tsx"** instead
    of usual **"jsx"**.
-   **Wretch** is used instead of Axios/Fetch. It provides smaller and more intuitive async code


<a id="orga954538"></a>

### Backend Development

-   Checkout Python Tornado docs&#x2026;
