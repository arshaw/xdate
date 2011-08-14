(function() {

var passedCnt = 0;
var failedCnt = 0;
var voidCnt = 0;
var error = false;

window.test = function(name, func) {
	var res = func();
	var passed;
	var message;
	if (typeof res == 'object') {
		passed = res[0];
		message = res[1];
	}
	else if (typeof res == 'string') {
		message = res;
	}
	else{
		passed = res;
	}
	message = message ? " (<i>" + message + "</i>)" : '';
	if (passed === true) {
		document.write("<div><span style='color:green'>PASSED</span> - " + name + message + "</div>");
		passedCnt++;
	}
	else if (passed === false) {
		document.write("<div><span style='color:red'>FAILED</span> - " + name + message + "</div>");
		failedCnt++;
	}
	else {
		document.write("<div><span style='color:orange'>VOID</span> - " + name + message + "</div>");
		voidCnt++;
	}
}

window.onerror = function() {
	error = true;
};

window.onload = function() {
	var html = "<i>";
	if (error) {
		html += "<div style='color:red'>A JavaScript error has been thrown. Check your console.</div>";
	}
	html +=
		"<b>" + passedCnt + "</b> PASSED, " +
		"<b>" + failedCnt + "</b> FAILED, " +
		"<b>" + voidCnt + "</b> VOID" +
		"</i>";
	document.getElementById('test-results').innerHTML = html;
};

})();
