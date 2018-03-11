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
 */
function OK_Object_ScrollBox(id, tabindex, overflow)
{
    /**
     * @public
     * @readonly
     */
    this._type = "scrollbox";

    /**
     * @public
     * @readonly
     */
    this.id = id;

    /**
     * @public
     * @readonly
     */
    this.tabindex = tabindex;

    /**
     * @public
     * @readonly
     */
    this.overflow = overflow;

    // --

    this.left = 0;
    this.top = 0;

    this._left = 0;
    this._top = 0;

    this.bounceX = 0;
    this.bounceY = 120;

    this.forceVScroll = 0;

    // --

    this.register();
    this.capture("mousedown");
    this.capture("DOMMouseScroll");
    this.capture("mousewheel");

    // --

    var v = ok.get(this.id + ":VSCROLL");
    v._id = this.id;
    v.onscroll = function () {
        ok.get(this._id).top = this.getValue();
        ok.route("scroll", this._id);
    };

    var h = ok.get(this.id + ":HSCROLL");
    h._id = this.id;
    h.onscroll = function () {
        ok.get(this._id).left = this.getValue();
        ok.route("scroll", this._id);
    };
};

/** */
OK_Object_ScrollBox.prototype = new OK_Object;

/**
 *
 */
OK_Object_ScrollBox.prototype.clear = function ()
{
    var _d = ok.$(this.id + ":DATA");

    this.top = 0;
    this.left = 0;
    this._left = 0;
    this._top = 0;

    _d.style[ok.css.transformJS] = "";
    ok.objects.removeAll(_d);
    _d.innerHTML = "";

    ok.layout.resize(this.id);
};

/**
 *
 */
OK_Object_ScrollBox.prototype.setHTML = function (html)
{
    var _c = ok.$(this.id + ":DATA");

    this.left = 0;
    this.top = 0;
    this._left = 0;
    this._top = 0;

    _c.style[ok.css.transformJS] = "";
    ok.objects.removeAll(_c);
    _c.innerHTML = html;

    ok.layout.resize(this.id);
};

/**
 *
 */
OK_Object_ScrollBox.prototype.__focus = function (e)
{
    // ok.$(this.id).style.outline = "1px dotted " + ok.colors.border;
    this.bubble(e);
};

/**
 *
 */
OK_Object_ScrollBox.prototype.__blur = function (e)
{
    // ok.$(this.id).style.outline = "";
    this.bubble(e);
};

/**
 *
 */
OK_Object_ScrollBox.prototype.__keydown = function (e)
{
    var vsc = ok.get(this.id + ":VSCROLL"),
        key = ok.kb.key(e);

    switch (key) {
        case 33:    // Page Up
            vsc.setValue(vsc.getValue() - vsc._large);
            break;
        case 32:    // Space
        case 34:    // Page Down
            vsc.setValue(vsc.getValue() + vsc._large);
            break;
        case 35:    // End
            vsc.setValue(vsc._max);
            break;
        case 36:    // Home
            vsc.setValue(vsc._min);
            break;
        case 38:    // Key Up
            vsc.setValue(vsc.getValue() - vsc._small);
            break;
        case 40:    // Key Down
            vsc.setValue(vsc.getValue() + vsc._small);
            break;
    };
};

/**
 *
 */
OK_Object_ScrollBox.prototype.__mousedown = function (e)
{
    if (this.bubble(e)) {
        return 1;
    };

    this.focus();
};

/**
 *
 */
OK_Object_ScrollBox.prototype.__DOMMouseScroll = function (e)
{
    var delta = e.detail,
        vsc = ok.get(this.id + ":VSCROLL");

    vsc.setValue(vsc.getValue() + vsc._small * delta);
};

/**
 *
 */
OK_Object_ScrollBox.prototype.__mousewheel = function (e)
{
    var delta = Math.round(-1 * (e.wheelDelta / 40)),
    vsc = ok.get(this.id + ":VSCROLL");

    vsc.setValue(vsc.getValue() + vsc._small * delta);
};

// --

/**
 *
 */
OK_Object_ScrollBox.prototype.__beforeresize = function (e)
{
    this.bubble(e);
    return 1;
};

/**
 *
 * @todo hscrollbar
 */
