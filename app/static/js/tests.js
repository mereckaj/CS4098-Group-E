"use strict"
function runAllTests(){

	if (confirm("Testing will clear the editor, click okay to continue") == true) {
		test_editor_exists()
		test_editor();
		test_save();
		test_upload();
		test_login_exists();
		test_registration_exists();
	}

}


function test_editor_exists(){
	console.log("Testing: Editor has been loaded")
	if(typeof editor != "undefined"){
		console.log("Result: PASS");
	}
	else {
		console.log("Result: FAIL");
	}
}

/*
	Test file upload: Creates a file, put the file contents into the editor and
	then checks if the editor and file contents are equal.
*/
function test_upload(){
	console.log("Testing: File Upload");
	var file = new File(["process simple { action a { requires { foo } provides { foo } }\
action b { requires { foo } provides { bar } } }"], "test.pml");

	var reader = new FileReader();
	var extension = file.name.split('.').pop();
	if (!file) {
		console.log("Result: FAIL");
	} else if (extension != "pml") {
		console.log("Result: FAIL");
	} else {
		reader.onload = function(e) {
			var expectedResults =reader.result;
			editor.session.doc.setValue(reader.result);
			var results = editor.getSession().getValue();
			if (expectedResults==results){
				console.log("Result: PASS");
			} else {
				console.log("Result: FAIL");
			}
			// close the file
			editor.session.doc.setValue('');
			document.getElementById('title').innerHTML = "PML Code Checker";
			closeFile = true;
		}
		reader.readAsText(file);
	}
}

/*
	Test editor: Check if editor source was loaded
*/
function test_editor(){
	var script = '';
	$('script').filter(function () {
		if ($(this).attr('src') == "/static/src-noconflict/ace.js"){
			script= '/static/src-noconflict/ace.js';
		}

	});
	console.log("Testing: Editor");
	if(script=="/static/src-noconflict/ace.js"){
		console.log("Result: PASS");
	} else {
		console.log("Result: FAIL");
	}
}

/*
	Test file save: Create filename and code, save it.
	Get data from server and check if code is the same.
	Then delete the file and test if the file still exist.
*/
function test_save(){
	var name = 'testingFileSave';
	var testCode = "process simple { action a { requires { foo } provides { foo } }\
action b { requires { foo } provides { bar } } }";

	//save file
	$.ajax({
		type: "POST",
		data: { filename: name, code: testCode},
		url: "/upload"
	});

	//get file contents and compare
	var path = /uploads/ + name;
	jQuery.get(path, function(data) {
		console.log("Testing: File Save");
		if(data==testCode){
			console.log("Result: PASS");
		} else {
			console.log("Result: FAIL");
		}
	});

	// delete file
	path = /delete_item/ + name;
	jQuery.post(path);

	console.log("Testing: File Delete");
	if(!fileExist(name)){
		console.log("Result: PASS");
	} else {
		console.log("Result: FAIL");
	}
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
