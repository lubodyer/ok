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
function OK_Object_CheckBox (id, tabindex, enabled, checked, className)
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
    this._type = "checkbox";

    /**
     * @public
     * @readonly
     */
    this.className = className;

    /**
     * @public
     * @readonly
     */
    this.tabindex = tabindex;

    /**
     * @public
     * @readonly
     */
    this.enabled = enabled ? 1 : 0;

    // --

    this.register();

    /**
     * @ignore
     */
    this.toggle = 1;
    this.value = checked ? 1 : 0;

    this.capture("mouseover");
    this.capture("mouseout");
    this.capture("mousedown");
    this.capture("mouseup");

    this.redraw();
};

/** */
OK_Object_CheckBox.prototype = new OK_Object;

/**
 *
 */
OK_Object_CheckBox.prototype.enable = function () {
    this.setEnabled(1);
};

/**
 *
 */
OK_Object_CheckBox.prototype.disable = function () {
    this.setEnabled(0);
};

/**
 *
 */
OK_Object_CheckBox.prototype.setEnabled = function (enabled) {
    if (this.enabled != enabled) {
        this.enabled = enabled ? true : false;
        this.redraw();
    };
};

/**
 *
 */
OK_Object_CheckBox.prototype.getValue = function ()
{
    return this.value;
};

/**
 *
 */
OK_Object_CheckBox.prototype.setValue = function (value, force)
{
    value = value ? 1 : 0;
    if (this.toggle && this.value != value)
    {
        if (!force && this.bubble({type: "beforetoggle", source: this})) {
            return;
        };

        this.value = value;

        if (this.toggle && !force) {
            this.bubble({type: "toggle", source: this});
        };

        this.redraw();
    };
};

/**
 *
 */
OK_Object_CheckBox.prototype.redraw = function ()
{
    var o, cname = "", c, _c, i;

    if (this.enabled) {
        cname = this.value ? this.down || this.over ? "DOWN_OVER" : this.focused ? "DOWN_FOCUSED" : "DOWN" : this.down ? "DOWN_OVER" : this.over ? this.isDefault && this.focused ? "FOCUSED" : "OVER" :
            (this.isDefault && (ok.objects.focused == null || ok.objects.focused._type != "button")) || this.focused ? this.isDefault && this.focused ? "OVER" : "FOCUSED" : "";
    } else {
        cname = this.value ? "DOWN_DISABLED" : "DISABLED";
    };

    o = ok.$(this.id+":BTN");
    if (o.tagName == "TABLE") {
        if (o) o.className = this.className + (cname ? "_" + cname : "") + "_OUT";
        o = ok.$(this.id+":BTN:in");
        if (o) o.className = this.className + (cname ? "_" + cname : "") + "_IN";
    } else {
        if (o) o.className = this.className + (cname ? "_" + cname : "") + "_IN";
    };

    // --

    o = ok.objects.scan(document.body, null, "label");
    for (i = 0; i < o.length; i++) {
        c = ok.get(o[i]);
        if (c.htmlFor === this.id) {
            _c = ok.$(c.id);
            _c.style.color = this.enabled ? this[c.id + ":COLOR"] ? this[c.id + ":COLOR"] : "" : ok.colors.graytext;
        };
    };

    // --

    this.bubble({type: 'redraw', className: cname});
};

// --

/**
 *
 */
OK_Object_CheckBox.prototype.__beforefocus = function () {
    if (this.tabindex == -1) {
        return 1;
    };
};

/**
 *
 */
OK_Object_CheckBox.prototype.__focus = function () {
    this.redraw();
};

/**
 *
 */
OK_Object_CheckBox.prototype.__blur = function () {
    this.redraw();
};

/**
 *
 */
OK_Object_CheckBox.prototype.__mouseover = function (e) {
    if (!this.over) {
        this.over = true;
        this.redraw();
    };
    this.bubble(e);
};

/**
 *
 */
OK_Object_CheckBox.prototype.__mousedown = function (e)
{
    if (this.toggle) {
        if (!this.bubble({type: "beforetoggle", source: this})) {
            this.down = true;
            this.redraw();
            this.focus();
            this.bubble({type: "toggle", source: this});
        };
    } else {
        this.down = true;
        this.redraw();
        this.focus();
        this.bubble(e);
    };
};

/**
 *
 */
OK_Object_CheckBox.prototype.__mouseout = function (e)
{
    var ok = 1, target = e.relatedTarget;

    if (target && target.id != this.id) while (ok && target) {
        if (target.id == this.id) {
            ok = 0;
            break;
        };
        target = target.parentNode;
    };

    if (ok) {
        this.over = 0;
        this.down = 0;
        this.redraw();
        this.bubble(e);
    };
};

/**
 *
 */
OK_Object_CheckBox.prototype.__mouseup = function (e)
{
    if (!this.enabled) return;
    if (this.down) {
        if (this.toggle) {
            this.down = false;
            this.setValue(!this.value, 1);
            this.bubble({type: "toggle", source: this});
        } else {
            this.down = false;
            this.redraw();
            this._onaction();
        };
    };
};


/**
 *
 */
OK_Object_CheckBox.prototype.__keydown = function (e)
{
    var key = ok.kb.key(e);

    if ((key == 32 || key == this.accesskey) && this.enabled && this.isVisible())
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
OK_Object_CheckBox.prototype.__touchdown = function (e) {
    if (!this.enabled) { return; };
    if (e.gesture.fingers == 1) {
        if (!this.down) {
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
OK_Object_CheckBox.prototype.__touchmove = function (e) {
    if (!this.enabled) { return; };
    if (this.down) {
        this.down = 0;
        this.redraw();
    };
};

/**
 *
 */
OK_Object_CheckBox.prototype.__tap = function (e) {
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
