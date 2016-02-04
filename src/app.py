from flask import Flask,request,render_template
from runCode import pmlchecker
app = Flask(__name__)

@app.route("/result/",methods=["POST"])
def root_post():
	code = request.form["code"]
	result = pmlchecker(code)
	return render_template("pmlcheck_result.html",code=code,result=result)

@app.route("/",methods=["GET"])
def root_get():
	return render_template("pmlcheck_form.html")

if __name__ == "__main__":
	app.run(
		host="0.0.0.0",
		port=8080,
		debug=True
	)