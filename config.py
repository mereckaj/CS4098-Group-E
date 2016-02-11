import os

basedir = os.path.abspath(os.path.dirname(__file__))

# Settings common to all configs
class Config:
	SECRET_KEY = os.environ.get("SECRET_KEY") or "HopefullyThisWillNeverBeUsed"
	SQLALCHEMY_COMMIT_ON_TEARDOWN = True
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	SESSION_TYPE = "sqlalchemy"
	CSRF_ENABLED = True

	# Flask-Mail settings
	MAIL_USERNAME = os.getenv('MAIL_USERNAME', 'email@example.com')
	MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', 'password')
	MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', '"MyApp" <noreply@example.com>')
	MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
	MAIL_PORT = int(os.getenv('MAIL_PORT', '465'))
	MAIL_USE_SSL = int(os.getenv('MAIL_USE_SSL', True))

	# Flask-User settings
	USER_APP_NAME = "AppName" # Used by email templates

	@staticmethod
	def init_app(app):
		# Any config specific initializations go here
		pass

class DevelopmentConfig(Config):
	DEBUG = True
	SQLALCHEMY_DATABASE_URI = os.environ.get("DEV_DATABASE_URL") or "sqlite:///" + os.path.join(basedir,"dev-db.sqlite")

class ProductionConfig(Config):
	DEBUG = False
	SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///" + os.path.join(basedir,"data.sqlite")

config = {
	'development' : DevelopmentConfig,
	'production' : ProductionConfig,

	'default' : DevelopmentConfig
}
