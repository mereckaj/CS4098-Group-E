import os
import sys
# We'll render HTML templates and access data sent by POST
# using the request object from flask. Redirect and url_for
# will be used to redirect the user once the upload is done
# and send_from_directory will help us to send/show on the
# browser the file that the user just uploaded
from flask import Flask, render_template, request, redirect, url_for, send_from_directory,session
from werkzeug import secure_filename
from . import main
from .runCode import pmlchecker
from .. import db
#from .models import User


# Initialize the Flask application
app = Flask(__name__)

# This is the path to the upload directory
app.config["UPLOAD_FOLDER"] = "tmp/"
# These are the extension that we are accepting to be uploaded
app.config["ALLOWED_EXTENSIONS"] = set(["txt", "pml", "png", "jpg", "jpeg", "gif"])

# For a given file, return whether it's an allowed type or not
def allowed_file(filename):
	return "." in filename and \
		filename.rsplit(".", 1)[1] in app.config["ALLOWED_EXTENSIONS"]

# Create a "tmp" folder to store the files if it does not exist and store the new file in there
def createFolders():
	if not os.path.exists("tmp/"):
		os.makedirs("tmp/")

# Result page
@main.route("/result/",methods=["POST"])
def root_post():
	# Extract the code from the POST request
	code = request.form["code"]

	# Run the code through the pmlheck tool and get the result
	result = pmlchecker(code)
	
	return render_template("pmlcheck_result.html",result=result)
	return session

# Main page
@main.route("/",methods=["GET"])
def root_get():
	return render_template("pmlcheck_form.html")

# Route that will process the file upload
@main.route("/upload", methods=["POST"])
def upload():
	createFolders()
	# Request the code
	code = request.form["fileCode"]
	session["update"] = request.form["fileCode"]
	session["changed"] = True
	#filename = '%s_upload.%s'%(User.query.get(int(userid)), "pml") use when push with user authentication
	filename = '%s_upload.%s'%("UserId12345", "pml") 
	# Take the current applications root folder, add on the relative UPLOAD_FOLDER path
	filepath = os.path.join(os.path.abspath(os.path.dirname(__name__)),app.config["UPLOAD_FOLDER"])
	# Move the file form the temporal folder to
	# the upload folder we setup
	inFile = open('tmp/' + filename,'w')
	inFile.write(code)

	return redirect(url_for("main.root_get"))
	return session

