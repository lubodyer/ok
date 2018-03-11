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
 */
function OK_Touch ()
{
    this._touches = [];
    this.touches = [];
    this.gesture = {};
    this.gestures = ["doubletap", "hold", "swipe", "swiping", "swipeleft", "swiperight", "swipeup", "swipedown", "rotate", "rotating", "rotateleft", "rotateright", "pinch", "pinching", "pinchin", "pinchout", "drag", "dragleft", "dragright", "dragup", "dragdown"];

    this.delayHold = 750;
    this.delayDTap = 250;
    this.kMaxVelocity = 2000;
    this.kMinVelocity = 100;
    this.kDecelerate = 800;
    this.swipeMin = 8;

    this.__TAP_TIMEOUT__ = void 0;
    this.__KINETICS_TIMEOUT__ = void 0;
};

/**
 *
 */
OK_Touch.prototype.clear = function ()
{
    if (this.gesture.node && (node = ok.fn.isObject(this.gesture.node))) {
        ok.route({type: "touchout", touches: this._touches}, node);
    };

    this._touches = [];
    this.touches = [];
    this.gesture = {};
    window.clearTimeout(this.__TAP_TIMEOUT__);
    this.__KINETICS_TIMEOUT__ = ok.fn.cancelAnimationFrame(this.__KINETICS_TIMEOUT__);
};

/**
 *
 */
OK_Touch.prototype._isSwipe = function ()
{
    var h, v, r = 0;
    if (this.gesture.swipe) {
        return 1;
    };
    if (this.touches[0]) {
        h = Math.abs(this._touches[0].x - this.touches[0].x) > this.swipeMin;
        v = Math.abs(this._touches[0].y - this.touches[0].y) > this.swipeMin;
        r = this.gesture.node && (h || v);
    };
    return r;
};

/**
 *
 */
OK_Touch.prototype._getDirection = function (x1, x2, y1, y2)
{
    return Math.abs(x1 - x2) > Math.abs(y1 - y2) ? (x1 - x2 > 0 ? "left" : "right") : (y1 - y2 > 0 ? "up" : "down");
};

/**
 *
 */
OK_Touch.prototype.__action = function (e)
{
    var node, r;

    if (ok.events.enabled)
    {
        e.type = e.gesture;
        e.gesture = ok.fn.clone(this.gesture);
        e.touches = this.touches;
        e._touches = this._touches;

        r = ok.events.bubble(e, this);

        if (!r && this.gesture['node'] && (node = ok.fn.isObject(this.gesture.node))) {
            return ok.route(e, node);
        };

        return r;
    };
};

/**
 *
 */
OK_Touch.prototype.__swipekinetics = function (e)
{
    var step, delta = (Date.now() - this.gesture.now) / 1000;
    this.gesture['now'] = Date.now();

    step = this.kDecelerate * delta;
    if (this.gesture.swipe.velocityX < step && this.gesture.swipe.velocityX > -step && this.gesture.swipe.velocityY < step && this.gesture.swipe.velocityY > -step) {
        this.gesture.swipe.velocityX = 0;
        this.gesture.swipe.velocityY = 0;
        ok.route({type: "action", gesture: "swipekineticsend"}, this);
        this.clear();
    } else {
        this.gesture.swipe.kinetics = 1;
        this.gesture.swipe.x2 += Math.floor(this.gesture.swipe.velocityX * delta);
        this.gesture.swipe.y2 += Math.floor(this.gesture.swipe.velocityY * delta);
        this.gesture.swipe.direction = this._getDirection(this.gesture.swipe.x1, this.gesture.swipe.x2, this.gesture.swipe.y1, this.gesture.swipe.y2);
        this.gesture.swipe._distanceX = this.gesture.swipe.distanceX;
        this.gesture.swipe._distanceY = this.gesture.swipe.distanceY;
        this.gesture.swipe.distanceX = this.gesture.swipe.x2 - this.gesture.swipe.x1;
        this.gesture.swipe.distanceY = this.gesture.swipe.y2 - this.gesture.swipe.y1;
        this.gesture.swipe.distance = ok.fn.distance(this._touches[0].x, this._touches[0].y, this.touches[0].x, this.touches[0].y);
        this.gesture.swipe.deltaX = this.gesture.swipe.distanceX - this.gesture.swipe._distanceX;
        this.gesture.swipe.deltaY = this.gesture.swipe.distanceY - this.gesture.swipe._distanceY;

        ok.route({type: "action", gesture: "swipekinetics"}, this);

        if (this.gesture.swipe) {
            this.gesture.swipe.velocityX += this.gesture.swipe.velocityX < 0 ? step : -step;
            this.gesture.swipe.velocityY += this.gesture.swipe.velocityY < 0 ? step : -step;
            this.__KINETICS_TIMEOUT__ = ok.fn.requestAnimationFrame(function () { ok.route("swipekinetics", ok.touch); });
        };
    };
};

