

test("switch curly-brackets", function() {
	var d1 = new XDate(2010, 5, 8);
	var d2 = new XDate(2011, 6, 4);
	return formatDates(d1, d2, 'ddd MMM dS yyyy{ - ddd MMM dS yyyy}') == "Tue Jun 8th 2010 - Mon Jul 4th 2011";
});


/*
// we dont support nested curly brackets, but this was a good test for infinite loop
test("switch curly-brackets, nested", function() {
	var d1 = new XDate(2010, 5, 8);
	var d2 = new XDate(2011, 6, 4);
	return formatDates(d1, d2, 'd-{d-{d}}') == "8-4-8";
});
*/


test("switch curly-brackets, no other date", function() {
	var d = new XDate(2010, 5, 8);
	return formatDates(d, null, 'ddd MMM dS yyyy{ - ddd MMM dS yyyy}') == "Tue Jun 8th 2010";
});


test("difference brackets", function() {
	var d1 = new XDate(2011, 5, 8);
	var d2 = new XDate(2011, 5, 10);
	var d3 = new XDate(2012, 6, 10);
	return formatDates(d1, d2, 'MMM dS[ yyyy]{ -[ MMM] dS yyyy}') == "Jun 8th - 10th 2011" &&
		formatDates(d1, d3, 'MMM dS[ yyyy]{ -[ MMM] dS yyyy}') == "Jun 8th 2011 - Jul 10th 2012";
});


test("difference brackets, seemingly same months", function() {
	var d1 = new XDate(2011, 5, 8);
	var d2 = new XDate(2012, 5, 8);
	return formatDates(d1, d2, "MMM dS[ yyyy]{ -[ MMM] dS yyyy}") == "Jun 8th 2011 - Jun 8th 2012";
});