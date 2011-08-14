

test("setMonth, allow overflow", function() {
	var d = new XDate(2010, 2, 31, 12);
	d.setMonth(1, false);
	return d.getMonth() == 2 && d.getDate() == 3;
});


test("setMonth, prevent overflow", function() {
	var d = new XDate(2010, 2, 31, 12);
	d.setMonth(1, true);
	return d.getMonth() == 1 && d.getDate() == 28;
});


test("addYears", function() {
	var d1 = new XDate(2011, 2, 1);
	d1.addYears(10);
	var d2 = new XDate(2011, 2, 1);
	d2.addYears(-2);
	return d1.getFullYear() == 2021 &&
		d1.getMonth() == 2 &&
		d1.getDate() == 1 &&
		d2.getFullYear() == 2009 &&
		d2.getMonth() == 2 &&
		d2.getDate() == 1;
});


test("addMonths", function() {
	var d1 = new XDate(2012, 2, 6);
	d1.addMonths(3);
	var d2 = new XDate(2012, 2, 6);
	d2.addMonths(-3);
	return d1.getFullYear() == 2012 &&
		d1.getMonth() == 5 &&
		d1.getDate() == 6 &&
		d2.getFullYear() == 2011 &&
		d2.getMonth() == 11 &&
		d2.getDate() == 6;
});


test("addMonths, prevent overflow", function() {
	var d1 = new XDate(2010, 11, 30); // dec 30
	d1.addMonths(2, true);
	var d2 = new XDate(2011, 5, 30); // jun 30
	d2.addMonths(-4, true);
	return d1.getFullYear() == 2011 &&
		d1.getMonth() == 1 &&
		d1.getDate() == 28 &&
		d2.getFullYear() == 2011 &&
		d2.getMonth() == 1 &&
		d2.getDate() == 28;
});


test("addDays", function() {
	var d1 = new XDate(2009, 5, 8);
	d1.addDays(30);
	var d2 = new XDate(2009, 5, 8);
	d2.addDays(-4);
	return d1.getFullYear() == 2009 &&
		d1.getMonth() == 6 &&
		d1.getDate() == 8 &&
		d2.getFullYear() == 2009 &&
		d2.getMonth() == 5 &&
		d2.getDate() == 4;
});


test("addHours, addMinutes, addSeconds, addMilliseconds", function() {
	var d = new XDate(2010, 0, 1, 5, 30, 24, 500);
	d.addHours(2);
	d.addMinutes(15);
	d.addSeconds(6);
	d.addMilliseconds(50);
	return d.getHours() == 7 &&
		d.getMinutes() == 45 &&
		d.getSeconds() == 30 &&
		d.getMilliseconds() == 550;
});


test("getWeek, getUTCWeek", function() {
	return new XDate(1986, 5, 8).getWeek() == 23 &&
		new XDate(2011, 3, 4).getWeek() == 14 &&
		new XDate(1986, 5, 8).getUTCWeek() == 23 &&
		new XDate(2011, 3, 4).getUTCWeek() == 14;
});


test("addWeeks", function() {
	return new XDate(2011, 7, 12).addWeeks(2).getDate() == 26 &&
		new XDate(2011, 7, 12).addWeeks(-2).getDate() == 29;
});


test("diffWeeks", function() {
	return Math.floor(new XDate(2011, 4, 18).diffWeeks(new XDate(2011, 4, 26))) == 1 &&
		Math.abs(new XDate(2011, 4, 18).diffWeeks(new XDate(2011, 4, 26), true) - (1+1/7)) < .001 &&
		Math.floor(new XDate(2011, 4, 18).diffWeeks(new XDate(2011, 4, 24))) == 0 &&
		Math.abs(new XDate(2011, 4, 18).diffWeeks(new XDate(2011, 4, 24), true) - (1-1/7)) < .001 &&
		Math.floor(new XDate(2011, 4, 18).diffWeeks(new XDate('2011-05-26'))) == 1;
});


