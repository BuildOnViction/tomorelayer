# Table of Contents

1.  [Introduction](#org5af4ab1)
2.  [First](#orgb8065f4)
    1.  [Pre-requisite](#org9d5cffc)
    2.  [Setup](#org7c43281)
    3.  [Start hacking](#org89ee27b)
        1.  [Frontend Development](#org528f942)
        2.  [Backend Development](#orgc1616a8)



<a id="org5af4ab1"></a>

# Introduction

A Relayer Manager, spawning custom relayer to tomochain blockchain infrastructure at will


<a id="orgb8065f4"></a>

# First


<a id="org9d5cffc"></a>

## Pre-requisite

-   Python 3.7 (recommended installing with pyenv)
-   pipenv
-   nvm
-   yarn
-   Docker


<a id="org7c43281"></a>

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


<a id="org89ee27b"></a>

## Start hacking

backend has the entry point called "app", frontend "index.tsx"
Those are where you get started.


<a id="org528f942"></a>

### Frontend Development

-   Libraries for frontend development includes mainly React & Atlaskit.
-   State Management & Code Splitting are handled using native React API instead of external libraries such as Redux and React-Loadable. This keeps the app minimal as
    it could be.
-   Stylesheet lang is SASS's SCSS
-   Generally, we are using **Typescript Compiler** for compiling ease & speed, also this helps eliminate the redundancy of babel
    plugins. Technically there is nothing change with React Development, except file extension now should be **"tsx"** instead
    of usual **"jsx"**.
-   **Wretch** is used instead of Axios/Fetch. It provides smaller and more intuitive async code


<a id="orgc1616a8"></a>

### Backend Development

-   Checkout Python Tornado docs&#x2026;