/**
 *
 */
OK_Touch.prototype.__touchstart = function (e)
{
    if (this.__KINETICS_TIMEOUT__) {
        this.__KINETICS_TIMEOUT__ = ok.fn.cancelAnimationFrame(this.__KINETICS_TIMEOUT__);
        this.clear();
    };

    if (this.__TAP_TIMEOUT__) {
        window.clearTimeout(this.__TAP_TIMEOUT__);
        this.clear();
    };

    // --

    var now = Date.now(),
        delta = now - (this.gesture.time || now),
        node, target = e.touches[0].target, pd = 1;

    // --

    if (!ok.fn.in_array(target.tagName, ["A", "INPUT", "SELECT", "TEXTAREA"]))
    {
        node = target;
        while (node.parentNode)
        {
            if (node.disableGestures) {
                pd = 0;
                break;
            };
            node = node.parentNode;
        };

        if (pd) {
            e.preventDefault();
        };
        e.stopPropagation();
    };

    if (this.gesture.node && this.gesture.node != target && (node = ok.fn.isObject(this.gesture.node))) {
        ok.route({type: "touchout", touches: this._touches}, node);
    };
    this.gesture['node'] = target;

    // --

    if (!ok.events.enabled) {
        this.clear();
        return;
    };

    // --

    if (ok.menu && this.gesture.node && !ok.fn.isMenu(this.gesture.node)) {
        ok.menu.hide(1);
        this.clear();
        return;
    };

    // --

    if (ok.objects.focused && ok.blur) {
        if (!(c = ok.fn.isObject(target)) || ok.fn.in_array(ok.get(c)._type, ["deck", "split", "box2", "scrollbox"])) {
            ok.objects.focused.blur();
        };
    };

    // --

    this.gesture['fingers'] = e.touches.length;
    this.gesture['time'] = now;
    this.gesture['now'] = now;

    this._touches = [];
    for (var i = 0; i < this.gesture.fingers; i++) {
        this._touches.push({x: e.touches[i].pageX, y: e.touches[i].pageY});
        if (i == 0) {
            ok.x = e.touches[i].pageX;
            ok.y = e.touches[i].pageY;
        };
    };

    if (this.gesture.fingers === 1) {
        this.gesture['doubletap'] = delta > 0 && delta <= this.delayDTap;
        window.setTimeout(function () {
            if (ok.touch.gesture.time && (Date.now() - ok.touch.gesture.time >= this.delayHold)) {
                ok.route({type: "action", gesture: "hold"}, ok.touch);
                ok.touch.clear();
            };
        }, this.delayHold);
    } else if (this.gesture.fingers === 2) {
        this.gesture['_angle'] = parseInt(ok.fn.angle(this._touches[0].x, this._touches[0].y, this._touches[1].x, this._touches[1].y), 10);
        this.gesture['_distance'] = parseInt(ok.fn.distance(this._touches[0].x, this._touches[0].y, this._touches[1].x, this._touches[1].y), 10);
        this.gesture['angle'] = 0;
        this.gesture['distance'] = 0;
    };

    if (this.gesture.node && (node = ok.fn.isObject(this.gesture.node))) {
        ok.route({type: "touchdown", gesture: this.gesture, touches: this._touches}, node);
    };

    return true;
};

