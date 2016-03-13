#! /bin/bash

#Run all of the python tests
source venv/bin/activate && python manage.py test
deactivate

#Run all of the bash tests
./tests/test_all.sh
