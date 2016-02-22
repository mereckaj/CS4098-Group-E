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

# Initialize the Flask application
app = Flask(__name__)

# This is the path to the upload directory
app.config["UPLOAD_FOLDER"] = "app/tmp/"
app.config["UPLOAD_FOLDER2"] = "tmp/"
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
		print("Created tmp/")
	if not os.path.exists("app/tmp/"):
		os.makedirs("app/tmp/")
		print("Created app/tmp/")

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

#reference http://code.runnable.com/UiPcaBXaxGNYAAAL/how-to-upload-a-file-to-the-server-in-flask-for-python
# Route that will process the file upload
@main.route("/upload", methods=["POST"])
def upload():
	createFolders()
	# Get the name of the uploaded file
	file = request.files["file"]
	# Check if the file is one of the allowed types/extensions
	if file and allowed_file(file.filename):
		# Make the filename safe, remove unsupported chars
		filename = secure_filename(file.filename)
		# Move the file form the temporal folder to
		# the upload folder we setup
		file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
		file.save(os.path.join(app.config["UPLOAD_FOLDER2"], filename))
		# Redirect the user to the uploaded_file route, which
		# will basicaly show on the browser the uploaded file
		return redirect(url_for("main.uploaded_file", filename=filename))

@main.route("/uploads/<filename>")
def uploaded_file(filename):
	return send_from_directory(app.config["UPLOAD_FOLDER2"], filename)

