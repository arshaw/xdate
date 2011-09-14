
test("removeTimezone", function() {
	var xdate1 = new XDate();
	var xdate2 = xdate1.clone().removeTimezone();
	return !xdate2.hasTimezone() &&
		(!xdate1.getTimezoneOffset() || xdate1.getTime() != xdate2.getTime()) &&
		(xdate1.getDate() == xdate2.getDate() && xdate2.getDate() == xdate2.getUTCDate()) &&
		(xdate1.getHours() == xdate2.getHours() && xdate2.getHours() == xdate2.getUTCHours());
});

test("addTimezone", function() {
	var xdate1 = new XDate(2011, 7, 8, false);
	var xdate2 = xdate1.clone().addTimezone();
	return xdate2.hasTimezone() &&
		(!xdate1.getTimezoneOffset() || xdate1.getTime() != xdate2.getTime()) &&
		xdate1.getDate() == xdate2.getDate() &&
		xdate1.getHours() == xdate1.getHours();
});

test("hasTimezone", function() {
	var xdate1 = new XDate(0, true);
	var xdate2 = new XDate(0, false);
	return xdate1.hasTimezone() && !xdate2.hasTimezone();
});

test("getTimezoneOffset", function() {
	var date = new Date();
	var xdate1 = new XDate(+date);
	var xdate2 = new XDate(+date, false);
	return xdate1.getTimezoneOffset() == date.getTimezoneOffset() &&
		!xdate2.getTimezoneOffset();
});