/**
 *
 */
OK_Touch.prototype.__touchmove = function (e)
{
    var diff, delta, object;

    window.clearTimeout(this.__TAP_TIMEOUT__);
    this.__KINETICS_TIMEOUT__ = ok.fn.cancelAnimationFrame(this.__KINETICS_TIMEOUT__);

    // --

    if (!ok.events.enabled) {
        this.clear();
        return;
    };

    // --

    this.gesture['moved'] = 1;

    if (this.gesture.node)
    {
        if (ok.fn.isObject(this.gesture.node)) {
            ok.route({type: "touchmove", gesture: this.gesture, touches: this._touches}, this.gesture.node.id);
        };

        if (e.touches.length === this.gesture.fingers) {
            this.touches = [];
            for (var i = 0, l = e.touches.length; i < l; i++) {
                this.touches.push({x: e.touches[i].pageX, y: e.touches[i].pageY});
            };

            // Swiping
            if (this._isSwipe())
            {
                if (!this.gesture.swipe) {
                    this.gesture['swipe'] = {
                        'x1': this._touches[0].x,
                        'y1': this._touches[0].y,
                        'direction': null,
                        'distance': 0,
                        'distanceX': 0,
                        'distanceY': 0,
                        'velocityX': 0,
                        'velocityY': 0,
                        'deltaX': 0,
                        'deltaY': 0
                    };
                };

                // --

                this.gesture.swipe['x2'] = this.touches[0].x;
                this.gesture.swipe['y2'] = this.touches[0].y;
                this.gesture.swipe['direction'] = this._getDirection(this._touches[0].x, this.touches[0].x, this._touches[0].y, this.touches[0].y);
                this.gesture.swipe['_distanceX'] = this.gesture.swipe.distanceX;
                this.gesture.swipe['_distanceY'] = this.gesture.swipe.distanceY;
                this.gesture.swipe['distanceX'] = this.gesture.swipe.x2 - this.gesture.swipe.x1;
                this.gesture.swipe['distanceY'] = this.gesture.swipe.y2 - this.gesture.swipe.y1;
                this.gesture.swipe['distance'] = ok.fn.distance(this._touches[0].x, this._touches[0].y, this.touches[0].x, this.touches[0].y);
                this.gesture.swipe['deltaX'] = this.gesture.swipe.distanceX - this.gesture.swipe._distanceX;
                this.gesture.swipe['deltaY'] = this.gesture.swipe.distanceY - this.gesture.swipe._distanceY;

                // --

                delta = (Date.now() - this.gesture.now) / 1000;
                this.gesture['now'] = Date.now();

                this.gesture.swipe['velocityX'] = (0.23 * this.gesture.swipe.velocityX) + (0.77 * (this.gesture.swipe.deltaX / delta));
                this.gesture.swipe['velocityY'] = (0.23 * this.gesture.swipe.velocityY) + (0.77 * (this.gesture.swipe.deltaY / delta));

                this.gesture.swipe['velocityX'] = Math.min(this.gesture.swipe.velocityX, this.kMaxVelocity);
                this.gesture.swipe['velocityX'] = Math.max(this.gesture.swipe.velocityX, -this.kMaxVelocity);
                this.gesture.swipe['velocityY'] = Math.min(this.gesture.swipe.velocityY, this.kMaxVelocity);
                this.gesture.swipe['velocityY'] = Math.max(this.gesture.swipe.velocityY, -this.kMaxVelocity);

                // --

                ok.route({type: "action", gesture: "swiping"}, this);
            };

            if (this.gesture.fingers === 2)
            {
                // Rotating
                diff = parseInt(this.gesture._angle - parseInt(ok.fn.angle(this.touches[0].x, this.touches[0].y, this.touches[1].x, this.touches[1].y), 10), 10);
                if (Math.abs(diff) > 20 || this.gesture.angle !== 0) {
                    delta = 0;
                    while (Math.abs(diff - this.gesture.angle) > 90 && delta++ < 10) {
                        diff = this.gesture.angle < 0 ? diff - 180 : diff + 180;
                    };
                    this.gesture['angle'] = parseInt(diff, 10);
                    ok.route({type: "action", gesture: "rotating", angle: this.gesture.angle }, this);
                };

                // --

                // Pinching
                diff = this.gesture._distance - parseInt(ok.fn.distance(this.touches[0].x, this.touches[0].y, this.touches[1].x, this.touches[1].y), 10);
                if (Math.abs(diff) > 10) {
                    this.gesture['distance'] = diff;
                    this.gesture['direction'] = diff > 0 ? "out" : "in";
                    ok.route({type: "action", gesture: "pinching", distance: diff }, this);
                };

                // --

                e.preventDefault();
            };
        } else {
            this.clear();
        };
    };

    e.preventDefault();
    e.stopPropagation();
    ok.events.cancel(e);

    return true;
};

