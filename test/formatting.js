

test("numbers, am", function() {
	return new XDate(1986, 5, 8, 4, 3, 2)
		.toString('MM/dd/yyyy hh:mm:ss tt') == "06/08/1986 04:03:02 am";
});


test("numbers, am uppercase", function() {
	return new XDate(1986, 5, 8, 4, 3, 2)
		.toString('MM/dd/yyyy hh:mm:ss TT') == "06/08/1986 04:03:02 AM";
});


test("numbers, am mini", function() {
	return new XDate(1986, 5, 8, 4, 3, 2)
		.toString('M/d/yy h:m:s t') == "6/8/86 4:3:2 a";
});


test("numbers, pm", function() {
	return new XDate(1986, 5, 8, 14, 3, 2)
		.toString('MM/dd/yyyy hh:mm:ss tt') == "06/08/1986 02:03:02 pm";
});


test("numbers, pm uppercase", function() {
	return new XDate(1986, 5, 8, 14, 3, 2)
		.toString('MM/dd/yyyy hh:mm:ss TT') == "06/08/1986 02:03:02 PM";
});


test("numbers, pm mini", function() {
	return new XDate(1986, 5, 8, 14, 3, 2)
		.toString('M/d/yy h:m:s t') == "6/8/86 2:3:2 p";
});


test("no am/pm confusion", function() {
	return new XDate(2012, 5, 8).toString('tt') == 'am' &&
		new XDate(2012, 5, 8, 12).toString('tt') == 'pm';
});


test("numbers, 24-hour clock", function() {
	return new XDate(1986, 5, 8, 14, 3, 2)
		.toString('dd/MM/yyyy HH:mm:ss') == "08/06/1986 14:03:02";
});


test("short names", function() {
	return new XDate(2011, 10, 5)
		.toString('ddd, MMM dd, yyyy') == "Sat, Nov 05, 2011";
});


test("long names", function() {
	return new XDate(2011, 10, 5)
		.toString('dddd, MMMM dd, yyyy') == "Saturday, November 05, 2011";
});


test("ordinals", function() {
	return new XDate(2011, 1, 1).toString('dS') == "1st" &&
		new XDate(2011, 1, 2).toString('dS') == "2nd" &&
		new XDate(2011, 1, 3).toString('dS') == "3rd" &&
		new XDate(2011, 1, 4).toString('dS') == "4th" &&
		new XDate(2011, 1, 23).toString('dS') == "23rd" &&
		new XDate(2011, 1, 11).toString('dS') == "11th";
});


test("fff milliseconds", function() {
	var d = new XDate();
	var s = d.toString('fff');
	return d.getMilliseconds() === parseInt(s, 10) && s.length==3;
});


test("timezone", function() {
	var d1 = new XDate();
	d1.getTimezoneOffset = function() { return 7 * 60 + 15 };
	var d2 = new XDate();
	d2.getTimezoneOffset = function() { return -(7 * 60 + 15) };
	return d1.toString('z') == '-7' &&
		d1.toString('zz') == '-07' &&
		d1.toString('zzz') == '-07:15' &&
		d2.toString('z') == '+7' &&
		d2.toString('zz') == '+07' &&
		d2.toString('zzz') == '+07:15';
});


test("toString(i)", function() {
	var d = new XDate(2011, 5, 8, 14, 35, 21);
	return d.toString('i') == '2011-06-08T14:35:21';
});

test("toString(i), utcMode=true", function() {
	var d = new XDate(2011, 5, 8, 14, 35, 21, true);
	return d.toString('i') == '2011-06-08T14:35:21';
});

test("toString(u)", function() {
	var d = new XDate(2011, 5, 8, 14, 35, 21);
	return d.toString('u').indexOf('2011-06-08T14:35:21') == 0;
});

test("toString(u), utcMode=true", function() {
	var d = new XDate(2011, 5, 8, 14, 35, 21, true);
	return d.toString('u') == '2011-06-08T14:35:21Z';
});

test("toUTCString(i)", function() {
	var d = new XDate(Date.UTC(2011, 5, 8, 14, 35, 21));
	return d.toUTCString('i') == '2011-06-08T14:35:21';
});

test("toUTCString(i), utcMode=true", function() {
	var d = new XDate(Date.UTC(2011, 5, 8, 14, 35, 21), true);
	return d.toUTCString('i') == '2011-06-08T14:35:21';
});

test("toUTCString(u)", function() {
	var d = new XDate(Date.UTC(2011, 5, 8, 14, 35, 21));
	return d.toUTCString('u') == '2011-06-08T14:35:21Z';
});

test("toUTCString(u), utcMode=true", function() {
	var d = new XDate(Date.UTC(2011, 5, 8, 14, 35, 21), true);
	return d.toUTCString('u') == '2011-06-08T14:35:21Z';
});


