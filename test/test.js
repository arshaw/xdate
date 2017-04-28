(function() {

var passedCnt = 0;
var failedCnt = 0;
var voidCnt = 0;
var profiles = [];
var error = false;

window.test = function(name, func) {
    var start = new Date();
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
        var duration = (new Date().getTime()) - start.getTime();
        profiles.push({name: name, duration: duration});
		document.write("<div><span style='color:green'>PASSED</span> - " + name + message + " (" + duration + "ms)</div>");
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
	var resultsHtml = "<i>";
	if (error) {
		resultsHtml += "<div style='color:red'>A JavaScript error has been thrown. Check your console.</div>";
	}
	resultsHtml +=
		"<b>" + passedCnt + "</b> PASSED, " +
		"<b>" + failedCnt + "</b> FAILED, " +
		"<b>" + voidCnt + "</b> VOID" +
		"</i>";
	document.getElementById('test-results').innerHTML = resultsHtml;

    if (!error) {
        var profileHtml = '';
        var profileData = profiles.slice(0).sort(function(a, b) {
            if (a.duration == b.duration) {
                return 0;
            }
            return a.duration < b.duration ? 1 : -1;
        });
        for (var i=0; i<profileData.length; i++) {
            profileHtml += "<div><span>(" + profileData[i].duration + "ms) " + profiles[i].name + "</span></div>";
        }
        document.getElementById('test-profiles').innerHTML = profileHtml;
    }
};

})();
