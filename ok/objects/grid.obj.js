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
function OK_Object_Grid(id, tabindex, className, header, text, padding, rowheight, selectedindex)
{
    this.id = id;
    this._type = "grid";
    this.tabindex = tabindex ? tabindex : 0;
    this.className = className;
    this.text = text;
    this.header = header ? 1 : 0;
    this.headerheight = 32;
    this.border = 1;
    this.padding = padding;

    /**
     * Sets or retrieves the height of the grid row.
     * @var int
     */
    this.rowheight = rowheight ? rowheight: 22;

    this.selectedIndex = selectedindex == null ? -1 : selectedindex;

    this.cols = [];
    this.rows = [];

    this._row = 0;
    this._col = 0;

    this._rows = 0;
    this._width = 0;
    this._vscroll = 0;
    this._hscroll = 0;

    this.scrollX = 1;
    this.scrollY = 1;

    this.top = 0;
    this._top = 0;
    this.left = 0;
    this._left = 0;

    this.bounceX = 60;
    this.bounceY = 120;

    // --

    this.register();
    this.capture("dblclick");
    this.capture('mousedown');
    this.capture('mousemove');
    this.capture('mouseout');
    this.capture("DOMMouseScroll");
    this.capture("mousewheel");
};

/** */
OK_Object_Grid.prototype = new OK_Object;

/**
 *
 *
 */
OK_Object_Grid.prototype.addcol = function (col) {
    if (col instanceof OK_Object_GridCol) {
        this.cols.push(col);
        return 1;
    };
    return 0;
};

/**
 *
 *
 */
OK_Object_Grid.prototype.addrow = function (row)
{
    if (row instanceof OK_Object_GridRow) {
        this.rows.push(row);
        return 1;
    };
    return 0;
};

/**
 *
 */
OK_Object_Grid.prototype.clear = function ()
{
    this.rows = [];
    this._row = 0;
    this._col = 0;
    this.top = 0;
    this._top = 0;
    this.left = 0;
    this._left = 0;
    this.selectedIndex = -1;
};

/**
 * Retrieves the data of the specified cell.
 * @param {int} row The row number starting from zero.
 * @param {int} col The column number starting from zero.
 * @param {string} The data of the cell.
 */
OK_Object_Grid.prototype.getCell = function (row, col)
{
    return this.rows[row].cells[col];
};

/**
 * Retrieves the total count of the grid rows.
 * @return {int}
 */
OK_Object_Grid.prototype.getRows = function ()
{
    return this.rows.length;
};

/**
 *
 */
OK_Object_Grid.prototype.redraw = function ()
{
    ok.layout.resize(this.id);
};

/**
 *
 */
