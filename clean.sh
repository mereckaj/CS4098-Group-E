#! /bin/bash

echo "[Clean]"

# Remove the tmp file from src if it is there
echo "Removing tmp file"
rm -rf ./src/tmp


# Remove the Virtual Environment folder if it is there
echo "Removing Virtual Environment"
rm -rf ./venv

# Reove logs
echo "Removing logs"
rm install.log &> /dev/null

echo "Files Removed"
