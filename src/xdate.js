
/**
 * @preserve XDate v@VERSION
 * Docs & Licensing: http://arshaw.com/xdate/
 */

/*
 * Internal Architecture
 * ---------------------
 * An XDate wraps a native Date. The native Date is stored in the '0' property of the object.
 * By default, an XDate has a timezone. However, to signify that an XDate does NOT have a timezone,
 * the `notzToString` method is assigned to the internal Date's toString (see `hasLocalTimezone`).
 *
 */

var XDate = (function(Date, undefined) {


/** @const */ var FULLYEAR     = 0;
/** @const */ var MONTH        = 1;
/** @const */ var DATE         = 2;
/** @const */ var HOURS        = 3;
/** @const */ var MINUTES      = 4;
/** @const */ var SECONDS      = 5;
/** @const */ var MILLISECONDS = 6;
/** @const */ var DAY          = 7;
/** @const */ var YEAR         = 8;
/** @const */ var WEEK         = 9;
/** @const */ var DAY_MS = 86400000;
/** @const */ var ISO_FORMAT_STRING = "yyyy-MM-dd'T'HH:mm:ss(.fff)zzz";


var methodSubjects = [
	'FullYear',     // 0
	'Month',        // 1
	'Date',         // 2
	'Hours',        // 3
	'Minutes',      // 4
	'Seconds',      // 5
	'Milliseconds', // 6
	'Day',          // 7
	'Year'          // 8
];
var subjectPlurals = [
	'Years',        // 0
	'Months',       // 1
	'Days'          // 2
];
var unitsWithin = [
	12,   // months in year
	31,   // days in month (sort of)
	24,   // hours in day
	60,   // minutes in hour
	60,   // seconds in minute
	1000, // milliseconds in second
	1     //
];
var formatStringRE = new RegExp(
	"(([a-zA-Z])\\2*)|" + // 1, 2
	"(\\(" + "(('.*?'|\\(.*?\\)|.)*?)" + "\\))|" + // 3, 4, 5 (allows for 1 level of inner quotes or parens)
	"('(.*?)')" // 6, 7
);
var UTC = Date.UTC;
var proto = XDate.prototype;



// This makes an XDate look pretty in Firebug and Web Inspector.
// It makes an XDate seem array-like, and displays [ <internal-date> ]
proto.length = 1;
proto.splice = Array.prototype.splice;




/* Constructor
---------------------------------------------------------------------------------*/


function XDate() {
	return init(
		(this instanceof XDate) ? this : new XDate(),
		arguments
	);
}


function init(xdate, args) {
	var len = args.length;
	var forceNoTimezone = false;
	if (isBoolean(args[len-1])) {
		forceNoTimezone = !args[--len];
		args = slice(args, 0, len);
	}
	if (!len) {
		xdate[0] = new Date();
		forceNoTimezone = false; // disregard bool parameter
	}
	else if (len == 1) {
		var arg = args[0];
		if (arg instanceof Date || isNumber(arg)) {
			xdate[0] = new Date(arg);
		}
		else if (arg instanceof XDate) {
			xdate[0] = _clone(arg);
			forceNoTimezone = false; // disregard bool parameter
		}
		else if (isString(arg)) {
			xdate[0] = new Date(0);
			xdate = parse(arg, xdate);
			forceNoTimezone = false; // disregard bool parameter
		}
	}
	else {
		xdate[0] = new Date(UTC.apply(Date, args));
		if (!forceNoTimezone) {
			xdate[0] = UTCToLocal(xdate[0]);
		}
	}
	if (forceNoTimezone) {
		xdate[0].toString = notzToString;
	}
	return xdate;
}



/* Timezone Methods
---------------------------------------------------------------------------------*/


proto.addLocalTimezone = methodize(addLocalTimezone);
function addLocalTimezone(xdate, coerce) {
	if (!hasLocalTimezone(xdate)) {
		if (coerce) {
			xdate[0] = UTCToLocal(xdate[0]); // makes a new date, wiping out notzToString
		}else{
			xdate[0] = new Date(xdate[0]); // makes a new date, wiping out notzToString
		}
	}
	return xdate; // for chaining
}


proto.removeLocalTimezone = methodize(removeLocalTimezone);
function removeLocalTimezone(xdate, coerce) {
	if (hasLocalTimezone(xdate)) {
		if (coerce) {
			xdate[0] = localToUTC(xdate[0]);
		}
		xdate[0].toString = notzToString;
	}
	return xdate; // for chaining
}


proto.hasLocalTimezone = methodize(hasLocalTimezone);
function hasLocalTimezone(xdate) {
	return xdate[0].toString !== notzToString;
}


proto.getTimezoneOffset = function() {
	if (hasLocalTimezone(this)) {
		return this[0].getTimezoneOffset();
	}else{
		return 0;
	}
};



/* get / set / add / diff Methods (except for week-related)
---------------------------------------------------------------------------------*/


each(methodSubjects, function(subject, fieldIndex) {

	proto['get' + subject] = function() {
		return this[0]['get' + (hasLocalTimezone(this) ? '' : 'UTC') + subject]();
	};
	
	if (fieldIndex != YEAR) { // because there is no getUTCYear
	
		proto['getUTC' + subject] = function() {
			return this[0]['getUTC' + subject]();
		};
		
	}

	if (fieldIndex != DAY) { // because there is no setDay or setUTCDay
	                         // and the add* and diff* methods use DATE instead
		
		proto['set' + subject] = function(value) {
			_set(this, fieldIndex, value, arguments);
			return this; // for chaining
		};
		
		if (fieldIndex != YEAR) { // because there is no setUTCYear
		                          // and the add* and diff* methods use FULLYEAR instead
			
			proto['setUTC' + subject] = function(value) {
				_set(this, fieldIndex, value, arguments, true);
				return this; // for chaining
			};
			
			proto['add' + (subjectPlurals[fieldIndex] || subject)] = function(delta, preventOverflow) {
				_add(this, fieldIndex, delta, preventOverflow);
				return this; // for chaining
			};
			
			proto['diff' + (subjectPlurals[fieldIndex] || subject)] = function(otherDate) {
				return _diff(this, fieldIndex, otherDate);
			};
			
		}
		
	}

});


function _set(xdate, fieldIndex, value, args, useUTC) {
	
	var date = xdate[0];
	var month = fieldIndex == MONTH ? value % 12 : getField(MONTH);
	var preventOverflow = false;
	var len = args.length;
	if (len == 2 && isBoolean(args[1])) {
		preventOverflow = args[1];
		args = [value];
	}
	useUTC = useUTC || !hasLocalTimezone(xdate);
	
	function getField(i) {
		return useUTC ? getUTCField(date, i) : getLocalField(date, i);
	}
	
	function setField(i, setArgs) {
		date['set' + (useUTC ? 'UTC' : '') + methodSubjects[i]].apply(date, setArgs);
	}
	
	setField(fieldIndex, args);
	
	if (preventOverflow && getField(MONTH) != month) {
		setField(MONTH, [ getField(MONTH) - 1 ]);
		setField(DATE, [ getDaysInMonth(getField(FULLYEAR), getField(MONTH)) ]);
	}
}


function _add(xdate, fieldIndex, delta, preventOverflow) {
	delta = Number(delta);
	var origDelta = delta;
	delta = Math.floor(delta);
	xdate['set' + methodSubjects[fieldIndex]](
		xdate['get' + methodSubjects[fieldIndex]]() + delta,
		preventOverflow || false
	);
	if (delta != origDelta && fieldIndex < MILLISECONDS) {
		_add(xdate, fieldIndex+1, (origDelta-delta)*unitsWithin[fieldIndex], preventOverflow);
	}
}


function _diff(xdate, fieldIndex, otherDate) { // fieldIndex=FULLYEAR is for years, fieldIndex=DATE is for days

	var v = 0;
	var d1 = xdate.toDate();
	var d2 = XDate(otherDate); // will be made a native Date...
	
	if (xdate.hasLocalTimezone()) {
		d2 = d2.addLocalTimezone(true);
	}else{
		d2 = d2.removeLocalTimezone(true);
	}
	d2 = d2.toDate();
	
	if (fieldIndex == FULLYEAR || fieldIndex == MONTH) {
		for (var i=MILLISECONDS, methodName; i>=fieldIndex; i--) {
			v /= unitsWithin[i];
			methodName = 'getUTC' + methodSubjects[i];
			v += d2[methodName]() - d1[methodName]();
		}
		if (fieldIndex == MONTH) {
			v += (d2.getUTCFullYear() - d1.getUTCFullYear()) * 12;
		}
	}
	else if (fieldIndex == DATE || fieldIndex == WEEK) {
		var clear1 = new Date(d1).setUTCHours(0, 0, 0, 0); // ms value
		var clear2 = new Date(d2).setUTCHours(0, 0, 0, 0); // ms value
		v = Math.round((clear2 - clear1) / DAY_MS) +
			((d2 - clear2) - (d1 - clear1)) / DAY_MS;
		if (fieldIndex == WEEK) {
			v /= 7;
		}
	}
	else {
		v = (d2 - d1) / [
			3600000, // milliseconds in hour
			60000,   // milliseconds in minute
			1000,    // milliseconds in second
			1        //
			][fieldIndex - 3];
	}
	
	return v;
}



/* Week Methods
---------------------------------------------------------------------------------*/


proto.getWeek = function() {
	return getWeek(this.getFullYear(), this.getMonth(), this.getDate());
};


proto.getUTCWeek = function() {
	return getWeek(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate());
};


proto.addWeeks = function(delta) {
	return this.addDays(Number(delta) * 7);
};


proto.diffWeeks = function(otherDate) {
	return _diff(this, WEEK, otherDate);
};


function getWeek(year, month, date) {
	var d = new Date(UTC(year, month, date));
	var currentWeek1 = getWeek1(year);
	var week1 = currentWeek1;
	if (d < currentWeek1) {
		week1 = getWeek1(year-1);
	}else{
		var nextWeek1 = getWeek1(year+1);
		if (d >= nextWeek1) {
			week1 = nextWeek1;
		}
	}
	return Math.floor(Math.round((d - week1) / DAY_MS) / 7) + 1;
}


function getWeek1(year) { // returns date of first week of year
	var d = new Date(UTC(year, 0, 4));
	d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7); // make it Monday of the week
	return d;
}



/* toString Methods
---------------------------------------------------------------------------------*/


proto.toString = function(formatString, settings, uniqueness) {
	if (formatString === undefined || !isValid(this)) {
		return this[0].toString(); // already accounts for no-timezone (might be notzToString)
	}else{
		return format(this, formatString, settings, uniqueness);
	}
};


proto.toUTCString = proto.toGMTString = function(formatString, settings, uniqueness) {
	if (formatString === undefined || !isValid(this)) {
		if (hasLocalTimezone(this)) {
			return this[0].toUTCString();
		}else{
			return stripGMT(this[0].toUTCString());
		}
	}else{
		return format(this, formatString, settings, uniqueness, true);
	}
};


proto.toISOString = function(showOriginalTimezone) {
	if (showOriginalTimezone) {
		return this.toString(ISO_FORMAT_STRING);
	}else{
		return this.toUTCString(ISO_FORMAT_STRING);
	}
};


each(
	[
		'toDateString',
		'toTimeString',
		'toLocaleString',
		'toLocaleDateString',
		'toLocaleTimeString'
	],
	function(methodName) {
		proto[methodName] = function() {
			if (hasLocalTimezone(this)) {
				return this[0][methodName]();
			}else{
				return stripGMT(UTCToLocal(this[0])[methodName]());
			}
		};
	}
);


function notzToString() { // a method for a Date object
	return stripGMT(UTCToLocal(this).toString());
}


function stripGMT(s) {
	return s.replace(/\s+(GMT|UTC).*/, '');
}



/* Advanced Formatting
---------------------------------------------------------------------------------*/


XDate.defaultLocale = '';
XDate.locales = {
	'': {
		monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
		dayNames: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
		dayNamesShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
		amDesignator: 'AM',
		pmDesignator: 'PM'
	}
};
XDate.formatters = {};


function format(xdate, formatString, settings, uniqueness, useUTC) {

	var locales = XDate.locales;
	var defaultLocaleSettings = locales[XDate.defaultLocale] || {};
	var _getField = useUTC ? getUTCField : getLocalField;
	
	settings = (isString(settings) ? locales[settings] : settings) || {};
	
	function getSetting(name) {
		return settings[name] || defaultLocaleSettings[name];
	}
	
	function getField(fieldIndex) {
		if (uniqueness) {
			var i = (fieldIndex == DAY ? DATE : fieldIndex) - 1;
			for (; i>=0; i--) {
				uniqueness.push(_getField(xdate, i));
			}
		}
		return _getField(xdate, fieldIndex);
	}
	
	return _format(xdate, formatString, getField, getSetting, useUTC);
}


function _format(xdate, formatString, getField, getSetting, useUTC) {
	var m;
	var subout;
	var out = '';
	while (m = formatString.match(formatStringRE)) {
		out += formatString.substr(0, m.index);
		if (m[1]) { // consecutive alphabetic characters
			out += processTokenString(xdate, m[1], getField, getSetting, useUTC);
		}
		else if (m[3]) { // parenthesis
			subout = _format(xdate, m[4], getField, getSetting, useUTC);
			if (parseInt(subout.replace(/\D/g, ''), 10)) { // if any of the numbers are non-zero. or no numbers at all
				out += subout;
			}
		}
		else { // else if (m[6]) { // single quotes
			out += m[7] || "'"; // if inner is blank, meaning 2 consecutive quotes = literal single quote
		}
		formatString = formatString.substr(m.index + m[0].length);
	}
	return out + formatString;
}


function processTokenString(xdate, tokenString, getField, getSetting, useUTC) {
	var end = tokenString.length;
	var replacement;
	var out = '';
	while (end > 0) {
		replacement = getTokenReplacement(xdate, tokenString.substr(0, end), getField, getSetting, useUTC);
		if (replacement !== undefined) {
			out += replacement;
			tokenString = tokenString.substr(end);
			end = tokenString.length;
		}else{
			end--;
		}
	}
	return out + tokenString;
}


function getTokenReplacement(xdate, token, getField, getSetting, useUTC) {
	var formatter = XDate.formatters[token];
	if (isString(formatter)) {
		return _format(xdate, formatter, getField, getSetting, useUTC);
	}
	else if (isFunction(formatter)) {
		return formatter(xdate, useUTC || false, getSetting);
	}
	switch (token) {
		case 'fff'  : return zeroPad(getField(MILLISECONDS), 3);
		case 's'    : return getField(SECONDS);
		case 'ss'   : return zeroPad(getField(SECONDS));
		case 'm'    : return getField(MINUTES);
		case 'mm'   : return zeroPad(getField(MINUTES));
		case 'h'    : return getField(HOURS) % 12 || 12;
		case 'hh'   : return zeroPad(getField(HOURS) % 12 || 12);
		case 'H'    : return getField(HOURS);
		case 'HH'   : return zeroPad(getField(HOURS));
		case 'd'    : return getField(DATE);
		case 'dd'   : return zeroPad(getField(DATE));
		case 'ddd'  : return getSetting('dayNamesShort')[getField(DAY)] || '';
		case 'dddd' : return getSetting('dayNames')[getField(DAY)] || '';
		case 'M'    : return getField(MONTH) + 1;
		case 'MM'   : return zeroPad(getField(MONTH) + 1);
		case 'MMM'  : return getSetting('monthNamesShort')[getField(MONTH)] || '';
		case 'MMMM' : return getSetting('monthNames')[getField(MONTH)] || '';
		case 'yy'   : return (getField(FULLYEAR)+'').substring(2);
		case 'yyyy' : return getField(FULLYEAR);
		case 't'    : return _getDesignator(getField, getSetting).substr(0, 1).toLowerCase();
		case 'tt'   : return _getDesignator(getField, getSetting).toLowerCase();
		case 'T'    : return _getDesignator(getField, getSetting).substr(0, 1);
		case 'TT'   : return _getDesignator(getField, getSetting);
		case 'z'    :
		case 'zz'   :
		case 'zzz'  : return _getTZString(xdate, token, useUTC);
		case 'w'    : return _getWeek(getField);
		case 'ww'   : return zeroPad(_getWeek(getField)); // what capital Z's?
		case 'S'    :
			var d = getField(DATE);
			if (d > 10 && d < 20) return 'th';
			return ['st', 'nd', 'rd'][d % 10 - 1] || 'th';
	}
}


function _getTZString(xdate, token, useUTC) {
	if (!hasLocalTimezone(xdate)) {
		return '';
	}
	if (useUTC) {
		return 'Z';
	}
	var tzo = xdate.getTimezoneOffset();
	var sign = tzo < 0 ? '+' : '-';
	var hours = Math.floor(Math.abs(tzo) / 60);
	var minutes = Math.abs(tzo) % 60;
	var out = hours;
	if (token == 'zz') {
		out = zeroPad(hours);
	}
	else if (token != 'z') { // zzz or K
		out = zeroPad(hours) + ':' + zeroPad(minutes);
	}
	return sign + out;
}


function _getDesignator(getField, getSetting) {
	return getField(HOURS) < 12 ? getSetting('amDesignator') : getSetting('pmDesignator');
}


function _getWeek(getField) {
	return getWeek(getField(FULLYEAR), getField(MONTH), getField(DATE));
}



/* Parsing
---------------------------------------------------------------------------------*/


XDate.parsers = [
	parseISO
];


XDate.parse = function(str) {
	return +XDate(''+str);
};


function parse(str, xdate) {
	var parsers = XDate.parsers;
	var i = 0;
	var res;
	for (; i<parsers.length; i++) {
		res = parsers[0](str, xdate);
		if (res) {
			return res;
		}
	}
	xdate[0] = new Date(str);
	return xdate;
}


function parseISO(str, xdate) {
	var m = str.match(/^(\d{4})(-(\d{2})(-(\d{2})([T ](\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|(([-+])(\d{2})(:?(\d{2}))?))?)?)?)?$/);
	if (m) {
		var d = new Date(UTC(
			m[1],
			m[3] ? m[3] - 1 : 0,
			m[5] || 1,
			m[7] || 0,
			m[8] || 0,
			m[10] || 0,
			m[12] ? Number('0.' + m[12]) * 1000 : 0
		));
		if (m[13]) { // has gmt offset or Z
			if (m[14]) { // has gmt offset
				d.setUTCMinutes(
					d.getUTCMinutes() +
					(m[15] == '-' ? 1 : -1) * (Number(m[16]) * 60 + (m[18] ? Number(m[18]) : 0))
				);
			}
		}else{ // has no timezone
			xdate.removeLocalTimezone();
		}
		return xdate.setTime(+d);
	}
}



/* Misc Methods
---------------------------------------------------------------------------------*/


proto.getTime = proto.valueOf = function() {
	return this[0].getTime();
};


proto.setTime = function(t) {
	this[0].setTime(t);
	return this; // for chaining
};


if (Date.prototype.toJSON) {
	proto.toJSON = function() {
		return this[0].toJSON();
	};
}


proto.isValid = methodize(isValid);
function isValid(xdate) {
	return !isNaN(+xdate[0]);
}


proto.clone = function() {
	return XDate(this);
};


proto.clearTime = function() {
	return this.setHours(0, 0, 0, 0); // will return an XDate for chaining
};


proto.toDate = function() {
	return new Date(this[0]);
};



/* Misc Class Methods
---------------------------------------------------------------------------------*/


XDate.now = function() {
	return +new Date();
};


XDate.today = function() {
	return XDate().clearTime();
};


XDate.UTC = UTC;


XDate.getDaysInMonth = getDaysInMonth;



/* Internal Utilities
---------------------------------------------------------------------------------*/


function _clone(xdate) { // returns the internal Date object that should be used
	var d = new Date(xdate[0]);
	if (!hasLocalTimezone(xdate)) {
		d.toString = notzToString;
	}
	return d;
}


function getLocalField(d, fieldIndex) { // d can be a Date or an XDate
	return d['get' + methodSubjects[fieldIndex]]();
}


function getUTCField(d, fieldIndex) { // d can be a Date or an XDate
	return d['getUTC' + methodSubjects[fieldIndex]]();
}



/* Date Math Utilities
---------------------------------------------------------------------------------*/


function localToUTC(date) {
	return new Date(UTC(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		date.getHours(),
		date.getMinutes(),
		date.getSeconds(),
		date.getMilliseconds()
	));
}


function UTCToLocal(date) {
	return new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds(),
		date.getUTCMilliseconds()
	);
}


function getDaysInMonth(year, month) {
	return 32 - new Date(UTC(year, month, 32)).getUTCDate();
}



/* General Utilities
---------------------------------------------------------------------------------*/


function methodize(f) {
	return function() {
		return f.apply(null, [this].concat(slice(arguments)));
	};
}


function slice(a, start, end) {
	return Array.prototype.slice.call(a, start, end);
}


function each(a, f) {
	for (var i=0; i<a.length; i++) {
		f(a[i], i);
	};
}


function zeroPad(n, len) {
	n += '';
	while (n.length < (len || 2)) {
		n = '0' + n;
	}
	return n;
}


function isString(arg) {
	return typeof arg == 'string';
}


function isNumber(arg) {
	return typeof arg == 'number';
}


function isBoolean(arg) {
	return typeof arg == 'boolean';
}


function isFunction(arg) {
	return typeof arg == 'function';
}



return XDate;

})(Date);