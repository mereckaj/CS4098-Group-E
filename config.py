import os

basedir = os.path.abspath(os.path.dirname(__file__))

# Settings common to all configs
class Config:
	SECRET_KEY = os.environ.get("SECRET_KEY") or "HopefullyThisWillNeverBeUsed"
	SQLALCHEMY_COMMIT_ON_TEARDOWN = True
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	SESSION_TYPE = "sqlalchemy"
	SECURITY_PASSWORD_SALT = os.environ.get("SECURITY_PASSWORD_SALT")

	MAIL_SERVER = 'smtp.googlemail.com'
	MAIL_PORT = 465
	MAIL_USE_TLS = False
	MAIL_USE_SSL = True

	MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
	MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
	MAIL_DEFAULT_SENDER = os.environ.get("MAIL_DEFAULT_SENDER")

	@staticmethod
	def init_app(app):
		# Any config specific initializations go here
		pass

class DevelopmentConfig(Config):
	DEVELOPMENT = True
	DEBUG = True
	MAIL_SUPPRESS_SEND=False
	SQLALCHEMY_DATABASE_URI = os.environ.get("DEV_DATABASE_URL") or "sqlite:///" + os.path.join(basedir,"dev-db.sqlite")

class ProductionConfig(Config):
	DEBUG = False
	MAIL_SUPPRESS_SEND=False
	SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///" + os.path.join(basedir,"prod-db.sqlite")

class TestingConfig(Config):
	DEBUG = False
	MAIL_SUPPRESS_SEND=True
	SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///" + os.path.join(basedir,"test_db.sqlite")


config = {
	"development" : DevelopmentConfig,
	"production" : ProductionConfig,
	"testing" : TestingConfig,
	"default" : ProductionConfig
}
