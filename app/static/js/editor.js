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

function vim(){
	editor.setKeyboardHandler("ace/keyboard/vim");
	console.log("Changed keybinds to vim")
}

function emacs(){
	editor.setKeyboardHandler("ace/keyboard/emacs");
	console.log("Changed keybinds to emacs")
}

function none(){
	editor.setKeyboardHandler("");
	console.log("Changed keybinds to emacs")	
}