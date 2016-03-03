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
}

/*
	When user tries to upload a file put it into the text editor
*/
function setupUpload(){
	var fileInput = document.getElementById('file');
	fileInput.addEventListener("change", function(e){

		var file = fileInput.files[0];
		var reader = new FileReader();

		reader.onload = function(e) {
			editor.session.doc.setValue(reader.result);
		}
		reader.readAsText(file);
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
	loadKeyBinds();
	loadFontSize();
}
function loadKeyBinds(){
	var cookieValue = getCookie("editor");

	// Check if in cookie or get from server
	if(cookieValue!="" && cookieValue != null){
		setEditor(cookieValue);
	}else{
		getSetting("editor",parseSettingReplyEditor,errorSettingReplyEditor);
	}
}
function parseSettingReplyEditor(data){
	setEditor(data.data);
}

function setEditor(editor){
	switch(editor) {
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
	console.log(data.data);
	// set it to default
	none();
}
function loadFontSize(data){
	var cookieValue = getCookie("fontsize");
	if(cookieValue!="" && cookieValue != null){
		changeFontSize(cookieValue);
	}else{
		getSetting("fontsize",parseSettingReplyFontsize,errorSettingReplyFontsize);
	}
}

function parseSettingReplyFontsize(data){
	changeFontSize(data.data);
}

function errorSettingReplyFontsize(data){
	console.log("Error getting fontsize from server");
	console.log(data);
	// Set it to default
	changeFontSize("12");
}
function setCookie(cname, cvalue, exdays) {
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
}

/*
	Send information to the server about some setting
*/
function sendSetting(key,value){
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
function navbar_file_new_file(){
	// Add code here to actually create a new file on the server size
	editor.session.doc.setValue("");
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
