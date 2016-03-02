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
window.onload =function() {

	// Load uploaded file contents into new project and save 
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
	getNames();

	// When click different project load into editor
	$('.proj').on('click', 'li', function (){
		var strUser = $(this).text();  
		strUser = strUser.replace( /^\D+/g, '');
		path = /uploads/ + strUser;
		jQuery.get('http://localhost:8000' + path, function(data) {
    			editor.session.doc.setValue(data);
		});
	});

	// Take what the user said their favorite editor was and set it to that.
	// Don't remove from onload
	switch(document.getElementById("editor_choice").innerHTML.trim()) {
		case "NONE":
			none();
			break;
		case "VIM":
			vim();
			break;
		case "EMACS":
			emacs();
			break;
		default:
			none();
	} 
}

// Set the keybinds to vim
function vim(){
	editor.setKeyboardHandler("ace/keyboard/vim");
	sendKeyBindPreference("VIM");
}

// Set the keybinds to emacs
function emacs(){
	editor.setKeyboardHandler("ace/keyboard/emacs");
	sendKeyBindPreference("EMACS");
}

// Set the keybinds to default
function none(){
	editor.setKeyboardHandler("");
	sendKeyBindPreference("NONE");
}

/* Send info to server and let it know that keybinds have been changed so it may
	update it in the database
*/
function sendKeyBindPreference(pref){
	$.ajax({
		type: "GET",
		url: "/binds/"+pref
	});
}

function navbar_file_new_file(path){
	$.ajax({
		type: "POST",
		url: path
	});
	editor.session.doc.setValue();
}

function navbar_file_open_file(){
	$('#file').trigger('click');
}

function navbar_file_save(){
	document.forms["send"].submit();
}

function navbar_file_close_file(){
	editor.session.doc.setValue();
}

// Gets a list of names and displays in dropdown
function getNames(){
	select_elem = document.getElementById('projects');
	list_of_names = document.getElementById('fileNames[]').value;
	list_of_names = list_of_names.split(',');
	list_of_names[0] = list_of_names[0].replace('[', '');
	list_of_names[list_of_names.length-1] = list_of_names[list_of_names.length-1].replace(']', '');
        if(select_elem){
            for(var i = 0; i < list_of_names.length; i++) {
                var option = document.createElement('li');
                option.innerHTML = '<a>' + 'Project ' + list_of_names[i] + '</a>';
                option.value = list_of_names[i];
                select_elem.appendChild(option);
            }
        }
}