OK_Object_Grid.prototype.draw = function (soft)
{
    var rows = this.getRows(),
        cols = this.cols.length,
        _g = ok.$(this.id),
        _d = ok.$(this.id + ":DATA"),
        _h = ok.$(this.id + ":HEADER"),
        padding, output, row, row_id, _r, k, w, c;

    if (!this.isDisplayed() || this.bubble("beforeredraw")) {
        return 0;
    };

    // --

    if (!soft) {
        _d.innerHTML = "";
    };

    // --

    if (this.selectedIndex > rows - 1) {
        this.selectedIndex = rows - 1;
        if (this.selectedIndex == -1) {
            ok.events.bubble('unselect', this);
        };
    };

    // --

    this._row = Math.max(0, Math.floor(this._top / this.rowheight));
    this._row = Math.min((this._height / this.rowheight) - 1, this._row);
    this._rows = Math.ceil(this.height / this.rowheight);
    this._max = rows - this._row > this._rows ? this._rows : rows - this._row;
    this._max += this._max + this._row < rows ? 1 : 0;

    if (this._row + this._max < rows - this._rows) {
        this._max += this._rows;
    } else {
        this._max = rows - this._row;
    };

    if (!rows) {
        _d.innerHTML = "<div class='" + (this.className + "_TEXT") + "'>" + this.text + "</div>";
    }
    else
    {
        for (row = this._row; row < this._row + this._max; row++)
        {
            row_id = this.id + ":ROW:" + row;
            _r = ok.$(row_id);

            if (_r) {
                continue;
            };

            if (!_r) {
                _r = document.createElement("DIV");
                _r.id = row_id;
                _r.className = this.className + "_ROW";
                _r.style.top = (row * this.rowheight) + "px";
                _r.style.left = 0;
                _r.style.width = this._width + "px";
                _r.style.height = this.rowheight + "px";
                _d.appendChild(_r);
            };

            output = [];

            for (k = 0, w = 0; k <= cols; k++)
            {
                if (!(c = this.cols[k])) {
                    c = {_last: 1, width: this.width - w > 0 ? this.width - w : 0, title: ""};
                };

                if (c.width)
                {
                    output.push("<div id='");
                    output.push(this.id);
                    output.push(":CELL:");
                    output.push(row);
                    output.push(":");
                    output.push(k);
                    output.push("' class='");
                    output.push(this.className);
                    output.push("_CELL");
                    if (row == this.selectedIndex && !c._last) {
                        output.push(" ");
                        output.push(this.className);
                        output.push("_CELL_");
                        output.push(this.focused ? "SELECTED" : "BLURRED");
                    };
                    output.push("' style='");
                    output.push("left: ");
                    output.push(w);
                    output.push("px; width:");
                    output.push(c.width);
                    output.push("px; height:");
                    output.push(this.rowheight);
                    output.push("px; padding:");
                    padding = c.padding === null ? this.padding : c.padding;
                    output.push(padding);
                    output.push("px;");
                    if (c.align) {
                        output.push("text-align:");
                        output.push(c.align);
                        output.push(";");
                    };
                    if (!c._last) {
                        output.push(c.style);
                    };
                    output.push("'>");

                    if (!c._last) {
                        output.push(this.getCell(row, k));
                    };
                    output.push("</div>");
                };

                w += c.width;
            };

            // --

            _r.innerHTML = output.join("");
        };
    };

    // --

    _h.style[ok.css.transformJS] = "translate3d(" + (-this._left) + "px, 0, 0)";
    _d.style[ok.css.transformJS] = "translate3d(" + (-this._left) + "px, " + (-this._top) + "px, 0)";

    // --

    this.bubble("redraw");
};

//------------------------------------------------------------------------------/

/**
 *
 */
OK_Object_Grid.prototype.select = function (index, noEvents)
{
    if (index > -1 && index !== this.selectedIndex && index < this.getRows()) {
        ok.route({type: "select", row: index, noEvents: noEvents}, this);
    };
};

/**
 *
 */
OK_Object_Grid.prototype.unselectAll = function ()
{
    if (this.selectedIndex > -1) {
        ok.route({type: "unselect", row: this.selectedIndex}, this);
    };
};

//------------------------------------------------------------------------------/

/**
 *
 */
