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
function OK_Object_TabBox(id, className, active)
{
    this.id = id;
    this._type = "tabs";
    this.className = className;
    this.tabindex = -1;

    this.last = -1;
    this.active = active ? active : 0;
    this.items = [];

    this.register();
};

/**
 *
 */
OK_Object_TabBox.prototype = new OK_Object;

/**
 *
 */
OK_Object_TabBox.prototype.add = function (id)
{
    var item = ok.get(id);

    item.parent = this;
    var ilen = this.items.length;
    this.items[ilen] = item;
    item.index = ilen;
    if (this.active == ilen) {
        item._mode = 0;
    } else if (ilen < this.active) {
        tabItem._mode = 1;
    } else {
        item._mode = 2;
    };
};

OK_Object_TabBox.prototype.activate = function (itemNo, noEvents)
{
    if (this.active == itemNo || !this.items[itemNo].enabled) {
        return 0;
    }

    if (!noEvents && itemNo !== this.items.length - 1 && ok.route({type: "beforeactivate", index: itemNo, id: this.items[itemNo].id}, this)) {
        return 0;
    };

    this.last = this.active;
    this.active = itemNo;
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].redraw();
    };
    ok.layout.resize(this.id);

    if (!noEvents) {
        ok.route({type: "activate", index: itemNo, id: this.items[itemNo].id}, this);
    };

    return 1;
};

OK_Object_TabBox.prototype.deactivate = function ()
{
    if (this.active != -1) {
        this.last = -1;
        this.active = -1;
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].redraw();
        };
    };
};

OK_Object_TabBox.prototype.getActive = function ()
{
    return this.items[this.active];
};

OK_Object_TabBox.prototype.__activate = function (e)
{
    var menu, _self, cells, i = 0, c, mi;

    if (this.active == this.items.length - 1)
    {
        _self = ok.$(this.id);
        menu = ok.get(this.id + ":MORE:MENU");
        cells = _self.rows[0].cells;

        menu.clear();
        menu.parentObject = this.items[this.active];
        menu._id = this.id;
        for (c = 0; c < cells.length - 1; c++) {
            if (cells[c].className !== this.className + "_EMPTY") {
                if (cells[c].style.display == "none" && this.items[i].enabled) {
                    mi = menu.create(this.id + ":MORE:MENU:" + i, ok.$(this.items[i].id + ":cell").innerHTML);
                    mi._id = this.id;
                    mi._index = i;
                    mi.onaction = function (e) {
                        this.parentMenu.hide(1);
                        ok.get(this._id).activate(this._index);
                    };
                    if (this.last == i) {
                        mi.disable();
                    };
                };
                i++;
            };
        };
        menu.onhide = function (e) {
            var tb = ok.get(this._id);
            if (tb.active == tb.items.length - 1) {
                if (tb.last > -1) {
                    tb.activate(tb.last);
                } else {
                    tb.deactivate();
                };
            };
        };
        menu.show();
        return;
    };

    this.bubble(e);
};

OK_Object_TabBox.prototype.__beforeresize = function (e)
{
    return 1;
};

OK_Object_TabBox.prototype.__resize = function (e)
{
    if (!this.isDisplayed()) { return; };

    var _this = ok.$(this.id),
        _p = _this.parentNode,
        cells = _this.rows[0].cells,
        i, c = cells.length - 1;

    this.items[this.items.length - 1].disable(1);

    for (i = 0, c = 0; c < cells.length - 1; c++) {
        if (cells[c].className !== this.className + "_EMPTY") {
            if (this.items[i].enabled) {
                cells[c].style.display = "";
            };
            i++;
        };
    };

    if (_this.offsetWidth > _p.clientWidth) {
        this.items[this.items.length - 1].enable(1);
        c = cells.length - 1;
        i = this.items.length - 1;
        while (c >= 0 && _this.offsetWidth > _p.clientWidth) {
            if (cells[c].className !== this.className + "_EMPTY") {
                if (i !== this.active && i !== this.items.length - 1 && !(this.active === this.items.length - 1 && i === this.last)) {
                    cells[c].style.display = "none";
                };
                i--;
            };
            c--;
        };
    };

    for (i = 0; i < this.items.length; i++) {
        this.items[i].redraw();
    };

    this.bubble(e);
    return 1;
};
