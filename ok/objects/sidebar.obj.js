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
function OK_Object_SideBar (id, parent_id, transition, direction)
{
    /**
     *
     */
    this._type = "background";

    /**
     *
     */
    this.id = id;

    /**
     *
     */
    this.parent_id = parent_id || "";

    /**
     *
     */
    this.transition = transition;

    /**
     *
     */
    this.direction = direction;

    /**
     *
     */
    this.shown = 0;

    /**
     *
     */
    this.fx_duration = 180;

    /**
     *
     */
    this.cover = "auto";

    // --

    this.register();
};

/** */
OK_Object_SideBar.prototype = new OK_Object;

// --

/**
 *
 */
OK_Object_SideBar.prototype.cancel = function (callback)
{
    if (!ok.route('cancel', this)) {
        this.hide(callback);
    };
};

/**
 *
 */
OK_Object_SideBar.prototype.show = function (callback)
{
    var self = this,
        _self = ok.$(this.id),
        _cvr, cvr, _parent, parent, fx;

    if (!this.shown)
    {
        this.shown = 1;

        if (this.parent_id)
        {
            parent = ok.get(this.parent_id);
            _parent = ok.$(this.parent_id);
            _parent.parentNode.insertBefore(_self, _parent.nextSibling);
        };

        if (this.cover)
        {
            _cvr = document.createElement("DIV");
            _cvr.id = this.id + "_COVER";
            _cvr.className = _self.className + "_COVER";
            _self.parentNode.insertBefore(_cvr, _self);

            cvr = new OK_Object(_cvr.id);
            cvr.register();
            cvr.capture("mousedown");
            cvr.__mousedown = function (e) {
                if (!ok.route('beforecancel', self)) {
                    self.cancel();
                };
            };
            cvr.__touchdown = function (e) {
                if (!ok.route('beforecancel', self)) {
                    ok.touch.clear();
                    self.cancel();
                };
            };
        };

        // --

        if (self.direction === "left") {
            _self.style.left = "auto";
            _self.style.right = 0;
            _self.style.top = 0;
            _self.style.bottom = "auto";
        } else if (self.direction === "rigth") {
            _self.style.left = 0;
            _self.style.right = "auto";
            _self.style.top = 0;
            _self.style.bottom = "auto";
        } else if (self.direction === "top") {
            _self.style.left = 0;
            _self.style.right = "auto";
            _self.style.top = 0;
            _self.style.bottom = "auto";
        } else if (self.direction === "bottom") {
            _self.style.left = 0;
            _self.style.right = "auto";
            _self.style.top = "auto";
            _self.style.bottom = 0;
        };

        // --

        _self.style.display = "block";
        ok.layout.resize(_self.id);

        // --

        ok.route("beforeshow", this);

        // --

        ok.pause();
        fx = ok.fx.create("", function (delta)
        {
            var _o = self.direction === "left" || self.direction === "right" ? _self.offsetWidth : _self.offsetHeight,
                _d = _o * delta,
                _p = _parent,
                p = parent;

            if (_cvr) {
                _cvr.style.opacity = delta;
            };

            if (self.transition === "show")
            {
                _self.style.opacity = delta;
            }
            else if (self.transition === "slide")
            {
                if (self.direction === "left") {
                    _self.style[ok.css.transformJS] = "translate3d(" + (_o - _d) + "px, 0, 0)";
                } else if (self.direction === "rigth") {
                    _self.style[ok.css.transformJS] = "translate3d(" + (_d - _o) + "px, 0, 0)";
                } else if (self.direction === "top") {
                    _self.style[ok.css.transformJS] = "translate3d(0, " + (_d - _o) + "px, 0)";
                } else if (self.direction === "bottom") {
                    _self.style[ok.css.transformJS] = "translate3d(0, " + (_o - _d) + "px, 0)";
                };

                _o = 0;
                while (_p)
                {
                    if (self.direction === "left") {
                        _p.style[ok.css.transformJS] = "translate3d(" + (_d * -1 - _o) + "px, 0, 0)";
                    } else if (self.direction === "rigth") {
                        _p.style[ok.css.transformJS] = "translate3d(" + _d + "px, 0, 0)"
                    } else if (self.direction === "top") {
                        _p.style[ok.css.transformJS] = "translate3d(0, " + _d + "px, 0)";
                    } else if (self.direction === "bottom") {
                        _p.style[ok.css.transformJS] = "translate3d(0, " + (_d * -1 - _o) + "px, 0)";
                    };

                    _o += self.direction === "left" || self.direction === "right" ? _p.offsetWidth : _p.offsetHeight;
                    _p = null;
                    if (p && p.parent_id) {
                        _p = ok.$(p.parent_id);
                        p = ok.get(p.parent_id);
                    }
                };
            };
        }, 0, 1, this.fx_duration, {
            onfinish: function (e)
            {
                var callback = this.callback;

                ok.resume();
                ok.route("show", self);

                if (callback) {
                    window.setTimeout(function () {
                        ok.fn.callback(callback);
                    });
                };
            }
        }, null, "ease-out");
        fx.callback = callback;
        return;
    };

    // --

    ok.fn.callback(callback);
};

/**
 *
 */
