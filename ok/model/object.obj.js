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
function OK_Object(id)
{
    this.id = id;
    this.enabled = 1;
    this.focused = 0;

    this.trigger_event('load');
};

OK_Object.prototype.cancelEvent = function (e)
{
    ok.events.cancel(e);
};

OK_Object.prototype.debug = function (message, level, module)
{
    ok.debug(message, level, module);
};

OK_Object.prototype.isDisplayed = function ()
{
    var e = ok.$(this.id), v = e ? 1 : 0;
    while (e && v && e.parentNode) {
        v = ok.layout.computed(e, "display") != "none";
        e = e.parentNode;
    };
    return v;
};

OK_Object.prototype.isVisible = function ()
{
    var e = ok.$(this.id), v = e ? 1 : 0;
    while (v && e.parentNode) {
        v = ok.layout.computed(e, "display") != "none" && ok.layout.computed(e, "visibility") != "hidden";
        e = e.parentNode;
    };
    return v;
};

OK_Object.prototype.isFocused = function ()
{
    return this.focused;
};

OK_Object.prototype.focus = function ()
{
    if (!this.focused && !ok.events.route({'type':'beforefocus'}, this) && ok.objects.focus(this))
    {
        this.focused = 1;

        var node = ok.$(this.id),
            object;

        node = node.parentNode;
        while (node) {
            if (node.id && (object = ok.get(node.id)) && (object._type === "dialog" || object._type === "aspect")) {
                object.focus();
                break;
            };
            node = node.parentNode;
        };

        ok.events.route({'type':'focus'}, this);
        return 1;
    };
    return 0;
};

OK_Object.prototype.blur = function (target)
{
    if (this.focused && !ok.events.route({type: 'beforeblur', target: target}, this))
    {
        this.focused = 0;

        var _node = ok.$(this.id),
            object;

        if (_node) {
            _node = _node.parentNode;
            while (_node) {
                if (_node.id && (object = ok.get(_node.id)) && (object._type === "dialog" || object._type === "aspect") && object.focused) {
                    object.blur(target);
                    break;
                };
                _node = _node.parentNode;
            };
        };

        ok.objects.last = this;
        ok.objects.focused = null;

        ok.events.route({type:'blur', target: target}, this);
        return 1;
    };

    return 0;
};

OK_Object.prototype.trigger_event = function (eventName, eventObj)
{
    var r = null;
    if (typeof this["on" + eventName] == "function") try {
        r = this["on" + eventName](eventObj);
    } catch (x) {
        ok.trigger_error("TRIGGER [event " + eventObj.type + "]: " + x.message, -11, ok.E_ERROR);
    };
};

OK_Object.prototype.register = function ()
{
    ok.objects.register(this);
};

OK_Object.prototype.capture = function (eventName)
{
    ok.events.capture("on" + eventName, String(this.id), "__" + eventName);
};

OK_Object.prototype.bubble = function (e)
{
    var r = null;

    if (typeof e == "string") {
        e = {'type': e};
    };

    if (typeof this["on" + e.type] == "function") {
        r = this["on" + e.type](e);
    };

    return r;
};

OK_Object.prototype._dragstart = function () {};

OK_Object.prototype.unload = function ()
{
    if (ok.objects.focused === this) {
        this.blur();
        ok.objects.focused = null;
    };

    if (ok.objects.last === this) {
        ok.objects.last = null;
    };

    ok.route({'type': "unload"}, this);
};

OK_Object_Anchor = function (id)
{
    this._type = "anchor";

    this.id = id;
    this.register();
    this.capture("mousedown");
};

OK_Object_Anchor.prototype = new OK_Object();

OK_Object_Anchor.prototype.__mousedown = function (e)
{
    var _a = ok.$(this.id),
        href = _a.getAttribute("href");

    if (href) {
        ok.route({type: "action", href: href, node: _a}, this);
    };

    return 1;
};

OK_Object_Anchor.prototype.__touchdown = function (e)
{
    if (e.gesture.fingers == 1) {
        var _a = ok.$(this.id),
            href = _a.getAttribute("href");

        if (href) {
            ok.route({type: "action", href: href, node: _a}, this);
        };
    };

    return 1;
};
