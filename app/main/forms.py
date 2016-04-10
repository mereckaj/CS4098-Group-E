from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, TextField, SubmitField
from wtforms.validators import Required, Email, Length,EqualTo, Length, Regexp


class RegisterForm(Form):
	first_name = StringField('First Name',validators=[
		Required(),
		Length(min=1,max=64,
			message="First name must be between 1 and 64 characters long")
	])
	last_name = StringField('Last Name',validators=[
		Required(),
		Length(min=1,max=64,
			message="Last name must be between 1 and 64 characters long")
	])
	password = PasswordField('Password', validators=[
		Required(),
		EqualTo("confirm", message="Passwords must match"),
		Length(min=8,max=64,
			message="Password must be between 8 and 64 characters long"),
		Regexp("(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$",
			message="Password is too weak, make sure it meets all of the required conditions")
	])
	confirm = PasswordField('Repeat Password')
	email = StringField('Email Address', validators=[
		Length(min=6, max=64,
			message = "Email must be between 6 and 64 characters long"),
		Regexp("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)",
			message="Invalid email address. It must be *@*.* or similar.")
	])
	submit = SubmitField("Register")

class LoginForm(Form):
	email = StringField('Email Address', validators=[
		Length(min=6, max=64,
			message="Email must be between 6 and 64 characters long"),
		Regexp("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)",
			message="Invalid email address. It must be *@*.* or similar.")
	])
	password = PasswordField('Password', validators=[Required()])
	submit = SubmitField("Login")

class PasswordResetForm(Form):
	email = StringField('Email Address', validators=[
		Length(min=6, max=64,
			message="Email must be between 6 and 64 characters long"),
		Regexp("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)",
			message="Invalid email address. It must be *@*.* or similar.")
	])
	submit = SubmitField("Reset password")

class PasswordChangeForm(Form):
	password = PasswordField('New Password', validators=[
		Required(),
		EqualTo("confirm", message="Passwords must match"),
		Length(min=8,max=64,
			message="Password must be between 8 and 64 characters long"),
		Regexp("(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$",
			message="Password is too weak, make sure it meets all of the required conditions")
	])
	confirm = PasswordField('Repeat Password')
	submit = SubmitField("Change password")
