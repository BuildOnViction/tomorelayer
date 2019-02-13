# TL;DR

1. Prepare
- First, have a local **.prod.env** file.
- We are going to use **Taskfile** to run deploy tasks, so it is generally advised to make an alias for it:
``` shell
$ eval 'alias task="./Taskfile.sh"'
```

2. Server requirements
- Ubuntu 18.10
- Setup a non-root user, sudo privileges with ssh & authorized_keys, NO-PASSWORD sudo for command executions:
``` shell
$ task dep user <user_name> <host_ip>
```

3. Setup everything, including **pyenv**, **python**, **nginx**, **supervisor** and stuffs...
``` shell
$ task dep setup
```

Note:
- During the setup, you may need to manually input user password.
- If get stuck installing *python3*, hit **Ctrl+C**
- After setup, you may also need to manually change Postgres password depending on your **.prod.env** file.

4. Running the Application
``` shell
$ task dep frontend
$ task dep backend
```

Thats it!
---

# DIVING DEEP...
## As root, bootstrapping the whole system with pipenv
``` shell
$ apt-get install python
$ curl https://raw.githubusercontent.com/kennethreitz/pipenv/master/get-pipenv.py | python
```


## Create an user & grant sudo privileges, eg: "tor"
*Note*: **pyenv** practically doesn't work with root privileges, so a **sudo** user (eg: *tor*) is required
```shell
$ adduser tor
$ usermod -aG sudo tor
$ su - tor
```


## After login as the new user, install neccessary official packages
```shell
$ sudo apt-get update
$ sudo apt-get install -y git python-pip nginx postgresql postgresql-contrib linuxbrew-wrapper \
make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev \
libsqlite3-dev llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev \
libffi-dev liblzma-dev python-openssl supervisor
```


#### Some special dependencies require special cares
Node 10:
``` shell
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ sudo apt-get install nodejs
```

PostgreSQL v10:
- create user, with proper privileges
- create db
- setup port
``` shell
$ sudo apt install postgresql postgresql-contrib
$ sudo su - postgres -c "createuser <user>"
$ sudo su - postgres -c "createdb <db>"

# if you want to set password
$ sudo -u postgres psql postgres
postgres=# \password <user>

$ sudo -u postgres psql
postgres=# grant all privileges on database <db-name> to <db-user>;
<Ctrl+D to exit>

$ nano /etc/postgresql/10/main/postgresql.conf
# change the port, then start postgres server
$ sudo service postgresql start
# or
$ sudo systemctl restart postgresql.service
```

- Install [Pyenv](https://github.com/pyenv/pyenv#installation )
  - Install **Python 3.7.2** with `pyenv`
  - Refer to [Common-build-problem](https://github.com/pyenv/pyenv/wiki/Common-build-problems ) if stuck with installing python3


## Code setup
- Pull the code there, install application dependencies
```shell
$ cd ~
$ git clone <repo:relayerms>
$ cd relayerms
$ npm install
$ pipenv install
```

Copy your `.prod.env` file to the source code folder. Build the distributed packages
```shell
$ scp <path:to:prod.env> tor:~/relayerms/
$ ssh tor
$ cd relayerms
$ task frontend prod
```


## Make server go online
#### Tornado & Supervisor
```shell
$ supervisord -c ~/relayerms/deploy/supervisord.conf
```

#### Nginx & bundled frontend assets
```shell
$ sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx
$ cp /srv/www/deploy/nginx.conf /etc/nginx/
$ cp /srv/www/deploy/relayerms.nginx.conf /etc/nginx/site-available/relayerms
$ sudo ln -s /etc/nginx/sites-available/relayerms /etc/nginx/sites-enabled/relayerms
$ sudo rm -r /etc/ngingx/sites-enabled/default
$ /etc/init.d/nginx start
```
