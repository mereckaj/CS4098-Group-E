#! /bin/bash

#Run all of the tests

VE=`echo $VIRTUAL_ENV`
if [ -z $VE ]; then
	# The virtualenv variable is null, so we are not in 
	# an active virtual environment. 
	source venv/bin/activate
fi

#Add tests to run here
python ./test/main.py