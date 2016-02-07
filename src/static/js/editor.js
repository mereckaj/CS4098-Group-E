function submitData(path){
	var data = editor.getSession().getValue();
	$.ajax({
		type: "POST",
		url: path,
		data: { code: data},
		success: function(d){
			// Take the reply and make it the new document now.
			document.open();
			document.write(d);
			document.close();
		}
	});
}