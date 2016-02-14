#! /bin/bash

ORIGIN=$(pwd)
echo "[Install]"

#Found most of this bash script snippet on http://stackoverflow.com/questions/1298066/check-if-a-package-is-installed-and-then-install-it-if-its-not
#mainly used the answer by Urhixidur.

echo -n "[Checking if python3.4 is installed]"
# Check if python3.4 is installed
PKG_OK=$(dpkg-query -W --showformat='${Status}\n' python3.4|grep "install ok installed")
if [ "" == "$PKG_OK" ]; then
  echo "[No python3.4. Setting up python3.4.]"
  sudo apt-get --force-yes --yes install python3.4 >> install.log
else
  echo -n "[OK]"
fi
echo "[Done]"

# Check if pip is isntalled
echo -n "[Checking if pip is installed]"
PIP_OK=$(dpkg-query -W --showformat='${Status}\n' python-pip|grep "install ok installed")
if [ "" == "$PIP_OK" ]; then
  echo "[No PIP. Setting up PIP.]"
  sudo apt-get --force-yes --yes install python-pip >> install.log
else
  echo -n "[OK]"
fi
echo "[Done]"

# insttall and setup virtualenv. Each script will change to venv by itself
echo -n "[Installing virtualenv]"
pip install virtualenv >> install.log
echo "[Done]"

echo -n "[Setting up virtualenv]"
virtualenv -p /usr/bin/python3.4 venv >> install.log
echo "[Done]"

# Install dependancies
echo "[Installing dependancies]"
sudo apt-get install --force-yes --yes libssl-dev >> install.log 
source venv/bin/activate &&  pip install -r requirements.txt >> install.log
cd $ORIGIN && bash peos.sh
