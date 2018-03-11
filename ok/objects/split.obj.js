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
function OK_Object_Split (id, lead, size, min, max, barsize, state) {
    /**
     * @public
     * @readonly
     */
    this._type = "split";

    /**
     * @public
     * @readonly
     */
    this.id = id;

    /**
     * @public
     * @readonly
     */
    this.lead = lead;

    /**
     * @public
     * @readonly
     */
    this.size = size;

    /**
     * @public
     * @readonly
     */
    this.min = min;

    /**
     * @public
     * @readonly
     */
    this.max = max;

    /**
     * @public
     * @readonly
     */
    this.barsize = barsize;

    /**
     * @public
     * @readonly
     */
    this.state = state ? state : "default";

    /**
     *
     */
    this.mode = "default";

    this.tabindex = -1;
    this.register();
};

/** */
OK_Object_Split.prototype = new OK_Object;

/**
 * Closes the leading area of the object.
 */
OK_Object_Split.prototype.close = function ()
{
    var state = this.state;

    if (this.state !== "closed")
    {
        if (this.mode === "menu" && state === "default") {
            ok.fx.create({
                s: this,
                _s: ok.$(this.id + ":1"),
                _c: ok.$(this.id + ":CVR")
            }, function (delta) {
                this._id._s.style[ok.css.transformJS] = "translate3d(" + (-delta) + "%, 0, 0)";
                if (this._id._c) {
                    this._id._c.style.opacity = 1 - (delta / 100);
                };
            }, 0, 100, 240, { onfinish: function (e) {
                this._id.s.state = "closed";
                ok.layout.resize(this._id.s.id);
                this._id._s.style[ok.css.transformJS] = "";
            }}, null, "ease-out");
            return 1;
        };

        // --

        this.state = "closed";
        ok.layout.resize(this.id);
        return 1;
    };
    return 0;
};

OK_Object_Split.prototype.expand = function ()
{
    if (this.state !== "expanded") {
        this.state = "expanded";
        ok.layout.resize(this.id);
        return 1;
    };
    return 0;
};

/**
 * Opens the leading area of the object.
 */
OK_Object_Split.prototype.open = function ()
{
    return this.restore();
};

OK_Object_Split.prototype.restore = function ()
{
    var state = this.state, _s1;

    if (this.state !== "default")
    {
        this.state = "default";
        
        ok.layout.resize(this.id);

        // --

        if (this.mode === "menu" && state === "closed") {
            ok.fx.create({
                _s: ok.$(this.id + ":1"),
                _c: ok.$(this.id + ":CVR")
            }, function (delta) {
                this._id._s.style[ok.css.transformJS] = "translate3d(" + (-delta) + "%, 0, 0)";
                if (this._id._c) {
                    this._id._c.style.opacity = 1 - (delta / 100);
                };
            }, 100, 0, 240, { onfinish: function (e) {
                this._id._s.style[ok.css.transformJS] = "";
            }}, null, "ease-out");
        };

        // --

        return 1;
    };
    return 0;
};

/**
 *
 */
OK_Object_Split.prototype.resizeTo = function (size)
{
    if (this.size != size) {
        this.size = size;
        this.size = Math.max(this.size, this.min);
        this.size = this.max ? Math.min(this.size, this.max) : this.size;
        ok.layout.resize(this.id);
        return 1;
    };
    return 0;
};

// ------------------------------------------------------------------------- //

/**
 *
 */
OK_Object_Split.prototype.__beforeresize = function (e)
{
    e.source = this;
    this.bubble(e);
    return 1;
};

/**
 *
 *
 */
