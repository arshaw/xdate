
test("hasLocalTimezone", function() {
	var xdate1 = new XDate(0, true);
	var xdate2 = new XDate(0, false);
	return xdate1.hasLocalTimezone() && !xdate2.hasLocalTimezone();
});

test("removeLocalTimezone", function() {
	var xdate1 = new XDate();
	var xdate2 = xdate1.clone().removeLocalTimezone();
	return xdate1.hasLocalTimezone() && !xdate2.hasLocalTimezone() && +xdate1 == +xdate2;
});

test("removeLocalTimezone, coerce", function() {
	var xdate1 = new XDate();
	var xdate2 = xdate1.clone().removeLocalTimezone(true);
	return !xdate2.hasLocalTimezone() &&
		(!xdate1.getTimezoneOffset() || xdate1.getTime() != xdate2.getTime()) &&
		(xdate1.getDate() == xdate2.getDate() && xdate2.getDate() == xdate2.getUTCDate()) &&
		(xdate1.getHours() == xdate2.getHours() && xdate2.getHours() == xdate2.getUTCHours());
});

test("addLocalTimezone", function() {
	var xdate1 = new XDate(2011, 5, 8, false);
	var xdate2 = xdate1.clone().addLocalTimezone();
	return !xdate1.hasLocalTimezone() && xdate2.hasLocalTimezone() && +xdate1 == +xdate2;
});

test("addLocalTimezone, coerce", function() {
	var xdate1 = new XDate(2011, 7, 8, false);
	var xdate2 = xdate1.clone().addLocalTimezone(true);
	return xdate2.hasLocalTimezone() &&
		(!xdate1.getTimezoneOffset() || xdate1.getTime() != xdate2.getTime()) &&
		xdate1.getDate() == xdate2.getDate() &&
		xdate1.getHours() == xdate1.getHours();
});

test("getTimezoneOffset", function() {
	var date = new Date();
	var xdate1 = new XDate(+date);
	var xdate2 = new XDate(+date, false);
	return xdate1.getTimezoneOffset() == date.getTimezoneOffset() &&
		!xdate2.getTimezoneOffset();
});