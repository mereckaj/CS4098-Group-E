import subprocess, hashlib, os
def pmlchecker(code,options):
	# Create a somewhat unique name for the temp file
	filename = storeInFile(code)

	# Run the code through the checker and get the output, in case options have
	# been passed in then use them.
	try:
		if options is None:
			output = subprocess.check_output(["./pmlcheck",filename],
				stderr=subprocess.STDOUT)
		else:
			output = subprocess.check_output(["./pmlcheck"] + options +
				[filename],stderr=subprocess.STDOUT)
	except subprocess.CalledProcessError as e:
		output = e.output
	#convert output into a string
	output = output.decode("utf-8")

	# Remove the file (If left there's a change it will cause collisions)
	os.remove(filename)

	# Return the data as [str]
	return output.split('\n')

def storeInFile(code):
	# Create a somewhat unique name for the temp file
	filehash = getFileName(code)

	storeInNamedFile(code,filehash)
	return "tmp/" + filehash

def getFileName(code):
	return hashlib.md5(code.encode('utf-8')).hexdigest()

def storeInNamedFile(code,filename):

	# Create a "tmp" folder to store the files if it does not exist and store the new file in there
	if not os.path.exists("tmp/"):
		os.makedirs("tmp/")
		print("Created tmp/")

	# Write the code to the file
	text_file = open("tmp/" +filename, "w")
	text_file.write("%s" % code)
	text_file.close()

# Takes a byte array of pml code
def pml_to_dot(code):
	# Create a somewhat unique name for the temp
	# graphlibDot will not be able to work unless name of the file starts with a character
	filename = "a" + getFileName(code.decode("utf-8"))
	storeInNamedFile(code.decode("utf-8"),filename)
	filename = "tmp/" + filename

	try:
		# Run the code through the checker and get the output
		output = subprocess.check_output(["./traverse","-l",filename],stderr=subprocess.STDOUT)
	except subprocess.CalledProcessError as e:
		output = e.output

	#convert output into a string
	output = output.decode("utf-8")

	# Remove the file (If left there's a change it will cause collisions)
	os.remove(filename)

	# Return the filename and output as a tupple
	return (filename, output)
