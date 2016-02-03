#! ../venv/bin/python

import sys

if not hasattr(sys, 'real_prefix'):
	print("Should be run from within")
	sys.exit(1)
else:
	print("Starting tests")
	#Add execution of tests here