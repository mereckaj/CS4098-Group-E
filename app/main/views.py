from flask import render_template, url_for, request, session, redirect, jsonify, current_app
from . import main
from .runCode import pmlchecker, pml_to_dot
from .forms import LoginForm, RegisterForm
from .. import db, login_manager, oauth
from flask_login import login_required,login_user,logout_user
from .models import User
import json, os

FACEBOOK_APP_ID = "486691024846349"
FACEBOOK_APP_SECRET = "5654dfce0e6167725cf31272545a914e"
GOOGLE_APP_ID = "899383105434-k00rirsh9bvq8cu7l19i1loh029e1hgv.apps.googleusercontent.com"
GOOGLE_APP_SECRET = "H48CFybLmBnZpTWgtLCt-ls1"
PROVIDER_GOOGLE = "GOOGLE"
PROVIDER_FACEBOOK = "FACEBOOK"
UPLOAD_FOLDER = "tmp/"

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
	'google',
	consumer_key=GOOGLE_APP_ID,
	consumer_secret=GOOGLE_APP_SECRET,
	request_token_params={
		'scope': 'https://www.googleapis.com/auth/userinfo.email'
	},
	base_url='https://www.googleapis.com/oauth2/v1/',
	request_token_url=None,
	access_token_method='POST',
	access_token_url='https://accounts.google.com/o/oauth2/token',
	authorize_url='https://accounts.google.com/o/oauth2/auth',
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

@main.route("/dot",methods=["POST"])
def dot():
	code = request.get_data()
	result = pml_to_dot(code)
	return result

# Url to go to if you want to log in through facebook, it basically
# calls the facebook url for loging in, on return it will redirect to
# main.facebook_authorized
@main.route('/facebook_login')
def facebook_login():
	next_url = request.args.get('next') or url_for('main.index')
	return facebook.authorize(callback=url_for('main.facebook_authorized',
		next=next_url,
		_external=True))

# Same as above except for google.
@main.route('/google_login')
def google_login():
	callback=url_for('main.google_authorized', _external=True)
	return google.authorize(callback=callback)

# ADD A DESCRIPTION OF WHAT HAPPENS HERE
@main.route("/upload", methods=["POST"])
def upload():
	createFolders()
	# Request the code
	code = request.form["fileCode"]
	session["update"] = request.form["fileCode"]
	session["changed"] = True
	filename = '%s_upload.%s'%(str(session["uid"]), "pml")

	# Take the current applications root folder, add on the relative
	# UPLOAD_FOLDER path
	filepath = os.path.join(os.path.abspath(os.path.dirname(__name__)),
		UPLOAD_FOLDER)
	# Move the file form the temporal folder to
	# the upload folder we setup
	inFile = open(UPLOAD_FOLDER + filename,'w')
	inFile.write(code)
	return redirect(url_for("main.index"))

# Either get or set some settings that the user decided to change
@main.route("/settings/<string:key>/<string:value>",methods=["POST"])
@main.route("/settings/<string:key>",methods=["GET"])
def settings(key,value=None):
	if request.method == "GET":
		uid = session["uid"]
		user = User.query.filter(User.id == uid).first()
		if user is None:
			return jsonify({"error":"no user"})
		else:
			data = getUserData(user,key)
			if data is None:
				return jsonify({"error":"invalid key: " + key})
			else:
				return jsonify({"data": data })
	elif request.method == "POST":
		uid = session["uid"]
		user = User.query.filter(User.id == uid).first()
		if user is None:
			return jsonify({"error":"no user"})
		else:
			data = setUserData(user,key,value)
			return jsonify({ "data": data})

def setUserData(user,key,value):
	if key is "editor":
		user.set_editor = value
	if key is "fontsize":
		user.set_fontsize = value
	return "ok"

# Basically a switch statement (which python doesn't have)
def getUserData(user,key):
	return {
		"editor" : str(user.get_editor()),
		"fontsize" : str(user.get_fontsize())
	}.get(key,None)

# Facebook callback function, check if the reply is present,
# Check if user gave email, if no email is given then can't register
# so show an error, if email is given see if there's a user registered
# with that email. If a user is registered log them in (No password checks)
# since the password would not be set
# If the email is not registered register it, since password = None the User
# model will generate a random 32 character password (This is a dirty hack)
@main.route('/facebook_login/authorized')
@facebook.authorized_handler
def facebook_authorized(resp):
	next_url = request.args.get('next') or url_for('main.index')
	if resp is None:
		return redirect(next_url)
	session['oauth_token'] = (resp['access_token'], '')
	user_data = facebook.get('/me?fields=email,id,first_name,last_name').data
	return authAndRedirectOrError(user_data,PROVIDER_FACEBOOK,next_url)

