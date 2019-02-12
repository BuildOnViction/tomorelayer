#!/bin/bash

# This script is meant to run at server side only

function install  {
    # Basic setup
    sudo apt-get update
    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    required="-y git python-pip nginx postgresql postgresql-contrib linuxbrew-wrapper \
make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev \
libsqlite3-dev llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev \
libffi-dev liblzma-dev python-openssl nodejs supervisor"
    sudo apt-get install $required

    # pyenv
    curl https://pyenv.run | bash
    echo 'eval "$(pyenv init -)"' >> ~/.bashrc
    echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bashrc
    echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
    eval 'export PYENV_ROOT="$HOME/.pyenv"'
    echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
    eval 'export PATH="$PYENV_ROOT/bin:$PATH"'
    echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bashrc

    pyenv install -v 3.7.2
    pyenv global 3.7.2

    # # Pull the code
    git clone -b deployment https://github.com/tomochain/relayerms.git
    cd relayerms
    npm install
    pipenv --python $HOME/.pyenv/versions/3.7.2/bin/python3.7m install

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
