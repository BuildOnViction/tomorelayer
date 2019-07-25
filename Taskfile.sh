#!/bin/bash
PATH=./node_modules/.bin:$PATH
# TODO: add 'help'

function backend {
    # Command to run backend side in production
    echo ">> INIT A TOR INSTANCE AT PORT $1"
    sudo kill $(lsof -t -i:$1)
    ENV_PATH=.env.production pipenv run python ./backend/app.py --port=$1
}

function frontend {
    # Command to build frontend scripts in production
    npm run build
}

# DEPLOY SCRIPTS
function dep {
    case "$1" in
        setup) echo ">> CREATE TOR APP at SERVER"
               scp ./deploy/dep.sh tor:~/
               ssh -t tor "~/dep.sh install"
               echo "Finished. Dont Forget to Update Supervisor Config & Posgtres Password before running Backend"
               ;;
        frontend)  echo ">> BUNDLE AND DEPLOY FRONTEND BUILD"
                   scp ./.env.production tor:/srv/www/tomorelayer/
                   if [ "$2" == "swap" ]
                   then
                       # Hot-swapping frontend bundle from local to server
                       npm run build
                       scp -r ./build tor:/srv/www/tomorelayer/
                   else
                       echo "Bundle at server side"
                       ssh tor "cd /srv/www/tomorelayer && ./Taskfile.sh frontend"
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
                      scp ./deploy/supervisord.conf tor:/srv/www/tomorelayer/deploy/
                      scp ./.env.production tor:/srv/www/tomorelayer/
                      scp -r ./backend tor:/srv/www/tomorelayer/
                      ssh tor "supervisorctl reread"
                      ssh tor "supervisorctl update"
                  else
                      scp ./deploy/supervisord.conf tor:/srv/www/tomorelayer/deploy/
                      scp ./.env.production tor:/srv/www/tomorelayer/
                      ssh tor "supervisord -c /srv/www/tomorelayer/deploy/supervisord.conf"
                  fi
                  ;;
        nginx) echo ">> UPDATE NGINX"
               ssh tor "service nginx stop"
               scp ./deploy/nginx.conf tor:/etc/nginx/
               ssh tor "service nginx start"
               ;;
        pgpwd) echo ">> CHANGE PG PASSWORD to \"$2\""
               ssh tor "su - postgres -c \"psql -U postgres -d postgres -c \\\"alter user postgres with password '$2';\\\"\""
               ;;
        *) echo "Task not recognized"
           ;;
    esac

}


# Which function? >>
"$@"