test("diffYears", function() {
	return new XDate('2011-04-10').diffYears('2013-04-10') == 2 &&
		new XDate('2011-01-01T06:06:06').diffYears('2013-07-01T06:06:06') == 2.5;
});


test("diffMonths", function() {
	return XDate('2011-06-05').diffMonths('2012-07-05') == 13 &&
		XDate('2012-07-05').diffMonths('2011-06-05') == -13;
});


test("diffDays", function() {
	return XDate('2012-12-25').diffDays('2012-12-30') == 5;
});


test("diffHours", function() {
	return XDate('2012-05-05T06:30:00').diffHours('2012-05-05T04:00:00') == -2.5;
});


test("diffMinutes", function() {
	return XDate('2012-05-01T05:50').diffMinutes('2012-05-01T06:10:30') == 20.5;
});


test("diffSeconds", function() {
	return XDate('2012-03-01T00:00:45').diffSeconds('2012-03-01T00:01:15') == 30;
});


test("diffMilliseconds", function() {
	return XDate('2011-06-06T05:05:05:00').diffMilliseconds('2011-06-06T05:05:08.100') == 3100;
});


test("clone", function() {
	var d1 = new XDate();
	var d2 = d1.clone();
	d2.addMinutes(30);
	return +d1 != +d2;
});


test("toDate", function() {
	var xdate = new XDate();
	var realDate = xdate.toDate();
	return Math.abs(xdate - realDate) < 3600000 && // within 1 hour (in case DST)
		realDate instanceof Date;
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


test("comparison methods", function() {
	var d = new XDate(2012, 5, 8);
	var before = new XDate(2012, 5, 7);
	var after = new XDate(2012, 5, 9);
	var eq = new XDate(2012, 5, 8);
	return d.before(after) && !d.before(before) &&
		d.after(before) && !d.after(after);
		d.equals(eq);
});

test("comparison methods, native dates", function() {
	var d = new XDate(2012, 5, 8);
	var before = new Date(2012, 5, 7);
	var after = new Date(2012, 5, 9);
	var eq = new Date(2012, 5, 8);
	return d.before(after) && !d.before(before) &&
		d.after(before) && !d.after(after);
		d.equals(eq);
});


test("comparison methods, parsed strings", function() {
	var d = new XDate(2012, 5, 8);
	var before = '2012-06-07';
	var after = '2012-06-09';
	var eq = '2012-06-08';
	return d.before(after) && !d.before(before) &&
		d.after(before) && !d.after(after);
		d.equals(eq);
});


test("comparison methods, invalid dates", function() {
	var d = new XDate(2012, 5, 8);
	var before = 'asdf';
	var after = 'asdf';
	var eq = 'asdf';
	return !d.before(after) && !d.before(before) &&
		!d.after(before) && !d.after(after) &&
		!d.equals(eq);
});


test("chaining", function() {
	var d1 = new XDate()
		.setFullYear(2012)
		.setMonth(5)
		.setDate(8)
		.setHours(17)
		.setMinutes(30)
		.setSeconds(5)
		.setMilliseconds(100);
	var d2 = d1
		.clone()
		.clearTime()
		.addDays(1);
	return d1.getFullYear() == 2012 &&
		d1.getMonth() == 5 &&
		d1.getDate() == 8 &&
		d1.getHours() == 17 &&
		d1.getMinutes() == 30 &&
		d1.getSeconds() == 5 &&
		d1.getMilliseconds() == 100 &&
		!d2.getHours() &&
		!d2.getMinutes() &&
		!d2.getSeconds() &&
		!d2.getMilliseconds() &&
		d2.getDate() == 9;
});


test("getDaysInMonth", function() {
	return XDate.getDaysInMonth(2011, 1) == 28 && // feb
		XDate.getDaysInMonth(2012, 1) == 29 && // feb, leap year
		XDate.getDaysInMonth(2012, 8) == 30 && // sep
		XDate.getDaysInMonth(2012, 6) == 31; // jul
});


test("no new", function() {
	return XDate("Sun Aug 14 2011 00:28:53 GMT-0700 (PDT)") &&
		!XDate("asdf").valid();
});

