#! /bin/bash

PWD=$(pwd)
PML="good.pml"
ERROR_PML="error.pml"
PMLCHECK=pmlcheck
function clean(){
	rm $PML $ERROR_PML;
}
function clean_and_exit_error(){
	echo "[FAIL]";
	clean
	exit 1;
}
function clean_and_exit_success(){
	echo "[OK]";
	clean
	exit 0;
}

[ -f $PMLCHECK ] && echo -e "$PMLCHECK exists" || { echo -e "$PMLCHECK does not exist $"; echo "[FAIL]"; exit 1;}

echo "process simple { action a { requires { foo } provides { foo } }\
action b { requires { foo } provides { bar } } }" > $PML

echo "process simple { } }" > $ERROR_PML

OUTPUT="$( $PWD/$PMLCHECK -x $PML 2>&1)"
if [ -z "$OUTPUT" ]; then
	OUTPUT="$($PMLCHECK -x $ERROR_PML 2>&1)"
	if [ -z "$OUTPUT" ]; then
		echo $OUTPUT
		clean_and_exit_error
	else
		clean_and_exit_success
	fi
else
	echo $OUTPUT
	clean_and_exit_error
fi
