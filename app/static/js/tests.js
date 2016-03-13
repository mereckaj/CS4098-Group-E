"use strict"
function runAllTests(){
	test_editor_exists()
}

/*
	Template for a test, rename your test function and add it to runALlTests
*/
function test_editor_exists(){
	/*
		Replace TEMPLATE with a short description of what your test is doing
	*/
	console.log("Testing: Editor has been loaded")

	if(typeof editor != "undefined"){
		console.log("Result: PASS");
	}
	else {
		console.log("Result: FAIL");
	}

	// print one of the results below


}