test("non-zero parenthesis", function() {
	var d1 = new XDate(2010, 5, 8, 1);
	var d2 = new XDate(2010, 5, 8, 14, 30);
	return d1.toString('M/d/yyyy h(:mm)tt') == "6/8/2010 1am" &&
		d2.toString('M/d/yyyy h(:mm)tt') == "6/8/2010 2:30pm";
});


test("non-zero parenthesis, nested", function() {
	return new XDate(2011, 5, 8).toString("(h(:mm)tt)") == "12am" &&
		new XDate(2011, 5, 8, 6).toString("(h(:mm)tt)") == "6am" &&
		new XDate(2011, 5, 8, 6, 30).toString("(h(:mm)tt)") == "6:30am";
});


test("non-zero parenthesis, crazy quotes", function() {
	return new XDate(2010, 5, 8, 14, 30)
		.toString("M/d/yyyy h(:mm')')tt") == "6/8/2010 2:30)pm";
});


test("string literal", function() {
	var d = new XDate(2011, 5, 8);
	return d.toString("MMM dS 'yyyy!mm'") == "Jun 8th yyyy!mm";
});


test("escaped single quote", function() {
	var d = new XDate(2011, 5, 8);
	return d.toString("''MMM dS yyyy''") == "'Jun 8th 2011'";
});


test("toString/toUTCString settings param", function() {
	var settings = {
		dayNames: ['Sunday', 'Benduday', 'Zhellday', 'Taungsday', 'Centaxday', 'Primeday', 'Saturday']
	};
	return new XDate(2011, 3, 29).toString('dddd yyyy', settings) == 'Primeday 2011' &&
		new XDate(2011, 3, 4, 12).toUTCString('dddd yyyy', settings) == 'Benduday 2011';
});


test("iso week, correct digits", function() {
	return new XDate(2011, 2, 1).toString('w') == '9' &&
		new XDate(2011, 2, 1).toUTCString('w') == '9' &&
		new XDate(2011, 2, 1).toString('ww') == '09' &&
		new XDate(2011, 2, 1).toUTCString('ww') == '09';
});


test("toString/toUTCString different locale", function() {
	XDate.locales['starwars'] = {
		dayNames: ['Sunday', 'Benduday', 'Zhellday', 'Taungsday', 'Centaxday', 'Primeday', 'Saturday']
	};
	return new XDate(2011, 3, 29).toString('dddd yyyy', 'starwars') == 'Primeday 2011' &&
		new XDate(2011, 3, 4, 12).toUTCString('dddd yyyy', 'starwars') == 'Benduday 2011';
});


test("toString/toUTCString new default locale", function() {
	XDate.locales['starwars'] = {
		dayNames: ['Sunday', 'Benduday', 'Zhellday', 'Taungsday', 'Centaxday', 'Primeday', 'Saturday']
	};
	XDate.defaultLocale = 'starwars';
	var good = 
		new XDate(2011, 3, 29).toString('dddd yyyy') == 'Primeday 2011' &&
		new XDate(2011, 3, 4, 12).toUTCString('dddd yyyy') == 'Benduday 2011';
	XDate.defaultLocale = '';
	return good;
});


test("custom formatter string", function() {
	XDate.formatters.xxx = 'yyyyMMdd';
	var d = new XDate('2012-11-01');
	return d.toString('xxx') == '20121101';
});


test("custom formatter function", function() {
	XDate.formatters.vvv = function(xdate, useUTC) {
		return "cool/" + useUTC + "/" + xdate.getDate();
	};
	var d = new XDate('2012-10-05');
	return d.toString('vvv') == "cool/false/5" &&
		d.toUTCString('vvv') == "cool/true/5";
});





test("toString methods, hasLocalTimezone=yes", function() {
	var realDate = new Date(2011, 3, 20, 12, 30);
	var xdate = new XDate(2011, 3, 20, 12, 30);
	return realDate.toString() == xdate.toString() &&
		realDate.toDateString() == xdate.toDateString() &&
		realDate.toTimeString() == xdate.toTimeString() &&
		realDate.toLocaleString() == xdate.toLocaleString() &&
		realDate.toLocaleDateString() == xdate.toLocaleDateString() &&
		realDate.toLocaleTimeString() == xdate.toLocaleTimeString() &&
		realDate.toUTCString() == xdate.toUTCString() &&
		realDate.toGMTString() == xdate.toGMTString();
});

test("toString methods, hasLocalTimezone=no", function() {
	var realDate = new Date(2011, 3, 20, 12, 30);
	var xdate = new XDate(2011, 3, 20, 12, 30, false);
	return realDate.toString().indexOf(xdate.toString()) == 0 &&
		realDate.toTimeString().indexOf(xdate.toTimeString()) == 0 &&
		realDate.toLocaleString().indexOf(xdate.toLocaleString()) == 0 &&
		realDate.toLocaleDateString().indexOf(xdate.toLocaleDateString()) == 0 &&
		realDate.toLocaleTimeString().indexOf(xdate.toLocaleTimeString()) == 0;
});

test("toGMTString", function() {
	var xdate = new XDate();
	return xdate.toUTCString() == xdate.toGMTString();
});
