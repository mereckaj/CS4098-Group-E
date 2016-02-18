function register(path){
	var data = $("#registerForm").serialize();
	$.ajax({
		type: "POST",
		url: path,
		data: data,
		success: success
	});
}

function success(response){
	document.write(response);
}