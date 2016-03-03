"use strict"
function convertPmlToDot(){
    var data = editor.session.doc.getValue();
    sendDataToServer("POST","/dot",data,convertSuccess,convertFailure);
}
function convertSuccess(data){
    return data
}
function convertFailure(data){
    console.log("Error");
    console.log(data);
}
/*
	Put some data to the server, use callbacks so that user never sees any
    delay. Callback is where the result will be gotten from too.
*/
function sendDataToServer(method,path,dataToSend,success,failure){
	$.ajax({
		type: method,
		url: path,
        data: dataToSend,
		success : success,
		error : failure
	});
}
