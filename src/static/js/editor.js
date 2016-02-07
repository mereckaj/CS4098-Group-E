console.log("Loaded editor.js");
function submitData(path){
	var data = editor.getSession().getValue();
	console.log("Got data: " + data);
	$.ajax({
		type: "POST",
		url: path,
		data: { code: data},
		success: function(d){
			console.log("Got reply from server: " + d);
			// Take the reply and make it the new document now.
			document = d;
			console.log("set document");
		}
	});
}