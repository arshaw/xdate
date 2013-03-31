

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


test("addMonths, prevent overflow, backwards january bug", function() {
	var d1 = new XDate(2013, 0, 28); // Jan 28
	var d2 = new XDate(2013, 0, 14); // Jan 14
	return d1.addMonths(-1, true).toString('yyyy-MM-dd') == '2012-12-28' && // Dec 28
		d2.addMonths(-1, true).toString('yyyy-MM-dd') == '2012-12-14'; // Dec 14
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


test("addWeeks", function() {
	return new XDate(2011, 7, 12).addWeeks(2).getDate() == 26 &&
		new XDate(2011, 7, 12).addWeeks(-2).getDate() == 29;
});
