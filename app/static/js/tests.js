"use strict"
function runAllTests(){
	// test_sample();
	test_login_exists();
	test_registration_exists();
}

/*
	Template for a test, rename your test function and add it to runALlTests
*/
function test_sample(){
	/*
		Replace TEMPLATE with a short description of what your test is doing
	*/
	console.log("Testing: TEMPLATE")


	// print one of the results below
	console.log("Result: PASS");
	console.log("Result: FAIL : Reason: ");
}

/*
	Get the html of the /login page and check that it contains
	the strings that should be in the buttons for facebook, Google
	and registration are in the text.

	Great tests :/
*/
function test_login_exists(){
	$.ajax({
		url : "/login",
		method: "GET",
		success : function(data){
			console.log("Testing: login buttons exist in the login screen");
			if(	data.indexOf("Facebook Login")>-1){
				if( data.indexOf("Google Login")>-1){
					if ( data.indexOf("Register")>-1){
						console.log("Result: PASS");
					} else{
						console.log("Result: FAIL : Reason: no register button");
					}
				}else{
					console.log("Result: FAIL : Reason: no google login button");
				}
			}else{
				console.log("Result: FAIL : Reason: no facebook login button");
			}
		},
		failure : function(data){
			console.log("Testing: login buttons exist in the login screen");
			console.log("Result: FAIL : Reason : could not get /login page contents");
		}
	})
}
function test_registration_exists(){
	$.ajax({
		url : "/register",
		method: "GET",
		success : function(data){
			console.log("Testing: register page has register fields");
			if(	data.indexOf("First Name")>-1){
				if(data.indexOf("Register")>-1){
					if(data.indexOf("Email Address")>-1){
						if(data.indexOf("Last Name")>-1){
							if(data.indexOf("Password")>-1){
								console.log("Result: PASS");
							}else{
								console.log("Result: Fail : Reason: could not find Password field");
							}
						}else{
							console.log("Result: Fail : Reason: could not find last name field");

						}
					}else{
						console.log("Result: Fail : Reason: could not find email field");

					}
				}else{
					console.log("Result: Fail : Reason: could not find register field");

				}
			}else{
				console.log("Result: Fail : Reason: could not find first name field");
			}
		},
		failure : function(data){
			console.log("Testing: register page has register fields");
			console.log("Result: FAIL : Reason: could not get /register page contents");
		}
	})
}
