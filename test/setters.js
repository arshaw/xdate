

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
