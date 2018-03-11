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
function OK_Object_Button (id, tabindex, enabled, className, accesskey, isDefault)
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
    this._type = "button";

    /**
     * @type int
     */
    this.tabindex = tabindex == null ? -1 : tabindex;

    /**
     * @type string
     */
    this.className = className ? className : "OK_BUTTON";

    /**
     * @type boolean
     */
    this.enabled = enabled ? true : false;

    /** @type boolean */
    this.toggle = false;
    /** @type boolean */
    this.value = false;
    /** @type boolean */
    this.down = false;
    /** @type boolean */
    this.over = false;
    /** @type boolean */
    this.async = true;

    this.accesskey = accesskey ? accesskey : null;

    /** @type boolean */
    this.isDefault = isDefault != null ? isDefault : false;

    this.register();

    this.capture("mouseover");
    this.capture("mouseout");
    this.capture("mousedown");
    this.capture("mouseup");
    this.capture("click");

    if (this.accesskey)
        ok.kb.keys.down[this.accesskey] = this.id;
    if (this.isDefault)
        ok.kb.keys.down[13] = this.id;

    this.redraw();
};

/** */
OK_Object_Button.prototype = new OK_Object;

/**
 *
 */
OK_Object_Button.prototype.enable = function () {
    this.setEnabled(1);
};

/**
 *
 */
OK_Object_Button.prototype.disable = function () {
    this.setEnabled(0);
};

/**
 *
 */
OK_Object_Button.prototype.setEnabled = function (enabled) {
    if (this.enabled != enabled) {
        this.enabled = enabled ? true : false;
        this.redraw();
    };
};

/**
 *
 */
OK_Object_Button.prototype.setToggle = function (toggle) {
    this.toggle = toggle ? true : false;
    this.value = this.toggle ? this.value : false;
};

/**
 *
 */
OK_Object_Button.prototype.getValue = function ()
{
    return this.value;
};

/**
 *
 */
OK_Object_Button.prototype.setText = function (text)
{
    var _t = ok.$(this.id + ":TEXT");
    if (_t) {
        _t.innerHTML = text;
    };
};

/**
 *
 */
OK_Object_Button.prototype.getText = function ()
{
    var _t = ok.$(this.id + ":TEXT");
    if (_t) {
        return _t.innerHTML;
    };
    return "";
};

/**
 *
 */
OK_Object_Button.prototype.setValue = function (value, force)
{
    value = value ? 1 : 0;
    if (this.toggle && this.value != value)
    {
        if (!force && this.bubble({type: "beforetoggle", source: this})) {
            return;
        };

        this.value = value;

        if (this.toggle && !force) {
            ok.route({type: "toggle", source: this}, this);
        };

        this.redraw();
    };
};

/**
 *
 */
OK_Object_Button.prototype.setDefault = function (state) {
    if (!this.isDefault) {
        var c = ok.objects.items.items;
        for (var p in c) if (c && c[p] && c[p] != this && c[p]._type == "button" && c[p].isDefault) {
            c[p].isDefault = 0;
            c[p].redraw();
        };
        this.isDefault = 1;
        ok.kb.keys.down[13] = this.id;
        this.redraw();
    }
};

OK_Object_Button.prototype.setLoading = function (loading, txtonly)
{
    var icon = ok.$(this.id + ":ICON");
    var text = ok.$(this.id + ":TEXT");
    if (loading) {
        if (!txtonly && icon) {
            icon._src = icon.src;
            icon.src = ok.cache.get(ok.ICON_LOADING);
        } else {
            text._html = text.innerHTML;
            text.innerHTML = "Loading...";
        }
    } else {
        if (icon && icon._src) {
            icon.src = icon._src;
            icon._src = null;
        };
        if (text && text._html) {
            text.innerHTML = text._html;
            text._html = null;
        }
    }
};

// --

/**
 *
 */
OK_Object_Button.prototype.__beforefocus = function () {
    if (this.tabindex == -1)
        return 1;
};

/**
 *
 */
OK_Object_Button.prototype.__focus = function () {
    this._redrawDefBtn();
    this.redraw();
};

/**
 *
 */
OK_Object_Button.prototype.__blur = function () {
    this._redrawDefBtn();
    this.redraw();
};

/**
 *
 */
OK_Object_Button.prototype.__mouseover = function (e) {
    if (!this.over) {
        this.over = true;
        this.redraw();
    };
    this.bubble(e);
};

/**
 *
 */
OK_Object_Button.prototype.__mousedown = function (e)
{
    if (this.toggle) {
        this.down = true;
        this.redraw();
        this.focus();
    } else {
        this.down = true;
        this.redraw();
        this.focus();
    };
    this.bubble(e);
    e.stopPropagation();
};

