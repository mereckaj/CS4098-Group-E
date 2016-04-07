#! /bin/bash


source venv/bin/activate
bash install_check.sh

python -m unittest discover -s tests/selenium/ -p 'test_*.py'

#Run all of the bash tests
./tests/test_all.sh

deactivate
