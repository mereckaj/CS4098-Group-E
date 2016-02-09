#! /bin/bash
source venv/bin/activate && python manage.py runserver -h 0.0.0.0 -p 8000 -d --threaded
