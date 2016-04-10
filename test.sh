#! /bin/bash


source venv/bin/activate
echo "Executing Post Install Checks"
echo "----------------------------------------------------------------------"
bash install_check.sh


echo "Executing Python Tests"
echo "----------------------------------------------------------------------"
python -m unittest discover -s tests/selenium/ -p 'test_*.py'

#Run all of the bash tests

echo "Executing Bash Tests"
echo "----------------------------------------------------------------------"
./tests/test_all.sh

deactivate
