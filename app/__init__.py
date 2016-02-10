from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.session import Session
from config import config

bootstrap = Bootstrap()
db = SQLAlchemy()
session = Session()

def create_app(config_name):
	app = Flask(__name__)
	app.config.from_object(config[config_name])
	config[config_name].init_app(app)

	# Set up any extensions used by the app
	bootstrap.init_app(app) # Bootstrap (make this look good)
	db.init_app(app) # SQLAlchemy (Object Relational Mapper) (Work with objects not SQL)
	session.init_app(app) # Session lets you keep data about users (Cookies)

	# Tell the app where to look for the routes
	from .main import main as main_blueprint
	app.register_blueprint(main_blueprint)

	return app