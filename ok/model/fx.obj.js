/**
 * OK v.5 - okay-os.com
 *
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
 * @package System
 */
ok.fx = {
    /**
     *
     */
    easing: {
        "linear":       [0,0, 1, 1],
        "zx-back":  [0,0, 0.265, 1.275],
        "ease":         [.25, .1, .25, 1],
        "ease-in":      [.42, 0, 1, 1],
        "ease-out":     [0, 0, .58, 1],
        "ease-in-out":  [.42, 0, .58, 1],
        "ease-in-quad": [0.550, 0.085, 0.680, 0.530],
        "ease-in-cubic": [0.550, 0.055, 0.675, 0.190],
        "ease-in-quart": [0.895, 0.030, 0.685, 0.220],
        "ease-in-quint": [0.755, 0.050, 0.855, 0.060],
        "ease-in-sine": [0.470, 0.000, 0.745, 0.715],
        "ease-in-expo": [0.950, 0.050, 0.795, 0.035],
        "ease-in-circ": [0.600, 0.040, 0.980, 0.335],
        "ease-in-back": [0.600, -0.280, 0.735, 0.045],
        "ease-out-quad": [0.250, 0.460, 0.450, 0.940],
        "ease-out-cubic": [0.215, 0.610, 0.355, 1.000],
        "ease-out-quart": [0.165, 0.840, 0.440, 1.000],
        "ease-out-quint": [0.230, 1.000, 0.320, 1.000],
        "ease-out-sine": [0.390, 0.575, 0.565, 1.000],
        "ease-out-expo": [0.190, 1.000, 0.220, 1.000],
        "ease-out-circ": [0.075, 0.820, 0.165, 1.000],
        "ease-out-back": [0.175, 0.885, 0.320, 1.275],
        "ease-in-out-quad": [0.455, 0.030, 0.515, 0.955],
        "ease-in-out-cubic": [0.645, 0.045, 0.355, 1.000],
        "ease-in-out-quart": [0.770, 0.000, 0.175, 1.000],
        "ease-in-out-quint": [0.860, 0.000, 0.070, 1.000],
        "ease-in-out-sine": [0.445, 0.050, 0.550, 0.950],
        "ease-in-out-expo": [1.000, 0.000, 0.000, 1.000],
        "ease-in-out-circ": [0.785, 0.135, 0.150, 0.860],
        "ease-in-out-back": [0.680, -0.550, 0.265, 1.550]
    },

    /**
     *
     */
    ease: "linear",

    /**
     * Sets or retrieves the default frame rate.
     * @type int
     */
    fps: 60,

    /**
     * Sets or retrieves the default duration of the effect.
     * @type int
     */
    duration: 500,

    /** */
    _queue: [],

    /** */
    __FX__: null,

    /**
     * Creates a new special effect and returns a reference to it.
     * @param {string} id The string identifying the effect.
     * @param {string} type The property that will be modified for the duration of the effect.
     * @param {int} from The initial value of the type property.
     * @param {int} to The final value of the type property.
     * @param {int} duration
     * @param {object} events
     * @return {OK_FX} Reference to the OK_FX object.
     */
    create: function (id, type, from, to, duration, events, ease) {
        var fx = new OK_FX();

        ease = ease && this.easing[ease] ? this.easing[ease] : this.easing[this.ease];
        duration = duration && parseInt(duration) ? duration : this.duration;

        if (events) for (var p in events) if (ok.fn.in_array(p, ["oncancel", "onfinish", "onstop"]))
            if (typeof events[p] == "function")
                fx[p] = events[p];
            else if (typeof events[p] == "string")
                fx[p] = new Function("e", events[p]);

        fx._start(id, type, from, to, duration, this.fps, this.bezier(ease[0], ease[1], ease[2], ease[3]));
        this._next();
        return fx;
    },

    /**
     *
     */
    current: function (start, end, delta)
    {
        return ((end - start) * delta) + start;
    },

    /**
     *
     */
    apply: function (_node, type, start, end, delta)
    {
        var node, current, rc, _start, _end, _type;

        if (typeof _node == "string") {
            _node = ok.$(_node);
        };

        if (type == "color" || type == "background-color")
        {
            if (typeof start == "string") {
                start = ok.fn.hex2rgba(start);
            };
            if (typeof end == "string") {
                end = ok.fn.hex2rgba(end);
            };
            current = {
                red: Math.round(this.current(start.red, end.red, delta)),
                green: Math.round(this.current(start.green, end.green, delta)),
                blue: Math.round(this.current(start.blue, end.blue, delta)),
                alpha: 1
            };

            _type = type == "color" ? "color" : "backgroundColor";
            _node.style[_type] = ok.fn.rgba2css(current);
            return 1;
        };

        node = ok.get(_node.id);
        current = this.current(start, end, delta);
        rc = Math.round(current);
        
        if (_node) {
            switch (type) {
                case "opacity":
                    _node.style.opacity = current;
                    break;
                case "top":
                    _node.style.top = Math.round(current) + "px";
                    if (node && node._type == "dialog") {
                        node.top = rc;
                    };
                    break;
                case "left":
                    _node.style.left = Math.round(current) + "px";
                    if (node && node._type == "dialog") {
                        node.left = rc;
                    };
                    break;
                case "right":
                    _node.style.right = Math.round(current) + "px";
                    if (node && node._type == "dialog") {
                        node.right = rc;
                    };
                    break;
                case "bottom":
                    _node.style.bottom = Math.round(current) + "px";
                    if (node && node._type == "dialog") {
                        node.bottom = rc;
                    };
                    break;
                case "width":
                    _node.style.width = Math.round(current) + "px";
                    if (node && node._type == "dialog") {
                        node.width = rc;
                    };
                    break;
                case "height":
                    _node.style.height = Math.round(current) + "px";
                    if (node && node._type == "dialog") {
                        node.height = rc;
                    };
                    break;
                case "scrollLeft":
                    _node.scrollLeft = Math.round(current);
                    break;
                case "scrollTop":
                    _node.scrollTop = Math.round(current);
                    break;
            };
            return 1;
        };
        return 0;
    },

    bezier: function (p1, p2, p3, p4)
    {
        var Cx = 3 * p1,
            Bx = 3 * (p3 - p1) - Cx,
            Ax = 1 - Cx - Bx,
            Cy = 3 * p2,
            By = 3 * (p4 - p2) - Cy,
            Ay = 1 - Cy - By;

        function bX(t) { return t * (Cx + t * (Bx + t * Ax)); };
        function bY(t) { return t * (Cy + t * (By + t * Ay)); };
        function bXD(t) { return Cx + t * (2*Bx + 3*Ax * t); };

        function fX(t) {
            var x = t, i = 0, z;

            while (i < 5) {
                z = bX(x) - t;
                if (Math.abs(z) < 1e-3) { break; };
                x = x - z / bXD(x);
                i++;
            };
            return x;
        };

        return function (t) {
            return bY(fX(t));
        };
    },

    // --

    _next: function ()
    {
        if (!this.__FX__) {
            this.__FX__ = ok.fn.requestAnimationFrame(function () {
                ok.fx.__FX__ = null;
                ok.fx._step();
            });
        };
    },

    _step: function ()
    {
        var fx, next = 0, count = 0;

        for (fx in this._queue) if (this._queue.hasOwnProperty(fx)) {
            if (this._queue[fx] instanceof OK_FX) {
                count++;
                if (this._queue[fx]._step()) {
                    next++;
                };
            };
        };

        if (next) {
            this._next();
        };
    }
};

