#! /bin/bash

#Change into the venv
VE=`echo $VIRTUAL_ENV`
if [ -z $VE ]; then
	# The virtualenv variable is null, so we are not in 
	# an active virtual environment. 
	source venv/bin/activate
fi

#Start the server
cd src
python app.py