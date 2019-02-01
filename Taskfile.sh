#!/bin/bash
PATH=./node_modules/.bin:$PATH


# DEFAULT VARIABLES
ENV_NAME="dev"
ENV_FILE=".dev.env"
ENV_PATH="./.dev.env"

# HELPER FUNCTIONS
function load_env {
    if [ "$1" != "" ]
    then
        echo "STG >> .$1.env"
        ENV_NAME="$1"
        ENV_FILE=".$1.env"
        ENV_PATH="./.$1.env"
    fi
}

function kill_port {
    kill-port $1
}


# TASKS
function frontend {
    load_env $1
    echo "node -r dotenv/config -r ts-node/register frontend/fuse.ts default dotenv_config_path=$ENV_FILE"
    node -r dotenv/config -r ts-node/register frontend/fuse.ts default dotenv_config_path=$ENV_PATH
}

function backend {
    load_env $2
    BE_PORT=""
    if [ "$1" != "" ]
    then
        BE_PORT=" --port=$1"
    fi
    echo "ENV_FILE=$ENV_FILE pipenv run python ./backend/app.py" $BE_PORT
    ENV_FILE=$ENV_FILE pipenv run python ./backend/app.py $BE_PORT
}

function docker {
    docker-compose -f docker-compose.dev.yaml up -d
}

function emb {
    network="development"
    if [ "$1" != "" ]
    then
        network="$1"
    fi
    rsync -a embark/plugin.js node_modules/embark-tomo/
    echo 'Plugin copied!'
    echo "EXEC: embark run --nobrowser --noserver $network"
    embark run --nobrowser --noserver --nodashboard $network
}

function lint {
    tslint -c ./frontend/tslint.json './frontend/**/*.ts*'
}

# DEPLOY SCRIPTS
function dep {
    case "$1" in
        user) echo ">> CREATE TOR APP with USER: $2 at SERVER: $3"
              user=$2
              host=$3
              sshkey=$(cat ~/.ssh/id_rsa.pub)
              echo -e "$user\tALL=(ALL) NOPASSWD:ALL" | pbcopy
              ssh -t root@$3 "adduser $user"
              ssh -t root@$3 "usermod -aG sudo $user"
              ssh -t root@$3 "echo -e \"$user\tALL=(ALL) NOPASSWD:ALL\" >> /etc/sudoers"
              ssh -t root@$3 "mkdir /home/$user/.ssh"
              ssh root@$3 "touch /home/$user/.ssh/authorized_keys"
              ssh root@$3 "echo \"$sshkey\" > /home/$user/.ssh/authorized_keys"
              echo "Finished: you can now login on the server passwordless with ssh. Don't forget the update the local '~/.ssh/config'"
              ;;
        setup)  echo ">> SETUP SERVER & BASIC DEPENDENCIES"
                scp ./deploy/dep.sh tor:~/
                ssh -t tor "~/dep.sh install"
                ;;
        frontend)  echo ">> BUNDLE AND DEPLOY FRONTEND BUILD"
                   frontend prod
                   scp -r frontend/dist tor:~/relayerms/frontend/dist
                   ;;
        backend)  echo ">> Backend Task..."
                  if [ "$2" == "log" ]
                  then
                      echo ">> VIEW SERVER LOG"
                      echo "====================================================== SUPERVISOR log:"
                      ssh tor "cat /home/linuxbrew/.linuxbrew/var/log/supervisord.log"
                      echo "====================================================== TOR1 log:"
                      ssh tor "cat /home/linuxbrew/.linuxbrew/var/log/tor1_log.log"
                      echo "error >>>>>>>>"
                      ssh tor "cat /home/linuxbrew/.linuxbrew/var/log/tor1_err.log"
                      echo "====================================================== TOR2 log:"
                      ssh tor "cat /home/linuxbrew/.linuxbrew/var/log/tor2_log.log"
                      echo "error >>>>>>>>"
                      ssh tor "cat /home/linuxbrew/.linuxbrew/var/log/tor2_err.log"
                  else
                      echo ">> UPDATE BACKEND CODE"
                      scp ./supervisord.conf tor:~/relayerms/
                      scp ./.prod.env tor:~/relayerms/
                      ssh tor "supervisorctl reread"
                      ssh tor "supervisorctl update"
                  fi
                  ;;
        nginx) echo ">> UPDATE NGINX"
               ssh tor "sudo service nginx stop"
               scp ./deploy/nginx.conf tor:/etc/nginx/
               scp ./deploy/relayerms.nginx.conf tor:/etc/nginx/sites-available/relayerms
               ssh tor "sudo service nginx start"
               ;;
        *) echo "Task not recognized"
           ;;
    esac

}


# Which function? >>
"$@"
