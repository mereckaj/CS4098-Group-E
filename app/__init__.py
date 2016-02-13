from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.session import Session
from config import config
from flask_user import login_required, UserManager, UserMixin, SQLAlchemyAdapter

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

	class User(db.Model, UserMixin):
		id = db.Column(db.Integer, primary_key=True)
		# User authentication information
		username = db.Column(db.String(50), nullable=False, unique=True)
		password = db.Column(db.String(255), nullable=False, server_default='')

		# User information
		active = db.Column('is_active', db.Boolean(), nullable=False, server_default='0')
		first_name = db.Column(db.String(100), nullable=False, server_default='')
		last_name = db.Column(db.String(100), nullable=False, server_default='')

	with app.app_context():
		db.create_all()
	db_adapter = SQLAlchemyAdapter(db,User)
	user_manager = UserManager(db_adapter, app)

	# Tell the app where to look for the routes
	from .main import main as main_blueprint
	app.register_blueprint(main_blueprint)

	return app