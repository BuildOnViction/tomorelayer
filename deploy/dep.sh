#!/bin/bash

# This script is meant to run at server side only

function install  {
    # NOTE: pwd == 'relayerms'
    # Basic setup
    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    required="-y git nginx python-pip postgresql postgresql-contrib linuxbrew-wrapper \
make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev \
libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev \
libffi-dev liblzma-dev python-openssl nodejs supervisor"
    sudo apt-get update
    sudo apt-get install $required

    # pyenv
    curl https://pyenv.run | bash
    echo 'eval "$(pyenv init -)"' >> ~/.bashrc
    echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bashrc

    # brew
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
    echo 'eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)' >> ~/.bashrc

    # set path
    echo 'export PATH="/home/linuxbrew/.linuxbrew/bin:$HOME/.pyenv/bin:$PATH"' >> ~/.bashrc
    eval 'export PATH="/home/linuxbrew/.linuxbrew/bin:$HOME/.pyenv/bin:$PATH"'

    # Install what needed
    brew install gcc pipenv
    eval 'export PATH="/home/linuxbrew/.linuxbrew/bin/pipenv:$PATH"'

    # Pull the code
    git clone -b deployment https://github.com/tomochain/relayerms.git
    cd relayerms
    pipenv install
    npm install
    CFLAGS="-I$(brew --prefix openssl)/include" LDFLAGS="-L$(brew --prefix openssl)/lib" pyenv install -v 3.7.1

    # Nginx Setup
    sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx
    sudo cp ~/relayerms/deploy/nginx.conf /etc/nginx/nginx.conf
    sudo cp ~/relayerms/deploy/relayerms.nginx.conf /etc/nginx/sites-available/relayerms
    sudo ln -s /etc/nginx/sites-available/relayerms /etc/nginx/sites-enabled/relayerms
    sudo rm -r /etc/nginx/sites-enabled/default

    # Make Task alias
    echo 'alias task="./Taskfile.sh"' >> ~/.bashrc

    # DONE!
    echo "DONE! RESTARTING SERVER MACHINE!..."
    sudo reboot
}


"$@"