# Same as facebooks one above, read that description.
@main.route("/google_login/authorized")
@google.authorized_handler
def google_authorized(resp):
	next_url = request.args.get("next") or url_for("main.index")
	if resp is None:
		return redirect(next_url);
	session['oauth_token'] = (resp['access_token'], '')
	user_data =  google.get("userinfo").data
	return authAndRedirectOrError(user_data,PROVIDER_GOOGLE,next_url)

# Refractored code for loging in a user through a third party plugin
def authAndRedirectOrError(user_data,provider,next_url):
	email = user_data["email"]

	# Extract details from user_data
	if provider is PROVIDER_GOOGLE:
		first_name = user_data["given_name"]
		last_name = user_data["family_name"]
	elif provider is PROVIDER_FACEBOOK:
		first_name = user_data["first_name"]
		last_name = user_data["last_name"]
	else:
		return render_template("login.html",
			error="[Error getting first and last names]")

	# Conver email to lower case to prevent strign comparison issues
	email = email.lower()

	# Check that an details has been given
	if email is not None:
		user = User.query.filter(User.email == email).first()
	else:
		return render_template("login.html",error=["Could not get email from "
			+ provider])

	# Try to log the user in, or register a new user
	if user is None:
		user = User(email=email, first_name=first_name, last_name=last_name)
		db.session.add(user)
		db.session.commit()

	login_and_load_user(user)
	return redirect(next_url)

# Register a new user, if it's a GET then return the form,
# If its a post then validate the users form
# If this email already exists then return an error
# Otherwise register a new user and log them in straight away
@main.route("/register",methods=["GET","POST"])
def register():
	form = RegisterForm()
	if request.method == "GET":
		return render_template("register.html",form=form,id="registerForm")
	elif request.method == "POST":
		if form.validate_on_submit():
			first_name = form.first_name.data
			last_name = form.last_name.data
			email = form.email.data.lower()
			password = form.password.data
			user = User.query.filter(User.email == email).first()
			if user is None:
				new_user = User(email=email, first_name=first_name,
					last_name=last_name,password=password)
				db.session.add(new_user)
				db.session.commit()
				login_and_load_user(new_user)
				return redirect(url_for("main.index"))
			else:
				return render_template("register.html",
					error=["User already exists"])
		else:
			ers = []
			for (field, errors) in form.errors.items():
				for e in errors:
					ers.append(e)
			return render_template("register.html",error=ers)

# If it's a GET request then regner the login form.
# If it's a POSt request then validate the form and see
# if the passwords matched and the user may be logged in.
@main.route("/login",methods=["GET","POST"])
def login():
	form = LoginForm()
	if form.validate_on_submit():
		email = form.email.data.lower()
		password = form.password.data
		user = User.query.filter(User.email == email).first()
		if user is None:
			return render_template("login.html",error=["User does not exist"])
		else:
			if user.check_password(password):
				login_and_load_user(user)
				return redirect(url_for("main.index"))
			else:
				return render_template("login.html",error=["Bad password :("])
	else:
		return render_template("login.html",form=form)

# Log out the user, no matter what way the logged in.
@main.route("/logout")
@login_required
def logout():
	logout_user_remove_session_data()
	return redirect(url_for("main.index"))

# Any unauthorized requests will be redirected to the login page.
@login_manager.unauthorized_handler
def unauthorized_handler():
	return redirect(url_for("main.login"))

# Get user object by id
@login_manager.user_loader
def load_user(userid):
	user = User.query.get(int(userid))
	if user:
		return user

@facebook.tokengetter
def get_facebook_oauth_token():
	return session.get('oauth_token')

@google.tokengetter
def get_access_token():
	return session.get('oauth_token')

# Create a "tmp" folder to store the files if it does not exist and store the
# new file in there
def createFolders():
	if not os.path.exists("tmp/"):
		os.makedirs("tmp/")

# Login the user and set up their session information
def login_and_load_user(user):
	login_user(user)
	uid = user.get_id()
	session["uid"] = uid
	if user.get_first_name() is not None:
		session["username"] = user.get_first_name()
	session["email"] = str(user.get_email())

# Logout the user and remove their session information
def logout_user_remove_session_data():
	logout_user()
	session.pop("uid",None)
	session.pop("email",None)
	session.pop("username",None)
