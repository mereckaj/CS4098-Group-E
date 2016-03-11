"use strict"
function convertPmlToDot(data,convertSuccess,convertFailure){
	if(data===""){
		var data = editor.session.doc.getValue();
	}
	sendDataToServer("POST","/dot",data,convertSuccess);
}
/*
	Put some data to the server, use callbacks so that user never sees any
	delay. Callback is where the result will be gotten from too.
*/
function sendDataToServer(method,path,dataToSend,success,failure,async){
	$.ajax({
		type: method,
		url: path,
		data: dataToSend,
		success : success,
		error : failure
	});
}
