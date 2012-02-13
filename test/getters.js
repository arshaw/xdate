
// most of the getters have already been tested in constructors.js

test("getTime, valueOf, +", function() {
	var MS = 933490800000;
	var xdate1 = new XDate(MS);
	var xdate2 = new XDate(MS, false);
	return xdate1.getTime() == MS && xdate1.valueOf() == MS && +xdate1 == MS &&
		xdate2.getTime() == MS && xdate2.valueOf() == MS && xdate2 == MS;
});

test("getUTC*", function() {
	var YEAR = 2011;
	var MONTH = 5;
	var DATE = 4;
	var HOURS = 13;
	var MINUTES = 45;
	var SECONDS = 20;
	var MILLISECONDS = 750;
	var xdate = new XDate(Date.UTC(YEAR, MONTH, DATE, HOURS, MINUTES, SECONDS, MILLISECONDS));
	return xdate.getUTCFullYear() == YEAR &&
		xdate.getUTCMonth() == MONTH &&
		xdate.getUTCDate() == DATE &&
		xdate.getUTCHours() == HOURS &&
		xdate.getUTCMinutes() == MINUTES &&
		xdate.getUTCSeconds() == SECONDS &&
		xdate.getUTCMilliseconds() == MILLISECONDS;
});

test("getYear", function() {
	var xdate = new XDate(1999, 0, 1);
	return xdate.getYear() == 99;
});

test("getWeek", function() {
	return new XDate(2011, 2, 1).getWeek() == 9;
});

test("getUTCWeek", function() {
	return new XDate(2011, 2, 1, 12, 30).getUTCWeek() == 9;
});

test("getWeek/getUTCWeek mega-test", function() {
	if (!Date.prototype.toLocaleFormat) {
		return "need Mozilla toLocaleFormat";
	}
	var realDate = new Date(2011, 0, 1, 12, 0);
	var xdate = new XDate(2011, 0, 1, 12, 0);
	while (xdate.getFullYear() != 2014) {
		var w1 = parseInt(realDate.toLocaleFormat('%V'), 10);
		var w2 = xdate.getWeek();
		if (w1 != w2) {
			return [
				false,
				realDate.toString() + '=' + w1 + ' ' + xdate.toString() + '=' + w2
			];
		}
		var realDateUTC = XDate(realDate).setUTCMode(true, true).toDate();
		w1 = parseInt(realDateUTC.toLocaleFormat('%V'), 10);
		w2 = xdate.getUTCWeek();
		if (w1 != w2) {
			return [
				false,
				realDateUTC.toUTCString() + '=' + w1 + ' ' + xdate.toUTCString() + '=' + w2 + ' (UTC!)'
			];
		}
		realDate.setDate(realDate.getDate() + 1);
		xdate.setDate(xdate.getDate() + 1);
	}
	return true;
});
