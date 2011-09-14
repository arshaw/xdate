

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
	return XDate('2011-06-06T05:05:05').diffMilliseconds('2011-06-06T05:05:08.100') == 3100;
});