OK_Object_Grid.prototype._create = function (e)
{
    var _g = ok.$(this.id),
        _h = ok.$(this.id + ":HEADER"),
        _d = ok.$(this.id + ":DATA"),
        c, _c = [], __c, _c1, _c2, i, l, matches, rows, _s, w;

    if (this._created || !this.isDisplayed()) {
        return;
    };

    // --

    this._created = 1;

    // --

    rows = this.getRows();

    this.top = 0;
    this._top = 0;
    this.left = 0;
    this._left = 0;
    this.width = _g.clientWidth;
    this.height = _g.clientHeight;
    this._width = 0;
    this._height = rows * this.rowheight;

    _h.innerHTML = "";
    _d.innerHTML = "";

    // --

    if (this.header)
    {
        this.top = this.rowheight;

        _h.style.width = this.width + "px";
        _h.style.height = this.headerheight + "px";
        _h.style.display = this.header ? "block" : "none";
    };

    // --

    for (i = 0, l = this.cols.length; i < l; i++)
    {
        c = this.cols[i];
        if (c._width != null) {
            c.width = c._width;
            c._width = null;
        };
        if (c.width) {
            if (typeof c.width == "string" && (matches = c.width.match(/^([0-9]+)\%$/))) {
                _c.push([i, c, matches[1]]);
            } else {
                this._width += c.width;
            };
        };
    };

    for (i = 0; i < _c.length; i++)
    {
        __c = _c[i];
        c = __c[1];
        c._width = c.width;
        c.width = (this.width - this._width) * (__c[2] / 100);
    };

    // --

    this._width = 0;

    for (i = 0, l = this.cols.length; i <= l; i++)
    {
        if (!(c = this.cols[i])) {
            c = {'_last': 1, 'width': this.width - this._width > 0 ? this.width - this._width : 0, 'title': ""};
        };

        if (c && this.header)
        {
            _c1 = document.createElement("DIV");
            _c2 = document.createElement("DIV");

            _c1.id = this.id + ":COL:" + i;
            _c1.className = _g.className + "_COL";
            _c1.style.width = c.width + "px";
            _c1.style.height = _h.clientHeight + "px";
            _c1.style.left = this._width + "px";
            _h.appendChild(_c1);

            _c2.id = _c1.id + ":TITLE";
            _c2.className = _g.className + "_COL_TITLE";
            _c2.style.width = _c1.clientWidth + "px";
            _c2.style.height = _c1.clientHeight + "px";
            _c1.appendChild(_c2);
            _c2.innerHTML = c.title;
        };

        if (!c._last) {
            this._width += c.width;
        };
    };

    if (this.header)
    {
        for (i = 0, l = this.cols.length, w = 0; i < l; i++)
        {
            c = this.cols[i];
            _c1 = document.createElement("DIV");
            _c2 = document.createElement("DIV");

            w += c.width;

            _c1.id = this.id + ":COL:" + i + ":RESIZER";
            _c1.className = _g.className + "_COL_RESIZER";
            _c1.style.height = _h.clientHeight + "px";
            _c1.style.left = (w - 5) + "px";
            _h.appendChild(_c1);

            _c2.id = this.id + ":COL:" + i + ":HANDLE";
            _c2.className = _g.className + "_COL_HANDLE";
            _c2.style.top = "4px";
            _c2.style.height = (_c1.clientHeight - 8) + "px";
            _c1.appendChild(_c2);
        };
    };
};

//------------------------------------------------------------------------------/

/**
 *
 * @access private
 */
OK_Object_Grid.prototype.__beforeresize = function (e)
{
    this.bubble("beforeresize");
    return 1;
};

/**
 *
 */
OK_Object_Grid.prototype.__focus = function (e)
{
    if (this.selectedIndex > -1) {
        var row = this.selectedIndex;
        if (ok.$(this.id + ":ROW:" + row)) {
            for (var i = 0, l = this.cols.length; i < l; i++) {
                ok.fn.removeClass(ok.$(this.id + ":CELL:" + row + ":" + i), ok.$(this.id).className + "_CELL_BLURRED");
                ok.fn.addClass(ok.$(this.id + ":CELL:" + row + ":" + i), ok.$(this.id).className + "_CELL_SELECTED");
            };
        };
    };
};

/**
 *
 */
OK_Object_Grid.prototype.__blur = function (e)
{
    if (this.selectedIndex > -1) {
        var row = this.selectedIndex;
        if (ok.$(this.id + ":ROW:" + row)) {
            for (var i = 0, l = this.cols.length; i < l; i++) {
                ok.fn.removeClass(ok.$(this.id + ":CELL:" + row + ":" + i), ok.$(this.id).className + "_CELL_SELECTED");
                ok.fn.addClass(ok.$(this.id + ":CELL:" + row + ":" + i), ok.$(this.id).className + "_CELL_BLURRED");
            };
        };
    };
};

/**
*
*
*/
OK_Object_Grid.prototype.__dblclick = function (e)
{
    if (e.button !== ok.BUTTON_LEFT) {
        return;
    };

    this.focus();

    var _g = ok.$(this.id),
        target = e.target || e.srcElement,
        m = target.id.split(/:/);

    if (m[1] == "CELL") {
        ok.events.route({
            type: "action",
            row: Number(m[2]),
            col: Number(m[3])
        }, this);
    };

};

