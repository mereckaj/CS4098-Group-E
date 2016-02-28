#! /bin/bash

# Required files
PML=pmlcheck

echo "[Running post install checks]"

# Check if $PML exists otherwise print error message and exit
[ -f $PML ] && echo "$PML [OK]" || { echo "$PML [FAIL]"; exit 1;}

echo "[Success]"