/**
 * @class
 * @package System
 *
 * @todo add .stop method
 */
function OK_FX ()
{
    this._id = null;
    this._type = null;
    this._from = null;
    this._to = null;
    this._fps = 50;
    this._duration = 500;
    this._busy = 0;
    this._canceled = 0;
    this._finished = 0;
    this._stopped = 0;
    this._current = null;
    this._delta = 0;
    this._timeout = null;
    this._time = null;
    this._index = null;
};

/**
 *
 */
OK_FX.prototype.cancel = function ()
{
    this._canceled = 1;
};

/**
 *
 */
OK_FX.prototype.finish = function ()
{
    this._set(1);
    this._stop();
};

/**
 *
 */
OK_FX.prototype.stop = function ()
{
    this._stopped = 1;
    this._stop();
};

/**
 *
 */
OK_FX.prototype.isCanceled = function ()
{
    return this._canceled;
};

/**
 *
 */
OK_FX.prototype.isFinished = function ()
{
    return this._finished;
};

/**
 *
 */
OK_FX.prototype._start = function (id, type, from, to, duration, fps, ease)
{
    this._id = id;
    this._index = ok.uniqid();
    ok.fx._queue[this._index] = this;

    this._type = type;
    this._from = from;
    this._to = to;
    this._ease = ease;
    this._duration = duration || this._duration;
    this._fps = fps || this._fps;
    this._time = new Date().getTime();
    this._canceled = 0;

    this._set(0);
};

/**
 *
 */
OK_FX.prototype._step = function ()
{
    var time, delta;
    
    if (this._canceled) {
        this._set(0);
        this._stop();
        return 0;
    };

    time = new Date().getTime();
    if (time < this._time + this._duration)
    {
        delta = (time  - this._time) / this._duration;
        this._set(delta);
        return 1;
    }
    else
    {
        this._set(1);
        this._stop();
    };

    return 0;
};

/**
 *
 */
OK_FX.prototype._set = function (delta)
{
    this._delta = this._ease(delta);
    this._current = ((this._to - this._from) * this._delta) + this._from;

    if (typeof this._type == "function") {
        this._type(this._current);
        return;
    };

    var o = typeof this._id == "object" ? this._id : ok.$(this._id);
    if (!o) {
        ok.route("error", this);
        return;
    };

    if (this._type == 'scrollLeft' || this._type == 'scrollTop') {
        o[this._type] = this._current;
    };

    if (this._type == "top" || this._type == "left" || this._type == "right" || this._type == "bottom" || this._type == "width" || this._type == "height") {
        this._current += "px";
    } else if (this._type == "color" || this._type == "background-color") {
        ok.fx.apply(o, this._type, this._from, this._to, this._delta);
        return;
    };

    o.style[this._type] = this._current;
};

/**
 *
 *
 */
OK_FX.prototype._stop = function ()
{
    if (!this._stopped && !this._canceled) {
        this._finished = 1;
    };

    delete ok.fx._queue[this._index];

    if (this._canceled) {
        ok.route({type:"cancel"}, this);
    } else if (this._stopped) {
        ok.route({type:"stop"}, this);
    } else {
        ok.route({type:"finish"}, this);
    };
};