/**
 *
 *
 */
OK_Object_Grid.prototype.__mousedown = function (e)
{
    var m, _g = ok.$(this.id),
        target = e.target || e.srcElement,
        rx = new RegExp("^" + this.id),
        row;

    this.focus();

    while (target && !rx.test(target.id)) {
        target = target.parentNode;
    };

    m = target.id.split(/:/);
    if (m[1] == "CELL") {
        row = Number(m[2]), col = Number(m[3]);
        ok.events.route({type: 'select', source: this, row: row, col: col, e: e}, this);
        if (e.button == ok.BUTTON_RIGHT) {
            ok.events.route({type: 'contextmenu', row: row, col: col, e: e}, this);
        };
    };
};

/**
 *
 * @access private
 */
OK_Object_Grid.prototype.__mousemove = function (e)
{
    var _g = ok.$(this.id), target = e.target || e.srcElement, m = target.id.split(/:/);

    if (m[1] == "COL") {
        if (this.___COL___ == null) {
            if (m[2] < this.cols.length) {
                var _c1 = ok.$(this.id + ":COL:" + m[2]),
                    _c2 = ok.$(this.id + ":COL:" + m[2] + ":TITLE"),
                    _c3 = ok.$(this.id + ":COL:" + m[2] + ":HANDLE");
//              ok.fn.addClass(_c1, _g.className + "_COL_OVER");
//              ok.fn.addClass(_c2, _g.className + "_COL_TITLE_OVER");
//              _c3.style.visibility = "hidden";
                this.___COL___ = m[2];
            };
        } else {
            var _c1 = ok.$(this.id + ":COL:" + this.___COL___),
                _c2 = ok.$(this.id + ":COL:" + this.___COL___ + ":TITLE"),
                _c3 = ok.$(this.id + ":COL:" + this.___COL___ + ":HANDLE");
            ok.fn.removeClass(_c1, _g.className + "_COL_OVER");
            ok.fn.removeClass(_c2, _g.className + "_COL_TITLE_OVER");
            _c3.style.visibility = "visible";

            if (m[2] < this.cols.length) {
                var _c1 = ok.$(this.id + ":COL:" + m[2]),
                    _c2 = ok.$(this.id + ":COL:" + m[2] + ":TITLE"),
                    _c3 = ok.$(this.id + ":COL:" + m[2] + ":HANDLE");
//              ok.fn.addClass(_c1, _g.className + "_COL_OVER");
//              ok.fn.addClass(_c2, _g.className + "_COL_TITLE_OVER");
//              _c3.style.visibility = "hidden";
                this.___COL___ = m[2];
            };
        };
    } else if (this.___COL___ != null) {
        var _c1 = ok.$(this.id + ":COL:" + this.___COL___),
            _c2 = ok.$(this.id + ":COL:" + this.___COL___ + ":TITLE"),
            _c3 = ok.$(this.id + ":COL:" + this.___COL___ + ":HANDLE");
        ok.fn.removeClass(_c1, _g.className + "_COL_OVER");
        ok.fn.removeClass(_c2, _g.className + "_COL_TITLE_OVER");
        _c3.style.visibility = "visible";
        this.___COL___ = null;
    };

};

/**
 *
 */
OK_Object_Grid.prototype.__mouseout = function (e)
{
    var out = 1, target = e.toElement || e.relatedTarget;

    if (target && target.id != this.id) while (out && target) {
        if (target.id == this.id) out = 0;
        target = target.parentNode;
    };

    if (out && this.___COL___ != null) {
        var _g = ok.$(this.id),
            _c1 = ok.$(this.id + ":COL:" + this.___COL___),
            _c2 = ok.$(this.id + ":COL:" + this.___COL___ + ":TITLE"),
            _c3 = ok.$(this.id + ":COL:" + this.___COL___ + ":HANDLE");
        ok.fn.removeClass(_c1, _g.className + "_COL_OVER");
        ok.fn.removeClass(_c2, _g.className + "_COL_TITLE_OVER");
        _c3.style.visibility = "visible";
        this.___COL___ = null;
    };
};

