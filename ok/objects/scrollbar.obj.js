/**
 * Copyright (c) 2004-2018 Lubo Dyer. All Rights Reserved.
 *
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
 *
 * @param id
 * @param value
 * @param min
 * @param max
 * @param small
 * @param large
 * @param vertical
 * @param disabled
 */
function OK_Object_ScrollBar(id, value, min, max, small, large, vertical, disabled)
{
    /**
     * @public
     * @readonly
     */
    this.id = id;

    /**
     * @public
     * @readonly
     */
    this.enabled = !disabled;

    this._vertical = vertical;
    this._frozen = 1;

    this.register();

    this.capture("mousedown");

    this._value = value;
    this._min = min;
    this._max = max;
    this._small = small;
    this._large = large;

    this.autorepeatstart = 300;
    this.autorepeat = 50;

    // ----

    var bsup = ok.get(this.id + ":UP");
    bsup._scbarid = this.id;
    bsup.focus = function () {};
    bsup.onmouseup = function (e) {
        window.clearTimeout(this.mdtm);
        ok.get(this._scbarid)._mouseup(e);
    };
    bsup.onmousedown = function (e, tm)
    {
        window.clearTimeout(this.mdtm);
        if (this.down && this.over) {
            var c = ok.get(this._scbarid);
            if (c._value > c._min) {
                c.setValue(c._value - c._small);
                var o = this;
                this.mdtm = window.setTimeout(function () {
                    o.onmousedown(e, true);
                }, tm == null ? c.autorepeatstart : c.autorepeat);
            };
        };
    };
    bsup = null;

    // --

    var bsdown = ok.get(this.id + ":DOWN");
    bsdown._scbarid = this.id;
    bsdown.focus = function () {};
    bsdown.onmouseup = function (e) {
        window.clearTimeout(this.mdtm);
        ok.get(this._scbarid)._mouseup(e);
    };
    bsdown.onmousedown = function (e, tm)
    {
        window.clearTimeout(this.mdtm);
        if (this.down && this.over) {
            var c = ok.get(this._scbarid);
            if (c._value < c._max) {
                c.setValue(c._value + c._small);
                var o = this;
                this.mdtm = window.setTimeout(function () {
                    o.onmousedown(e, true);
                }, tm == null ? c.autorepeatstart : c.autorepeat);
            };
        };
    };
    bsdown = null;

    // ----

    var sbar = ok.get(this.id + ":THUMB");

    var scrollbar_id = this.id;

    sbar._scrollbar_id = this.id;
    sbar.onmouseup = function (e) {
        ok.get(this._scrollbar_id)._mouseup(e);
    };
    sbar.onmousedown = function (e) {
        var s = ok.get(this._scrollbar_id),
            _s = ok.$(this._scrollbar_id),
            _u = ok.$(this._scrollbar_id + ":UP"),
            _d = ok.$(this._scrollbar_id + ":DOWN"),
            _b = ok.$(this._scrollbar_id + ":BAR"),
            p = ok.layout.get(_b);

        if (!ok.route({type: 'scrollstart', source: this, value: this.getValue()}, s))
        {
            s._px_scroll_min = s._vertical ? p.top : p.left;
            s._px_scroll_max = (s._vertical ? p.height : p.width) - s._px_bar;
            s._px_scroll_start = (s._vertical ? e.clientY : e.clientX) - s._px_scroll_min - s._px_offset;

            // --

            OK_Object_ScrollBar._scrollbar_id = this._scrollbar_id;
            OK_Object_ScrollBar._doc_mousemove = function (e) {
                return ok.get(OK_Object_ScrollBar._scrollbar_id)._mousemove(e);
            };
            ok.events.capture("onmousemove", document, OK_Object_ScrollBar._doc_mousemove, {capture: true});

            OK_Object_ScrollBar._doc_mouseup = function (e) {
                return ok.get(OK_Object_ScrollBar._scrollbar_id)._mouseup(e);
            };
            ok.events.capture("onmouseup", document, OK_Object_ScrollBar._doc_mouseup, {capture: true});

            this.setToggle(1);
            this.setValue(1, 1);

            return true;
        };
    };

    var sbar = ok.$(this.id + ":BAR");
    sbar._id = this.id;
    sbar.onmouseout = sbar.onmouseup = function (e)
    {
        this._down = false;
        window.clearTimeout(this.tm);
    };
    sbar.onmousedown = function (e, tm)
    {
        if (!tm) {
            this._down = true;
        }
        window.clearTimeout(this.tm);

        if (this._down)
        {
            var _b = ok.$(this._id + ":BAR");
            var _t = ok.$(this._id + ":THUMB");
            var _l = ok.layout.get(_b);
            var _lt = ok.layout.get(_t);
            var y = e.clientY - _l.top;
            var x = e.clientX - _l.left;
            var _y = _lt.top - _l.top;
            var _x = _lt.left - _l.left;
            var o = ok.get(this._id);

            var repeat = 0;

            if (o._vertical)
            {
                if (y < _y)
                {
                    o.setValue(o._value - o._large);
                    repeat = 1;
                }
                else if (y > _y + _lt.height)
                {
                    o.setValue(o._value + o._large);
                    repeat = 1;
                };
            }
            else
            {
                if (x < _x)
                {
                    o.setValue(o._value - o._large);
                    repeat = 1;
                }
                else if (x > _x + _lt.width)
                {
                    o.setValue(o._value + o._large);
                    repeat = 1;
                };
            };

            if (repeat) {
                var _o = this;
                this.mdtm = window.setTimeout(function () {
                    _o.onmousedown(e, true);
                }, tm == null ? o.autorepeatstart : o.autorepeat);
            };
        };
    };

};

