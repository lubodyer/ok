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
function OK_Object_Menu (id) {
    this.id = id;
    this._type = "menu";

    this.tabindex = -1;
    this.visible = 0;
    this.items = [];
    this.item = -1;
    this.fx = null;

    this.register();
};

/** */
OK_Object_Menu.prototype = new OK_Object;

OK_Object_Menu.prototype.focus = function () {};
OK_Object_Menu.prototype.blur = function () {};

/**
 *
 */
OK_Object_Menu.prototype.add = function (menuItem) {
    this.items.push(menuItem);
    menuItem.parentMenu = this;
};

/**
 *
 */
OK_Object_Menu.prototype.clear = function () {
    ok.objects.removeAll(this.id);
    ok.$(this.id).innerHTML = "";
    this.items = [];
    this.item = -1;
};

/**
 *
 */
OK_Object_Menu.prototype.create = function (id, text, events) {
    var div = document.createElement("div"),
        mi;

    div.id = id;
    div.className = "MENUITEM";
    div.innerHTML = text;
    ok.$(this.id).appendChild(div);

    mi = new OK_Object_MenuItem(id);

    if (events)
        for (var p in events)
            if (ok.fn.in_array(p, ["onaction"]))
                if (typeof events[p] == "function")
                    mi[p] = events[p];
                else if (typeof events[p] == "string")
                    mi[p] = new Function("e", events[p]);

    this.add(mi);
    return mi;
};

/**
 *
 */
OK_Object_Menu.prototype.show = function ()
{
    if (!this.visible && !this.bubble('beforeshow'))
    {
        ok.menu = this;

        var m = ok.$(this.id);
        this._parentNode = m.parentNode;
        document.body.appendChild(m);

        m.style.display = "block";
        ok.layout.resize(this.id);

        if (this.parentObject) {
            this.position(ok.$(this.parentObject.id), "vertical");
        };

        m.style.visibility = 'visible';
        m.style.opacity = 0;
        this.visible = 1;
        this.bubble('show');

        if (this.fx) { this.fx.finish(); };
        this.fx = ok.fx.create(this.id, "opacity", 0, 1, 200, { onfinish: function () {
            ok.get(this._id).fx = null;
        }});
    };
};

/**
 *
 */
OK_Object_Menu.prototype.hide = function (hideParent, suppressEvent)
{
    if (this.visible && (suppressEvent || (!suppressEvent && !this.bubble('beforehide'))))
    {
        this.blur();
        if (this.item > -1) {
            this.items[this.item].blur();
        };
        this.hideAll();
        this.visible = 0;

        if (this.parentMenuItem) {
            ok.menu = this.parentMenuItem.parentMenu;
            if (hideParent)  {
                this.parentMenuItem.parentMenu.hide(1);
            };
        } else {
            ok.menu = null;
        };

        if (this.parentObject && this.parentObject._type == "button") {
            this.parentObject.setValue(0, 1);
            this.parentObject.focus();
        };

        if (!suppressEvent) {
            this.bubble('hide');
        };

        // --

        var _m = ok.$(this.id);

        if (this._parentNode) {
            this._parentNode.appendChild(_m);
            this._parentNode = null;
        };

        _m.style.visibility = "";
        _m.style.display = "none";

        // if (this.fx) { this.fx.finish(); };
        // this.fx = ok.fx.create(this.id, "opacity", 1, 0, 200, { onfinish: function () {
            // var m = ok.get(this._id),
                // _m = ok.$(this._id);

            // m.fx = null;
            // if (m._parentNode) {
                // m._parentNode.appendChild(_m);
                // m._parentNode = null;
            // };
            // _m.style.visibility = "";
        // }});
    };
};

/**
 *
 */
OK_Object_Menu.prototype.hideAll = function () {
    var len = this.items.length;
    for (var i=0; i<len; i++)
        if (this.items[i].subMenu)
            this.items[i].subMenu.hide();
};

/**
 *
 */
OK_Object_Menu.prototype.__beforeload = function (e)
{
    // var m = ok.$(this.id);
    // this._parentNode = m.parentNode;
    // document.body.appendChild(m);
// //   m.style.visibility = "hidden";
    // m.style.display = "none";
};

/**
 *
 */
OK_Object_Menu.prototype.__keydown = function (e) {

    var newItem;
    var key = ok.kb.key(e);

    switch (key) {
        // Tab
        case 9:
            return 1;
            break;

        // Left arrow
        case 37:
            if (this.parentMenuItem)
                this.hide();
            else if (this.parentObject.parentObject) {
                this.hide();
                this.parentObject.parentObject.onkeydown(37);
                this.parentObject.parentObject.onkeydown(40);
            };
            break;
        // Up arrow
        case 38:
            if (this.items.length) {
                newItem = this.item - 1;
                if (newItem < 0) newItem = this.items.length - 1;
                this.items[newItem].focus();
            };
            break;
        // Right arrow
        case 39:
            if (this.item > -1 && this.items[this.item].subMenu) {
                this.items[this.item].subMenu.show();
                this.items[this.item].subMenu.onkeydown(40);
            } else if (this.findTopMenu().parentObject.parentObject) {
                this.findTopMenu().hide();
                this.findTopMenu().parentObject.parentObject.onkeydown(39);
                this.findTopMenu().parentObject.parentObject.onkeydown(40);
            };
            break;
        // Down arrow
        case 40:
            if (this.items.length) {
                newItem = this.item + 1;
                if (newItem == this.items.length) newItem = 0;
                this.items[newItem].focus();
            };
            break;
        // Escape key
        case 27:
            this.hide();
    };
};

OK_Object_Menu.prototype.__unload = function () {
    if (ok.menu == this) {
        ok.menu = null;
    };
};

OK_Object_Menu.prototype.findItemIndex = function (item)
{
    for (var i=0; i < this.items.length; i++)
        if (this.items[i] == item)
            return i;
    return -1;
};
OK_Object_Menu.prototype.findTopMenu = function ()
{
    var topMenu = this;
    while (topMenu.parentMenuItem)
        topMenu = topMenu.parentMenuItem.parentMenu;
    return topMenu;
};

OK_Object_Menu.prototype.position = function (parent, direction) {

    var eL = ok.$(this.id);
    var pos = ok.layout.position(eL, parent, direction);

    eL.style.top = pos.top + "px";
    eL.style.left = pos.left + "px";
};
