# /bin/bash

ORIGIN=$(pwd)
PML=pmlcheck
TRAVERSE=traverse
TRAVERSE_JSON=traverse_json
DB=*.sqlite
echo "Install"

# Check if a db exists, if it does remove it
echo -n "[Checking if a database already exists]"
[ -f $DB ] && rm $DB && echo -n "[Removed]"
echo "[OK]"

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
sudo pip install virtualenv >> install.log
if [ $? -ne 0 ]
then
	echo "[Failed to install virtualenv, check install.log]"
	exit 1
else
	echo "[Done]"
fi

echo -n "[Setting up virtualenv]"
virtualenv -p /usr/bin/python3.4 venv >> install.log
echo "[Done]"

# Install dependancies
echo -n "[Installing dependancies]"
sudo apt-get install --force-yes --yes libssl-dev libffi-dev python3.4-dev >> install.log
echo "[Done]"

echo -n "[Installing from requirements.txt]"
source venv/bin/activate &&  pip install -r requirements.txt >> install.log
echo "[Done]"

[ -f $PML ] && echo "[Found $PML, skipping recompile]" || { echo "[Compiling peos]"; cd $ORIGIN && bash peos.sh;}
[ -f $TRAVERSE ] && echo "[Found $TRAVERSE, skipping recompile]" || { echo "[Compiling peos]"; cd $ORIGIN && bash peos.sh;}
[ -f $TRAVERSE_JSON ] && echo "[Found $TRAVERSE_JSON, skipping recompile]" || { echo "[Compiling peos_json]"; cd $ORIGIN && bash peos_json.sh;}
# Post install checks
echo "[Running post install checks]"
bash install_check.sh
echo "[Done]"
