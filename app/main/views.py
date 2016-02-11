from flask import render_template, url_for, request, session
from . import main
from .runCode import pmlchecker
from .. import db
from flask_user import login_required

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


@main.route("/authed",methods=["GET"])
@login_required
def home():
	return render_template("homepage.html")