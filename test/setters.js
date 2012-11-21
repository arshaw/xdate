

test("set*, when utcMode=false", function() {
	var xdate = new XDate(2012, 0, 1);
	var YEAR = 2011;
	var MONTH = 5;
	var DATE = 4;
	var HOURS = 13;
	var MINUTES = 45;
	var SECONDS = 20;
	var MILLISECONDS = 750;
	xdate.setFullYear(YEAR)
		.setMonth(MONTH)
		.setDate(DATE)
		.setHours(HOURS)
		.setMinutes(MINUTES)
		.setSeconds(SECONDS)
		.setMilliseconds(MILLISECONDS);
	return xdate.getFullYear() == YEAR &&
		xdate.getMonth() == MONTH &&
		xdate.getDate() == DATE &&
		xdate.getHours() == HOURS &&
		xdate.getMinutes() == MINUTES &&
		xdate.getSeconds() == SECONDS &&
		xdate.getMilliseconds() == MILLISECONDS;
});

test("set*, when utcMode=true", function() {
	var xdate = new XDate(2012, 0, 1, true);
	var YEAR = 2011;
	var MONTH = 5;
	var DATE = 4;
	var HOURS = 13;
	var MINUTES = 45;
	var SECONDS = 20;
	var MILLISECONDS = 750;
	xdate.setFullYear(YEAR)
		.setMonth(MONTH)
		.setDate(DATE)
		.setHours(HOURS)
		.setMinutes(MINUTES)
		.setSeconds(SECONDS)
		.setMilliseconds(MILLISECONDS);
	return xdate.getFullYear() == YEAR &&
		xdate.getMonth() == MONTH &&
		xdate.getDate() == DATE &&
		xdate.getHours() == HOURS &&
		xdate.getMinutes() == MINUTES &&
		xdate.getSeconds() == SECONDS &&
		xdate.getMilliseconds() == MILLISECONDS;
});

test("setTime", function() {
	var MS = 933490800000;
	var xdate1 = new XDate();
	var xdate2 = new XDate().setUTCMode(true);
	xdate1.setTime(MS);
	xdate2.setTime(MS);
	return xdate1.getTime() == MS && xdate2.getTime() == MS;
});

test("setFullYear, allow overflow", function() {
	var xdate1 = new XDate(2012, 1, 29);
	var xdate2 = new XDate(2012, 1, 29);
	xdate1.setFullYear(2013);
	xdate2.setFullYear(2013, false);
	return xdate1.getMonth() == 2 && xdate1.getDate() == 1 &&
		xdate2.getMonth() == 2 && xdate2.getDate() == 1;
});

test("setYear, prevent overflow", function() {
	var xdate = new XDate(2012, 1, 29);
	xdate.setFullYear(2013, true);
	return xdate.getMonth() == 1 && xdate.getDate() == 28;
});

test("setMonth, allow overflow", function() {
	var xdate1 = new XDate(2010, 2, 31, 12);
	var xdate2 = new XDate(2010, 2, 31, 12);
	xdate1.setMonth(1);
	xdate2.setMonth(1, false);
	return xdate1.getMonth() == 2 && xdate1.getDate() == 3 &&
		xdate2.getMonth() == 2 && xdate2.getDate() == 3
});

test("setMonth, prevent overflow", function() {
	var d = new XDate(2010, 2, 31, 12);
	d.setMonth(1, true);
	return d.getMonth() == 1 && d.getDate() == 28;
});

test("setUTC*, with utcMode=false", function() {
	var xdate = new XDate(2012, 0, 1);
	var YEAR = 2011;
	var MONTH = 5;
	var DATE = 4;
	var HOURS = 13;
	var MINUTES = 45;
	var SECONDS = 20;
	var MILLISECONDS = 750;
	xdate.setUTCFullYear(YEAR)
		.setUTCMonth(MONTH)
		.setUTCDate(DATE)
		.setUTCHours(HOURS)
		.setUTCMinutes(MINUTES)
		.setUTCSeconds(SECONDS)
		.setUTCMilliseconds(MILLISECONDS);
	return xdate.getUTCFullYear() == YEAR &&
		xdate.getUTCMonth() == MONTH &&
		xdate.getUTCDate() == DATE &&
		xdate.getUTCHours() == HOURS &&
		xdate.getUTCMinutes() == MINUTES &&
		xdate.getUTCSeconds() == SECONDS &&
		xdate.getUTCMilliseconds() == MILLISECONDS;
});