/**
 *
 */
OK_Object_Grid.prototype.__DOMMouseScroll = function (e)
{
    var delta = e.detail,
        vsc = ok.get(this.id + ":VSCROLL");

    vsc.setValue(vsc.getValue() + vsc._small * delta);
};

/**
 *
 */
OK_Object_Grid.prototype.__mousewheel = function (e)
{
    var delta = Math.round(-1 * (e.wheelDelta / 40)),
        vsc = ok.get(this.id + ":VSCROLL");

    vsc.setValue(vsc.getValue() + vsc._small * delta);
};

// --

/**
 *
 */
OK_Object_Grid.prototype.__resize = function (e)
{
    var _g = ok.$(this.id),
        _h = ok.$(this.id + ":HEADER"),
        _d = ok.$(this.id + ":DATA"),
        c, _c1, _c2, s, _s, i, l, _c = [], __c, matches, rows, w;

    if (!this.isDisplayed()) {
        return;
    };

    if (!this._created) {
        this._create();
    };

    // --

    rows = this.getRows();

    this.top = 0;
    this.left = 0;
    this.width = _g.clientWidth;
    this.height = _g.clientHeight;
    this._width = 0;
    this._height = rows * this.rowheight;

    // --

    this._hscroll = 0;
    this._vscroll = 0;
    if (ok.client.mobile) {
        this._hscroll = this.scrollX && this._width > this.width;
        this._vscroll = this.scrollY && this._height > this.height;
    } else {
        for (i = 0; i < 2; i++) {
            if (this.scrollX && !this._hscroll && this._width > this.width) {
                this._hscroll = 1;
                this.height -= 16;
            };

            if (this.scrollY && !this._vscroll && this._height > this.height) {
                this._vscroll = 1;
                this.width -= 16;
            };
        };
    };

    // --

    for (i = 0, l = this.cols.length; i < l; i++)
    {
        c = this.cols[i];
        if (c._width != null) {
            c.width = c._width;
            c._width = null;
        };
        if (c.width) {
            if (typeof c.width == "string" && (matches = c.width.match(/^([0-9]+)\%$/))) {
                _c.push([i, c, matches[1]]);
            } else {
                this._width += c.width;
            };
        };
    };

    for (i = 0; i < _c.length; i++)
    {
        __c = _c[i];
        c = __c[1];
        c._width = c.width;
        c.width = (this.width - this._width) * (__c[2] / 100);
    };

    // --

    this._width = 0;

    for (i = 0, l = this.cols.length; i <= l; i++)
    {
        if (!(c = this.cols[i])) {
            c = {'_last': 1, 'width': this.width - this._width > 0 ? this.width - this._width : 0, 'title': "" }
        };

        if (c && this.header) {
            _c1 = ok.$(this.id + ":COL:" + i);
            _c2 = ok.$(_c1.id + ":TITLE");

            _c1.style.width = c.width + "px";
            _c1.style.height = this.headerheight + "px";
            _c1.style.left = this._width + "px";

            _c2.style.width = _c1.clientWidth + "px";
            _c2.style.height = "auto"; // _c1.clientHeight + "px";
            //~ _c2.style.padding = this.padding + "px";
            if (c.align) {
                _c2.style.textAlign = c.align;
            };
        };

        if (!c._last) {
            this._width += c.width;
        };
    };

    if (this.header) {
        this.top = this.headerheight;
        for (i = 0, l = this.cols.length, w = 0; i < l; i++) {
            c = this.cols[i];
            _c1 = ok.$(this.id + ":COL:" + i + ":RESIZER");
            _c2 = ok.$(this.id + ":COL:" + i + ":HANDLE");

            w += c.width;

            _c1.style.height = _h.clientHeight + "px";
            _c1.style.left = (w - 5) + "px";

            _c2.style.top = "4px";
            _c2.style.height = (_c1.clientHeight - 8) + "px";
        };
    };

    // --

    this._hscroll = this.scrollX && this._width > this.width;
    this._vscroll = this.scrollY && this._height > this.height - this.top;

    // --

    this._width = Math.max(this._width, this.width);
    this._height = Math.max(this._height, this.height);


    _s = ok.$(this.id + ":HSCROLL");
    if (this._hscroll)
    {
        _s.style.left = 0;
        _s.style.bottom = 0;
        _s.style.top = "auto";
        _s.style.right = "auto";
        _s.style.width = this.width - (this._vscroll && !ok.client.mobile ? 16 : 0) + "px";
        _s.style.opacity = 0;
        _s.style[ok.css.transitionJS] = "opacity .25s ease-in-out";
        _s.style.display = "";
        ok.layout.resize(_s);
        if (!ok.client.mobile) {
            _s.style.opacity = 1;
        };

        s = ok.get(this.id + ":HSCROLL");
        s.set(this._left, 0, this._width - this.width, 16, this.width);
    } else {
        _s.style.display = "none";
    };

    _s = ok.$(this.id + ":VSCROLL");
    if (this._vscroll)
    {
        _s.style.top = 0;
        _s.style.right = 0;
        _s.style.left = "auto";
        _s.style.bottom = "auto";
        _s.style.height =  this.height - (this._hscroll && !ok.client.mobile ? 16 : 0) + "px";
        _s.style.opacity = 0;
        _s.style[ok.css.transitionJS] = "opacity .25s ease-in-out";
        _s.style.display = "";
        ok.layout.resize(_s);
        if (!ok.client.mobile) {
            _s.style.opacity = 1;
        };

        s = ok.get(this.id + ":VSCROLL");
        s.set(this._top, 0, this._height - this.height, this.rowheight, this.height);
    } else {
        _s.style.display = "none";
    };

    // --

    _h.style.width = this._width + "px";
    _h.style.display = this.header ? "block" : "none";

    _d.style.top = this.top + "px";
    _d.style.left = this.left + "px";
    _d.style.width = this._width + "px";
    _d.style.height = this._height + "px";

    // --

    this.draw();
    this.bubble("resize");
    return 1;
};

