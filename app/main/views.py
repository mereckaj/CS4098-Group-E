from flask import render_template, url_for, request, session, redirect, jsonify,\
	make_response,current_app
from . import main
from .runCode import pmlchecker, pml_to_dot, pml_to_json
from .forms import LoginForm, RegisterForm,PasswordResetForm,PasswordChangeForm
from .. import db, login_manager, oauth, mail
from flask_login import login_required,login_user,logout_user
from .models import User
import json, os
from itsdangerous import URLSafeTimedSerializer
from flask.ext.mail import Message


FACEBOOK_APP_ID = "486691024846349"
FACEBOOK_APP_SECRET = "5654dfce0e6167725cf31272545a914e"
GOOGLE_APP_ID = "899383105434-k00rirsh9bvq8cu7l19i1loh029e1hgv.apps.googleusercontent.com"
GOOGLE_APP_SECRET = "H48CFybLmBnZpTWgtLCt-ls1"
PROVIDER_GOOGLE = "GOOGLE"
PROVIDER_FACEBOOK = "FACEBOOK"

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
		result = pmlchecker(code,None)
		return jsonify({'data':result})
@main.route("/dot",methods=["POST"])
def dot():
	code = request.get_data()
	filename,result,success = pml_to_dot(code)
	return jsonify({
		"success" : success,
		"data":result,
		"filename":filename
	})

#Convert PML to JSON
@main.route("/pml/json",methods=["POST"])
def pml_json():
	code = request.get_data()
	filename,result,success = pml_to_json(code)
	return jsonify({
		"success" : success,
		"data":result,
		"filename":filename
	})

# Run a full pmlcheck on the code sent in
@main.route("/pml/full",methods=["POST"])
def pml_full_check():
	return jsonify({ "data" : pmlchecker(request.get_data().decode('utf-8'),None)})

# provides resource never required
@main.route("/pml/resource/pnr",methods=["POST"])
def resource_provides_never_required():
	return jsonify({ "data" : pmlchecker(request.get_data().decode('utf-8'),["-p"])})

# requires resource that is never provided
@main.route("/pml/resource/rnp",methods=["POST"])
def resource_requires_never_provided():
	return jsonify({ "data" : pmlchecker(request.get_data().decode('utf-8'),["-r"])})

# action neither requires nor provides resources
@main.route("/pml/action/empty",methods=["POST"])
def action_empty():
	return jsonify({ "data" : pmlchecker(request.get_data().decode('utf-8'),["-e"])})

#  action provides but does not require resources
@main.route("/pml/action/miracle",methods=["POST"])
def action_miracle():
	return jsonify({ "data" : pmlchecker(request.get_data().decode('utf-8'),["-m"])})

# action requires but does not provide resources
@main.route("/pml/action/blackhole",methods=["POST"])
def action_blackhole():
	return jsonify({ "data" : pmlchecker(request.get_data().decode('utf-8'),["-b"])})

# action provides different resources than required
@main.route("/pml/action/transformation",methods=["POST"])
def action_transformation():
	return jsonify({ "data" : pmlchecker(request.get_data().decode('utf-8'),["-t"])})

# expression check
@main.route("/pml/expression/check",methods=["POST"])
def expression_check():
	return jsonify({ "data" : pmlchecker(request.get_data().decode('utf-8'),["-x"])})

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

# Get code from the editor
# Write the code to the file and save
@main.route("/upload", methods=["POST"])
def upload():
	createFolders()
	filename = request.form["filename"]
	upload_folder = "tmp/" + str(session["uid"]) + "/"
	# Request the code
	code = request.form["code"]
	session["update"] = request.form["code"]
	session["changed"] = True
	session['currentFile'] = filename
	# Save the file to the upload folder we setup
	inFile = open(upload_folder + str(session['currentFile']),'w')
	inFile.write("%s" % code)
	inFile.close()
	displayFile(filename)
	listFilename()
	return redirect(url_for("main.index"))

# Add filename to list
# Check if filename exist
# Create new pml file with filename
@main.route("/newFile", methods =["POST"])
def newFile():
	filename = request.form["filename"]
	session['currentFile'] = filename
	#fileExist(filename) #couldnt get same file working
	session['lst'].append(session['currentFile'])
	upload_folder = "tmp/" + str(session["uid"]) + "/"
	file = open(os.path.join(upload_folder,str(session['currentFile'])),'w')
	file.close()
	listFilename()
	return redirect(url_for("main.index"))

# Return contents of file that is selected
@main.route("/uploads/<filename>", methods =["GET"])
def displayFile(filename):
	upload_folder = "tmp/" + str(session["uid"]) + "/" + str(filename)
	session['currentFile'] = filename
	listFilename()
	resp = make_response(open(upload_folder).read())
	return resp

# Remove file that is selected
@main.route('/delete_item/<filename>', methods=['POST'])
def delete_item(filename):
	print('deleting')
	upload_folder = "tmp/" + str(session["uid"]) + "/" + str(filename)
	os.remove(upload_folder)
	listFilename()
	return redirect(url_for("main.index"))

# Clear Editor
@main.route('/clearEditor', methods=['POST'])
def clear_editor():
	session["update"] = ''
	session['currentFile'] = "PML Code Checker"
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
		user = create_user(email, first_name, last_name,confirmed=True)

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
				new_user = create_user(email,first_name,last_name,password)
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
	session['currentFile'] = "PML Code Checker"
	session["changed"] = False
	session['lst'].clear() # Declares an empty list named
	return redirect(url_for("main.index"))

