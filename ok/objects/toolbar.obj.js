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
function OK_Object_ToolBar (id)
{
    this.id = id;
    this.register();
};

/** */
OK_Object_ToolBar.prototype = new OK_Object;

/**
 *
 */
OK_Object_ToolBar.prototype.__beforeresize = function ()
{
    if (!this.isDisplayed()) {
        return;
    };

    var _this = ok.$(this.id),
        _box = _this.firstElementChild,
        _b, lc;

    lc = _box.rows[0].cells.length;
    for (var i = 0; i < lc; i++) {
        _box.rows[0].cells[i].style.display = "";
    };

    _b = ok.$(this.id + '_TBTN');
    _b.style.display = "none";
};

/**
 *
 */
OK_Object_ToolBar.prototype.__resize = function ()
{
    if (!this.isDisplayed()) {
        return;
    };

    var _this = ok.$(this.id),
        _box = _this.firstElementChild,
        _b, lc;

    if (_box.offsetWidth > _this.clientWidth) {
        lc = _box.rows[0].cells.length - 1;
        while (_box.offsetWidth > _this.clientWidth - 24 && lc > 0) {
            _box.rows[0].cells[lc].style.display = "none";
            lc--;
        };

        _b = ok.$(this.id + '_TBTN');
        _b.style.right = (_this.clientWidth - _box.offsetWidth - 26) + "px";
        _b.style.display = "";
    };
};

/**
 *
 */
OK_Object_ToolBar.prototype.__more = function ()
{
    var _this = ok.$(this.id),
        _box = _this.firstElementChild,
        menu = ok.get(this.id + "_TBTN_MENU"),
        cells = _box.rows[0].cells,
        cell, o, c,
        _b, lc;

    menu.clear();
    for (var i = 0; i < cells.length; i++) {
        cell = _box.rows[0].cells[i];
        if (cell.style.display == "none") {
            o = cell.firstChild;
            if (o && (c = ok.get(o.id))) {
                o = menu.create(this.id + "_TBTN_MENUITEM_" + i, c.getText(), {onaction: function (e) {
                    ok.route('action', this._id);
                }});
                o._id = c.id;
                if (!c.enabled) {
                    o.disable();
                };
            };
        };
    };
};
