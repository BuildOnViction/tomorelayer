#!/bin/bash
PATH=./node_modules/.bin:$PATH
# TODO: add 'help'

function kill_port {
    kill-port $1
}


# TASKS
function frontend {
    echo "npm start"
    npm start
}

function backend {
    echo "npm run backend-tunnel"
    kill-port 8888
    npm run backend-tunnel
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

function lint-be {
    echo "Linting with Flake8............."
    pipenv run flake8 **/*.py
    echo "Linting with Pylint............."
    pipenv run pylint **/*.py
}


# DEPLOY SCRIPTS
function dep {
    case "$1" in
        setup) echo ">> CREATE TOR APP at SERVER"
               scp ./deploy/dep.sh tor:~/
               ssh -t tor "~/dep.sh install"
               echo "Finished. Don't forget the update the local '~/.ssh/config' and change POSTGRES password"
               ;;
        frontend)  echo ">> BUNDLE AND DEPLOY FRONTEND BUILD"
                   scp ./.prod.env tor:/srv/www/relayerms/
                   if [ "$2" == "swap" ]
                   then
                       # Hot-swapping frontend bundle from local to server
                       frontend prod
                       scp -r frontend/dist tor:/srv/www/relayerms/frontend/
                   else
                       echo "Bundle at server side"
                       ssh tor "cd /srv/www/relayerms && ./Taskfile.sh frontend prod"
                       ssh tor "service nginx start"
                   fi
                   ;;
        backend)  echo ">> Backend Task..."
                  if [ "$2" == "log" ]
                  then
                      echo ">> VIEW SERVER LOG"
                      echo "====================================================== SUPERVISOR log:"
                      ssh tor "cat /tmp/supervisord.log"
                      echo "====================================================== TOR1 log:"
                      ssh tor "cat /tmp/tor1_log.log"
                      echo "error >>>>>>>>"
                      ssh tor "cat /tmp/tor1_err.log"
                      echo "====================================================== TOR2 log:"
                      ssh tor "cat /tmp/tor2_log.log"
                      echo "error >>>>>>>>"
                      ssh tor "cat /tmp/tor2_err.log"
                  elif [ "$2" == "swap" ]
                  then
                      echo ">> SWAPPING BACKEND CODE"
                      # TODO: unconfirmed!
                      scp ./deploy/supervisord.conf tor:/srv/www/relayerms/deploy/
                      scp ./.prod.env tor:/srv/www/relayerms/
                      scp -r ./backend tor:/srv/www/relayerms/
                      ssh tor "supervisorctl reread"
                      ssh tor "supervisorctl update"
                  else
                      scp ./deploy/supervisord.conf tor:/srv/www/relayerms/deploy/
                      scp ./.prod.env tor:/srv/www/relayerms/
                      ssh tor "supervisord -c /srv/www/relayerms/deploy/supervisord.conf"
                  fi
                  ;;
        nginx) echo ">> UPDATE NGINX"
               ssh tor "service nginx stop"
               scp ./deploy/nginx.conf tor:/etc/nginx/
               scp ./deploy/relayerms.nginx.conf tor:/etc/nginx/sites-available/relayerms
               ssh tor "service nginx start"
               ;;
        *) echo "Task not recognized"
           ;;
    esac

}


# Which function? >>
"$@"
