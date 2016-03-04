#! /bin/bash

# Required files
PML=pmlcheck

# Check if $PML exists otherwise print error message and exit
[ -f $PML ] && echo -e "\t $PML [OK]" || { echo -e "\t $PML [FAIL]"; exit 1;}
