
test("identical methods", function() {
	var xdate = new XDate(true);
	return xdate.getFullYear() == xdate.getUTCFullYear() &&
		xdate.getMonth() == xdate.getUTCMonth() &&
		xdate.getDate() == xdate.getUTCDate() &&
		xdate.getHours() == xdate.getUTCHours() &&
		xdate.getMinutes() == xdate.getUTCMinutes() &&
		xdate.getSeconds() == xdate.getUTCSeconds() &&
		xdate.getMilliseconds() == xdate.getUTCMilliseconds();
});

test("getUTCMode", function() {
	var xdate1 = new XDate(0, true);
	var xdate2 = new XDate(0, false);
	return xdate1.getUTCMode() && !xdate2.getUTCMode();
});

test("setUTCMode to true", function() {
	var xdate1 = new XDate();
	var xdate2 = xdate1.clone().setUTCMode(true);
	return !xdate1.getUTCMode() && xdate2.getUTCMode() && +xdate1 == +xdate2;
});

test("setUTCMode to true, coerce", function() {
	var xdate1 = new XDate();
	var xdate2 = xdate1.clone().setUTCMode(true, true);
	return !xdate1.getUTCMode() && xdate2.getUTCMode() &&
		(!xdate1.getTimezoneOffset() || xdate1.getTime() != xdate2.getTime()) &&
		(xdate1.getDate() == xdate2.getDate() && xdate2.getDate() == xdate2.getUTCDate()) &&
		(xdate1.getHours() == xdate2.getHours() && xdate2.getHours() == xdate2.getUTCHours());
});

test("setUTCMode to false", function() {
	var xdate1 = new XDate(2011, 5, 8, true);
	var xdate2 = xdate1.clone().setUTCMode(false);
	return xdate1.getUTCMode() && !xdate2.getUTCMode() && +xdate1 == +xdate2;
});

test("setUTCMode to false, coerce", function() {
	var xdate1 = new XDate(2011, 7, 8, true);
	var xdate2 = xdate1.clone().setUTCMode(false, true);
	return xdate1.getUTCMode() && !xdate2.getUTCMode() &&
		(!xdate1.getTimezoneOffset() || xdate1.getTime() != xdate2.getTime()) &&
		xdate1.getDate() == xdate2.getDate() &&
		xdate1.getHours() == xdate1.getHours();
});

test("getTimezoneOffset", function() {
	var date = new Date();
	var xdate1 = new XDate(+date);
	var xdate2 = new XDate(+date, true);
	return xdate1.getTimezoneOffset() == date.getTimezoneOffset() &&
		!xdate2.getTimezoneOffset();
});