/**
 *
 */
OK_Touch.prototype.__touchend = function (e)
{
    var valid = 0;

    if (!ok.events.enabled) {
        this.clear();
        return;
    };

    // --

    if (this.gesture.doubletap) {
        ok.route({type: "action", gesture: "doubletap"}, this);
        this.clear();
    } else if (this.gesture.fingers === 1) {
        if (this.gesture.swipe)
        {
            this.gesture.swipe['released'] = 1;
            if (ok.route({type: "action", gesture: "swipe"}, this)) {
                this.__KINETICS_TIMEOUT__ = ok.fn.requestAnimationFrame(function () { ok.route("swipekinetics", ok.touch); });
                return true;
            } else {
                ok.route({type: "action", gesture: "swipe" + this._getDirection(this._touches[0].x, this.touches[0].x, this._touches[0].y, this.touches[0].y)}, this);
                this.clear();
            };
        } else {
            if (this.gesture.moved && Math.abs(parseInt(ok.fn.distance(this.touches[0].x, this.touches[0].y, this._touches[0].x, this._touches[0].y))) < this.swipeMin) {
                this.gesture.moved = 0;
            };

            if (!this.gesture.moved) {
                ok.route({type: "action", gesture: "tap"}, this);
                this.clear();
//              this.__TAP_TIMEOUT__ = window.setTimeout(function () { ok.touch.clear(); }, this.delayDTap);
            };
        };
    } else if (this.gesture.fingers === 2) {
        if (this.gesture.angle !== 0) {
            ok.route({type: "action", gesture: "rotate", angle: this.gesture.angle}, this);
            ok.route({type: "action", gesture: "rotate" + (this.gesture.angle > 0 ? "right" : "left"), angle: this.gesture.angle}, this);
            valid = 1;
        };
        if (this.gesture.distance !== 0) {
            ok.route({type: "action", gesture: "pinch", distance: this.gesture.distance}, this);
            ok.route({type: "action", gesture: "pinch" + (this.gesture.distance > 0 ? "out" : "in"), distance: this.gesture.distance}, this);
            valid = 1;
        };
        if (!valid && this.touches[0]) {
            if (Math.abs(this._touches[0].x - this.touches[0].x) > 10 || Math.abs(this._touches[0].y - this.touches[0].y) > 10) {
                ok.route({type: "action", gesture: "drag"}, this);
                ok.route({type: "action", gesture: "drag" + this._getDirection(this._touches[0].x, this.touches[0].x, this._touches[0].y, this.touches[0].y)}, this);
            };
        };
        this.clear();
    };

    if (!e.touches.length) {
        this.clear();
    };

    ok.events.cancel(e);
    return true;
};

/**
 *
 */
OK_Touch.prototype.__touchcancel = function (e)
{
    this.clear();
    ok.events.cancel(e);
};
