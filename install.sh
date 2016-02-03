#! /bin/bash

echo "[Install]"

# Check if script is run with sudo

# Check that platform is what the client asked for

# Check if python3.5 is installed

# Check if pip is isntalled


# insttall and setup virtualenv. Each script will change to venv by itself
pip install virtualenv
virtualenv -p /usr/bin/python3.5 venv

VE=`echo $VIRTUAL_ENV`
if [ -z $VE ]; then
	# The virtualenv variable is null, so we are not in 
	# an active virtual environment. 
	source venv/bin/activate
fi

# Install Flask

#Install dependancies
pip install -r requirements.txt
