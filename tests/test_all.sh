#! /bin/bash
PWD=$(pwd)/tests/

# Count the number of scrips in the tests/bash folder
TESTS=$(ls -l $PWD/bash/test_*.sh | wc -l);
SUCCESS=0

# For every script in tht file, run it and check that it's return is ok
for each in $PWD/bash/test_*.sh;
do
	$each
	# Check the return code of the tests, if it is 0 then count it as success
	# if it is 1 then it failed.
	if [ $? -ne 1 ]; then
		let SUCCESS=SUCCESS+1
	fi
done

# Calculate the percentage of tests that were successful
PERCENT=$(awk "BEGIN { pc=100*${SUCCESS}/${TESTS}; i=int(pc); print (pc-i<0.5)?i:i+1 }")

# Inform the user
echo "Ran $TESTS of which $SUCCESS were successful ($PERCENT %)";