OK_Object_SideBar.prototype.hide = function (callback)
{
    var self = this,
        _self = ok.$(this.id),
        _cvr, cvr, _parent, parent, fx;

    if (this.shown)
    {
        ok.route("beforehide", this);

        this.shown = 0;

        if (this.parent_id)
        {
            parent = ok.get(this.parent_id);
            _parent = ok.$(this.parent_id);
//          _parent.parentNode.insertBefore(_self, _parent.nextSibling);
        };

        if (this.cover) {
            _cvr = ok.$(this.id + "_COVER");
        };

        ok.pause();
        fx = ok.fx.create("", function (delta)
        {
            var _o = self.direction === "left" || self.direction === "right" ? _self.offsetWidth : _self.offsetHeight,
                _d = _o * delta,
                _p = _parent,
                p = parent;

            if (_cvr) {
                _cvr.style.opacity = delta;
            };

            // --

            if (self.transition === "show")
            {
                _self.style.opacity = delta;
            }
            else if (self.transition === "slide")
            {
                if (self.direction === "left") {
                    _self.style[ok.css.transformJS] = "translate3d(" + (_o - _d) + "px, 0, 0)";
                } else if (self.direction === "rigth") {
                    _self.style[ok.css.transformJS] = "translate3d(" + (_d - _o) + "px, 0, 0)";
                } else if (self.direction === "top") {
                    _self.style[ok.css.transformJS] = "translate3d(0, " + (_d - _o) + "px, 0)";
                } else if (self.direction === "bottom") {
                    _self.style[ok.css.transformJS] = "translate3d(0, " + (_o - _d) + "px, 0)";
                };

                _o = 0;
                while (_p)
                {
                    if (self.direction === "left") {
                        _p.style[ok.css.transformJS] = "translate3d(" + (_d * -1 - _o) + "px, 0, 0)";
                    } else if (self.direction === "rigth") {
                        _p.style[ok.css.transformJS] = "translate3d(" + _d + "px, 0, 0)"
                    } else if (self.direction === "top") {
                        _p.style[ok.css.transformJS] = "translate3d(0, " + _d + "px, 0)";
                    } else if (self.direction === "bottom") {
                        _p.style[ok.css.transformJS] = "translate3d(0, " + (_d * -1 - _o) + "px, 0)";
                    };

                    //~ _p.style[ok.css.transformJS] = self.direction === "left" ? "translate3d(" + (_d * -1 - _o) + "px, 0, 0)" : "translate3d(0, " + (_d * -1 - _o) + "px, 0)";

                    _o += self.direction === "left" || self.direction === "right" ? _p.offsetWidth : _p.offsetHeight;
                    _p = null;
                    if (p && p.parent_id) {
                        _p = ok.$(p.parent_id);
                        p = ok.get(p.parent_id);
                    }
                };
            };
        }, 1, 0, this.fx_duration, {
            onfinish: function (e)
            {
                var callback = this.callback;

                ok.resume();

                // --

                _self.style.display = "";
                if (_cvr) {
                    ok.objects.removeAll(_cvr, 1);
                    _cvr.parentNode.removeChild(_cvr);
                };

                // --

                ok.route("hide", self);

                // --

                if (callback) {
                    window.setTimeout(function () {
                        ok.fn.callback(callback);
                    });
                };
            }
        }, null, "ease-in");
        fx.callback = callback;
        return;
    };

    ok.fn.callback(callback);
};

/**
 *
 */
OK_Object_SideBar.prototype.close = function ()
{
    var _self = ok.$(this.id),
        _cvr = ok.$(this.id + "_COVER");

    if (_cvr) {
        ok.objects.removeAll(_cvr, 1);
        _self.parentNode.removeChild(_cvr);
    };

    ok.objects.removeAll(_self, 1);
    _self.parentNode.removeChild(_self);
};

/**
 *
 */
OK_Object_SideBar.prototype.__resize = function ()
{
    var self = this,
        _self = ok.$(this.id),
        _cvr, cvr, _parent, parent,
        _o, _d, _p, p;

    if (this.parent_id) {
        parent = ok.get(this.parent_id);
        _parent = ok.$(this.parent_id);
    };

    _cvr = ok.$(this.id + "_COVER");

    _o = self.direction === "left" || self.direction === "right" ? _self.offsetWidth : _self.offsetHeight,
    _d = _o,
    _p = _parent,
    p = parent;

    if (self.direction === "left") {
        _self.style[ok.css.transformJS] = "translate3d(" + (_o - _d) + "px, 0, 0)";
    } else if (self.direction === "rigth") {
        _self.style[ok.css.transformJS] = "translate3d(" + (_d - _o) + "px, 0, 0)";
    } else if (self.direction === "top") {
        _self.style[ok.css.transformJS] = "translate3d(0, " + (_d - _o) + "px, 0)";
    } else if (self.direction === "bottom") {
        _self.style[ok.css.transformJS] = "translate3d(0, " + (_o - _d) + "px, 0)";
    };

    _o = 0;
    while (_p)
    {
        if (self.direction === "left") {
            _p.style[ok.css.transformJS] = "translate3d(" + (_d * -1 - _o) + "px, 0, 0)";
        } else if (self.direction === "rigth") {
            _p.style[ok.css.transformJS] = "translate3d(" + _d + "px, 0, 0)"
        } else if (self.direction === "top") {
            _p.style[ok.css.transformJS] = "translate3d(0, " + _d + "px, 0)";
        } else if (self.direction === "bottom") {
            _p.style[ok.css.transformJS] = "translate3d(0, " + (_d * -1 - _o) + "px, 0)";
        };

        _o += self.direction === "left" || self.direction === "right" ? _p.offsetWidth : _p.offsetHeight;
        _p = null;
        if (p && p.parent_id) {
            _p = ok.$(p.parent_id);
            p = ok.get(p.parent_id);
        };
    };
};

