#! /bin/bash

export MAIL_USERNAME="pmlidege"
export MAIL_PASSWORD="SuperPassword1"
export MAIL_DEFAULT_SENDER="pmlidege@gmail.com"
export SECURITY_PASSWORD_SALT="salty_like_ppd"
export SECRET_KEY="super_secret_password_totally_secure_top_kek"

source venv/bin/activate && python manage.py runserver -h localhost -p 8000 -d --threaded