/**
 *
 */
OK_Object_Button.prototype.__mouseout = function (e)
{
    var _ok = 1, target = e.relatedTarget;

    if (!e.out && target && target.id != this.id) while (_ok && target) {
        if (target.id == this.id) {
            _ok = 0;
            break;
        };
        target = target.parentNode;
    };

    if (_ok || !ok.events.enabled) {
        this.over = 0;
        this.down = 0;
        this.redraw();
    };
    this.bubble(e);
    e.stopPropagation();
};

/**
 *
 */
OK_Object_Button.prototype.__mouseup = function (e)
{
    if (!this.enabled) return;
    if (this.down) {
        if (this.toggle) {
            this.down = false;
            this.setValue(!this.value);
        } else {
            this.down = false;
            this.redraw();
            this._onaction();
        };
    };
    this.bubble(e);
    e.stopPropagation();
};

/**
 *
 */
OK_Object_Button.prototype.redraw = function ()
{
    var cname = "";
    if (this.enabled)
        cname = this.value ? this.down || this.over ? "DOWN_OVER" : this.focused ? "DOWN_FOCUSED" : "DOWN" : this.down ? "DOWN_OVER" : this.over ? this.isDefault && this.focused ? "FOCUSED" : "OVER" :
            (this.isDefault && (ok.objects.focused == null || ok.objects.focused._type != "button")) || this.focused ? this.isDefault && this.focused ? "OVER" : "FOCUSED" : "";
    else
        cname = this.value ? "DOWN_DISABLED" : "DISABLED";

    var o = ok.$(this.id);
    if (o.tagName == "TABLE") {
        if (o) o.className = this.className + (cname ? "_" + cname : "") + "_OUT";
        o = ok.$(this.id+":in");
        if (o) o.className = this.className + (cname ? "_" + cname : "") + "_IN";
    } else {
        if (o) o.className = this.className + (cname ? "_" + cname : "") + "_OUT";
    };
    this.bubble({type: 'redraw', className: cname});
};

/**
 *
 */
OK_Object_Button.prototype._redrawDefBtn = function ()
{
    var c = ok.objects.items.items;
    for (var p in c)
        if (c && c[p] && c[p] != this && c[p]._type == "button" && c[p].isDefault)
            c[p].redraw();
};

/**
 *
 */
OK_Object_Button.prototype.__keydown = function (e)
{
    var key = ok.kb.key(e);

    if ((key == 13 || key == 32 || key == this.accesskey) && this.enabled && this.isVisible())
    {
        if (this.toggle) {
            this.setValue(!this.value);
        } else {
            this._onaction();
        };
        return true;
    };
};

/**
 *
 */
OK_Object_Button.prototype.__touchdown = function (e) {
    if (!this.enabled) { return; };
    if (e.gesture.fingers == 1) {
        if (!this.down) {
            this.over = true;
            this.down = true;
            this.redraw();
            this.focus();
            this.bubble(e);
        };
    } else if (this.down) {
        this.down = false;
        this.redraw();
    };
};

/**
 *
 */
OK_Object_Button.prototype.__touchout = function (e) {
    if (this.down || this.over) {
        this.down = false;
        this.over = false;
        this.redraw();
    };
};

/**
 *
 */
OK_Object_Button.prototype.__touchmove = function (e) {
    if (!this.enabled) { return; };
    if (this.down) {
        this.down = 0;
        this.redraw();
    };
};

/**
 *
 */
OK_Object_Button.prototype.__tap = function (e) {
    if (this.enabled && this.isVisible()) {
        if (this.toggle) {
            this.setValue(!this.value);
        } else {
            this._onaction();
        };

        if (this.down) {
            this.down = 0;
            this.redraw();
        };
    };
};

/**
 *
 */
OK_Object_Button.prototype.__resize = function (e) {
    if (this.isDisplayed()) {
        this.redraw();
    };
};

/**
 *
 */
OK_Object_Button.prototype._onaction = function ()
{
    if (!this.async) {
        this.bubble({type: "action", source: this});
    } else {
        var self = this;
        ok.thread(function () {
            self.bubble({type: "action", source: this});
        });
    };
};

/**
 *
 */
OK_Object_Button.prototype.addMenu = function (menu)
{
    if (typeof menu == "string") {
        menu = ok.get(menu);
    };

    this.childMenu = menu;
    this.setToggle(1);

    this.__toggle = function () {
        if (!this.value) {
            this.childMenu.hide();
        } else {
            if (ok.menu) {
                ok.menu.hide();
            };
            this.childMenu.show();
        };
        this.bubble({type: "toggle", source: this});
    };

    menu.parentObject = this;

};

/**
 *
 */
OK_Object_Button.prototype.__click = function (e)
{

};
