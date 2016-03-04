"use strict"; // Prevent javascript from doing stupid shit.
/*
	Tell the program what to do when the page loads which is
	basically initialization
*/
window.onload =function() {
	$('#fontsize').bind('input', function() {
		var val = document.getElementById('fontsize').value
		sendSetting("fontsize",val);
		changeFontSize(val);
	});
	setupUpload();
	loadUserSettings();


	// When select project load it into the editor
	$('.proj').on('click', 'li', function (){
		var strUser = $(this).text();
		var number = strUser.replace( /^\D+/g, ''); // get project number
		var path = /uploads/ + number;
		jQuery.get('http://localhost:8000' + path, function(data) {
    			editor.session.doc.setValue(data);
		});

	});

	// When click project delete the project and file
	$('.del').on('click', 'li', function (){
		var strUser = $(this).text();
		var number = strUser.replace( /^\D+/g, '');	// get project number
		var path = /delete_item/ + number;
		jQuery.post('http://localhost:8000' + path);
		refresh()
	});

	// Get file names and display in both dropdown menus
	getNames('projects');
	getNames('deleting');
}
/*
	When user tries to upload a file put it into the text editor
*/
function setupUpload(){
	console.log("Setting up upload button");
	var fileInput = document.getElementById('file');
	fileInput.addEventListener("change", function(e){
		var file = fileInput.files[0];
		var reader = new FileReader();
		var extension = file.name.split('.').pop();
		if (!file) {
			alert("Failed to load file");
		} else if (extension != "pml") {
			alert(file.name + " is not a valid pml file");
		} else {
			reader.onload = function(e) {
				$.ajax({
					type: "POST",
					url: "/newFile"
				});
				editor.session.doc.setValue(reader.result);
				navbar_file_save()
			}
			reader.readAsText(file);
		}
	});
}

/*
	Used to send PML code to the editor
*/
function submitData(path){
	var data = editor.getSession().getValue();
	$.ajax({
		type: "POST",
		url: path,
		data: { code: data},
		success: function(d){
			$('#result').html(d);
		}
	});
}

/*
	Load all user settings here
*/
function loadUserSettings(){
	console.log("Setting up user settings");
	loadKeyBinds();
	loadFontSize();
}
function loadKeyBinds(){
	console.log("Loading user key bind preference");
	var cookieValue = getCookie("editor");
	console.log("-->" + cookieValue +"<--");

	// Check if in cookie or get from server
	if(cookieValue!="" && cookieValue != null){
		console.log("Key binds from cookie");
		setEditor(cookieValue);
	}else{
		console.log("Key binds from server");
		getSetting("editor",parseSettingReplyEditor,errorSettingReplyEditor);
		console.log("Got key binds from server");
	}
}
function parseSettingReplyEditor(data){
	console.log("Success getting editor from server ");
	setEditor(data.data);
}

function setEditor(editor){
	switch(editor) {
	// Take what the user said their favorite editor was and set it to that.
	// Don't remove from onload
		case "NONE":
			changeKeyBinds("","NONE");
			break;
		case "VIM":
			changeKeyBinds("ace/keyboard/vim","VIM");
			break;
		case "EMACS":
			changeKeyBinds("ace/keyboard/emacs","EMACS");
			break;
		default:
			changeKeyBinds("","NONE");
	}
}

function errorSettingReplyEditor(data){
	console.log("Error getting editor from server");
	console.log(data);
	// set it to default
	none();
}
function loadFontSize(data){
	console.log("Loading user fontsize preference");
	var cookieValue = getCookie("fontsize");
	console.log("-->" + cookieValue +"<--");
	if(cookieValue!="" && cookieValue != null){
		console.log("font size from cookie")
		changeFontSize(cookieValue);
	}else{
		console.log("font size from server")
		getSetting("fontsize",parseSettingReplyFontsize,errorSettingReplyFontsize);
	}
}

function parseSettingReplyFontsize(data){
	console.log("Success getting fontsize from server ");
	changeFontSize(data.data);
}