/**
 *
 */
OK_Object_Grid.prototype.__select = function (e)
{
    var _r, rows;

    if (!e.noEvents && this.bubble({type: "beforeselect", e: e.e, row: e.row})) {
        return 1;
    };

    if (this.selectedIndex > -1 && this.selectedIndex != e.row) {
        ok.events.route({ type: "unselect", e: e.e, row: this.selectedIndex, noEvents: e.noEvents }, this);
    };

    this.selectedIndex = e.row;

    _r = ok.$(this.id + ":ROW:" + e.row);
    if (_r) {
        for (var i = 0, l = this.cols.length; i < l; i++) {
            ok.fn.addClass(ok.$(this.id + ":CELL:" + e.row + ":" + i), ok.$(this.id).className + "_CELL_" + (this.focused ? "SELECTED" : "BLURRED"));
        };
    };

    if (!e.noEvents) {
        this.bubble({type: "select", source: this, row: this.selectedIndex, e: e.e});
    };
};

/**
 *
 */
OK_Object_Grid.prototype.__unselect = function (e)
{
    if (this.selectedIndex == e.row) {
        this.selectedIndex = -1;

        if (ok.$(this.id + ":ROW:" + e.row)) {
            for (var i = 0, l = this.cols.length; i < l; i++) {
                ok.fn.removeClass(ok.$(this.id + ":CELL:" + e.row + ":" + i), ok.$(this.id).className + "_CELL_" + (this.focused ? "SELECTED" : "BLURRED"));
            };
        };

        if (!e.noEvents) {
            this.bubble({type: "unselect", source: this, row: e.row, e: e.e});
        };
    };
};

/**
 *
 */
OK_Object_Grid.prototype.__scroll = function (e)
{
    if (e.source._vertical) {
        this._top = e.value;
    } else {
        this._left = e.value;
    };

    this.draw(1);
};


// --

/**
 *
 */
