/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 * @class
 * @extends OK_Object
 */
function OK_Object_Calendar (id, className, year, month, thismonth, buttons, bsize, rangeonly, past)
{
    /**
     * Retrieves the string identifying the Object.
     * @type string
     */
    this.id = id;

    /**
     * Retrieves the string identifying the type of the Object.
     * @type string
     */
    this._type = "calendar";


    this.bsize = bsize ? bsize : 32;

    this.buttons = buttons ? 1 : 0;

    this.rangeonly = rangeonly ? 1 : 0;

    /**
     *
     * @type Date
     */
    this.date = new Date(year > 0 ? year : 0, month > 0 ? month : 0);

    /**
     *
     */
    this.thismonth = thismonth ? 1 : 0;

    /**
     *
     */
    this.past = past ? 1 : 0;

    /**
     * @type string
     */
    this.className = className ? className : "OK_CALENDAR";

    this.ranges = [];

    this.register();
};

/** */
OK_Object_Calendar.prototype = new OK_Object;

/**
 *
 */
OK_Object_Calendar.prototype.setDate = function (date)
{
    this.date = new Date(date ? date : new Date());
    this.date.setHours(0, 0, 0, 0);
    this.redraw();
};

/**
 *
 */
OK_Object_Calendar.prototype.clearRanges = function ()
{
    this.ranges = [];
};

/**
 *
 */
OK_Object_Calendar.prototype.addRange = function (start, end, className)
{
    this.ranges.push({
        start: start.setHours(0, 0, 0, 0),
        end: end.setHours(0, 0, 0, 0),
        className: className ? className : "RANGE"
    });
};

/**
 *
 */
