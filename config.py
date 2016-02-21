import os

basedir = os.path.abspath(os.path.dirname(__file__))

# Settings common to all configs
class Config:
	SECRET_KEY = os.environ.get("SECRET_KEY") or "HopefullyThisWillNeverBeUsed"
	SQLALCHEMY_COMMIT_ON_TEARDOWN = True
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	SESSION_TYPE = "sqlalchemy"

	@staticmethod
	def init_app(app):
		# Any config specific initializations go here
		pass

class DevelopmentConfig(Config):
	DEVELOPMENT = True
	DEBUG = True
	SQLALCHEMY_DATABASE_URI = os.environ.get("DEV_DATABASE_URL") or "sqlite:///" + os.path.join(basedir,"dev-db.sqlite")

class ProductionConfig(Config):
	DEBUG = False
	SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///" + os.path.join(basedir,"data.sqlite")

config = {
	"development" : DevelopmentConfig,
	"production" : ProductionConfig,

	"default" : DevelopmentConfig
}
