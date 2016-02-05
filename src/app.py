from flask import Flask,request,render_template
from runCode import pmlchecker
from flask.ext.script import Manager
app = Flask(__name__)
manager = Manager(app)

@app.route("/result/",methods=["POST"])
def root_post():
	code = request.form["code"]
	result = pmlchecker(code)
	return render_template("pmlcheck_result.html",code=code,result=result)

@app.route("/",methods=["GET"])
def root_get():
	return render_template("pmlcheck_form.html")

if __name__ == "__main__":
	manager.run()