#! /bin/bash

echo "[Clean]"

# Remove the tmp file from src if it is there
echo "Removing tmp file"
rm -rf ./tmp

# Remove the Virtual Environment folder if it is there
echo "Removing Virtual Environment"
rm -rf ./venv

# Remove logs
echo "Removing logs"
rm *.log &> /dev/null

# Remove database
echo "Removing database"
rm -f *.sqlite

# Remove dependancies
rm -f  pmlcheck

# Remove .pyc, __pycache__
# Code from: https://gist.github.com/peter-stratton/c127d6df835290261027
find . -type f -iname \*.pyc -not -path "./.*" -delete && find . -type d -name __pycache__ -not -path "./.*" -delete;

echo "Files Removed"
