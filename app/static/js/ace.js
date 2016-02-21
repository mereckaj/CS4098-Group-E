ace.require("ace/ext/language_tools");
var editor = ace.edit("editor");
editor.setTheme("static/ace-master/lib/ace/theme//chrome");
editor.session.setMode("ace/mode/c_cpp");
editor.setOptions({
	enableBasicAutocompletion: true,
	enableSnippets: true,
	enableLiveAutocompletion: false
});