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
function OK_Object_Tab(id, text, service, enabled, className)
{
    this.id = id;
    this._type = "tab";
    this.enabled = enabled ? 1 : 0;
    this.service = service;
    this.loaded = service ? 0 : 1;
    this.changed = 0;
    this.text = text;
    this._down = false;
    this.className = className;

    this.register();

    this.capture("mouseover");
    this.capture("mouseout");
    this.capture("mousedown");
    this.capture("mouseup");
};

/** */
OK_Object_Tab.prototype = new OK_Object;

/**
 *
 */
OK_Object_Tab.prototype.activate = function ()
{
    if (!this.enabled) {
        return 0;
    };

    if (this.parent.getActive() !== this) {
        this.parent.activate(ok.fn.array_search(this, this.parent.items));
        return;
    };

//  ok.$(this.id).className = this.parent.className + "_ACTIVE";
//  ok.$(this.id + ":cell").className = this.parent.className + "_ACTIVE_CELL";
//  ok.$(this.id + ":container").className = this.parent.className + "_CONTAINER_ACTIVE";

//  var c = ok.$(this.id + ":contents");
//  if (c) {
//      c.style.display = "block";
//      ok.layout.resize(c);
//  };

    this.bubble({type:'activate'});
};

/**
 *
 */
OK_Object_Tab.prototype.setText = function (text)
{
    ok.$(this.id + ":cell").innerHTML = text;
};

/**
 *
 */
OK_Object_Tab.prototype.enable = function (soft)
{
    if (!this.enabled) {
        this.enabled = 1;
        ok.$(this.id).parentNode.style.display = "";
        this.redraw();
        if (!soft) {
            ok.layout.resize(this.parent.id);
        };
    };
};

/**
 *
 */
OK_Object_Tab.prototype.disable = function (soft)
{
    if (this.enabled) {
        this.enabled = 0;
        ok.$(this.id).parentNode.style.display = "none";
        if (!soft) {
            ok.layout.resize(this.parent.id);
        };
    };
};

/**
 *
 */
OK_Object_Tab.prototype.setEnabled = function (enabled)
{
    if (enabled) {
        return this.enable();
    };
    return this.disable();
};

/**
 *
 */
OK_Object_Tab.prototype.setChanged = function (changed)
{
    changed = changed ? 1 : 0;
    if (this.changed != changed) {
        this.changed = changed;
        if (changed) {

        } else {

        };
        return 1;
    };
    return 0;
};

// --

/**
 *
 */
OK_Object_Tab.prototype.redraw = function ()
{
    var index = ok.fn.array_search(this, this.parent.items),
        active = index == this.parent.active,
        inset = index < this.parent.active,
        inactive = index == 0 && this.parent.active == -1,
        cname = active ? "_ACTIVE" : inactive ? "_INACTIVE" : inset ? "_INSET" : "",
        className = this.className ? this.className : this.parent.className,
        c1 = className + cname,
        c2 = c1 + "_CELL",
        c3 = active ? "_CONTAINER_ACTIVE" : "_CONTAINER_INACTIVE";

    if (!this.enabled) {
        c1 += " " + className + "_DISABLED";
        c2 += " " + className + "_DISABLED_CELL";
    };

    ok.$(this.id).className = c1;
    ok.$(this.id + ":cell").className = c2;
    ok.$(this.id + ":container").className = className + c3;
};

// --

/**
 *
 */
OK_Object_Tab.prototype.__mouseover = function(e)
{
    if (!this.enabled || this.parent.getActive() == this) return;

    var index = ok.fn.array_search(this, this.parent.items),
        active = index == this.parent.active,
        inset = index < this.parent.active,
        inactive = index == 0 && this.parent.active == -1,
        cname = active ? "_ACTIVE" : inactive ? "_INACTIVE" : inset ? "_INSET" : "",
        className = this.className ? this.className : this.parent.className,
        c1 = className + cname,
        c2 = c1 + "_CELL";

    ok.$(this.id).className = c1 + "_OVER";
    ok.$(this.id + ":cell").className = c2 + "_OVER";
};

/**
 *
 */
OK_Object_Tab.prototype.__mouseout = function(e)
{
    if (!this.enabled || this.parent.getActive() == this) return;

    var index = ok.fn.array_search(this, this.parent.items),
        active = index == this.parent.active,
        inset = index < this.parent.active,
        inactive = index == 0 && this.parent.active == -1,
        cname = active ? "_ACTIVE" : inactive ? "_INACTIVE" : inset ? "_INSET" : "",
        className = this.className ? this.className : this.parent.className,
        c1 = className + cname,
        c2 = c1 + "_CELL";

    ok.$(this.id).className = c1;
    ok.$(this.id + ":cell").className = c2;
};

/**
 *
 */
OK_Object_Tab.prototype.__mousedown = function(e)
{
    if (this.enabled) {
        this._down = true;
    };
};

/**
 *
 */
OK_Object_Tab.prototype.__mouseup = function(e)
{
    if (this.enabled) {
        if (this._down) {
            this.__click(e);
        };
        this._down = false;
    };
};

/**
 *
 */
OK_Object_Tab.prototype.__click = function(e)
{
    if (this.parent.getActive() == this) return;
    if (this.parent.activate(this.index)) {
        this.bubble('click');
    };
};

/**
 *
 */
OK_Object_Tab.prototype.__touchdown = function(e)
{
    if (this.parent.getActive() == this) return;
    if (this.parent.activate(this.index)) {
        this.bubble('tap');
    };
};
