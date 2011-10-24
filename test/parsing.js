

test("IETF", function() {
	var s = "Sat Apr 23 2011 13:44:12 GMT";
	var d = new XDate(s);
	return d.getUTCFullYear() == 2011 &&
		d.getUTCMonth() == 3 &&
		d.getUTCDate() == 23 &&
		d.getUTCHours() == 13 &&
		d.getUTCMinutes() == 44 &&
		d.getUTCSeconds() == 12 &&
		!d.getUTCMode() &&
		+d == +new Date(s);
});


test("ISO, no time", function() {
	var s = "2010-06-08";
	var d = new XDate(s);
	return d.getFullYear() == 2010 &&
		d.getMonth() == 5 &&
		d.getDate() == 8 &&
		!d.getHours() &&
		!d.getMinutes() &&
		!d.getSeconds() &&
		!d.getMilliseconds() &&
		!d.getUTCMode();
});


test("ISO, T", function() {
	var s = "2010-06-08T14:45:30";
	var d = new XDate(s);
	return d.getFullYear() == 2010 &&
		d.getMonth() == 5 &&
		d.getDate() == 8 &&
		d.getHours() == 14 &&
		d.getMinutes() == 45 &&
		d.getSeconds() == 30 &&
		!d.getMilliseconds() &&
		!d.getUTCMode();
});


test("ISO, space", function() {
	var s = "2010-06-08 14:45:30";
	var d = new XDate(s);
	return d.getFullYear() == 2010 &&
		d.getMonth() == 5 &&
		d.getDate() == 8 &&
		d.getHours() == 14 &&
		d.getMinutes() == 45 &&
		d.getSeconds() == 30 &&
		!d.getMilliseconds() &&
		!d.getUTCMode();
});


test("ISO, no seconds", function() {
	var s = "2010-06-08T14:45";
	var d = new XDate(s);
	return d.getFullYear() == 2010 &&
		d.getMonth() == 5 &&
		d.getDate() == 8 &&
		d.getHours() == 14 &&
		d.getMinutes() == 45 &&
		!d.getSeconds() &&
		!d.getMilliseconds() &&
		!d.getUTCMode();
});


test("ISO, milliseconds", function() {
	var s = "2010-06-08T14:45:30.500";
	var d = new XDate(s);
	return d.getFullYear() == 2010 &&
		d.getMonth() == 5 &&
		d.getDate() == 8 &&
		d.getHours() == 14 &&
		d.getMinutes() == 45 &&
		d.getSeconds() == 30 &&
		d.getMilliseconds() == 500 &&
		!d.getUTCMode();
});


test("ISO, timezone colon", function() {
	var s = "2010-06-08T14:00:28-02:30";
	var d = new XDate(s);
	return d.getUTCHours() == 16 &&
		d.getUTCMinutes() == 30 &&
		d.getUTCSeconds() == 28 &&
		!d.getUTCMode();
});


test("ISO, timezone no colon", function() {
	var s = "2010-06-08T14:00:28-0230";
	var d = new XDate(s);
	return d.getUTCHours() == 16 &&
		d.getUTCMinutes() == 30 &&
		d.getUTCSeconds() == 28 &&
		!d.getUTCMode();
});


test("ISO, timezone hour only", function() {
	var s = "2010-06-08T14:45:34-02";
	var d = new XDate(s);
	return d.getUTCHours() == 16 &&
		d.getUTCMinutes() == 45 &&
		d.getUTCSeconds() == 34 &&
		!d.getUTCMode();
});


test("ISO, timezone positive", function() {
	var s = "2010-06-08T14:00:28+02:30";
	var d = new XDate(s);
	return d.getUTCHours() == 11 &&
		d.getUTCMinutes() == 30 &&
		d.getUTCSeconds() == 28 &&
		!d.getUTCMode();
});


test("ISO, with Z", function() {
	var d = new XDate('2011-06-08T00:00:00Z');
	return d.getUTCFullYear() == 2011 &&
		d.getUTCMonth() == 5 &&
		d.getUTCDate() == 8 &&
		!d.getUTCHours() && !d.getUTCMinutes() &&
		!d.getUTCMode();
});


test("ISO, no timezone, utcMode=true", function() {
	var s = "2010-06-08T14:30:28";
	var d = new XDate(s, true);
	return d.getFullYear() == 2010 && d.getUTCFullYear() == 2010 &&
		d.getMonth() == 5 && d.getUTCMonth() == 5 &&
		d.getDate() == 8 && d.getUTCDate() == 8 &&
		d.getHours() == 14 && d.getUTCHours() == 14 &&
		d.getMinutes() == 30 && d.getUTCMinutes() == 30 &&
		d.getSeconds() == 28 && d.getUTCSeconds() == 28;
});


test("in and out", function() {
	var d = new XDate();
	return +new XDate(d.toISOString()) == +d;
});


