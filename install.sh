#! /bin/bash

echo "[Install]"

# Check if script is run with sudo

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   echo "Run \"sudo ./install.sh\""
   exit 1
fi

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


# Check if python3.4 is installed
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' python3.4|grep "install ok installed")
echo Checking for python3.4: $PKG_OK
if [ "" == "$PKG_OK" ]; then
  echo "No python3.4. Setting up python3.4."
  apt-get --force-yes --yes install python3.4
fi

# Check if pip is isntalled
PIP_OK=$(dpkg-query -W --showformat='${Status}\n' python-pip|grep "install ok installed")
echo Checking for pip: $PIP_OK
if [ "" == "$PIP_OK" ]; then
  echo "No PIP. Setting up PIP."
  apt-get --force-yes --yes install python-pip
fi

# insttall and setup virtualenv. Each script will change to venv by itself
pip install virtualenv
virtualenv -p /usr/bin/python3.5 venv

VE="echo $VIRTUAL_ENV"
if [ -z $VE ]; then
	# The virtualenv variable is null, so we are not in 
	# an active virtual environment. 
	source venv/bin/activate
fi

# Install Flask

# Install dependancies
pip install -r requirements.txt