#! /bin/bash
source venv/bin/activate && python manage.py runserver -h localhost -p 8000 -d --threaded