/** */
OK_Object_ScrollBar.prototype = new OK_Object;

/**
 *
 */
OK_Object_ScrollBar.prototype.set = function (value, min, max, small, large) {
    this._value = value;
    this._min = min;
    this._max = max;
    this._small = small;
    this._large = large;
    if (this.enabled)
        this._calc();
};

/**
 *
 */
OK_Object_ScrollBar.prototype.setValue = function (value, suppressEvent) {
    if (value < this._min) value = this._min;
    if (value > this._max) value = this._max;
    if (this._value != value) {
        this._value = value;
        this._calc();
        if (!suppressEvent) {
            ok.route({type: 'scroll', source: this, value: this._value}, this);
        };
    };
};

/**
 *
 */
OK_Object_ScrollBar.prototype.getValue = function () {
    return this._value;
};

/**
 *
 */
OK_Object_ScrollBar.prototype.getMin = function () {
    return this._min;
};

/**
 *
 */
OK_Object_ScrollBar.prototype.getMax = function () {
    return this._max;
};

/**
 *
 */
OK_Object_ScrollBar.prototype.setMin = function (value) {
    if (this._min != value) {
        this._min = value;
        this._calc();
    };
};

/**
 *
 */
OK_Object_ScrollBar.prototype.setMax = function (value) {
    if (this._max != value) {
        if (this._value == this._max)
            this._value = value;
        this._max = value;
        this._calc();
    };
};

/**
 *
 */
OK_Object_ScrollBar.prototype.enable = function () {
    if (!this.enabled) {
        this.enabled = 1;
        this._calc();
    };
};

/**
 *
 */
OK_Object_ScrollBar.prototype.disable = function () {
    if (this.enabled) {
        this.enabled = 0;
        this._calc();
    };
};

/**
 *
 */
OK_Object_ScrollBar.prototype.setEnabled = function (enabled) {
    if (enabled)
        this.enable();
    else
        this.disable();
};

/**
 *
 */
OK_Object_ScrollBar.prototype._calc = function () {
    if (!this.isDisplayed()) return;

    ok.get(this.id + ":UP").setEnabled(this.enabled);
    ok.get(this.id + ":DOWN").setEnabled(this.enabled);
    ok.get(this.id + ":THUMB").setEnabled(this.enabled);

    if (!this.enabled) return;

    var s = ok.$(this.id);
    var u = ok.$(this.id + ":UP");
    var d = ok.$(this.id + ":DOWN");
    var b = ok.$(this.id + ":BAR");
    var t = ok.$(this.id + ":THUMB");

    if (!this._px_total) {
        this._px_total = this._vertical ? b.clientHeight : b.clientWidth;
    };

    if (!this._px_total || !this._max)
        return;

    this._px_bar = Math.round((this._px_total * this._large) / (this._max - this._min + this._large));
    if (this._px_bar < 16) this._px_bar = 16;
    if (this._px_bar >= this._px_total) {
        this._px_bar = 16;
        this._frozen = 1;
    }
    else
    {
        this._frozen = 0;
        this._px_offset = Math.round((Math.round((this._value * 100) / (this._max - this._min)) * (this._px_total - this._px_bar)) / 100);
        if (this._vertical) {
            t.style.top = this._px_offset + "px";
            t.style.height = this._px_bar + "px";
        } else {
            t.style.width = this._px_bar + "px";
            t.style.marginLeft = this._px_offset + "px";
        }
    };
};

/**
 *
 */
OK_Object_ScrollBar.prototype._set = function (force) {
    if (!force) {
        this.___SET_TM___ = ok.thread("ok.get('" + this.id + "')._set(1)");
        return;
    };

    //todo

};

