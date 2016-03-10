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
			/*
				Code to show the errors and warnings inside the editor
			*/
			var errorRows = []
			var errorMessages = []
			for (var i = 0; i < d.data.length-1; i++) {
				var colonSplit = d.data[i].split(':');
				var rowNumber = parseInt(colonSplit[1]);
				errorRows.push(rowNumber-1);
				var errorMessage = colonSplit[2].toString();
				errorMessages.push(errorMessage);
			}
			var annotations = []
			for(var i = 0; i < errorRows.length;i++){
				annotations.push({
					row: errorRows[i],
					column: 2,
					text: errorMessages[i],
					type: "error"
				});
			}
			editor.session.setAnnotations(annotations);
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
function changeFontSize(val){
	editor.setOption("fontSize",val+"px");
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
	list_of_names[list_of_names.length-1] = list_of_names[list_of_names
		.length-1].replace(']', '');
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

function simpleGraph(){
	/*
		call the function that will conver PML to DOT, passing "" will make
		the function get data straight from the ace editor
		processDot is a cllback function that will be called on success
		on failure an error message will be printed to console
	*/
	convertPmlToDot("",processDot);
}
function processDot(data){
	/*
		data is a json object that contains "data" and "filename" keys, here
		the filename is extracted and the original object is replace by what
		data was.
	*/
	var filename = data.filename;
	var success = data.success;
	if (success != true){
		alert("An error occured when creating the visualization, please check" +
			"that there are no syntax mistakes.");
	}
	data = data.data;
	/*
		rename all of the r: and p: with requires and provides
		make it easier to understand what is happening the graph
	*/
	data = data.replace(/r:/g,"requires:");
	data = data.replace(/p:/g,"provides:");

	// Convert from dot to vis network
	var parsedData = vis.network.convertDot(data);

	/*
		Extract the nodes and edges from the parse data and remove the
		node that contains the filename
	*/
	var data = {
		nodes: parsedData.nodes,
		edges: parsedData.edges
	}
	data.nodes = removeFileName(data.nodes,filename);
	data.edges = fixEdges(data.edges);
	/*
		Get the container to which the graph will be added and set options
		for this current network
	*/
	var container = document.getElementById('visualization');
	var options = parsedData.options;

	options = {
		manipulation: false,
		width : "100%",
		height : "100%",
		physics :  {
			hierarchicalRepulsion: {
				nodeDistance: 300
			},
			enabled : false
		},
		layout : {
			improvedLayout : true,
			hierarchical: {
				enabled: true,
				levelSeparation: 100,
				direction: "UD",
				sortMethod: "directed"
			}
		},
		interaction : {
			navigationButtons: true,
			/*
				Enable when graph is moved to it's own page. If on the same page
				and this is enabled then editor's keys get take over by graph
			*/
			keyboard: false
		},
		nodes : {
			shadow:true
		},
		edges : {
			width: 2,
			shadow:true
		}
	}

	data = changeColourOfProvidesAndRequires(data);
	data = removeRequiresProvidesFromLabels(data);
	// create a network and display it
	var network = new vis.Network(container, data, options);
}
/*
	Rename taillabel to label as it seems vis can't deal with
	taillabels
*/
function fixEdges(edges) {
	for(var i = 0; i < edges.length;i++){
		if("taillabel" in edges[i]){
			edges[i].renameProperty("taillabel","label");
		}
	}
	return edges;
}
/*
	Traverse always adds a node with the filename into the graph, here we remove
	that node as it adds no value.
*/
function removeFileName(array,value) {
	var length = array.length;
	var result = [];
	for( var i = 0; i < length; i++){
		if(array[i].label===value){
		}else{
			result.push(array[i]);
		}
	}
	return result;
}
/*
	Change requires to be redish and provides to be greenish
*/
function changeColourOfProvidesAndRequires(data) {
	var nodes = data.nodes;
	var edges = data.edges;

	for(var i = 0; i < edges.length; i++){
		if("label" in edges[i]){
			if(contains(edges[i].label,"requires")){
				edges[i].font.color = "#E0683D";
			}else if(contains(edges[i].label,"provides")){
				edges[i].font.color = "#64E03D";
			}
		}
	}
	return {
		nodes : nodes,
		edges : edges
	}
}
/*
	Function for cehcking if a string contains a substring
*/
function contains(string,value) {
	return string.indexOf(value)>-1;
}
/*
	Remove require and provides from the graph
*/
function removeRequiresProvidesFromLabels(data) {
	var nodes = data.nodes;
	var edges = data.edges;
	var prov;
	for(var i = 0; i < edges.length; i++){
		if("label" in edges[i]){
			if(contains(edges[i].label,"provides") ||
				contains(edges[i].label,"requires")){
				// Set the label to whatever it was after :
				edges[i].label = edges[i].label.substring(
					edges[i].label.indexOf(":")+1);
			}
		}
	}
	return {
		nodes : nodes,
		edges : edges
	}
}
/*
	Rename any property of an object to some different one but keep the value
*/
Object.defineProperty(
	Object.prototype,
	'renameProperty',
	{
		writable : false, // Cannot alter this property
		enumerable : false, // Will not show up in a for-in loop.
		configurable : false, // Cannot be deleted via the delete operator
		value : function (oldName, newName) {
			// Do nothing if the names are the same
			if (oldName == newName) {
				return this;
			}
			/*
				Check for the old property name to
				avoid a ReferenceError in strict mode.
			*/
			if (this.hasOwnProperty(oldName)) {
				this[newName] = this[oldName];
				delete this[oldName];
			}
			return this;
		}
	}
);
