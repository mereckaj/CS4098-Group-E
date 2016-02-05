import subprocess, hashlib, os
def pmlchecker(code):
	
	# Create a somewhat unique name for the temp file
	filename = storeInFile(code)

	try:
		# Run the code through the checker and get the output
		output = subprocess.check_output(["./../pmlcheck",filename],stderr=subprocess.STDOUT)
	except subprocess.CalledProcessError as e:
		output = str(e.output)
	# Remove the file (If left there's a change it will cause collisions)
	output = output.decode("utf-8")
	output.encode('utf-8').decode('unicode_escape')
	os.remove(filename)

	# Return the data
	return output

def storeInFile(code):
	# Create a somewhat unique name for the temp file
	filehash = hashlib.md5(code.encode('utf-8')).hexdigest()

	storeInNamedFile(code,filehash)
	return filehash

def storeInNamedFile(code,filename):

	# Write the code to the file 
	text_file = open(filename, "w")
	text_file.write("%s" % code)
	text_file.close()