OK_Object_ScrollBar.prototype.__mousedown = function (e, tm)
{
    window.clearTimeout(this.___MDTM___);
    if (!this.enabled) return;

    if (e == false) {
        e = this.___MDTE___;
    } else {
        var target = ok.client.ie ? e.srcElement : e.target;
        if (!target || target.id != this.id)
            return;
    };

    var box = ok.layout.get(ok.$(this.id));
    var up = ok.$(this.id + ":UP");
    var pos = this._vertical ? e.clientY - box.top - 16 : e.clientX - box.left - 16;

    if (pos < this._px_offset)
        this.setValue(this._value - this._large);
    else if (pos > this._px_offset + this._px_bar)
        this.setValue(this._value + this._large);
    else
        return;

    if (this._value < this._max && this._value > this._min) {
        this.___MDTE___ = {
            clientY:    e.clientY,
            clientX:    e.clientX
        };
        var id = this.id;
        this.___MDTM___ = window.setTimeout(function () {
            ok.get(id).__mousedown(false, 1);
        }, (tm == null) ? this.autorepeatstart : this.autorepeat);
        OK_Object_ScrollBar._doc_mouseup = function (e) {
            window.clearTimeout(ok.get(id).___MDTM___);
            ok.events.release('onmouseup', document, OK_Object_ScrollBar._doc_mouseup);
        };
        ok.events.capture("onmouseup", document, OK_Object_ScrollBar._doc_mouseup);
    };
};

OK_Object_ScrollBar.prototype._mousemove = function (e)
{
    var st = new Date().getTime();

    e.preventDefault();
    e.stopPropagation();

    if (this.bubble('mousemove')) {
        return;
    };

    this._px_scroll_pos = (this._vertical ? e.clientY : e.clientX) - this._px_scroll_min - this._px_scroll_start;
    this._px_scroll_percent = Math.round((this._px_scroll_pos * 100) / this._px_scroll_max);
    this._px_scroll_value = Math.round(((this._max - this._min) * this._px_scroll_percent) / 100);
    if (this._px_scroll_value < this._min) this._px_scroll_value = this._min;
    if (this._px_scroll_value > this._max) this._px_scroll_value = this._max;

    if (this._value != this._px_scroll_value)
    {
        this.setValue(this._px_scroll_value);
    };
};

/**
 *
 */
OK_Object_ScrollBar.prototype._mouseup = function (e)
{
    var t = ok.get(this.id + ":THUMB");

    t.setToggle(0);
    t.redraw();

    ok.events.release("onmousemove", document, OK_Object_ScrollBar._doc_mousemove, {capture: true});
    ok.events.release("onmouseup", document, OK_Object_ScrollBar._doc_mouseup, {capture: true});

    if (!ok.client.ie) {
        ok.events.release("onmouseout", document, OK_Object_ScrollBar._doc_mouseout, {capture: true});
    };

    ok.route({type: 'scrollend', source: this, value: this.getValue()}, this);
};

/**
 *
 */
OK_Object_ScrollBar.prototype.__beforeresize = function (e)
{
    this._px_total = 0;
    var _t = ok.$(this.id + ":THUMB");
    if (this._vertical) {
        _t.style.height = "16px";
    } else {
        _t.style.width = "16px";
    };
};


/**
 *
 */
OK_Object_ScrollBar.prototype.__resize = function (e)
{
    if (!this.isDisplayed()) {
        return;
    };

    var _s = ok.$(this.id);
    var _u = ok.$(this.id + ":UP");
    var _d = ok.$(this.id + ":DOWN");
    var _b = ok.$(this.id + ":BAR");
    var _t = ok.$(this.id + ":THUMB");

    if (ok.client.mobile || _s.clientWidth < 16 || _s.clientHeight < 16) {
        _u.style.display = "none";
        _d.style.display = "none";
    } else {
        _u.style.display = "";
        _d.style.display = "";
    };

    _s.style.background = ok.client.mobile ? "transparent" : "";

    if (this._vertical) {
        _s.style.width = (ok.client.mobile ? 6 : 16) + "px";
        _t.style.width = (ok.client.mobile ? 3 : 16) + "px";
        _b.style.height = (_s.clientHeight - _u.offsetHeight - _d.offsetHeight) + "px";
    } else {
        _s.style.height = (ok.client.mobile ? 6 : 16) + "px";
        _t.style.height = (ok.client.mobile ? 3 : 16) + "px";

        _b.style.top = "-" + _u.offsetHeight + "px";
        _b.style.left = _u.offsetWidth + "px";
        _b.style.width = (_s.clientWidth -_u.offsetWidth - _d.offsetWidth) + "px";

        _d.style.top = "-" + (_u.offsetHeight + _b.offsetHeight) + "px";
        _d.style.left = 0;
        _d.style.left = (_s.clientWidth - _d.offsetWidth) + "px";
    };

    this._calc();
};

/**
 *
 */
OK_Object_ScrollBar.prototype.__beforeload = function () {
    if (this._vertical) {
        var b = ok.$(this.id + ":THUMB");
        b.style.top = 0;
        b.style.left = 0;
    };
};
