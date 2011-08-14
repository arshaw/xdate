/**
 * @preserve XDate v@VERSION
 * http://arshaw.com/xdate/
 *
 * Copyright 2011, Adam Shaw
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: @DATE
 */


/*
TODO: describe real vs anchor date
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
var otherGetterNames = [
	'getTimezoneOffset',
	'getTime',
	'valueOf',
	'toDateString',
	'toTimeString',
	'toLocaleString',
	'toLocaleDateString',
	'toLocaleTimeString',
	'toJSON'
];
var formatStringRE = new RegExp(
	"(([a-zA-Z])\\2*)|" + // 1, 2
	"(\\(" + "(('.*?'|\\(.*?\\)|.)*?)" + "\\))|" + // 3, 4, 5
	"('(.*?)')" // 6, 7
);
var UTC = Date.UTC;
var proto = XDate.prototype;
var i;



function XDate() {
	return init(
		(this instanceof XDate) ? this : new XDate(),
		arguments
	);
}


function init(xdate, args) {
	var arg = args[0];
	var len = args.length;
	if (!len) {
		_setReal(xdate, new Date());
	}
	else if (len == 1) {
		if (arg instanceof Date || isNumber(arg)) {
			_setReal(xdate, new Date(arg));
		}
		else if (arg instanceof XDate) {
			setAnchor(xdate, new Date(getAnchor(arg)));
		}
		else if (isString(arg)) {
			return parse(arg, xdate);
		}
	}
	else {
		setAnchor(xdate, new Date(UTC.apply(Date, args)));
	}
	return xdate;
}


function ensureXDate(arg) {
	return arg instanceof XDate ? arg : new XDate(arg);
}



/* Standard Methods, Adding Methods, Diffing Methods
------------------------------------------------------------------------------*/


for (i=0; i<WEEK; i++) (function(subject, fieldIndex) {

	if (fieldIndex != YEAR) {
	
		// getFullYear
		// getMonth
		// getDate
		// getHours
		// getMinutes
		// getSeconds
		// getMilliseconds
		// getDay
		// (can't do getYear here b/c getUTCYear doesn't exist. see below)
		proto['get' + subject] = function() {
			return getLocalField(this, fieldIndex);
		};
		
		// getUTCFullYear
		// getUTCMonth
		// getUTCDate
		// getUTCHours
		// getUTCMinutes
		// getUTCSeconds
		// getUTCMilliseconds
		// getUTCDay
		// (there is no getUTCYear)
		proto['getUTC' + subject] = function() {
			return getUTCField(this, fieldIndex);
		};
	
	}
	
	if (fieldIndex != DAY) {
	
		// setFullYear
		// setMonth
		// setDate
		// setHours
		// setMinutes
		// setSeconds
		// setMilliseconds
		// setYear
		// (there is no setDay)
		proto['set' + subject] = function(value, preventOverflow) {
			_set(this, fieldIndex, value, preventOverflow, arguments);
			return this; // for chaining
		};
	
		if (fieldIndex != YEAR) {
	
			// setUTCFullYear
			// setUTCMonth
			// setUTCDate
			// setUTCHours
			// setUTCMinutes
			// setUTCMilliseconds
			// (there is no setUTCDay)
			// (there is no setUTCYear)
			proto['setUTC' + subject] = function() {
				var real = getReal(this)
				real['setUTC' + subject].apply(real, arguments);
				clearAnchor(this);
				return this; // for chaining
			};
			
			// addYears (FullYear)
			// addMonths
			// addDays (Date)
			// addHours
			// addMinutes
			// addSeconds
			// addMilliseconds
			// (there is no adding Day)
			// (there is no adding Year)
			proto['add' + (subjectPlurals[fieldIndex] || subject)] = function(delta, preventOverflow) {
				delta = parseInt(delta);
				this['set' + subject](
					this['get' + subject]() + delta,
					preventOverflow
				);
				return this; // for chaining
			};
			
			// diffYears (FullYear)
			// diffMonths
			// diffDays (Date)
			// diffHours
			// diffMinutes
			// diffSeconds
			// diffMilliseconds
			// (there is no diffing Day)
			// (there is no diffing Year)
			proto['diff' + (subjectPlurals[fieldIndex] || subject)] = function(otherDate) {
				return _diff(this, fieldIndex, otherDate);
			};
		
		}
	
	}
	
})(methodSubjects[i], i);


for (i=0; i<otherGetterNames.length; i++) (function(getterName) {

	proto[getterName] = function() {
		return getReal(this)[getterName]();
	};

})(otherGetterNames[i]);


proto.getYear = function() {
	return this.getFullYear() - 1900;
};


proto.setTime = function(t) {
	getReal(this).setTime(t);
	clearAnchor(this);
	return this; // for chaining
};