OK_Object_Grid.prototype.__swiping = function (e)
{
    var vsc = ok.get(this.id + ":VSCROLL"),
        hsc = ok.get(this.id + ":HSCROLL"),
        _s = ok.$(this.id + ":DATA"),
        left = this._left,
        _left = this._width - this.width,
        top = this._top,
        _top = this._height - this.height;

    if (e.gesture.fingers === 1)
    {
        if (!e.gesture.swipe.lockDirection) {
            e.gesture.swipe.lockDirection = e.gesture.swipe.direction;
        };

        switch (e.gesture.swipe.lockDirection)
        {
            case "up":
            case "down":
                ok.$(this.id + ":VSCROLL").style.opacity = 1;

                top -= e.gesture.swipe.deltaY;
                if (this.bounceY) {
                    if (top < 0 && top > -this.bounceY) {
                        top += e.gesture.swipe.deltaY * 0.5;
                    };
                    top = Math.max(top, -this.bounceY);
                    top = Math.min(top, _top + this.bounceY);
                } else {
                    top = Math.max(top, 0);
                    top = Math.min(top, _top);
                };

                break;

            case "left":
            case "right":
                ok.$(this.id + ":HSCROLL").style.opacity = 1;

                left -= e.gesture.swipe.deltaX;
                if (this.bounceX) {
                    if (left < 0 && left > -this.bounceX) {
                        left += e.gesture.swipe.deltaX * 0.5;
                    };
                    left = Math.max(left, -this.bounceX);
                    left = Math.min(left, _left + this.bounceX);
                } else {
                    left = Math.max(left, 0);
                    left = Math.min(left, _left);
                };

                break;
        };
    };

    if (left !== this._left || top !== this._top)
    {
        this._left = left;
        this._top = top;

        _s.style[ok.css.transformJS] = "translate3d(" + (this._left * -1 + "px") + ", " + (this._top * -1 + "px") + ", 0)";
        vsc.setValue(this._top, 1);
        hsc.setValue(this._left, 1);
        this.draw(1);

        // --

        ok.events.bubble({type: "scroll", top: this._top, left: this._left}, this.id);
    };
};

/**
 *
 */
OK_Object_Grid.prototype.__swipe = function (e)
{
    var _left = this._width - this.width,
        _top = this._height - this.height;

    if (e.gesture.fingers === 1)
    {
        switch (e.gesture.swipe.lockDirection)
        {
            case "up":
            case "down":
                if (this._top < 0 || this._top > _top)
                {
                    ok.$(this.id + ":VSCROLL").style.opacity = 0;

                    // --

                    ok.pause();
                    ok.fx.create(this.id, function (delta)
                    {
                        var c = ok.get(this._id),
                            _c = ok.$(this._id + ":DATA");

                        c._top = delta;
                        c.draw(1);

                        ok.events.bubble({type: "scroll", top: c._top, left: c._left}, c.id);

                    }, this._top, this._top > _top ? _top : 0, 180, { onfinish: function (e) {
                        ok.resume();
                    }}, null, "ease-out");
                    return;
                };
                break;
            case "left":
            case "right":
                if (this._left < 0 || this._left > _left)
                {
                    ok.$(this.id + ":HSCROLL").style.opacity = 0;

                    // --

                    ok.pause();
                    ok.fx.create(this.id, function (delta)
                    {
                        var c = ok.get(this._id),
                            _c = ok.$(this._id + ":DATA");

                        c._left = delta;
                        c.draw();

                        ok.events.bubble({type: "scroll", left: c._left, top: c._top}, c.id);

                    }, this._left, this._left > _left ? _left : 0, 180, { onfinish: function (e) {
                        ok.resume();
                    }}, null, "ease-out");
                    return;
                };

                break;
        };

        return 1;
    };
};

/**
 *
 */