function errorSettingReplyFontsize(data){
	console.log("Error getting fontsize from server");
	console.log(data);
	// Set it to default
	changeFontSize("12");
}
function setCookie(cname, cvalue, exdays) {
	console.log("Creating cookie " + cname + " with value " + cvalue);
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

/*
	Change key bind settings, store it in the cookie and send the information
	to the server

	handler is the full ace name, choices:
		1. "ace/keyboard/emacs"
		2. "ace/keyboard/vim"
		3. ""

	shorname is what gets sent to server and stored in cookie, choices
		1. EMACS
		2. VIM
		3. NONE
*/
function changeKeyBinds(handler,shortname){
	editor.setKeyboardHandler(handler);
	sendSetting("editor",shortname);
	setCookie("editor",shortname,1024);
	console.log("Set editor to " + shortname)
}

/*
	Send information to the server about some setting
*/
function sendSetting(key,value){
	console.log("Sent setting " + key +" with value " + value)
	$.ajax({
		type: "POST",
		url: "/settings/"+key+"/"+value
	});
}
/*
	Get some setting from the server, use callbacks so that user doesn't have
	to wait for a long time for the editor to load.
*/
function getSetting(key,success,failure){
	console.log("Getting setting " + key);
	$.ajax({
		type: "GET",
		url: "/settings/"+key,
		success : success,
		error : failure
	});
}
/*
	Tell the program what to do when user clicks menu buttons
*/
function navbar_file_new_file(path){
	$.ajax({
		type: "POST",
		url: path
	});
	refresh();
}

function navbar_file_open_file(){
	$('#file').trigger('click');
}

function navbar_file_save(){
	document.forms["send"].submit();
}

function navbar_file_close_file(){
	editor.session.doc.setValue("");
}
/* 	ACE editor can't, for some stupid reason, take actual arguments to
	setOption. So we hack oh and we hack nasty. This here should get people
	expelled from college in a normal case.
*/
function changeFontSize(val){
	switch(val){
		case "12":
			editor.setOption("fontSize",12);
			break;
		case "13":
			editor.setOption("fontSize",13);
			break;
		case "14":
			editor.setOption("fontSize",14);
			break;
		case "15":
			editor.setOption("fontSize",15);
			break;
		case "16":
			editor.setOption("fontSize",16);
			break;
		case "17":
			editor.setOption("fontSize",17);
			break;
		case "18":
			editor.setOption("fontSize",18);
			break;
		case "19":
			editor.setOption("fontSize",19);
			break;
		case "20":
			editor.setOption("fontSize",20);
			break;
		case "21":
			editor.setOption("fontSize",21);
			break;
		case "22":
			editor.setOption("fontSize",22);
			break;
		case "23":
			editor.setOption("fontSize",23);
			break;
		case "24":
			editor.setOption("fontSize",24);
			break;
		case "25":
			editor.setOption("fontSize",25);
			break;
		case "26":
			editor.setOption("fontSize",26);
			break;
		default:
			editor.setOption("fontSize",12);
	}
	setCookie("fontsize",val,1024);
	$("#fontsize").attr("placeholder", val);
}


// refresh so the contents in drop down menu is updated
function refresh(){
	document.forms["refreshed"].submit();
}

// Gets a list of names and displays in dropdown
function getNames(dropdown){
	var select_elem = document.getElementById(dropdown);
	var list_of_names = document.getElementById('fileNames').value;
	list_of_names = list_of_names.split(',');
	list_of_names[0] = list_of_names[0].replace('[', '');
	list_of_names[list_of_names.length-1] = list_of_names[list_of_names.length-1].replace(']', '');
        if(select_elem){
            for(var i = 0; i < list_of_names.length; i++) {
		        list_of_names[i] = list_of_names[i].replace( /'/g, '');
                var option = document.createElement('li');
                option.innerHTML = '<a>' + list_of_names[i] + '</a>';
                option.value = list_of_names[i];
                select_elem.appendChild(option);
            }
        }
}