OK_Object_Calendar.prototype.redraw = function ()
{
    var _t = ok.$(this.id),
        date = this.date,
        i, z, _c, _r, b, now = new Date(),
        ms_per_day = 1000 * 60 * 60 * 24,
        daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        months = ["January","February","March","April","May","June","July","August","September","October","November","December"],
        month, start, dow, end, current;

    now.setHours(0, 0, 0, 0);

    if (!date) {
        date = this.date = new Date(now);
        date.setHours(0, 0, 0, 0);
    };

    if( new Date( date.getFullYear(), 1, 29 ).getMonth() == 1 ) {
        daysInMonth[1] = 29;
    }


    month = date.getMonth();

    // --

    b = ok.get(this.id + ":NEXT");
    if (!b && this.buttons) {
        b = new OK_Object_Button(this.id + ":NEXT", -1, 1, this.className + "_NAV");
        b._id = this.id;
        b.onaction = function (e) {
            var c = ok.get(this._id),
                date = new Date(c.date.getTime()),
                m = date.getMonth();

            if (m < 11) {
                date.setMonth(m + 1);
            } else {
                date.setFullYear(date.getFullYear() + 1);
                date.setMonth(0);
            };
            c.setDate(date);
        };
    };
    if (b) {
        b._date = date;
    };

    b = ok.get(this.id + ":PREV");
    if (!b && this.buttons) {
        b = new OK_Object_Button(this.id + ":PREV", -1, 1, this.className + "_NAV");
        b._id = this.id;
        b.onaction = function (e) {
            var c = ok.get(this._id),
                date = new Date(c.date.getTime()),
                m = date.getMonth();

            if (m > 0) {
                date.setMonth(m - 1);
            } else {
                date.setFullYear(date.getFullYear() - 1);
                date.setMonth(11);
            };
            c.setDate(date);
        };
    };
    if (b) {
        b._date = date;
        b.setEnabled(date.getMonth() > now.getMonth() || date.getYear() > now.getYear() || this.past);
    };


    ok.$(this.id + ":TITLE").innerHTML = months[month] + ", " + date.getFullYear();

    // --

    while (_t.rows.length > 2) {
        ok.objects.removeAll(_t.rows[2]);
        _t.firstElementChild.removeChild(_t.rows[2]);
    };

    // --

    start = new Date(date);
    start.setDate(1);
    dow = start.getDay();
    if (dow == 0) { dow = 7; };
    start.setDate(start.getDate() - (dow - 1));

    end = new Date(date);
    end.setDate(daysInMonth[month]);
    dow = end.getDay();
    if (dow == 0) { dow = 7; };
    end.setDate(end.getDate() + (7 - dow));

    _r = document.createElement("tr");
    _t.firstElementChild.appendChild(_r);

    for (var rows = 3, current = new Date(start.getTime()), i = 1, b, cname; current <= end; i++)
    {
        cname = "";

        _c = document.createElement("td");
        _c.id = this.id + ":" + i;
        _c.style.width = this.bsize + "px";
        _c.style.height = this.bsize + "px";
        _c.style.textAlign = "center";
        _c.style.verticalAlign = "middle";
        _r.appendChild(_c);
        if (current.getMonth() != month) {
            _c.innerHTML = "&#160;";
        } else {
            _c.innerHTML = current.getDate();
        };

        if (current.getTime() == now.getTime()) {
            cname = "NOW";
        };

        for (var p = 0, pl = this.ranges.length; p < pl; p++) {
            if ((this.past || current >= now) && current.getMonth() == month && current >= this.ranges[p].start && current <= this.ranges[p].end) {
                cname = this.ranges[p].className;
                break;
            };
        };

        b = new OK_Object_Button(this.id + ":" + i, -1, 1, this.className + "_BTN" + cname);
        b._id = this.id;
        b._date = new Date(current.getTime());
        b.__swipe = function (e) {
            return ok.route(e, this._id);
        };
        b.__swiping = function (e) {
            return ok.route(e, this._id);
        };
        b.__swipekinetics = function (e) {
            return ok.route(e, this._id);
        };
        b.setEnabled(current.getMonth() == month);
        if (b.enabled && !this.past) {
            b.setEnabled(current >= now);
        };
        if (b.enabled && this.rangeonly && (!cname || cname == "NOW")) {
            b.disable();
        };
        b.onaction = function (e)
        {
            ok.route({
                type: 'select',
                date: this._date
            }, this._id);
        };

        if (i % 7 == 0 && current < end) {
            _r = document.createElement("tr");
            _t.firstElementChild.appendChild(_r);
            rows++;
        };

        current.setDate(current.getDate() + 1);
    };


    if (rows < 8) {
        _r = document.createElement("tr");
        _c = document.createElement("td");
        _c.rowspan = 7;
        _c.innerHTML = "&#160";
        _c.style.width = this.bsize + "px";
        _c.style.height = this.bsize + "px";
        _r.appendChild(_c);
        _t.firstElementChild.appendChild(_r);
        rows++;
    };

//  _t.style.height = (rows * 30) + "px";
//  _t.style.width = (7 * 30) + "px";
//
    if (_t.parentNode) {
        i = ok.get(_t.parentNode.id);
        if (i && i._type == "menu") {
            i = ok.$(i.id);
            i.style.width = (_t.offsetWidth + 6) + "px";
            i.style.height = (_t.offsetHeight + 6) + "px";
        };
    };

};

/**
 *
 */
OK_Object_Calendar.prototype.__beforeresize = function (e)
{
    if (!this.isDisplayed()) {
        return;
    };

    return 1;
};

/**
 *
 */
OK_Object_Calendar.prototype.__resize = function (e)
{
    if (!this.isDisplayed()) {
        return;
    };

    this.redraw();
    return 1;
};

/**
 *
 */
OK_Object_Calendar.prototype.__swiping = function (e)
{
    var b;

    if (e.gesture.swipe.direction == "right")
    {
        ok.touch.clear();
        b = ok.get(this.id + ":PREV");
        if (b.enabled) {
            ok.route('action', b);
        };
    }
    else if (e.gesture.swipe.direction == "left")
    {
        ok.touch.clear();
        b = ok.get(this.id + ":NEXT");
        if (b.enabled) {
            ok.route('action', b);
        };
    };

    return 1;
};

