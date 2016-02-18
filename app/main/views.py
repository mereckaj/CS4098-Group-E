from flask import render_template, url_for, request, session, redirect, jsonify
from . import main
from .runCode import pmlchecker
from .forms import LoginForm, RegisterForm
from .. import db, login_manager, oauth
from flask_login import login_required,login_user,logout_user
from .models import User

FACEBOOK_APP_ID = "486691024846349"
FACEBOOK_APP_SECRET = "5654dfce0e6167725cf31272545a914e"
GOOGLE_ID = "k00rirsh9bvq8cu7l19i1loh029e1hgv"
GOOGLE_SECRET = "H48CFybLmBnZpTWgtLCt-ls1"

facebook = oauth.remote_app(
	"facebook",
	base_url="https://graph.facebook.com/",
	request_token_url=None,
	access_token_url="/oauth/access_token",
	authorize_url="https://www.facebook.com/dialog/oauth",
	consumer_key=FACEBOOK_APP_ID,
	consumer_secret=FACEBOOK_APP_SECRET,
	request_token_params={"scope": "email"}
)

google = oauth.remote_app(
	"google",
	base_url="https://www.googleapis.com/oauth2/v1/",
	request_token_url=None,
	access_token_url="https://accounts.google.com/o/oauth2/token",
	authorize_url="https://accounts.google.com/o/oauth2/auth",
	consumer_key=GOOGLE_ID,
	consumer_secret=GOOGLE_SECRET,
	request_token_params={"scope": "email"},
	access_token_method="POST"
)

# Main page
@main.route("/",methods=["GET","POST"])
@login_required
def index():
	if request.method == "GET":
		return render_template("pmlcheck_form.html")
	elif request.method == "POST":
		# Extract the code from the POST request
		code = request.form["code"]

		# Run the code through the pmlheck tool and get the result
		result = pmlchecker(code)
		
		return render_template("pmlcheck_result.html",result=result)

@main.route('/facebook_login')
def facebook_login():
	next_url = request.args.get('next') or url_for('index')
	return facebook.authorize(callback=url_for('main.facebook_authorized',
		next=next_url,
		_external=True))

@main.route('/facebook_login/authorized')
@facebook.authorized_handler
def facebook_authorized(resp):
	next_url = request.args.get('next') or url_for('index')
	if resp is None:
		# The user likely denied the request
		flash(u'There was a problem logging in.')
		return redirect(next_url)
	session['oauth_token'] = (resp['access_token'], '')
	user_data = facebook.get('/me').data
	if "email" in user_data:
		user = User.query.filter(User.email == user_data['email']).first()
	else:
		return render_template("register.html",error=["No email from facebook"])
		# return redirect(url_for("main.register",error=["No email from facebook"]))
	if user is None:
		new_user = User(email=user_data['email'], first_name=user_data['first_name'], last_name=user_data['last_name'])
		db.session.add(new_user)
		db.session.commit()
		login_user(new_user)
	else:
		login_user(user)
	return redirect(next_url)

@main.route("/register",methods=["GET","POST"])
def register():
	form = RegisterForm()
	if request.method == "GET":
		return render_template("register.html",form=form,id="registerForm")
	elif request.method == "POST":
		if form.validate_on_submit():
			first_name = form.first_name.data
			last_name = form.last_name.data
			email = form.email.data
			password = form.password.data
			user = User.query.filter(User.email == email).first()
			if user is None:
				new_user = User(email=email, first_name=first_name, last_name=last_name,password=password)
				# new_user.set_password(password=password)
				db.session.add(new_user)
				db.session.commit()
				login_user(new_user)
				return redirect(url_for("main.index"))
			else:
				return render_template("register.html",error=["User already exists"])
				# return redirect(url_for("main.register",error=["User already exists"]))
		else:
			return prepareFormErrors(form)

@main.route("/login",methods=["POST"])
def login():
	form = LoginForm()
	if form.validate_on_submit():
		email = form.email.data
		password = form.password.data
		user = User.query.filter(User.email == email).first()
		if user is None:
			return render_template("register.html",error=["User does not exist"])
			# return redirect(url_for("main.register",error=["User does not exist"]))
		else:
			login_user(user.get_id())
	else:
		return prepareFormErrors(form)

def prepareFormErrors(form):
	ers = []
	for (field, errors) in form.errors.items():
		for e in errors:
			ers.append(field + " : " + e)
	return render_template("register.html",error=ers,form=form)

@main.route("/logout")
@login_required
def logout():
	logout_user()
	return redirect(url_for("main.index"))

# @login_manager.unauthorized_handler
# def unauthorized_handler():
# 	return render_template(url_for("main.index"))
# AUTH

@login_manager.user_loader
def load_user(userid):
	user = User.query.get(int(userid))
	if user:
		return user

@facebook.tokengetter
def get_facebook_oauth_token():
	return session.get('oauth_token')

def debug(message):
	print("\n" + message + "\n")