OK_Object_Split.prototype.__resize = function (e)
{
    var _s = ok.$(this.id),
        _s1 = ok.$(this.id + ":1"),
        _s2 = ok.$(this.id + ":2"),
        _b = ok.$(this.id + ":BAR"),
        _c   = ok.$(this.id + ":CVR"), c,
        __s1 = [], __b = [], __s2 = [], __c = [], size, len;

    // --

    size = this.size;
    if (matches = String(size).match(/^([0-9]+)%$/)) {
        len = this.lead == "left" || this.lead == "right" ? _s.clientWidth : _s.clientHeight;
        size = Math.floor(len * (matches[1] / 100));
        size = Math.max(size, this.min);
        size = this.max ? Math.min(size, this.max) : size;
    };

    // --

    __c = [0];

    switch (this.lead)
    {
        case "left":
            if (this.state == "closed") {
                __s1 =  [0];
                __b =   [0];
                __s2 =  [1, 0, 0, _s.clientWidth, _s.clientHeight];
            } else if (this.state == "expanded") {
                __s1 =  [1, 0, 0, _s.clientWidth, _s.clientHeight];
                __b =   [0];
                __s2 =  [0];
            } else {
                if (this.mode == "menu") {
                    __s1 =  [1, 0, 0, size, _s.clientHeight];
                    __b =   [0];
                    __s2 =  [1, 0, 0, _s.clientWidth, _s.clientHeight];
                    __c =   [1];
                } else {
                    __s1 =  [1, 0, 0, size, _s.clientHeight];
                    __b =   [1, 0, size, this.barsize, _s.clientHeight];
                    __s2 =  [1, 0, size + this.barsize, _s.clientWidth - size - this.barsize, _s.clientHeight];
                };
            };
            break;

        case "right":
            if (this.state == "closed") {
                __s1 =  [1, 0, 0, _s.clientWidth, _s.clientHeight];
                __b =   [0];
                __s2 =  [0];
            } else if (this.state == "expanded") {
                __s1 =  [0];
                __b =   [0];
                __s2 =  [1, 0, 0, _s.clientWidth, _s.clientHeight];
            } else {
                __s1 =  [1, 0, 0, _s.clientWidth - size - this.barsize, _s.clientHeight];
                __b =   [1, 0, _s.clientWidth - size - this.barsize, this.barsize, _s.clientHeight];
                __s2 =  [1, 0, _s.clientWidth - size, size, _s.clientHeight];
            };
            break;

        case "top":
            if (this.state == "closed") {
                __s1 =  [0];
                __b =   [0];
                __s2 =  [1, 0, 0, _s.clientWidth, _s.clientHeight];
            } else if (this.state == "expanded") {
                __s1 =  [1, 0, 0, _s.clientWidth, _s.clientHeight];
                __b =   [0];
                __s2 =  [0];
            } else {
                __s1 =  [1, 0, 0, _s.clientWidth, size];
                __b =   [1, size, 0, _s.clientWidth, this.barsize];
                __s2 =  [1, size + this.barsize, 0, _s.clientWidth, _s.clientHeight - size - this.barsize];
            };
            break;

        case "bottom":
            if (this.state == "closed") {
                __s1 =  [1, 0, 0, _s.clientWidth, _s.clientHeight];
                __b =   [0];
                __s2 =  [0];
            } else {
                __s1 =  [1, 0, 0, _s.clientWidth, _s.clientHeight - size - this.barsize];
                __b =   [1, _s.clientHeight - size - this.barsize, 0, _s.clientWidth, this.barsize];
                __s2 =  [1, _s.clientHeight - size, 0, _s.clientWidth, size];
            };
            break;
    };

    // --

    if (__s1[0])
    {
        if ((this.lead === "left" || this.lead === "top") && _s.lastChild !== _s1) {
            _s.appendChild(_s1);
        };

        // --

        _s1.style.top = __s1[1] + "px";
        _s1.style.left = __s1[2] + "px";
        _s1.style.width = __s1[3] + "px";
        _s1.style.height = __s1[4] + "px";
        _s1.style.display = "block";
        ok.layout.resize(_s1);
    } else {
        _s1.style.display = "";
    };

    if (__b[0]) {
        _b.style.top = __b[1] + "px";
        _b.style.left = __b[2] + "px";
        _b.style.width = __b[3] + "px";
        _b.style.height = __b[4] + "px";
        _b.style.display = "block";
        ok.layout.resize(_b);
    } else {
        _b.style.display = "";
    };

    if (__s2[0]) {
        _s2.style.top = __s2[1] + "px";
        _s2.style.left = __s2[2] + "px";
        _s2.style.width = __s2[3] + "px";
        _s2.style.height = __s2[4] + "px";
        _s2.style.display = "block";
        ok.layout.resize(_s2);
    } else {
        _s2.style.display = "";
    };

    if (__c[0])
    {
        if (!_c) {
            _c = document.createElement("DIV");
            _c.id = this.id + ":CVR";
            _c.className = "OK_SPLIT_CVR";
        };

        // --

        _s.insertBefore(_c, _s.lastChild);

        // --

        c = ok.get(_c.id);
        if (!c) {
            c = new OK_Object(_c.id);
            c._id = this.id;
            c.register();
            c.capture("mousedown");
            c.__mousedown = function (e) {
                var c = ok.get(this._id);
                if (!ok.route('beforecancel', c)) {
                    c.close();
                    ok.route('cancel', c);
                };
            };
            c.__touchdown = function (e) {
                var c = ok.get(this._id);
                if (!ok.route('beforecancel', c)) {
                    c.close();
                    ok.touch.clear();
                    ok.route('cancel', c);
                };
            };
        };
    } else if (_c) {
        ok.objects.removeAll(_c, 1);
        _c.parentNode.removeChild(_c);
    };

    // --

    e.source = this;
    this.bubble(e);
    return 1;
};
