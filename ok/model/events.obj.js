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
function OK_Events ()
{
    this._counter = 0;
    this._index = [];
    this.enabled = 0;
    this.passive = null;
};

OK_Events.prototype._testPassive = function ()
{
    var passive = 0;

    try {
      window.addEventListener('test', null, Object.defineProperty({}, 'passive', { get: function() { passive = 1; }}));
    } catch (e) {};

    return passive;
};

OK_Events.prototype.capture = function (eventName, target, fn, options)
{
    var fp;

    if (this.passive === null) {
        this.passive = this._testPassive();
    };

    if (typeof options == "object" && !this.passive) {
        options = options.capture ? true : false;
    };

    if (typeof target == "string" && typeof fn == "string")
    {
        fp = function (e) {
            ok.events.__router(e, fp.fn, fp.target);
        };
        fp.target = target;
        fp.fn = fn;
        if (!this._index[target]) {
            this._index[target] = [];
        };
        this._index[target][eventName] = {f: fp, o: options};
        return ok.$(target).addEventListener(eventName.replace(/^on/, ""), this._index[target][eventName].f, options);
    }
    else if (typeof target == "object" && typeof fn == "function")
    {
        return target.addEventListener(eventName.replace(/^on/, ""), fn, options);
    };

    ok.trigger_error("Error capturing event: [event " + eventName + "] [target " + target + "] [fn " + fn + "].", 101902, ok.E_WARNING);
    return 0;
};

/**
*
* @private
*/
OK_Events.prototype.bubble = function (e, o)
{
    var r = null;

    if (typeof e == "string") {
        e = {'type': e};
    };

    if (typeof o == "string") {
        o = ok.get(o);
    };

    if (typeof o["on" + e.type] == "function") {
        r = o["on" + e.type](e);
    };

    return r;
};

OK_Events.prototype.cancel = function (e) {
    if (e && e.type == 'mousedown') {
        ok.__mousedown(e);
    };

    if (e && e.stopPropagation) {
        e.stopPropagation();
    } else if (window.event) {
        window.event.cancelBubble = true;
    };
};

OK_Events.prototype.disable = function () {
    if (this.enabled) {
        this.enabled = 0;
    };
};

OK_Events.prototype.enable = function () {
    if (!this.enabled) {
        this.enabled = 1;
    };
};

OK_Events.prototype.release = function (eventName, target, fn, options) {
    if (typeof target == "string" && !fn) {
        fn = this._index[target][eventName].f;
        options = this._index[target][eventName].o;
        this._index[target][eventName] = null;
    };

    if (typeof fn == "function") {
        target.removeEventListener(eventName.replace(/^on/, ""), fn, options);
        return 1;
    };

    return 0;
};

OK_Events.prototype.prevent = function (e) {
    if (e && e.type == 'mousedown')
        ok.menu.__mousedown(e);

    if (e && e.preventDefault) {
        e.preventDefault();
    } else if (window.event) {
        window.event.returnValue = false;
    };
};

OK_Events.prototype.route = function (e, o)
{
    e = (typeof e == "string") ? {'type': e} : e;

    if (!ok.events.enabled && ok.fn.in_array(e.type, [
        'onclick',
        'oncontextmenu',
        'ondoubleclick',
        'onfocus',
        'onkeydown',
        'onkeypress',
        'onkeyup',
        'onmousedown',
//      'onmouseout',
        'onmouseover',
        'onmouseup'
    ])) {
        ok.trigger_error("EVENTS: Event routing canceled.", 101915, ok.E_ERROR);
        return;
    };

    var r = 0;

    if (typeof o == "function") {
        r = o(e);
    } else {
        if (typeof o == "string") {
            o = ok.get(o);
        };

        if (o && typeof o["__" + e.type] == "function") {
            r = o["__" + e.type](e);
        } else if (o && typeof o["on" + e.type] == "function") {
            r = o["on" + e.type](e);
        };
    };

    return r;
};

OK_Events.prototype.stop = function (e)
{
    if (typeof e.stopPropagation == "function") {
        e.stopPropagation();
        return 1;
    };
};

OK_Events.prototype.broadcast = function (e, node, bFromTop)
{
    var i, l, c, stop = 0;
    
    if (node) {
        if (node.id && bFromTop)
        {
            c = ok.get(node.id);
            if (c && c.isDisplayed()) {
                stop = this.route(e, c);
            };
        };

        if (!stop && node.childNodes) {
            for (var i=0, l=node.childNodes.length; i<l; i++) {
                this.broadcast(e, node.childNodes.item(i), 1);
            };
        };
    };
};

OK_Events.prototype.unload = function (id)
{
    if (this._index[id] != null)
        for (var event in this._index[id])
            if (typeof this._index[id][event] != "function")
                this.release(event, id);
};

OK_Events.prototype.__router = function (e, target, scope)
{
    if (!ok.events.enabled && e.type != "mouseout") {
        return;
    };

    if (!e) { e = window.event; };

    if (typeof scope == "string") {
        scope = ok.get(scope);
    };

    if (typeof scope != "object") {
        ok.trigger_error("Invalid scope while routing event.", 101904, ok.E_WARNING);
        return false;
    };

    if (typeof scope[target] == "function")
    {
        if (scope[target](e)) return true;
    } else if (scope instanceof OK_Object && typeof scope["on" + e.type] == "function") {
        if (scope["on" + e.type](e)) return true;
    };

    return 0;
};
