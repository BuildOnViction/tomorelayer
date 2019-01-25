## Create an user & grant sudo privileges, eg: "tor"
```shell
$ adduser tor
$ usermod -aG sudo tor
$ su - tor
```

## After login as the new user, install neccessary official packages
```shell
$ sudo apt-get update
$ sudo apt-get install git nginx python-pip
```

#### Some special dependencies require special cares
[Node-version-manager](https://github.com/creationix/nvm )

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

Linuxbrew, Pipenv and Python
- Install [Linuxbrew](https://linuxbrew.sh/ )

- Install [Pyenv](https://github.com/pyenv/pyenv#installation )
  - Install **Python 3.7.1** with `pyenv`
  - Refer to [Common-build-problem](https://github.com/pyenv/pyenv/wiki/Common-build-problems ) if stuck with installing python3

- Install [Pipenv](https://pipenv.readthedocs.io/en/latest/install/#installing-pipenv )


## Code setup
Where?
- Take the ownership and make a `www` dir at `root/srv`
```shell
$ sudo chown -R $USER /srv
$ sudo mkdir /srv/www
```

- Pull the code there, install application dependencies
```shell
$ cd /srv/www
$ git clone <repo:relayerms>
$ cd relayerms
$ npm install -g embark
$ npm install
```

Copy your `.prod.env` file to the source code folder and rename it to `.env`. Build the distributed packages
```shell
$ npm run fe
```

## Make server go online
#### Nginx
```shell
$ sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx
$ cp /srv/www/deploy/nginx.conf /etc/nginx/
$ cp /srv/www/deploy/relayerms.nginx.conf /etc/nginx/site-available/relayerms
$ sudo ln -s /etc/nginx/sites-available/relayerms /etc/nginx/sites-enabled/relayerms
$ sudo rm -r /etc/ngingx/sites-enabled/default
$ /etc/init.d/nginx start
```
