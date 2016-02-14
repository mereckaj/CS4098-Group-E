from .. import db
from flask_user import UserMixin

class User(db.Model, UserMixin):
		id = db.Column(db.Integer, primary_key=True)
		# User authentication information
		username = db.Column(db.String(50), nullable=False, unique=True)
		password = db.Column(db.String(255), nullable=False, server_default='')

		# User information
		active = db.Column('is_active', db.Boolean(), nullable=False, server_default='0')
		first_name = db.Column(db.String(100), nullable=False, server_default='')
		last_name = db.Column(db.String(100), nullable=False, server_default='')

		def usernameExists(self,ObjectClass,user_name):
			query = ObjectClass.query
			query = query.filter(username==user_name)
			return query.first()