@main.route("/reset_password",methods=["GET","POST"])
def reset_password():
	form = PasswordResetForm();
	if request.method == "GET":
		return render_template("password_reset.html",form=form);
	elif request.method == "POST":
		if form.validate_on_submit():
			email = form.email.data.lower()
			user = User.query.filter_by(email=email).first()
			if user is not None:
				token = generate_email_token(email)
				reset_url = url_for("main.reset",token=token,_external=True)
				html = render_template("email_password_reset.html", reset_url=reset_url)
				subject = "Password reset request"
				send_email(email,subject,html)
			return render_template("password_reset_complete.html",email=email)
		else:
			return render_template("password_reset.html",form=form)

@main.route("/reset/<token>",methods=["GET","POST"])
# @login_required
def reset(token):
	form = PasswordChangeForm();
	if request.method == "GET":
		return render_template("password_reset.html",form=form);
	elif request.method == "POST":
		if form.validate_on_submit():
			password = form.password.data
			email = confirm_token(token)
			user = User.query.filter_by(email=email).first_or_404()
			user.set_password(password);
			db.session.add(user)
			db.session.commit()
			login_and_load_user(user)
			return redirect(url_for("main.index"))
		return render_template("password_reset.html",form=form);


@main.route("/confirm/<token>")
@login_required
def confirm_email(token):
	try:
		email = confirm_token(token)
	except:
		return "exception"
	user = User.query.filter_by(email=email).first_or_404()
	if user.confirmed:
		return "Already confirmed"
	else:
		user.confirmed = True
		db.session.add(user)
		db.session.commit()
		remove_alert_from_session("Email not confirmed")
		session["email_not_confirmed"] = False
	return redirect(url_for('main.index'))

@main.route('/resend')
@login_required
def resend_confirmation():
	current_user = User.query.filter_by(email=session["email"]).first()
	if not current_user.is_email_confirmed():
		token = generate_email_token(current_user.email)
		confirm_url = url_for('main.confirm_email', token=token, _external=True)
		html = render_template('email_confirmation.html', confirm_url=confirm_url)
		subject = "Email confirmation from PML IDE"
		send_email(current_user.email, subject, html)
	return redirect(url_for('main.index'))


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
	if not os.path.exists("tmp/" + str(session["uid"])):
		session['lst'].clear() # Declares an empty list named lst
		session['currentFile'] = "PML Code Checker"
		os.makedirs("tmp/" + str(session["uid"]))

# Login the user and set up their session information
def login_and_load_user(user):
	login_user(user)
	uid = user.get_id()
	session["uid"] = uid
	if user.get_first_name() is not None:
		session["username"] = user.get_first_name()
	session["email"] = str(user.get_email())
	if not user.is_email_confirmed():
		session["email_not_confirmed"] = True
		add_alert_to_session("Email not confirmed")
	listFilename()

# Logout the user and remove their session information
def logout_user_remove_session_data():
	logout_user()
	session.pop("uid",None)
	session.pop("email",None)
	session.pop("username",None)

# If Filename exist add a counter to it
def fileExist(filename):
	i =1
	path= "tmp/" + str(session["uid"]) + '/'
	while os.path.isfile(path + session['currentFile']):
		session['currentFile'] = filename + ' ' + str(i)
		print(session['currentFile'])
		i += 1

# Gets all files that exist under the user and adds it to the drop down menu
# Sets the counter to the next valid file number
def listFilename():
	i =1
	path= "tmp/" + str(session["uid"]) + '/'
	session['lst'] = [] # Declares an empty list named lst
	session['lst'].clear() # Declares an empty list named lst
	if not os.path.exists("tmp/" + str(session["uid"])):
		createFolders()
	names = os.listdir(path)
	files = sorted(names, key=lambda x: os.path.getctime(os.path.join(path, x)))
	files.reverse()
	session['lst'] =files

# Create a user and send the confirmation email.
# If confirmation sending fails the user wont be registered (hopefully)
def create_user(email, first_name, last_name,password=None,confirmed=False):
	user = User(email=email, first_name=first_name, last_name=last_name,
		password=password,confirmed=confirmed)
	token = generate_email_token(user.email)
	send_confirmation_email(user,token)
	db.session.add(user)
	db.session.commit()
	return user

def send_confirmation_email(user,token):
	confirm_url = url_for('main.confirm_email', token=token, _external=True)
	html = render_template('email_confirmation.html', confirm_url=confirm_url)
	subject = "Email confirmation from PML IDE"
	send_email(user.email,subject,html)

# generate a token to send to the user
def generate_email_token(email):
	serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
	return serializer.dumps(email, salt=current_app.config['SECURITY_PASSWORD_SALT'])

# Given a token see if it can be confirmed
def confirm_token(token, expiration=3600):
	serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
	try:
		email = serializer.loads(
			token,
			salt=current_app.config['SECURITY_PASSWORD_SALT'],
			max_age=expiration
		)
	except:
		return False
	return email

# Send an email to the user
def send_email(to, subject, template):
	msg = Message(
		subject,
		recipients=[to],
		html=template,
		sender=current_app.config['MAIL_DEFAULT_SENDER']
	)
	mail.send(msg)

# Remote an allert that will apear in the logout dropdown list
def remove_alert_from_session(alert):
	if "alerts" in session:
		if alert in session["alerts"]:
			session["alerts"].remove(alert)

# Add an alert to the logout dropdown list
def add_alert_to_session(alert):
	if "alerts" in session:
		session["alerts"].append(alert)
	else:
		session["alerts"] = []
		session["alerts"].append(alert)
