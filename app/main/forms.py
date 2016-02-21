from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, TextField, SubmitField
from wtforms.validators import Required, Email, Length,EqualTo


class RegisterForm(Form):
	first_name = StringField('First Name',validators=[Required()])
	last_name = StringField('Last Name',validators=[Required()])
	password = PasswordField('New Password', [
		Required(),
		EqualTo('confirm', message='Passwords must match')
	])
	confirm = PasswordField('Repeat Password')
	email = StringField('Email Address', [Length(min=6, max=64)])
	submit = SubmitField("Register")

class LoginForm(Form):
	email = StringField('Email Address', [Length(min=6, max=64)])
	password = PasswordField('New Password', [Required()])
	submit = SubmitField("Login")