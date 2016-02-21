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
    var button = document.getElementById('send');

    fileInput.addEventListener("change", function(e){

	  var file = fileInput.files[0];
	  var reader = new FileReader();

	  reader.onload = function(e) {
            editor.session.doc.setValue(reader.result);
	  }

	  reader.readAsText(file);  

    });
}
