#!/bin/bash
PATH=./node_modules/.bin:$PATH
# TODO: add 'help'

function backend {
    # Command to run backend side in production
    ENV_PATH=.prod.env pipenv run python ./backend/app.py --port=8001
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
               echo "Finished. Don't forget the update the local '~/.ssh/config' and change POSTGRES password"
               ;;
        frontend)  echo ">> BUNDLE AND DEPLOY FRONTEND BUILD"
                   scp ./.prod.env tor:/srv/www/relayerms/
                   if [ "$2" == "swap" ]
                   then
                       # Hot-swapping frontend bundle from local to server
                       npm run build
                       scp -r frontend/build tor:/srv/www/relayerms/frontend/
                   else
                       echo "Bundle at server side"
                       ssh tor "cd /srv/www/relayerms && ./Taskfile.sh frontend"
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
