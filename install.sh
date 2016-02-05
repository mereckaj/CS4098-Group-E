#! /bin/bash

echo "[Install]"

# Check that platform is what the client asked for

# OS_VERSION=$(lsb_release -s -d)
# if [ -z $OS_VERSION ]
# then
# 	echo "Could not determine OS"
# 	exit 1
# fi
#
# if [[ $OS_VERSION != *"Ubuntu 14.04"* ]]
# then
# 	echo "You are running: " $OS_VERSION " program is made for Ubuntu 14.04"
# 	exit 1
# fi


echo "[Checking if python3.4 is installed]"
# Check if python3.4 is installed
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' python3.4|grep "install ok installed")
if [ "" == "$PKG_OK" ]; then
  echo "[No python3.4. Setting up python3.4.]"
  sudo apt-get --force-yes --yes install python3.4
else
  echo "[OK]"
fi

# Check if pip is isntalled
echo "[Checking if pip is installed]"
PIP_OK=$(dpkg-query -W --showformat='${Status}\n' python-pip|grep "install ok installed")
if [ "" == "$PIP_OK" ]; then
  echo "[No PIP. Setting up PIP.]"
  sudo apt-get --force-yes --yes install python-pip
else
  echo "[OK]"
fi

# insttall and setup virtualenv. Each script will change to venv by itself
echo "[Installing virtualenv]"
pip install virtualenv
echo "[Setting up virtualenv]"
virtualenv -p /usr/bin/python3.4 venv

VE="echo $VIRTUAL_ENV"
if [ -z $VE ]; then
	# The virtualenv variable is null, so we are not in 
	# an active virtual environment. 
	echo "[Entering virtualenv]"
	source venv/bin/activate
fi

# Install Flask

# Install dependancies
source venv/bin/activate &&  pip install -r requirements.txt
