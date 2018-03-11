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
function OK_Object_MenuItem(id) {
    this.id = id;
    this._type = "menuitem";

    this.tabindex = -1;
    this.subMenu = null;

    ok.objects.register(this);

    this.capture("mouseover");
    this.capture("mouseout");
    this.capture("mousedown");
};

/** */
OK_Object_MenuItem.prototype = new OK_Object;

/**
 *
 */
OK_Object_MenuItem.prototype.add = function (menu) {
    menu = ok.get(menu);
    menu.parentMenuItem = this;
    this.subMenu = menu;
};

/**
 *
 */
OK_Object_MenuItem.prototype.focus = function () {
    if (!this.enabled) return;
    if (this.parentMenu.item > -1)
        this.parentMenu.items[this.parentMenu.item].blur();
    this.parentMenu.item = this.parentMenu.findItemIndex(this);
    ok.$(this.id).className = "MENUITEM_OVER";
};

/**
 *
 */
OK_Object_MenuItem.prototype.blur = function () {
    if (!this.enabled) return;
    this.parentMenu.item = -1;
    ok.$(this.id).className = "MENUITEM";
};

/**
 *
 */
OK_Object_MenuItem.prototype.show = function () {
    this.parentMenu.hideAll();
    if (this.subMenu)
        this.subMenu.show();
};

/**
 *
 */
OK_Object_MenuItem.prototype.disable = function () {
    if (this.enabled) {
        this.enabled = 0;
        ok.$(this.id).className = "MENUITEM_DISABLED";
        return 1;
    };
    return 0;
};

/**
 *
 */
OK_Object_MenuItem.prototype.enable = function () {
    if (!this.enabled) {
        this.enabled = 1;
        ok.$(this.id).className = "MENUITEM";
        return 1;
    };
    return 0;
};

/**
 *
 */
OK_Object_MenuItem.prototype.setEnabled = function (enabled) {
    if (enabled) {
        return this.enable();
    };
    return this.disable();
};

/**
 *
 */
OK_Object_MenuItem.prototype.clearMenuTimeout = function ()
{
    if (this.menuShowTimeout != null) window.clearTimeout(this.menuShowTimeout);
    if (this.menuHideTimeout != null) window.clearTimeout(this.menuHideTimeout);
};

/**
 *
 */
OK_Object_MenuItem.prototype.__mouseover = function () {
    if (!this.enabled) return;
    this.focus();
    this.clearMenuTimeout();
    if (this.subMenu) {
        var sid = this.subMenu.id;
        this.menuShowTimeout = window.setTimeout(function () {
            ok.get(sid).show();
        }, 500);
    } else {
        var pid = this.parentMenu.id;
        this.menuShowTimeout = window.setTimeout(function () {
            ok.get(pid).hideAll();
        }, 400);
    };
};

/**
 *
 */
OK_Object_MenuItem.prototype.__mousedown = function (e)
{
    if (this.enabled) {
        if (this.subMenu) {
            window.clearTimeout(this.menuShowTimeout);
            this.subMenu.show();
        } else {
            this.parentMenu.hide(1);
            ok.route('action', this);
        };
    };
};

/**
 *
 */
OK_Object_MenuItem.prototype.__mouseout = function ()
{
    if (!this.enabled) return;
    this.blur();
    this.clearMenuTimeout();
    if (this.subMenu) {
        var sid = this.subMenu.id;
        this.menuHideTimeout = window.setTimeout(function () {
            ok.get(sid).hide();
        }, 400);
    };
};


/**
 *
 */
OK_Object_MenuItem.prototype.__tap = function ()
{
    if (this.enabled) {
        this.focus();
        this.clearMenuTimeout();
        ok.route("mousedown", this);
    };
};