OK_Object_ScrollBox.prototype.__resize = function (e)
{
    var _c = ok.$(this.id),
        _s = ok.$(this.id + ":DATA"),
        _sv = ok.$(this.id + ":VSCROLL"),
        _sh = ok.$(this.id + ":HSCROLL"),
        _br = ok.$(this.id + ":RIGHT"),
        _bl = ok.$(this.id + ":LEFT"), _i, v;

    // --
    
    this.width = _c.clientWidth;
    this.height = _c.clientHeight;

    _s.style.height = "";
    _s.style.width = "";
    _s.style.left = "";

    ok.layout.resize(_s);

    this._hscroll = 0;
    this._vscroll = 0;
    this._left = 0;
    this._top = 0;

    if (!ok.client.mobile && this.forceVScroll) {
        this.vscroll = 1;
        _s.style.width = _s.scrollWidth - 16 + "px";
    }  else {
    }

    _s.style.width = _s.scrollWidth + "px";
    _s.style.height = _s.scrollHeight + "px";

    // --

    if (ok.client.mobile) {
        this._hscroll = _s.offsetWidth > _c.clientWidth;
        this._vscroll = _s.offsetHeight > _c.clientHeight;
    } else {
        for (var i = 0; i < 2; i++) {
            if (!this._hscroll && _s.offsetWidth > _c.clientWidth) {
                this._hscroll = 1;
                _s.style.height = (_c.clientHeight - 16) + "px";
                ok.layout.resize(_s);
                _s.style.width = _s.scrollWidth + "px";
                _s.style.height = _s.scrollHeight + "px";
            };

            if (!this._vscroll && (_s.offsetHeight > _c.clientHeight || (!ok.client.mobile && this.forceVScroll))) {
                this._vscroll = 1;
                _s.style.width = (_c.clientWidth - 16) + "px";
                ok.layout.resize(_s);
                _s.style.width = _s.scrollWidth + "px";
                _s.style.height = _s.scrollHeight + "px";
            };
        };
    };

    // --

    if (this._vscroll)
    {
        this._top = _s.offsetHeight - _c.clientHeight;
        if (this._hscroll && !ok.client.mobile) {
            this._left += 16;
        };

        v = ok.get(this.id + ":VSCROLL");
        v.set(this.top, 0, this._top, 16, _c.clientHeight);

        _sv.style.height = _c.offsetHeight - (this._hscroll && !ok.client.mobile ? 16 : 0) + "px";
        _sv.style.bottom = "auto";
        _sv.style.left = "auto";
        _sv.style.top = 0;
        _sv.style.right = 0;
        _sv.style.opacity = 0;
        _sv.style[ok.css.transitionJS] = "opacity .25s ease-in-out";
        _sv.style.display = "block";
        ok.layout.resize(_sv);
        if (!ok.client.mobile) {
            _sv.style.opacity = 1;
        };
    } else {
        this._top = 0;
        _sv.style.display = "none";
    };

    if (this._hscroll)
    {
        this._left = _s.offsetWidth - _c.clientWidth;
        if (this._vscroll && !ok.client.mobile) {
            this._left += 16;
        };

        h = ok.get(this.id + ":HSCROLL");
        h.set(this.left, 0, this._left, 16, _c.clientWidth);

        _sh.style.width = _c.offsetWidth - (this._vscroll && !ok.client.mobile ? 16 : 0) + "px";
        _sh.style.left = 0;
        _sh.style.right = "auto";
        _sh.style.top = "auto";
        _sh.style.bottom = 0;
        _sh.style.opacity = 0;
        _sh.style[ok.css.transitionJS] = "opacity .25s ease-in-out";
        _sh.style.display = "block";
        ok.layout.resize(_sh);
        if (!ok.client.mobile) {
            _sh.style.opacity = 1;
        };
    } else {
        this._left = 0;
        _sh.style.display = "none";
    };

    // --

    if (this.top > this._top) {
        this.top = this._top;
    };

    _s.style[ok.css.transformJS] = "translate3d(" + (this.left * -1 + "px") + ", " + (this.top * -1 + "px") + ", 0)";

    v = _c.clientWidth - (!ok.client.mobile && this.vscroll ? 16 : 0);
    //~ if (_s.offsetWidth < v) {
        //~ _s.style.left = ((v - _s.offsetWidth) / 2) + "px";
    //~ };

    // --

    for (var i = 0, c, cs = ok.objects.scan(_s), l=cs.length; i < l; i++)
    {
        c = ok.get(cs[i]);
        if (!c._scid && !ok.fn.isObjectNode(ok.$(c.id), ["slideshow", "calendar"]))
        {
            c._scid = this.id;
            c.__swipe = function (e) {
                return ok.route(e, this._scid);
            };
            c.__swiping = function (e) {
                if (this._type == "button" && this.down || this.over) {
                    this.down = false;
                    this.over = false;
                    this.redraw();
                };

                return ok.route(e, this._scid);
            };
            c.__swipekinetics = function (e) {
                return ok.route(e, this._scid);
            };
            c.__swipekineticsend = function (e) {
                return ok.route(e, this._scid);
            };
        };
    };

    // --

    this.bubble(e);
    return 1;
};

