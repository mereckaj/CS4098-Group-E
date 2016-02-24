var textarea = $('#code');
textarea.hide();
var textarea2 = $('input[name="fileCode"]');
var textarea3 = $('input[name="update"]');
ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
editor.setTheme("static/ace-master/lib/ace/theme//chrome");
editor.session.setMode("ace/mode/c_cpp");
editor.getSession().setValue(textarea3.val());

// Update text editor when there is a change
editor.getSession().on('change', function () {
	textarea.val(editor.getSession().getValue());
	textarea2.val(editor.getSession().getValue());
});

textarea.val(editor.getSession().getValue());
textarea2.val(editor.getSession().getValue());

editor.setOptions({
	enableBasicAutocompletion: true,
	enableSnippets: true,
	enableLiveAutocompletion: false
});