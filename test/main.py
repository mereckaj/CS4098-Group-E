#! ../venv/bin/python

import sys

if not hasattr(sys, 'real_prefix'):
	print("Should be run from within the virtualenv")
	sys.exit(1)
else:
	print("Starting tests")
	print("No tests yet :(")
	#Add execution of tests here