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
 */

/** */
ok.DIALOG_MODAL = 'modal';
/** */
ok.DIALOG_MODELESS = 'modeless';

/**
 *
 * @class
 */
function OK_Object_Dialog (id, type, left, top, width, height, className, center, close, dock, parent)
{
    this._type = "dialog";
    this.id = id ? id : ok.fn.uniqid();
    this.type = type ? type : "modeless";
    this.dock = dock ? dock : "";
    this.tabindex = -1;
    this.visible = 0;
    this.className = className ? className : "OK_DIALOG";
    this.parent = parent ? parent : document.body;
    this.top = top !== null ? top : 20;
    this.left = left !== null ? left : 20;
    this.width = width !== null ? width : 200;
    this.height = height !== null ? height : 100;
    this.border = 4;
    this._close = close ? close : 0;
    this._center = center ? center : 0;
    this._create();
    this.register();
    ok.dialogs.add(this.id, this);
};

OK_Object_Dialog.prototype = new OK_Object;

OK_Object_Dialog.prototype.focus = function ()
{
    if (!this.focused)
    {
        if (ok.dialogs.focused) {
            ok.dialogs.focused.blur();
        }

        ok.dialogs.focused = this;
        this.focused = 1;

        var _node = ok.$(this.id);
        _node.className = this.className + "_FOCUSED";

        this.bubble("focus");

        return 1;
    };

    return 0;
};

OK_Object_Dialog.prototype.blur = function ()
{
    if (this.focused)
    {
        var _node = ok.$(this.id);
        _node.className = this.className;

        this.focused = 0;

        if (ok.dialogs.focused == this) {
            ok.dialogs.focused = null;
        };

        this.bubble("blur");

        return 1;
    };
    return 0;
};

OK_Object_Dialog.prototype.bringToFront = function ()
{
    var _node = ok.$(this.id);

    if (this.parent.lastChild !== _node) {
        this.parent.appendChild(_node);
    };
};

OK_Object_Dialog.prototype.center = function()
{
    var screen = ok.layout.get(this.parent),
        d = ok.layout.get(this.id),
        x = Math.round(screen.width / 2 - d.width / 2) + screen.left,
        y = Math.round(screen.height / 2 - d.height / 2) + screen.top;

    if (y > 100) y -= 40;
    this.moveTo(x, y);
};

OK_Object_Dialog.prototype.close = function (force)
{
    if (!force && this.bubble('close'))
        return 0;
    this.hide(1);
    ok.dialogs.remove(this.id);
    var node = ok.$(this.id);
    ok.objects.removeAll(node, 1);
    node.parentNode.removeChild(node);
    return 1;
};

OK_Object_Dialog.prototype._create = function ()
{
    var _d;

    if (!ok.$(this.id))
    {
        _d = document.createElement("div");

        _d.id = this.id;
        _d.className = this.className;
        _d.style.position = "absolute";
        _d.style.top = this.top + "px";
        _d.style.left = this.left + "px";
        _d.style.width = this.width + "px";
        _d.style.height = this.height + "px";
        _d.style.display = "none";

        this.parent.appendChild(_d);
    };
};

OK_Object_Dialog.prototype.hide = function (force)
{
    if (!this.visible || (!force && this.bubble('beforehide'))) {
        return 0;
    };

    var _d = ok.$(this.id);

    this.blur();
    if (ok.objects.focused) {
        var _f = ok.$(ok.objects.focused.id);
        if (ok.fn.isChildOf(_f, _d)) {
            ok.objects.focused.blur();
        };
    };

    if (ok.menu) {
        ok.menu.hide(1);
    };

    if (this._cover) {
        this._cover.parentNode.removeChild(this._cover);
    };

    _d.style.display = "none";
    this.visible = 0;

    if (ok.dialog == this)
        ok.dialog = null;

    if (this.type == "modal") {
        this.___STATE_SELF___ = ok._save();
        ok._restore(this.___STATE_OK___);
    };

    this.bubble("hide");
    return 1;
};

OK_Object_Dialog.prototype.moveTo = function (x, y, force)
{
    if (!force)
    {
        var d = ok.layout.get(this.id),
            screen = ok.layout.get(document.body),
            maxX = screen.width - d.width,
            maxY = screen.height - d.height;

        if (x < 0) x = 0;
        if (x > maxX) x = maxX;
        if (y < 0) y = 0;
        if (y > maxY) y = maxY;
    };

    this.top = y;
    this.left = x;

    var node = ok.$(this.id);
    node.style.top = y + "px";
    node.style.left = x + "px";
};

OK_Object_Dialog.prototype.resizeTo = function (width, height, silent)
{
    var _node = ok.$(this.id);

    this.width = width;
    this.height = height;

    _node.style.width = this.width + "px";
    _node.style.height = this.height + "px";

    if (!silent && this.visible) {
        ok.layout.resize(ok.$(this.id));
    };
};

OK_Object_Dialog.prototype.show = function (force)
{
    if (this.visible || (!force && this.bubble('beforeshow'))) {
        return 0;
    };

    if (ok.objects.focused) {
        ok.objects.focused.blur();
    };

    this.bringToFront();
    this.focus();

    var node = ok.$(this.id),
        top = this.top,
        left = this.left,
        width = this.width,
        height = this.height;

    if (width > document.body.clientWidth) {
        width = document.body.clientWidth;
    };

    if (height > document.body.clientHeight) {
        height = document.body.clientHeight;
    };

    // --

    if (this.dock == "right")
    {
        top = 0;
        left = this.parent.clientWidth - width;
        height = this.parent.clientHeight;
    };

    // --

    node.style.top = top + "px";
    node.style.left = left + "px";
    node.style.width = width + "px";
    node.style.height = height + "px";

    if (this.type == ok.DIALOG_MODAL) {
        var c = document.createElement('DIV');
        c.className = this.className + '_COVER';
        node.parentNode.insertBefore(c, node);
        this._cover = c;
    };

    node.style.visibility = "visible";
    node.style.display = "block";
    this.visible = 1;

    if (!this.dock && this._center) {
        this.center();
    };

    if (this.type == "modal") {
        this.___STATE_OK___ = ok._save();
        ok._restore(this.___STATE_SELF___);
    };

    ok.layout.resize(node);
    ok.dialog = this;

    this.bubble("show");
    return 1;
};

OK_Object_Dialog.prototype.__keydown = function (e)
{
    var key = ok.kb.key(e);

    if (key == 27) {
        this.hide();
    };
};

OK_Object_Dialog.prototype.__resize = function (e)
{
    var node = ok.$(this.id),
        left = this.left,
        top = this.top,
        width = this.width,
        height = this.height;

    if (left < 0) {
        left = 0;
    };

    if (top < 0) {
        top = 0;
    };

    if (width > document.body.clientWidth) {
        width = document.body.clientWidth;
    };

    if (height > document.body.clientHeight) {
        height = document.body.clientHeight;
    };

    node.style.top = this.top + "px";
    node.style.left = this.left + "px";
    node.style.width = width + "px";
    node.style.height = height + "px";

    if (!this.dock && this._center) {
        this.center();
    };

    this.bubble(e);
};

OK_Object_Dialog.prototype.__unload = function (e)
{
    this.blur();
    this.parent = null;
    this.bubble(e);
};
