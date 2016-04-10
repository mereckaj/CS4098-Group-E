#! /bin/bash
if [ "$#" -ne 1 ]; then
	echo "Not enough arguments passed"
	echo "Usage: ./start.sh <development | production>"
	echo -e "\nChoose a config to use"
	echo -e "\tdevelopment : Suppress mail sending for new user"
	echo -e "\tproduction : Does not suppress mail sending for new users"
	exit 1
fi
export MAIL_USERNAME="pmlidege"
export MAIL_PASSWORD="SuperPassword1"
export MAIL_DEFAULT_SENDER="pmlidege@gmail.com"
export SECURITY_PASSWORD_SALT="salty_like_ppd"
export SECRET_KEY="super_secret_password_totally_secure_top_kek"
export FLASK_CONFIG="$1"

source venv/bin/activate && python manage.py runserver -h localhost -p 8000 -d --threaded