// --

/**
 *
 */
OK_Object_ScrollBox.prototype.__swipe = function (e)
{
    if (e.gesture.fingers === 1)
    {
        switch (e.gesture.swipe.lockDirection)
        {
            case "up":
            case "down":
                if (this.top < 0 || this.top > this._top)
                {
                    ok.$(this.id + ":VSCROLL").style.opacity = 0;

                    // --

                    ok.pause();
                    ok.fx.create(this.id, function (delta)
                    {
                        var c = ok.get(this._id),
                            _c = ok.$(this._id + ":DATA");

                        c.top = delta;
                        _c.style[ok.css.transformJS] = "translate3d(" + (c.left * -1 + "px") + ", " + (c.top * -1 + "px") + ", 0)";

                        ok.events.bubble({type: "scroll", source: this, top: c.top, left: c.left}, c.id);

                    }, this.top, this.top > this._top ? this._top : 0, 180, { onfinish: function (e) {
                        ok.resume();
                    }}, null, "ease-out");
                    return;
                };
                break;
            case "left":
            case "right":
                if (this.left < 0 || this.left > this._left)
                {
                    ok.$(this.id + ":HSCROLL").style.opacity = 0;

                    // --

                    ok.pause();
                    ok.fx.create(this.id, function (delta)
                    {
                        var c = ok.get(this._id),
                            _c = ok.$(this._id + ":DATA");

                        c.left = delta;
                        _c.style[ok.css.transformJS] = "translate3d(" + (c.left * -1 + "px") + ", " + (c.top * -1 + "px") + ", 0)";

                        ok.events.bubble({type: "scroll", source: this, top: c.top, left: c.left}, c.id);

                    }, this.left, this.left > this._left ? this._left : 0, 180, { onfinish: function (e) {
                        ok.resume();
                    }}, null, "ease-out");
                    return;
                };

                break;
        };

        return 1;
    };
};

/**
 *
 */
OK_Object_ScrollBox.prototype.__swipekinetics = function (e)
{
    var vsc = ok.get(this.id + ":VSCROLL"),
        hsc = ok.get(this.id + ":HSCROLL"),
        _s = ok.$(this.id + ":DATA"),
        left = this.left,
        top = this.top;

    if (e.gesture.fingers === 1)
    {
        switch (e.gesture.swipe.lockDirection)
        {
            case "up":
            case "down":
                ok.$(this.id + ":VSCROLL").style.opacity = 1;

                top -= e.gesture.swipe.deltaY;

                if (this.bounceY) {
                    if (top < 0 && top > -this.bounceY) {
                        top += e.gesture.swipe.deltaY * 0.5;
                    };

                    top = Math.max(top, -this.bounceY);
                    top = Math.min(top, this._top + this.bounceY);
                } else {
                    top = Math.max(top, 0);
                    top = Math.min(top, this._top);
                };

                // --

                this.top = top;
                _s.style[ok.css.transformJS] = "translate3d(" + (this.left * -1 + "px") + ", " + (this.top * -1 + "px") + ", 0)";
                vsc.setValue(this.top, 1);

                // --

                if ((this.bounceY && top == -this.bounceY || top == this._top + this.bounceY) || (!this.bounceY && top == 0 || top == this._top)) {
                    ok.touch.clear();
                    e.type = "swipekineticsend";
                    ok.route(e, this);
                } else {
                    ok.events.bubble({type: "scroll", source: this, top: this.top, left: this.left}, this.id);
                };

                break;

            case "left":
            case "right":
                ok.$(this.id + ":HSCROLL").style.opacity = 1;

                left -= e.gesture.swipe.deltaX;

                if (this.bounceX) {
                    if (left < 0 && left > -this.bounceX) {
                        left += e.gesture.swipe.deltaX * 0.5;
                    };

                    left = Math.max(left, -this.bounceX);
                    left = Math.min(left, this._left + this.bounceX);
                } else {
                    left = Math.max(left, 0);
                    left = Math.min(left, this._left);
                };

                // --

                this.left = left;
                _s.style[ok.css.transformJS] = "translate3d(" + (this.left * -1 + "px") + ", " + (this.top * -1 + "px") + ", 0)";
                hsc.setValue(this.left, 1);

                // --

                if ((this.bounceX && left == -this.bounceX || left == this._left + this.bounceX) || (!this.bounceX && left == 0 || left == this._left)) {
                    ok.touch.clear();
                    e.type = "swipekineticsend";
                    ok.route(e, this);
                } else {
                    ok.events.bubble({type: "scroll", source: this, left: this.left, top: this.top}, this.id);
                };
                break;
        };
    };
};

