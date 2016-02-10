#! /bin/bash

echo "[Clean]"

# Remove the tmp file from src if it is there
echo "Removing tmp file"
rm -rf ./src/tmp


# Remove the Virtual Environment folder if it is there
echo "Removing Virtual Environment"
rm -rf ./venv

# Remove logs
echo "Removing logs"
rm install.log &> /dev/null

# Remove database
echo "Removing database"
rm *.sqlite

echo "Files Removed"
