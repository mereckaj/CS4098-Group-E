"use strict"
function runAllTests(){
	// test_sample();

	test_editor();
	test_save(); 	
	test_upload();	
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
	console.log("Result: FAIL");
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
