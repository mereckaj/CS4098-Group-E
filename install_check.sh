#! /bin/bash

# Required files
PML=pmlcheck
TRAVERSE=traverse

# Check if $PML exists otherwise print error message and exit
[ -f $PML ] && echo -e "\t $PML [OK]" || { echo -e "\t $PML [FAIL]"; exit 1;}

# Check if $TRAVERSE exists
[ -f $TRAVERSE ] && echo -e "\t $TRAVERSE [OK]" || { echo -e "\t $TRAVERSE [FAIL]"; exit 1;}


