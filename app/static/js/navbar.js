/* ACE editor can't, for some stupid reson, take actual arguments to setOption.
	so we hack oh and we hack nasty. This here should get people expelled from college 
	in a normal case.
*/
$('#fontsize').bind('input', function() {
	var val = document.getElementById('fontsize').value
	sendFontSizePreference(val);
	changeFontSize(val);
});

function changeFontSize(val){
	switch(val){
		case "12":
			editor.setOption("fontSize",12);
			break;
		case "13":
			editor.setOption("fontSize",13);
			break;
		case "14":
			editor.setOption("fontSize",14);
			break;
		case "15":
			editor.setOption("fontSize",15);
			break;
		case "16":
			editor.setOption("fontSize",16);
			break;
		case "17":
			editor.setOption("fontSize",17);
			break;
		case "18":
			editor.setOption("fontSize",18);
			break;
		case "19":
			editor.setOption("fontSize",19);
			break;
		case "20":
			editor.setOption("fontSize",20);
			break;
		case "21":
			editor.setOption("fontSize",21);
			break;
		case "22":
			editor.setOption("fontSize",22);
			break;
		case "23":
			editor.setOption("fontSize",23);
			break;
		case "24":
			editor.setOption("fontSize",24);
			break;
		case "25":
			editor.setOption("fontSize",25);
			break;
		case "26":
			editor.setOption("fontSize",26);
			break;
		default:
			editor.setOption("fontSize",12);
	}
}
/* Send info to server and let it know that preferred font size changed, 
   have been changed so it may update it in the database
*/
function sendFontSizePreference(pref){
	$.ajax({
		type: "GET",
		url: "/fontsize/"+pref
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
	changeFontSize(document.getElementById("editor_choice").innerHTML.trim());
	
}