## Create an user & grant sudo privileges, eg **tor**
```sh
$ adduser tor
$ usermod -aG sudo tor
$ su - tor
```

## After login as the new user, install neccessary official packages
```sh
$ sudo apt-get install git nginx
```
#### Some special dependencies require special cares
Node v10
```sh
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ sudo apt install nodejs
```

PostgreSQL v10:
- create user, with proper privileges
- create db
- setup port
``` shell
$ sudo apt install postgresql postgresql-contrib
$ sudo su - postgres -c "createuser <user>"
$ sudo su - postgres -c "createdb <db>"
$ sudo -u postgres psql
postgres=# grant all privileges on database johndb to john;
<Ctrl+D to exit>
$ nano /etc/postgresql/10/main/postgresql.conf
# change the port, then start postgres server
$ sudo service postgresql start
# or
$ sudo systemctl restart postgresql.service
```

## Code setup
Where?
- Take the ownership and make a `www` dir at `root/srv`
- Pull the code here
```sh
$ sudo chown -R $USER /srv
$ sudo mkdir /srv/www
$ cd /srv/www
$ git clone <repo:relayerms>
$ cd relayerms
```

Install application dependencies
```sh
$ npm install
```

Build the distributed packages
```sh
$ npm run fe
```

## Make server go online
#### Nginx
```sh
$ sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx
$ cp /srv/www/deploy/nginx.conf /etc/nginx/
$ cp /srv/www/deploy/relayerms.nginx.conf /etc/nginx/site-available/relayerms
$ sudo ln -s /etc/nginx/sites-available/relayerms /etc/nginx/sites-enabled/relayerms
$ sudo rm -r /etc/ngingx/sites-enabled/default
$ /etc/init.d/nginx start
```
