# Table of Contents

1.  [Introduction](#orgef97b8d)
2.  [First](#orgf2fdaae)
    1.  [Pre-requisite](#org7590eb3)
    2.  [Setup](#org96f2328)
    3.  [Start hacking](#org2c5686d)



<a id="orgef97b8d"></a>

# Introduction

A Relayer Manager, spawning custom relayer to tomochain blockchain infrastructure at will


<a id="orgf2fdaae"></a>

# First


<a id="org7590eb3"></a>

## Pre-requisite

-   Python 3.7 (recommended installing with pyenv)
-   pipenv
-   nvm
-   yarn
-   Docker


<a id="org96f2328"></a>

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

    $ yarn frontend
    $ yarn backend


<a id="org2c5686d"></a>

## Start hacking

Both frontend & backend have the similar entry point called "app".
Those are where you get started.
