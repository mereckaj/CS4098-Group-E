from flask import Flask,request,render_template
from runCode import pmlchecker
from flask.ext.script import Manager

# Create an instance of the application and pass it to the Manager class 
# which will deal with the command line arguments

app = Flask(__name__)
manager = Manager(app)

# Result page
@app.route("/result/",methods=["POST"])
def root_post():
	# Extract the code from the POST request
	code = request.form["code"]

	# Run the code through the pmlheck tool and get the result
	result = pmlchecker(code)
	
	return render_template("pmlcheck_result.html",code=code,result=result)

# Main page
@app.route("/",methods=["GET"])
def root_get():
	return render_template("pmlcheck_form.html")

# Run the instance created above
if __name__ == "__main__":
	manager.run()