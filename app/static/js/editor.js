"use strict"; // Prevent javascript from doing stupid shit.
var network;
var container;
var graphData;
var options;
var containerName;
var colourScheme;
/*
	Tell the program what to do when the page loads which is
	basically initialization
*/
var noFiles;	//true when there is no files
var closeFile;	//True when file is closed
var coloursSchemes = {
	flowGraph : [
		{
			miracle : "#86B71E",
			blackhole : "#37948D",
			transformer : "#C1232B"
		},
		{
			miracle : "#3517DD",
			blackhole : "#7D0CDA",
			transformer : "#FFF500"
		},
		{
			miracle : "#20EC00",
			blackhole : "#FC0012",
			transformer : "#FF6C00"
		},
		{
			miracle : "#86D69A",
			blackhole : "#747C91",
			transformer : "#644164"
		}
	]
}
var colourSchemeInUse = coloursSchemes.flowGraph[0];
var lastText = "";
window.onload =function() {
	setInterval(function() { submitData()},1000);
	$('#fontsize').bind('input', function() {
		var val = document.getElementById('fontsize').value
		sendSetting("fontsize",val);
		changeFontSize(val);

	});
	setupUpload();
	setupFileDragAndDrop();
	loadUserSettings();
	// Select file and load it into the editor
	$('.proj').on('click', 'li', function (){
		if(!noFiles){
			var filename = $(this).text();
			noFiles =false;
			closeFile = false; //file is open
			var path = /uploads/ + filename;
			document.getElementById('title').innerHTML = filename;
			jQuery.get(path, function(data) {
				editor.session.doc.setValue(data);
				navbar_file_save();
			});
		}
	});

	// When click project delete the project and file
	// if there is file's to delete
	$('.del').on('click', 'li', function (){
		if(!noFiles){
			var filename = $(this).text();
			var path = /delete_item/ + filename;
			jQuery.post(path);
			removeElement(filename,'projects','.proj li');
			removeElement(filename,'deleting','.del li');
			loadNextFile(filename,'projects','.proj li');
			loadNextFile(filename,'deleting','.del li');
		}
		if(noFiles) {
			$.ajax({
				type: "POST",
				url: "/clearEditor"
			});
		}
	});

	// Get file names and display in both dropdown menus
	getNames('projects');
	getNames('deleting');

	loadColourSchemes();
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
		var name = file.name.substr(0, file.name.lastIndexOf('.'));
		name = updateName(name,name, 1);
		if(noFiles){	//if no files delete text in dropdown
			removeElement('There are no saved files','projects','.proj li');
			removeElement('There are no saved files','deleting','.del li');
		}
		if (!file) {
			alert("Failed to load file");
		} else if (extension != "pml") {
			alert(file.name + " is not a valid pml file");
		} else {
			reader.onload = function(e) {
				$.ajax({
					type: "POST",
					data: { filename: name},
					url: "/newFile"
				});
				editor.session.doc.setValue(reader.result);
				noFiles=false;
				closeFile = false; //file is open
				document.getElementById('title').innerHTML = name;
				addElement(name,'projects');
				addElement(name,'deleting');
				navbar_file_save();
			}
			reader.readAsText(file);
		}
	});
}

/*
	Rig up the ACE editors so that the user can populate them
	by dragging and dropping a file that contains PML.
*/
function setupFileDragAndDrop() {
    	var inputXml;
    	inputXml = document.getElementById('editor');
    	addFileDragAndDropEventListeners(inputXml, editor);

     	function addFileDragAndDropEventListeners(aceInputDiv, aceObject) {
       		aceInputDiv.addEventListener('dragover', function (e) {
		    aceInputDiv.preventDefault(e);
                    stopEvent(e);
                });

                aceInputDiv.addEventListener('drop', function (e) {
                    putFileContentsInAceEditor(e.dataTransfer.files[0], aceObject);
                    stopEvent(e);
                });

                function stopEvent(e) {
                    e.stopPropagation();
                 e.preventDefault();
           	}
     	} // end addFileDragAndDropEventListeners
} // end setupFileDragAndDrop

