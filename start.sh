#! /bin/bash
cd src && source ../venv/bin/activate && python app.py runserver -h 0.0.0.0 -p 8080 -d --threaded