/**
 *
 */
OK_Object_ScrollBox.prototype.__swipekineticsend = function (e)
{
    ok.$(this.id + ":VSCROLL").style.opacity = 0;
    ok.$(this.id + ":HSCROLL").style.opacity = 0;

    // --

    if (this.top < 0 || this.top > this._top || this.left < 0 || this.left > this._left)
    {
        this.__top = this.top;
        this.__left = this.left;

        ok.pause();
        fx = ok.fx.create(this.id, function (delta)
        {
            var c = ok.get(this._id),
                _c = ok.$(this._id + ":DATA");

            c.top = ok.fx.current(c.__top, c.__top > c._top ? c._top : 0, delta);
            c.left = ok.fx.current(c.__left, c.__left > c._left ? c._left : 0, delta);

            _c.style[ok.css.transformJS] = "translate3d(" + (c.left * -1 + "px") + ", " + (c.top * -1 + "px") + ", 0)";

            ok.events.bubble({type: "scroll", source: this, top: c.top, left: c.left}, c.id);

        }, 0, 1, 180, { onfinish: function (e) {
            ok.resume();
        }}, null, "ease-out");
    };
};

/**
 *
 */
OK_Object_ScrollBox.prototype.__swiping = function (e)
{
    var vsc = ok.get(this.id + ":VSCROLL"),
        hsc = ok.get(this.id + ":HSCROLL"),
        _s = ok.$(this.id + ":DATA"),
        left = this.left,
        top = this.top;

    if (e.gesture.fingers === 1)
    {
        if (!e.gesture.swipe.lockDirection) {
            e.gesture.swipe.lockDirection = e.gesture.swipe.direction;
        };

        switch (e.gesture.swipe.lockDirection)
        {
            case "up":
            case "down":
                ok.$(this.id + ":VSCROLL").style.opacity = 1;

                top -= e.gesture.swipe.deltaY;
                if (this.bounceY) {
                    if (top < 0 && top > -this.bounceY) {
                        top += e.gesture.swipe.deltaY * 0.5;
                    };
                    top = Math.max(top, -this.bounceY);
                    top = Math.min(top, this._top + this.bounceY);
                } else {
                    top = Math.max(top, 0);
                    top = Math.min(top, this._top);
                };

                break;

            case "left":
            case "right":
                ok.$(this.id + ":HSCROLL").style.opacity = 1;

                left -= e.gesture.swipe.deltaX;
                if (this.bounceX) {
                    if (left < 0 && left > -this.bounceX) {
                        left += e.gesture.swipe.deltaX * 0.5;
                    };
                    left = Math.max(left, -this.bounceX);
                    left = Math.min(left, this._left + this.bounceX);
                } else {
                    left = Math.max(left, 0);
                    left = Math.min(left, this._left);
                };

                break;
        };
    };

    if (left !== this.left || top !== this.top)
    {
        this.left = left;
        this.top = top;

        _s.style[ok.css.transformJS] = "translate3d(" + (this.left * -1 + "px") + ", " + (this.top * -1 + "px") + ", 0)";
        ok.events.bubble({type: "scroll", source: this, top: this.top, left: this.left}, this.id);
        vsc.setValue(this.top, 1);
        hsc.setValue(this.left, 1);
    };
};

/**
 *
 */
OK_Object_ScrollBox.prototype.__scroll = function (e)
{
    var _c = ok.$(this.id + ":DATA");

    _c.style[ok.css.transformJS] = "translate3d(" + (this.left * -1 + "px") + ", " + (this.top * -1 + "px") + ", 0)";

    e.source = this;
    e.left = this.left;
    e.top = this.top;
    this.bubble(e);
};

