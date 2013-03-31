
test("no args", function() {
	var xdate = new XDate();
	var time = +new Date();
	return Math.abs(xdate.getTime() - time) < 1000 && !xdate.getUTCMode();
});

test("only utcMode=false", function() {
	var xdate = new XDate(false);
	var time = +new Date();
	return Math.abs(xdate.getTime() - time) < 1000 && !xdate.getUTCMode();
});

test("only utcMode=true", function() {
	var xdate = new XDate(true);
	var time = +new Date();
	return Math.abs(xdate.getTime() - time) < 1000 && xdate.getUTCMode();
});

test("from XDate", function() {
	var xdate1 = new XDate();
	var xdate2 = new XDate(xdate1);
	return xdate1.getTime() == xdate2.getTime() &&
		!xdate1.getUTCMode() && !xdate2.getUTCMode();
});

test("from XDate with utcMode=true", function() {
	var xdate1 = new XDate().setUTCMode(true);
	var xdate2 = new XDate(xdate1);
	return xdate1.getTime() == xdate2.getTime() &&
		xdate1.getUTCMode() && xdate2.getUTCMode();
});

test("from XDate, override with utcMode=true", function() {
	var xdate1 = new XDate();
	var xdate2 = new XDate(xdate1, true);
	return xdate1.getTime() == xdate2.getTime() &&
		!xdate1.getUTCMode() && xdate2.getUTCMode();
});

test("from XDate, override with utcMode=false", function() {
	var xdate1 = new XDate().setUTCMode(true);
	var xdate2 = new XDate(xdate1, false);
	return xdate1.getTime() == xdate2.getTime() &&
		xdate1.getUTCMode() && !xdate2.getUTCMode();
});

test("from native Date, utcMode=false", function() {
	var date = new Date();
	var xdate1 = new XDate(date);
	var xdate2 = new XDate(date, false);
	return date.getTime() == xdate1.getTime() &&
		date.getTime() == xdate2.getTime() &&
		!xdate1.getUTCMode() && !xdate2.getUTCMode();
});

test("from native Date, utcMode=true", function() {
	var date = new Date();
	var xdate = new XDate(date, true);
	return date.getTime() == xdate.getTime() &&
		xdate.getUTCMode();
});

test("from milliseconds time, utcMode=false", function() {
	var MS = 933490800000;
	var xdate1 = new XDate(MS);
	var xdate2 = new XDate(MS, false);
	return !xdate1.getUTCMode() &&
		!xdate2.getUTCMode() &&
		xdate1.getTime() == MS &&
		xdate2.getTime() == MS;
});

test("from milliseconds time, utcMode=true", function() {
	var MS = 933490800000;
	var xdate = new XDate(MS, true);
	return xdate.getUTCMode() && xdate.getTime() == MS;
});

test("year/month/date, utcMode=false", function() {
	var YEAR = 2011;
	var MONTH = 5;
	var DATE = 4;
	var xdate1 = new XDate(YEAR, MONTH, DATE);
	var xdate2 = new XDate(YEAR, MONTH, DATE, false);
	return !xdate1.getUTCMode() && !xdate2.getUTCMode() &&
		xdate1.getTime() == xdate2.getTime() &&
		xdate1.getFullYear() == YEAR &&
		xdate1.getMonth() == MONTH &&
		xdate1.getDate() == DATE &&
		!xdate1.getHours() &&
		!xdate1.getMinutes() &&
		!xdate1.getSeconds() &&
		!xdate1.getMilliseconds();
});

test("toString, utcMode=undefined/true", function() {
	var xdate1 = new XDate('2012-09-21');
	var xdate2 = new XDate('2012-09-21', true);
	return xdate1.toString('yyyy-MM-dd HH-mm-ss') == '2012-09-21 00-00-00' &&
		xdate2.toString('yyyy-MM-dd HH-mm-ss') == '2012-09-21 00-00-00';
});

test("year/month/date/minutes/seconds/milliseconds, utcMode=false", function() {
	var YEAR = 2011;
	var MONTH = 5;
	var DATE = 4;
	var HOURS = 13;
	var MINUTES = 45;
	var SECONDS = 20;
	var MILLISECONDS = 750;
	var xdate1 = new XDate(YEAR, MONTH, DATE, HOURS, MINUTES, SECONDS, MILLISECONDS);
	var xdate2 = new XDate(YEAR, MONTH, DATE, HOURS, MINUTES, SECONDS, MILLISECONDS, false);
	return !xdate1.getUTCMode() && !xdate2.getUTCMode() &&
		xdate1.getTime() == xdate2.getTime() &&
		xdate1.getFullYear() == YEAR &&
		xdate1.getMonth() == MONTH &&
		xdate1.getDate() == DATE &&
		xdate1.getHours() == HOURS &&
		xdate1.getMinutes() == MINUTES &&
		xdate1.getSeconds() == SECONDS &&
		xdate1.getMilliseconds() == MILLISECONDS;
});

test("year/month/date, utcMode=true", function() {
	var YEAR = 2011;
	var MONTH = 5;
	var DATE = 4;
	var xdate = new XDate(YEAR, MONTH, DATE, true);
	return xdate.getUTCMode()
		xdate.getFullYear() == YEAR &&
		xdate.getMonth() == MONTH &&
		xdate.getDate() == DATE &&
		!xdate.getHours() &&
		!xdate.getMinutes() &&
		!xdate.getSeconds() &&
		!xdate.getMilliseconds();
});

test("year/month/date/minutes/seconds/milliseconds, utcMode=true", function() {
	var YEAR = 2011;
	var MONTH = 5;
	var DATE = 4;
	var HOURS = 13;
	var MINUTES = 45;
	var SECONDS = 20;
	var MILLISECONDS = 750;
	var xdate = new XDate(YEAR, MONTH, DATE, HOURS, MINUTES, SECONDS, MILLISECONDS, true);
	return xdate.getUTCMode() &&	
		xdate.getFullYear() == YEAR &&
		xdate.getMonth() == MONTH &&
		xdate.getDate() == DATE &&
		xdate.getHours() == HOURS &&
		xdate.getMinutes() == MINUTES &&
		xdate.getSeconds() == SECONDS &&
		xdate.getMilliseconds() == MILLISECONDS;
});

test("without new operator", function() {
	return XDate("Sun Aug 14 2011 00:28:53 GMT-0700 (PDT)") &&
		!XDate("asdf").valid();
});

// we will test the dateString constructor in parsing.js
