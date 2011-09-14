

// THESE TESTS DONT MATTER ANYMORE


test("avoid dead zone", function() {
	var deadZone = getDSTDeadZone();
	if (deadZone) {
		var year = deadZone[1].getFullYear();
		var month = deadZone[1].getMonth();
		var date = deadZone[1].getDate();
		var hours = deadZone[1].getHours() - 1;
		var minutes = deadZone[1].getMinutes();
		var realDate = new Date(year, month, date, hours, minutes);
		var xdate = new XDate(year, month, date, hours, minutes);
		hours %= 24;
		return realDate.getHours() != hours && // real date falls into deadzone
			xdate.getHours() == hours &&
			!xdate.getSeconds() &&
			!xdate.getMilliseconds() &&
			+realDate == +xdate; // reduce to same local time
	}
	return "can't find browser's DST dead zone";
});


test("avoid dead zone, from ISO string", function() {
	var deadZone = getDSTDeadZone();
	if (deadZone) {
		var year = deadZone[1].getFullYear();
		var month = deadZone[1].getMonth();
		var date = deadZone[1].getDate();
		var hours = deadZone[1].getHours() - 1;
		var minutes = deadZone[1].getMinutes();
		if (hours < 0) {
			hours += 24;
			date--;
			if (date < 1) {
				month--;
				if (month < 0) {
					month += 12;
					year--;
				}
				date = 32 - new Date(Date.UTC(year, month, 32)).getUTCDate(); // days in month
			}
		}
		function pad(n) {
			return n < 10 ? '0' + n : n;
		}
		var xdate = new XDate(
			pad(year) + '-' + pad(month+1) + '-' + pad(date) +
			'T' + pad(hours) + ':' + pad(minutes)
		);
		var realDate = new Date(year, month, date, hours, minutes);
		return realDate.getHours() != hours && // real date falls into deadzone
			xdate.getFullYear() == year &&
			xdate.getMonth() == month &&
			xdate.getDate() == date &&
			xdate.getHours() == hours &&
			xdate.getMinutes() == minutes &&
			+xdate == +realDate; // reduce to same local time
	}
	return "can't find browser's DST dead zone";
});



function getDSTDeadZone() {
	var dstDates = getDSTDates();
	if (dstDates) {
		var prior = new Date(+dstDates[0]-1);
		if (Math.abs(dstDates[0].getHours() - prior.getHours()) > 1) {
			return [prior, dstDates[0]];
		}
		prior = new Date(+dstDates[1]-1);
		if (Math.abs(dstDates[1].getHours() - prior.getHours()) > 1) {
			return [prior, dstDates[1]];
		}
	}
}

function getDSTDates() {
	var MS_DAY = 86400000;
	var res = [];
	var d0 = new Date();
	var overAYear = new Date(+d0);
	overAYear.setFullYear(overAYear.getFullYear() + 1);
	overAYear = new Date(+overAYear + MS_DAY);
	while (d0 < overAYear) {
		var d1 = new Date(+d0 + MS_DAY);
		if (d0.getTimezoneOffset() != d1.getTimezoneOffset()) {
			res.push(new Date(narrowDSTDate(+d0, +d1)));
			if (res.length == 2) {
				break;
			}
		}
		d0 = d1;
	}
	return res.length==2 ? res : null;
}

function narrowDSTDate(start, end) {
	if (end <= start+1) {
		return end;
	}
	var mid = start + Math.floor((end - start) / 2);
	var midTZO = new Date(mid).getTimezoneOffset();
	var startTZO = new Date(start).getTimezoneOffset();
	var endTZO = new Date(end).getTimezoneOffset();
	if (midTZO == startTZO) {
		return narrowDSTDate(mid, end);
	}
	else if (midTZO == endTZO) {
		return narrowDSTDate(start, mid);
	}
}