test("setUTC*, with utcMode=true", function() {
	var xdate = new XDate(2012, 0, 1, true);
	var YEAR = 2011;
	var MONTH = 5;
	var DATE = 4;
	var HOURS = 13;
	var MINUTES = 45;
	var SECONDS = 20;
	var MILLISECONDS = 750;
	xdate.setUTCFullYear(YEAR)
		.setUTCMonth(MONTH)
		.setUTCDate(DATE)
		.setUTCHours(HOURS)
		.setUTCMinutes(MINUTES)
		.setUTCSeconds(SECONDS)
		.setUTCMilliseconds(MILLISECONDS);
	return xdate.getUTCFullYear() == YEAR &&
		xdate.getUTCMonth() == MONTH &&
		xdate.getUTCDate() == DATE &&
		xdate.getUTCHours() == HOURS &&
		xdate.getUTCMinutes() == MINUTES &&
		xdate.getUTCSeconds() == SECONDS &&
		xdate.getUTCMilliseconds() == MILLISECONDS;
});

test("setYear", function() {
	var xdate = new XDate(2010, 0, 1);
	xdate.setYear(99);
	return xdate.getFullYear() == 1999;
});

test("setWeek", function() {
	function test(xdate, n) {
		var year = xdate.getFullYear();
		xdate.setWeek(n);
		return xdate.getWeek() == n &&
			xdate.getFullYear() == year &&
			xdate.getDay() == 1 && // monday
			xdate.getHours() == 0 &&
			xdate.getMinutes() == 0 &&
			xdate.getSeconds() == 0 &&
			xdate.getMilliseconds() == 0;
	}
	return test(XDate(), 50) &&
		test(XDate(), 21) &&
		test(XDate(2011, 5, 5), 5) &&
		test(XDate(2009, 12, 12), 13);
});

test("setWeek, with year", function() {
	function test(xdate, n, year) {
		xdate.setWeek(n, year);
		return xdate.getWeek() == n &&
			xdate.getFullYear() == year &&
			xdate.getDay() == 1 && // monday
			xdate.getHours() == 0 &&
			xdate.getMinutes() == 0 &&
			xdate.getSeconds() == 0 &&
			xdate.getMilliseconds() == 0;
	}
	return test(XDate(), 50, 2013) &&
		test(XDate(), 21, 2014) &&
		test(XDate(2011, 5, 5), 5, 1999) &&
		test(XDate(2009, 12, 12), 13, 1995);
});

test("setUTCWeek", function() {
	function test(xdate, n) {
		var year = xdate.getUTCFullYear();
		xdate.setUTCWeek(n);
		return xdate.getUTCWeek() == n &&
			xdate.getUTCFullYear() == year &&
			xdate.getUTCDay() == 1 && // monday
			xdate.getUTCHours() == 0 &&
			xdate.getUTCMinutes() == 0 &&
			xdate.getUTCSeconds() == 0 &&
			xdate.getUTCMilliseconds() == 0;
	}
	return test(XDate(), 50) &&
		test(XDate(), 21) &&
		test(XDate(2011, 5, 5), 5) &&
		test(XDate(2009, 12, 12), 13);
});

test("setUTCWeek, with year", function() {
	function test(xdate, n, year) {
		xdate.setUTCWeek(n, year);
		return xdate.getUTCWeek() == n &&
			xdate.getUTCFullYear() == year &&
			xdate.getUTCDay() == 1 && // monday
			xdate.getUTCHours() == 0 &&
			xdate.getUTCMinutes() == 0 &&
			xdate.getUTCSeconds() == 0 &&
			xdate.getUTCMilliseconds() == 0;
	}
	return test(XDate(), 50, 2013) &&
		test(XDate(), 21, 2014) &&
		test(XDate(2011, 5, 5), 5, 1999) &&
		test(XDate(2009, 12, 12), 13, 1995);
});

test("setWeek overflow", function() {
	var xdate = new XDate(2012, 0, 3);
	xdate.setWeek(54);
	return xdate.getFullYear() == 2013 &&
		xdate.getWeek() == 2 &&
		xdate.getMonth() == 0 &&
		xdate.getDate() == 7;
});

test("setWeek underflow", function() {
	var xdate = new XDate(2012, 0, 2); // a monday
	return +xdate.clone().setWeek(0) == +xdate.clone().addWeeks(-1) &&
		+xdate.clone().setWeek(-1) == +xdate.clone().addWeeks(-2);
});

test("setUTCWeek correctly handles UTC week numbering edge case", function() {
	var date = new XDate(Date.UTC(2010, 0, 3));

	var wasWeek53 = date.getUTCWeek() === 53;
	date.setUTCWeek(53);

	return wasWeek53 && "Mon, 28 Dec 2009 00:00:00 GMT" === date.toUTCString();
});


