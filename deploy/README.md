# Easy way: use Task-runner script to deploy

1. Prepare
- First, have a local **.env.production** file.
- We are going to use **Taskfile** to run deploy tasks, so it is generally advised to make an alias for it:
``` shell
$ eval 'alias task="./Taskfile.sh"'
```
- Have a ssh config file (eg: `~/.ssh/config`)that contains something like this...
```
Host tor
 HostName <host_ip>
 User root
 AddKeysToAgent yes
 UseKeychain yes
 IdentitiesOnly yes
 IdentityFile ~/.ssh/id_rsa
```

2. Server requirements
- Ubuntu 18.10
- Run the following command
``` shell
$ task dep setup
```

Note:
- After setup, you may also need to manually change Postgres password depending on your **.env.production** file.

3. Running the Application
``` shell
$ task dep frontend
$ task dep backend
```

Thats it!



# Diving deep...
## As root, bootstrapping the whole system with pipenv and other neccessary dependency packages
``` shell
$ apt-get update
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ apt-get install -y git python python-pip nginx postgresql postgresql-contrib \
make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev \
libsqlite3-dev llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev \
libffi-dev liblzma-dev python-openssl supervisor
$ curl https://raw.githubusercontent.com/kennethreitz/pipenv/master/get-pipenv.py | python
```

#### Some special dependencies require special cares
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
$ git clone <repo:tomorelayer>
$ cd tomorelayer
$ npm install
$ pipenv install
```

Copy your `.env.production` file to the source code folder. Build the distributed packages
```shell
$ scp <path:to:prod.env> tor:/srv/www/tomorelayer/
$ ssh tor
$ cd tomorelayer
$ task frontend prod
```


## Make server go online
#### Tornado & Supervisor
```shell
$ supervisord -c /srv/www/tomorelayer/deploy/supervisord.conf
```

#### Nginx & bundled frontend assets
```shell
$ sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx
$ cp /srv/www/deploy/nginx.conf /etc/nginx/
$ cp /srv/www/deploy/tomorelayer.nginx.conf /etc/nginx/site-available/tomorelayer
$ sudo ln -s /etc/nginx/sites-available/tomorelayer /etc/nginx/sites-enabled/tomorelayer
$ sudo rm -r /etc/ngingx/sites-enabled/default
$ /etc/init.d/nginx start
```