OK_Object_Grid.prototype.__swipekinetics = function (e)
{
    var vsc = ok.get(this.id + ":VSCROLL"),
        hsc = ok.get(this.id + ":HSCROLL"),
        _s = ok.$(this.id + ":DATA"),
        left = this._left,
        _left = this._width - this.width,
        top = this._top,
        _top = this._height - this.height;

    if (e.gesture.fingers === 1)
    {
        switch (e.gesture.swipe.lockDirection)
        {
            case "up":
            case "down":
                ok.$(this.id + ":VSCROLL").style.opacity = 1;

                top -= e.gesture.swipe.deltaY;

                if (this.bounceY) {
                    if (top < 0 && top > -this.bounceY) {
                        top += e.gesture.swipe.deltaY * 0.5;
                    };

                    top = Math.max(top, -this.bounceY);
                    top = Math.min(top, _top + this.bounceY);
                } else {
                    top = Math.max(top, 0);
                    top = Math.min(top, _top);
                };

                // --

                this._top = top;
                vsc.setValue(this._top, 1);
                this.draw(1);

                // --

                if ((this.bounceY && top == -this.bounceY || top == _top + this.bounceY) || (!this.bounceY && top == 0 || top == _top)) {
                    ok.touch.clear();
                    e.type = "swipekineticsend";
                    ok.route(e, this);
                } else {
                    ok.events.bubble({type: "scroll", top: this._top, left: this._left}, this.id);
                };

                break;
            case "left":
            case "right":
                ok.$(this.id + ":HSCROLL").style.opacity = 1;

                left -= e.gesture.swipe.deltaX;

                if (this.bounceX) {
                    if (left < 0 && left > -this.bounceX) {
                        left += e.gesture.swipe.deltaX * 0.5;
                    };

                    left = Math.max(left, -this.bounceX);
                    left = Math.min(left, _left + this.bounceX);
                } else {
                    left = Math.max(left, 0);
                    left = Math.min(left, _left);
                };

                // --

                this._left = left;
                hsc.setValue(this._left, 1);
                this.draw(1);

                // --

                if ((this.bounceX && left == -this.bounceX || left == _left + this.bounceX) || (!this.bounceX && left == 0 || left == _left)) {
                    ok.touch.clear();
                    e.type = "swipekineticsend";
                    ok.route(e, this);
                } else {
                    ok.events.bubble({type: "scroll", left: this._left, top: this._top}, this.id);
                };
                break;
        };
    };
};

/**
 *
 */
OK_Object_Grid.prototype.__swipekineticsend = function (e)
{
    var _left = this._width - this.width,
        _top = this._height - this.height;

    ok.$(this.id + ":VSCROLL").style.opacity = 0;
    ok.$(this.id + ":HSCROLL").style.opacity = 0;

    // --

    if (this._top < 0 || this._top > _top || this._left < 0 || this._left > _left)
    {
        this.__top = this._top;
        this.__left = this._left;
        this._mtop = _top;
        this._mleft = _left;

        ok.pause();
        fx = ok.fx.create(this.id, function (delta)
        {
            var c = ok.get(this._id),
                _c = ok.$(this._id + ":DATA");

            c._top = ok.fx.current(c.__top, c.__top > c._mtop ? c._mtop : 0, delta);
            c._left = ok.fx.current(c.__left, c.__left > c._mleft ? c._mleft : 0, delta);
            c.draw(1);

            ok.events.bubble({type: "scroll", top: c.top, left: c.left}, c.id);

        }, 0, 1, 180, { onfinish: function (e) {
            var c = ok.get(this._id),
                vsc = ok.get(c.id + ":VSCROLL"),
                hsc = ok.get(c.id + ":HSCROLL");

            vsc.setValue(c._top, 1);
            hsc.setValue(c._left, 1);

            ok.resume();
        }}, null, "ease-out");
    };
};

// --

/**
 *
 */
OK_Object_Grid.prototype.__tap = function (e)
{
    ok.route({type: "mousedown", target: e.gesture.node}, this);
};


//------------------------------------------------------------------------------/

/**
 * @class
 *
 */
function OK_Object_GridCol(title, width, align, sort, filter, padding, style)
{
    this.title = title;
    this.width = width;
    this.align = align;
    this.sort = sort;
    this.filter = filter;
    this.padding = padding;
    this.style = style ? style : "";
};

//------------------------------------------------------------------------------/

/**
 * @class
 */
function OK_Object_GridRow(cells)
{
    this.cells = cells;
};

