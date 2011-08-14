

test("constructor, current date", function() {
	return Math.abs(new XDate() - new Date()) < 1000;
});


test("constructor, millisecond time", function() {
	var ms = 1303591251004;
	return +new XDate(ms) == +new Date(ms);
});


test("constructor, Date object", function() {
	var d = new Date();
	return +new XDate(d) == +d;
});


test("constructor, IETF string", function() {
	var s = "Sat Apr 23 2011 13:44:12 GMT-0700 (PDT)";
	return +new XDate(s) == +new Date(s);
});


test("contructor, invalid string", function() {
	var s = "asdf";
	return isNaN(+new XDate(s)) && isNaN(+new Date(s));
});


test("constructor and get methods", function() {
	var year = 2011;
	var month = 3;
	var date = 20;
	var hours = 14;
	var minutes = 30;
	var seconds = 45;
	var ms = 500;
	var xdate = new XDate(year, month, date, hours, minutes, seconds, ms);
	var realDate = new Date(year, month, date, hours, minutes, seconds, ms);
	return xdate.getFullYear() == year &&
		xdate.getMonth() == month &&
		xdate.getDate() == date &&
		xdate.getHours() == hours &&
		xdate.getMinutes() == minutes &&
		xdate.getSeconds() == seconds &&
		xdate.getMilliseconds() == ms &&
		xdate.getTimezoneOffset() == realDate.getTimezoneOffset() &&
		xdate.getYear() == realDate.getYear();
});


test("set methods", function() {
	var year = 2011;
	var month = 3;
	var date = 20;
	var hours = 14;
	var minutes = 30;
	var seconds = 45;
	var ms = 500;
	var d = new XDate();
	d.setFullYear(year);
	d.setMonth(month);
	d.setDate(date);
	d.setHours(hours);
	d.setMinutes(minutes);
	d.setSeconds(seconds);
	d.setMilliseconds(ms);
	return d.getFullYear() == year &&
		d.getMonth() == month &&
		d.getDate() == date &&
		d.getHours() == hours &&
		d.getMinutes() == minutes &&
		d.getSeconds() == seconds &&
		d.getMilliseconds() == ms;
});


test("UTC get methods", function() {
	var s = "Sat Apr 23 2011 13:44:12 GMT-0700 (PDT)";
	var realDate = new Date(s);
	var xdate = new Date(s);
	return realDate.getUTCFullYear() == xdate.getUTCFullYear() &&
		realDate.getUTCMonth() == xdate.getUTCMonth() &&
		realDate.getUTCDate() == xdate.getUTCDate() &&
		realDate.getUTCHours() == xdate.getUTCHours() &&
		realDate.getUTCMinutes() == xdate.getUTCMinutes() &&
		realDate.getUTCSeconds() == xdate.getUTCSeconds() &&
		realDate.getUTCMilliseconds() == xdate.getUTCMilliseconds();
});


test("UTC set methods", function() {
	var year = 2011;
	var month = 3;
	var date = 20;
	var hours = 14;
	var minutes = 30;
	var seconds = 45;
	var ms = 500;
	var d = new XDate();
	var t = +d;
	d.setUTCFullYear(year);
	d.setUTCMonth(month);
	d.setUTCDate(date);
	d.setUTCHours(hours);
	d.setUTCMinutes(minutes);
	d.setUTCSeconds(seconds);
	d.setUTCMilliseconds(ms);
	return d.getUTCFullYear() == year &&
		d.getUTCMonth() == month &&
		d.getUTCDate() == date &&
		d.getUTCHours() == hours &&
		d.getUTCMinutes() == minutes &&
		d.getUTCSeconds() == seconds &&
		d.getUTCMilliseconds() == ms &&
		+d != t;
});


test("getTime and valueOf", function() {
	var realDate = new Date(2011, 1, 1);
	var xdate = new Date(2011, 1, 1);
	return +realDate == +xdate &&
		realDate.getTime() == xdate.getTime() &&
		realDate.valueOf() == xdate.valueOf();
});


test("setTime", function() {
	var t = 1303599549534;
	var realDate = new Date();
	var xdate = new XDate();
	realDate.setTime(t);
	xdate.setTime(t);
	return +realDate == +xdate;
});


test("toString methods", function() {
	var realDate = new Date(2011, 3, 20, 12, 30);
	var xdate = new Date(2011, 3, 20, 12, 30);
	return realDate.toString() == xdate.toString() &&
		realDate.toDateString() == xdate.toDateString() &&
		realDate.toTimeString() == xdate.toTimeString() &&
		realDate.toLocaleString() == xdate.toLocaleString() &&
		realDate.toLocaleDateString() == xdate.toLocaleDateString() &&
		realDate.toLocaleTimeString() == xdate.toLocaleTimeString() &&
		realDate.toUTCString() == xdate.toUTCString() &&
		realDate.toGMTString() == xdate.toGMTString();
});


test("toJSON", function() {
	var realDate = new Date(2011, 3, 20, 12, 30);
	var xdate = new Date(2011, 3, 20, 12, 30);
	if (!realDate.toJSON) {
		return "toJSON not supported";
	}
	return realDate.toJSON() == xdate.toJSON();
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
	return Math.abs(Date.now() - XDate.now()) < 1000;
});