function _set(xdate, fieldIndex, value, preventOverflow, args) {
	value = parseInt(value);
	var month = fieldIndex == MONTH ? value % 12 : xdate.getMonth();
	var anchor = getAnchor(xdate);
	if (args.length == 2 && (isBoolean(preventOverflow) || preventOverflow === undefined)) {
		args = [value];
	}
	anchor['setUTC' + methodSubjects[fieldIndex]].apply(anchor, args);
	setAnchor(xdate, anchor);
	if (
		(fieldIndex == FULLYEAR || fieldIndex == MONTH) &&
		preventOverflow === true &&
		xdate.getMonth() != month
	) {
		xdate.addMonths(-1)
			.setDate(
				getDaysInMonth(xdate.getFullYear(), xdate.getMonth())
			);
	}
}


function _diff(xdate, fieldIndex, otherDate) {
	var d1 = getAnchor(xdate);
	var d2 = getAnchor(ensureXDate(otherDate));
	var v = 0;
	if (fieldIndex == FULLYEAR || fieldIndex == MONTH) {
		for (var i=MILLISECONDS, methodName; i>=fieldIndex; i--) {
			v /= [
				12,   // months in year
				31,   // day in month (kinda)
				24,   // hours in day
				60,   // minutes in hour
				60,   // seconds in minute
				1000, // milliseconds in second
				1     //
				][i];
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



/* Week Stuff (TODO: write tests)
----------------------------------------------------------------------------*/


proto.diffWeeks = function(otherDate) {
	return _diff(this, WEEK, otherDate);
};


proto.addWeeks = function(delta) {
	return this.addDays(parseInt(delta) * 7);
};


proto.getWeek = function(d) {
	return getWeek(this.getFullYear(), this.getMonth(), this.getDate());
};


proto.getUTCWeek = function(d) {
	return getWeek(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate());
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


function getWeek1(year) {
	var d = new Date(UTC(year, 0, 4));
	d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
	return d;
}




/* Comparison Methods
------------------------------------------------------------------------------*/


proto.equals = function(date) {
	return +getAnchor(this) == +getAnchor(ensureXDate(date));
};


proto.before = function(date) {
	return getAnchor(this) < getAnchor(ensureXDate(date));
};


proto.after = function(date) {
	return getAnchor(this) > getAnchor(ensureXDate(date));
};




/* Other Utility Methods
------------------------------------------------------------------------------*/


proto.valid = function() {
	return !isNaN(+getReal(this));
};


proto.clearTime = function() {
	return this.setHours(0, 0, 0, 0);
};


proto.clone = function() {
	return new XDate(this);
};


proto.toDate = function() {
	return new Date(getReal(this));
};




/* Parsing
------------------------------------------------------------------------------*/


XDate.parsers = [
	parseISO
];


XDate.parse = function(str) {
	return +new XDate(''+str);
};


function parse(str, xdate) {
	for (
		var parsers = XDate.parsers, i=0, res;
		i < parsers.length;
		i++
	) {
		res = parsers[0](str, xdate);
		if (res) {
			return res;
		}
	}
	setReal(xdate, new Date(str));
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
			setReal(xdate, d);
			if (m[14]) { // has gmt offset
				xdate.addMinutes((m[15] == '-' ? 1 : -1) * (Number(m[16]) * 60 + (m[18] ? Number(m[18]) : 0)));
			}
		}else{
			setAnchor(xdate, d);
		}
		return xdate;
	}
}




/* Formatting
------------------------------------------------------------------------------*/

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
XDate.formatters = {
	i: "yyyy-MM-dd'T'HH:mm:ss(.fff)",
	u: "yyyy-MM-dd'T'HH:mm:ss(.fff)K"
};


proto.toString = function(formatString, settings, uniqueness) {
	if (!arguments.length || !this.valid()) {
		return getReal(this).toString();
	}
	return format(formatString, this, false, settings, uniqueness);
};


proto.toUTCString = proto.toGMTString = function(formatString, settings, uniqueness) {
	if (!arguments.length || !this.valid()) {
		return getReal(this).toUTCString();
	}
	return format(formatString, this, true, settings, uniqueness);
};


proto.toISOString = function() {
	return this.toUTCString('u');
};


function format(formatString, xdate, useUTC, settings, uniqueness) {
	
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
	
	return _format(formatString, xdate, getField, useUTC, getSetting, uniqueness);
}


function _format(formatString, xdate, getField, useUTC, getSetting, uniqueness) {
	var m;
	var subout;
	var out = '';
	while (m = formatString.match(formatStringRE)) {
		out += formatString.substr(0, m.index);
		if (m[1]) {
			out += processTokenString(m[1], xdate, getField, useUTC, getSetting, uniqueness);
		}
		else if (m[3]) {
			subout = _format(m[4], xdate, getField, useUTC, getSetting, uniqueness);
			if (parseInt(subout.replace(/\D/g, ''))) {
				out += subout;
			}
		}
		else { // else if (m[6]) {
			out += m[7] || "'";
		}
		formatString = formatString.substr(m.index + m[0].length);
	}
	return out + formatString;
}


function processTokenString(tokenString, xdate, getField, useUTC, getSetting, uniqueness) {
	var end = tokenString.length;
	var replacement;
	var out = '';
	while (end > 0) {
		replacement = getTokenReplacement(tokenString.substr(0, end), xdate, getField, useUTC, getSetting, uniqueness);
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


function getTokenReplacement(token, xdate, getField, useUTC, getSetting, uniqueness) {
	var formatter = XDate.formatters[token];
	if (isString(formatter)) {
		return _format(formatter, xdate, getField, useUTC, getSetting, uniqueness);
	}
	else if (isFunction(formatter)) {
		return formatter(xdate, useUTC, getSetting);
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
		case 'K'    : if (useUTC) return 'Z';
		case 'zzz'  : return getTZOSign(xdate) + zeroPad(getTZOHours(xdate)) + ':' + zeroPad(getTZOMinutes(xdate));
		case 'zz'   : return getTZOSign(xdate) + zeroPad(getTZOHours(xdate));
		case 'z'    : return getTZOSign(xdate) + getTZOHours(xdate);
		case 'W'    : return _getWeek(getField);
		case 'WW'   : return zeroPad(_getWeek(getField));
		case 'S'    :
			var d = getField(DATE);
			if (d > 10 && d < 20) return 'th';
			return ['st', 'nd', 'rd'][d % 10 - 1] || 'th';
	}
}


function getTZOSign(xdate) {
	return xdate.getTimezoneOffset() < 0 ? '+' : '-';
}


function getTZOHours(xdate) {
	return Math.floor(Math.abs(xdate.getTimezoneOffset()) / 60);
}


function getTZOMinutes(xdate) {
	return Math.abs(xdate.getTimezoneOffset()) % 60;
}


function _getDesignator(getField, getSetting) {
	return getField(HOURS) < 12 ? getSetting('amDesignator') : getSetting('pmDesignator');
}


function _getWeek(getField) {
	return getWeek(getField(FULLYEAR), getField(MONTH), getField(DATE));
}



/* Misc Class Methods
-----------------------------------------------------------------------------*/


XDate.now = function() {
	return +new Date();
};


XDate.UTC = UTC;


XDate.getDaysInMonth = getDaysInMonth;




/* Internal Accessors
------------------------------------------------------------------------------*/


function getLocalField(xdate, fieldIndex) {
	if (xdate._) {
		return xdate._['getUTC' + methodSubjects[fieldIndex]]();
	}else{
		return xdate[0]['get' + methodSubjects[fieldIndex]]();
	}
}


function getUTCField(xdate, fieldIndex) {
	return xdate[0]['getUTC' + methodSubjects[fieldIndex]]();
}


function getReal(xdate) {
	return xdate[0];
}


function setReal(xdate, realDate) {
	_setReal(xdate, realDate);
	clearAnchor(xdate);
}


function _setReal(xdate, realDate) {
	xdate[0] = realDate;
}


function getAnchor(xdate) {
	return xdate._ || localToUTC(xdate[0]);
}


function setAnchor(xdate, anchorDate) {
	var realDate = UTCToLocal(anchorDate);
	if (!isNaN(+anchorDate) && realDate.getHours() != anchorDate.getUTCHours()) {
		xdate._ = anchorDate;
	}else{
		clearAnchor(xdate);
	}
	xdate[0] = realDate;
}


function clearAnchor(xdate) {
	delete xdate._;
}




/* Date Utils
------------------------------------------------------------------------------*/


function getDaysInMonth(year, month) {
	return 32 - new Date(UTC(year, month, 32)).getUTCDate();
}


function localToUTC(localDate) {
	return new Date(UTC(
		localDate.getFullYear(),
		localDate.getMonth(),
		localDate.getDate(),
		localDate.getHours(),
		localDate.getMinutes(),
		localDate.getSeconds(),
		localDate.getMilliseconds()
	));
}


function UTCToLocal(universalDate) {
	return new Date(
		universalDate.getUTCFullYear(),
		universalDate.getUTCMonth(),
		universalDate.getUTCDate(),
		universalDate.getUTCHours(),
		universalDate.getUTCMinutes(),
		universalDate.getUTCSeconds(),
		universalDate.getUTCMilliseconds()
	);
}




/* General Utils
------------------------------------------------------------------------------*/


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




// Make XDate objects array-like
// Will show the "real" date within an array in Firebug, WebInspector
proto.length = 1;
proto.splice = Array.prototype.splice;


return XDate;

})(Date);