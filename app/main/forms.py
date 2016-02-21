from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, TextField, SubmitField
from wtforms.validators import Required, Email, Length,EqualTo, Length, Regexp


class RegisterForm(Form):
	first_name = StringField('First Name',validators=[Required(),Length(min=1,max=64,message="First name is too long, we only need your first name")])
	last_name = StringField('Last Name',validators=[Required()])
	password = PasswordField('New Password', [
		Required(),
		EqualTo('confirm', message='Passwords must match'),
		Regexp("(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$",
			message="Password is too weak, make sure it meets all of the required conditions")
	])
	confirm = PasswordField('Repeat Password')
	email = StringField('Email Address', [Length(min=6, max=64)])
	submit = SubmitField("Register")

class LoginForm(Form):
	email = StringField('Email Address', [Length(min=6, max=64)])
	password = PasswordField('New Password', [Required()])
	submit = SubmitField("Login")