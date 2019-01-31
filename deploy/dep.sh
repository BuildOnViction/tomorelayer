#!/bin/bash

# This script is meant to run at server side only

function install  {
    # NOTE: pwd == 'relayerms'
    # Basic setup
    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    required="-y git nginx python-pip postgresql postgresql-contrib \
make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev \
libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev \
libffi-dev liblzma-dev python-openssl nodejs"
    sudo apt-get update
    sudo apt-get install $required

    # pyenv
    git clone https://github.com/pyenv/pyenv.git ~/.pyenv
    echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
    echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
    echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bashrc

    # brew
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
    test -d ~/.linuxbrew && eval $(~/.linuxbrew/bin/brew shellenv)
    test -d /home/linuxbrew/.linuxbrew && eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
    test -r ~/.bashrc && echo "eval \$($(brew --prefix)/bin/brew shellenv)" >> ~/.bashrc
    echo "eval \$($(brew --prefix)/bin/brew shellenv)" >> ~/.bashrc
    eval $($(brew --prefix)/bin/brew shellenv)
    brew install pipenv

    # Nginx Setup
    sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx
    sudo cp ~/relayerms/deploy/nginx.conf /etc/nginx/nginx.conf
    sudo cp ~/relayerms/deploy/relayerms.nginx.conf /etc/nginx/sites-available/relayerms
    sudo ln -s /etc/nginx/sites-available/relayerms /etc/nginx/sites-enabled/relayerms
    sudo rm -r /etc/nginx/sites-enabled/default
    echo "DONE! RESTARTING SERVER MACHINE!..."
    sudo reboot
}


"$@"