/*
	A small function that takes a file and an ACE editor object.
	The function reads the file and copies its contents into the ACE editor.
*/
function putFileContentsInAceEditor(file, aceEditor) {
    	var reader, text;
       	reader = new FileReader();
       	reader.onload = (function (file) {
         	text = file.target.result;
                aceEditor.getSession().setValue(text);
		navbar_file_save();
        });
        reader.readAsText(file);
	var extension = file.name.split('.').pop();
	if(noFiles){	//if no files delete text in dropdown
		removeElement('There are no saved files','projects','.proj li');
		removeElement('There are no saved files','deleting','.del li');
	}
	if (!file) {
		alert("Failed to load file");
	} else if (extension != "pml") {
		alert(file.name + " is not a valid pml file");
	}
	name = file.name;
	name = updateName(name,name, 1);
	noFiles=false;
	closeFile = false; //file is open
	document.getElementById('title').innerHTML = name;
	addElement(name,'projects');
	addElement(name,'deleting');

}

function addElement(name, dropdown){
	var select_elem = document.getElementById(dropdown);
	noFiles =false;
	closeFile =false;
	var option = document.createElement('li');
	option.innerHTML = '<a>' + name + '</a>';
	option.value = name;
	select_elem.appendChild(option);
}

function removeElement(name, dropdown, opt){
	var nameExist = false;
	var select_elem = document.getElementById(dropdown);
	$(opt).each(function (){
		var option = $(this).text();
		if(option == name){
			select_elem.removeChild(this);
			nameExist = true;
		}
	});
}

/*
	check if the file exist
*/
function fileExist(name){
	var list_of_names = document.getElementById('fileNames').value;
	list_of_names = list_of_names.split(',');
	for(var i = 0; i < list_of_names.length; i++) {
		if(list_of_names[i] !== '[]'){
			noFiles =false;
			list_of_names[i] = list_of_names[i].match(/'([^']+)'/)[1];
			if(name==list_of_names[i]){
				return true;
			}
		}

	}
	return false;
}


function updateName(name, newName,count){

	$('.proj li').each(function (){
		if(!noFiles){
			var filename = $(this).text();
			if(filename == newName){
				newName = name + ' ' + count;
				count = count + 1 ;
				return updateName(name,newName, count );
			}
		}
	});
	return newName;
}
/*
	This will load the last saved file into editor after delete
*/
function loadNextFile(deleteFile, dropdown,opt){
	var currentFile = document.getElementById('title').innerHTML;
	var select_elem = document.getElementById(dropdown);
	var found = false;
	if($(opt).length != 0){
		if(deleteFile == currentFile){
			var filename = $('.proj li:last').text();
			var path = /uploads/ + filename;
			document.getElementById('title').innerHTML = filename;
			closeFile = false; //file is open
			jQuery.get(path, function(data) {
				editor.session.doc.setValue(data);
				navbar_file_save();
			});
		}
	}else{
		document.getElementById('title').innerHTML = "PML Code Checker";
		editor.session.doc.setValue('');
		noFiles= true;
		closeFile =true;
		var option = document.createElement('li');
		option.innerHTML = '<a>' + 'There are no saved files' + '</a>';
		option.value = 'There is no saved files';
		select_elem.appendChild(option);
	}

}

