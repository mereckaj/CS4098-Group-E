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
	var fileInput = document.getElementById('file');
	fileInput.addEventListener("change", function(e){

		var file = fileInput.files[0];
		var reader = new FileReader();

		reader.onload = function(e) {
			editor.session.doc.setValue(reader.result);
		}
		reader.readAsText(file);
	});

	// Take what the user said their favorite editor was and set it to that.
	var ed = document.getElementById("editor_choice").innerHTML.trim();
	console.log("ed" + ed);
	switch(ed) {
		case "NONE":
			console.log("NONE");
			none();
			break;
		case "VIM":
			console.log("VIM");
			vim();
			break;
		case "EMACS":
			console.log("EMACS");
			emacs();
			break;
		default:
			none();
	} 
}

function vim(){
	editor.setKeyboardHandler("ace/keyboard/vim");
	sendKeyBindPreference("VIM");
}

function emacs(){
	editor.setKeyboardHandler("ace/keyboard/emacs");
	sendKeyBindPreference("EMACS");
}

function none(){
	editor.setKeyboardHandler("");
	sendKeyBindPreference("NONE");
}

function sendKeyBindPreference(pref){
	$.ajax({
		type: "GET",
		url: "/binds/"+pref
	});
}
