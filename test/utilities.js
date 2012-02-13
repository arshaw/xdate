

test("clone", function() {
	var d1 = new XDate();
	var d2 = d1.clone();
	d2.addMinutes(30);
	return +d1 != +d2;
});


test("clearTime", function() {
	var d = new XDate(2010, 2, 5, 16, 15, 10, 100);
	d.clearTime();
	return !d.getHours() && !d.getMinutes() && !d.getSeconds() && !d.getMilliseconds();
});


test("valid", function() {
	var good = new XDate();
	var bad = new XDate('asdf');
	return good.valid() && !bad.valid();
});


test("toDate, hasLocalTimezone=yes", function() {
	var d = new Date(2012, 5, 8);
	var xdate = new XDate(d);
	return +xdate.toDate() == +d;
});


test("toDate, hasLocalTimezone=no", function() {
	var d = new Date(2012, 5, 8);
	var xdate = new XDate(+d, false);
	return +xdate.toDate() == +d;
});


test("getDaysInMonth", function() {
	return XDate.getDaysInMonth(2011, 1) == 28 && // feb
		XDate.getDaysInMonth(2012, 1) == 29 && // feb, leap year
		XDate.getDaysInMonth(2012, 8) == 30 && // sep
		XDate.getDaysInMonth(2012, 6) == 31; // jul
});


test("UTC class method", function() {
	return Date.UTC(2011, 3, 20, 12, 30) == XDate.UTC(2011, 3, 20, 12, 30);
});


test("parse class method", function() {
	var s = "Sat Apr 23 2011 13:44:12 GMT-0700 (PDT)";
	return Date.parse(s) == XDate.parse(s) &&
		isNaN(Date.parse()) && isNaN(XDate.parse());
});


test("now class method", function() {
	return Math.abs(+new Date() - XDate.now()) < 1000;
});


test("today class method", function() {
	var xdate = XDate.today();
	var d = new Date();
	return xdate.getFullYear() == d.getFullYear() &&
		xdate.getMonth() == d.getMonth() &&
		xdate.getDate() == d.getDate() &&
		!xdate.getHours() &&
		!xdate.getSeconds() &&
		!xdate.getMilliseconds();
});


test("toJSON", function() {
	var realDate = new Date(2011, 3, 20, 12, 30);
	var xdate = new Date(2011, 3, 20, 12, 30);
	if (!realDate.toJSON) {
		return "toJSON not supported";
	}
	return realDate.toJSON() == xdate.toJSON();
});





test("chaining", function() {
	var d = new XDate()
		.setYear(99)
		.setFullYear(2011)
		.setWeek(50)
		.setMonth(1)
		.setDate(5)
		.setHours(12)
		.setMinutes(50)
		.setSeconds(20)
		.setMilliseconds(500)
		.setTime(0)
		.addYears(1)
		.addMonths(1)
		.addDays(1)
		.addMinutes(1)
		.addSeconds(1)
		.addMilliseconds(1)
		.clone()
		.clearTime()
		.setUTCFullYear(2010)
		.setUTCMonth(6)
		.setUTCWeek(5)
		.setUTCDate(4)
		.setUTCHours(12)
		.setUTCMinutes(30)
		.setUTCSeconds(30)
		.setUTCMilliseconds(10)
		.setUTCMode(true);
	return d instanceof XDate;
});