/*
	Used to send PML code to the editor
*/
function submitData(){
	var data = editor.getSession().getValue();
	/*
		Prevent the program from sending repeated messages to the server with
		same data. Only send it if it has changed.
	*/
	if(lastText===data){
		return;
	}
	lastText = data;
	$.ajax({
		type: "POST",
		url: "/pml/full",
		data: data,
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
			var annotations = [];
			var errorCheck = 0;
			if(errorMessages[0] != undefined){
				var n = errorMessages[0].indexOf("syntax");
				for(var i = 0; i < errorMessages.length;i++){
						var check = errorMessages[i].indexOf("syntax");
						if( check != -1){
							errorCheck++;
						}
					}

				if(errorMessages > 1 || errorCheck == 0){
					for(var i = 0; i < errorMessages.length;i++){
						annotations.push({
							row: errorRows[i],
							column: 2,
							text: errorMessages[i],
							type: "warning"
						});
					}
				}
				else
				{
					for(var i = 0; i < errorRows.length;i++){
						annotations.push({
							row: errorRows[i],
							column: 2,
							text: errorMessages[i],
							type: "error"
						});
					}
				}

				editor.session.setAnnotations(annotations);
			}
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
function navbar_file_new_file(){
	var input = prompt("Please enter filename","Untitled file");
	input = $.trim(input);
	var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars
	if (pattern.test(input)) {
        	alert("Please only use standard alphanumerics");
		input = '';
		navbar_file_new_file();
	}

	if (input != ''&& input != null) {
		if(noFiles){	//if no files delete text in dropdown
			removeElement('There are no saved files','projects','.proj li');
			removeElement('There are no saved files','deleting','.del li');
		}
		input = updateName(input,input, 1);
		$.ajax({
			type: "POST",
			data: { filename: input},
			url: "/newFile"
		});
		editor.session.doc.setValue("");
		document.getElementById('title').innerHTML = input;
		closeFile =false;
		navbar_file_save();
		addElement(input,'projects');
		addElement(input,'deleting');
	}
	else{
		alert("Filename not entered, please try again");
	}
}

function navbar_file_open_file(){
	$('#file').trigger('click');
}

function navbar_file_save(){
	var input = document.getElementById('title').innerHTML;
	if (closeFile==true){
		var input = prompt("Please enter filename","Untitled file");
		input = $.trim(input);
		var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars
		if (pattern.test(input)) {
        		alert("Please only use standard alphanumerics");
			input = '';
			navbar_file_save();
		}
		input = updateName(input,input, 1);
	}

	if (input != ''&& input != null) {
		if(noFiles){	//if no files delete text in dropdown
			removeElement('There are no saved files','projects','.proj li');
			removeElement('There are no saved files','deleting','.del li');
		}
		document.getElementById('title').innerHTML = input;
		var data = editor.getSession().getValue();
		$.ajax({
			type: "POST",
			data: { filename: input, code: data},
			url: "/upload"
		});
	}
	else{
		alert("Filename not entered, please try again");
	}
	if (closeFile){
		addElement(input,'projects');
		addElement(input,'deleting');
		closeFile =false;
	}
}

function navbar_file_close_file(){
	document.getElementById('title').innerHTML = "PML Code Checker";
	editor.session.doc.setValue("");
	closeFile = true; //file is closed
	$.ajax({
		type: "POST",
		url: "/clearEditor"
	});
}

//If the name exist return new name
function changeName(name, newName,count){
	var list_of_names = document.getElementById('fileNames').value;
	list_of_names = list_of_names.split(',');
	for(var i = 0; i < list_of_names.length; i++) {
		if(list_of_names[i] !== '[]'){
			noFiles =false;
			list_of_names[i] = list_of_names[i].match(/'([^']+)'/)[1];
			if(name==list_of_names[i]){
				newName = name + ' ' + count;
				return changeName(name,newName, count++ );
			}
		}
	}
	return name;
}

function changeFontSize(val){
	editor.setOption("fontSize",val+"px");
	setCookie("fontsize",val,1024);
	$("#fontsize").attr("placeholder", val);
}

/*
	Gets a list of names and displays in dropdown
*/
function getNames(dropdown){
	var select_elem = document.getElementById(dropdown);
	var list_of_names = document.getElementById('fileNames').value;
	list_of_names = list_of_names.split(',');
	if(select_elem){
		for(var i = 0; i < list_of_names.length; i++) {
			if(list_of_names[i] !== '[]'){
				noFiles =false;
				closeFile =false;
				list_of_names[i] = list_of_names[i].match(/'([^']+)'/)[1];
				var option = document.createElement('li');
				option.innerHTML = '<a>' + list_of_names[i] + '</a>';
				option.value = list_of_names[i];
				select_elem.appendChild(option);
			}
			else{
				document.getElementById('title').innerHTML = "PML Code Checker";
				noFiles = true;
				closeFile =true;
				var option = document.createElement('li');
				option.innerHTML = '<a>' + 'There are no saved files' + '</a>';
				option.value = 'There is no saved files';
				select_elem.appendChild(option);
			}
		}
	}
}

function simpleGraph(container){
	/*
		call the function that will conver PML to DOT, passing "" will make
		the function get data straight from the ace editor
		processDot is a cllback function that will be called on success
		on failure an error message will be printed to console
	*/
	containerName = container;
	convertPmlToDot("", processDot);
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
		alert("An error occured when creating the visualization, please check " +
			"that there are no syntax mistakes. Here is what the server returned" +
			data.data
		);
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

	var container = document.getElementById(containerName);


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

	// create a network and display it
	// var network = new vis.Network(container, data, options);
	setGraphOptions(container,data,options);
	createGraph();
	analysisColouredActions();
}
/*
	Rename taillabel to label as it seems vis can't deal with
	taillabels
*/
function fixEdges(edges) {
	for(var i = 0; i < edges.length;i++){
		if("taillabel" in edges[i]){
			if("label" in edges[i]){
				edges[i].label = edges[i].taillabel + "\n" +
					edges[i].label;
			}else{
				edges[i].renameProperty("taillabel","label");
			}
		}
	}
	for(var i = 0; i < edges.length;i++){
		if("label" in edges[i]){
			if(contains(edges[i].label,"requires:[]")){
				edges[i].label = edges[i].label.replace("requires:[]","");
			}
			if(contains(edges[i].label,"provides:[]")){
				edges[i].label = edges[i].label.replace("provides:[]","");
			}
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
				if(contains(edges[i].label,"provides")){
					edges[i].font.color = "black";
				}else{
					edges[i].font.color = "#E0683D";
				}
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
/*
	Get data about miracles/blackholes and 	transformers and colour them
	in different colours
*/
function analysisColouredActions(){
	sendDataToServer(
		"POST",
		"/pml/action/transformation",
		editor.session.doc.getValue(),
		transformationHighlightSuccess,
		highlightFail
	);
	sendDataToServer(
		"POST",
		"/pml/action/miracle",
		editor.session.doc.getValue()
		,miracleHighlightSuccess,
		highlightFail
	);
	sendDataToServer(
		"POST",
		"/pml/action/blackhole",
		editor.session.doc.getValue(),
		blackholeHighlightSuccess,
		highlightFail
	);
}
function miracleHighlightSuccess(data) {
	highlightNodes(data,"MIRACLE");
}
function blackholeHighlightSuccess(data) {
	highlightNodes(data,"BLACKHOLE");
}
function transformationHighlightSuccess(data) {
	highlightNodes(data,"TRANSFORM");
}
function highlightNodes(data,type){
	// createGraph(args[0],args[1],args[2]);
	var array = data.data;
	switch (type) {
		case "MIRACLE":
			for (var line in array){
				if(array[line]!=""){
					var actionName = getActionName(array[line]);
					highlightNode(actionName,colourSchemeInUse.miracle);
				}
			}
			break;
		case "BLACKHOLE":
			for (var line in array){
				if(array[line]!=""){
					var actionName = getActionName(array[line]);
					highlightNode(actionName,colourSchemeInUse.blackhole);
				}
			}
			break;
		case "TRANSFORM":
			for (var line in array){
				if(array[line]!=""){
					var actionName = getActionName(array[line]);
					highlightNode(actionName,colourSchemeInUse.transformer);
				}
			}
			break;
	}
	// Redraw the graph with new settings
	createGraph();
}
function highlightFail(data) {
	alert("Error when performing highlights");
	console.log(data);
}
function getActionName(str) {
	return str.split("action")[1].split("'")[1];
}
function createGraph() {
	network = new vis.Network(container,graphData,options);
}
function highlightNode(nodeName,nodeColour) {
	for(var nodes in graphData.nodes){
		if(equal(graphData.nodes[nodes].label,nodeName)){
			var obj = graphData.nodes[nodes];
			graphData.nodes[nodes].color = nodeColour;
		}
	}
}
function equal(str1,str2){
	return str1===str2;
}
function setGraphOptions(cont,data,opts) {
	container = cont;
	graphData = data;
	options = opts;
}
function changeColoursScheme(scheme,containter){
	colourSchemeInUse = coloursSchemes.flowGraph[scheme];
	simpleGraph(containter);
}
function loadColourSchemes(){
	for ( var i in coloursSchemes.flowGraph){
		createTableEntry(coloursSchemes.flowGraph[i], i);
	}
}
function createTableEntry(scheme, radioNumber) {
	var table = document.getElementById("colourSchemeTable");
	var newRow = table.insertRow();
	var col1 = newRow.insertCell(0);
	var col2 = newRow.insertCell(1);
	var radioDiv = document.createElement("div");
	radioDiv.className = "radio";

	var radioLabel = document.createElement("label");
	radioLabel.className = "active";
	radioLabel.value = "Scheme : " + radioNumber;
	radioLabel.id = "Scheme " + radioNumber;

	var radioLabelInput = document.createElement("input");
	radioLabelInput.type = "radio";
	radioLabelInput.name = "optradio";
	radioLabelInput.value = "Scheme " + radioNumber;
	radioLabelInput.id = radioNumber.toString();
	if(radioNumber==="0"){
		radioLabelInput.checked = true;
	}
	radioLabelInput.addEventListener(
		"click",
		function(){
			changeColoursScheme(radioNumber,'visualization');
		},
		false
	);

	radioLabel.appendChild(radioLabelInput);
	// radioLabel.innerHTML = radioLabel.innerHTML + "Scheme " + radioNumber;
	radioDiv.appendChild(radioLabel);
	col1.appendChild(radioDiv);

	var miracleButton = document.createElement("button");
	miracleButton.className = "btn btn-primary";
	miracleButton.style = "background-color:" + scheme.miracle;
	miracleButton.innerHTML = "Miracle";

	var blackHoleButton = document.createElement("button");
	blackHoleButton.className = "btn btn-primary";
	blackHoleButton.style = "background-color:" + scheme.blackhole;
	blackHoleButton.innerHTML = "Blackhole";

	var transformerButton = document.createElement("button");
	transformerButton.className = "btn btn-primary";
	transformerButton.style = "background-color:" + scheme.transformer;
	transformerButton.innerHTML = "Transformer";

	col2.appendChild(miracleButton);
	col2.appendChild(blackHoleButton);
	col2.appendChild(transformerButton);
}
/*
	Post the current editors data to the server and get the reply
*/
function pmlToJson(){
	convertPmlToJSON("",processJSON);
}
/*
	Call back function to deal with pmlToJson
*/
function processJSON(data) {
	// Check to make sure there were no failures on the server side
	var success = data.success;
	if (success != true){
		alert("An error occured when trying to parse PML. Please make sure that " +
		"Please make sure that the syntax of the PML is correct. Here is what " +
		"the server returned: " + data.data);
		return;
	}
	// The server returns raw json (Not jsonified) so parse it
	var parsed_json = JSON.parse(data.data);
	var nodes = [];
	var relations = [];
	/*
		Loop over all the data, remove the start and end nodes and any relations
		that go to them. They were added by traverse for DOT and we don't need
		them here.
	*/
	for (var i in parsed_json){
		if( "type" in parsed_json[i]){
			if(parsed_json[i].type==="node"){
				if(isSuitableNode(parsed_json[i])){
					nodes.push(parsed_json[i]);
				}
			}else if(parsed_json[i].type==="relation"){
				if(isSuitableRelation(parsed_json[i])){
					relations.push(parsed_json[i]);
				}
			}
		}
	}
	/*
		CODE GOES HERE
	*/
}
/*
	Check that the relation does not come from/go to a node we don't care about
*/
function isSuitableRelation(relation){
	if(	relation.data.from.data.name!=="start" &&
		relation.data.from.data.name!=="end" &&
		relation.data.to.data.name!=="start" &&
		relation.data.to.data.name!=="end"){
			return true;
	}
	console.log(relation);
	return false;
}
/*
	Check that start and end nodes don't get included after parsing
*/
function isSuitableNode(node){
	if("name" in node.data){
		/*
			Unsuitable (these nodes were added in by traverse and dont
			come from actual PML)
		*/
		if(node.data.name!=="start" && node.data.name!=="end"){
			return true;
		}
	}
	return false;
}
