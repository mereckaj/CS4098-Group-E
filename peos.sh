#! /bin/bash

# This script downloads and compiles peos. Which produces pml check
# which is used by the application to perform pml synax checks

ORIGIN=$(pwd)
LOG=$ORIGIN/peos.log
PACMAN="apt-get install"

rm -f $LOG
echo -n "Making /tmp/ge_peos "
cd /tmp && mkdir ge_peos -p && cd ge_peos
echo "[DONE]"

echo -n "Cloning repo from https://github.com/jnoll/peos.git "
git clone https://github.com/jnoll/peos.git >> $LOG
echo "[DONE]"

echo -n "Installing dependancies "
sudo $PACMAN bison flex libreadline-dev libncurses-dev tcl tcl-dev check expect libxml2 >> $LOG
echo "[DONE]"

echo -n "Compiling everything "
cd peos && make >> $LOG
mv pml/check/pmlcheck $ORIGIN
echo "[DONE]"

echo -n "Cleaning up "
rm -rf /tmp/ge_peos >> $LOG
echo "[DONE]"
