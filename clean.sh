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

# Remove dependencies
rm -f  pmlcheck

# Remove .pyc, __pycache__
find . -type f -iname \*.pyc -not -path "./.*" -delete && find . -type d -name __pycache__ -not -path "./.*" -delete;

echo "Files Removed"
