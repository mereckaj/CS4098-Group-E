from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.session import Session
from flask_oauthlib.client import OAuth
from flask_login import LoginManager
from config import config

bootstrap = Bootstrap()
db = SQLAlchemy()
session = Session()
oauth = OAuth()
login_manager = LoginManager()

def create_app(config_name):
	app = Flask(__name__)
	app.config.from_object(config[config_name])
	config[config_name].init_app(app)

	# Set up any extensions used by the app
	bootstrap.init_app(app) # Bootstrap (make this look good)
	db.init_app(app) # SQLAlchemy (Object Relational Mapper) (Work with objects not SQL)
	session.init_app(app) # Session lets you keep data about users (Cookies)
	
	login_manager.init_app(app)
	login_manager.login_view = "main.facebook_login"
	login_manager.login_message = u"You need to log in to view this page"

	# Tell the app where to look for the routeszz
	from .main import main as main_blueprint
	app.register_blueprint(main_blueprint)
	
	with app.app_context():
		db.create_all()

	return app