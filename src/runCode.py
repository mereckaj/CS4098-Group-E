import subprocess, hashlib, os
def pmlchecker(code):
	
	# Create a somewhat unique name for the temp file
	filename = storeInFile(code)

	try:
		# Run the code through the checker and get the output
		output = subprocess.check_output(["./../pmlcheck",filename],stderr=subprocess.STDOUT)
		
	except subprocess.CalledProcessError as e:
		output = str(e.output)
		#convert the output into bytes
		output = output.encode("utf-8")
	#convert output into a string
	output = output.decode("utf-8")
	#convert back into bytes, and get rid of escape characters and returns it to a str
	output.encode("utf-8").decode('unicode_escape')
	print("the type %s"% type(output))
	# Remove the file (If left there's a change it will cause collisions)
	os.remove(filename)
	# Return the data as str
	return output

def storeInFile(code):
	# Create a somewhat unique name for the temp file
	filehash = hashlib.md5(code.encode('utf-8')).hexdigest()

	storeInNamedFile(code,filehash)
	return "tmp/" + filehash

def storeInNamedFile(code,filename):

	if not os.path.exists("tmp/"):
		os.makedirs("tmp/")
		print("Created tmp/")
	else:
		print("tmp exists")
	# Write the code to the file 
	text_file = open("tmp/" +filename, "w")
	text_file.write("%s" % code)
	text_file.close()