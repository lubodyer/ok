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
function OK_Object_Box2(id, orientation, align, valign)
{
    /**
     * @public
     * @readonly
     */
    this._type = "box2";

    /**
     * @public
     * @readonly
     */
    this.id = id;

    /**
     *
     * @iname align-box2
     */
    this.align = align ? align : "stretch";

    /**
     *
     */
    this.items = [];

    /**
     *
     */
    this.orientation = orientation ? orientation : "horizontal";

    /**
     *
     * @iname valign-box2
     */
    this.valign = valign ? valign : "stretch";

    // --

    this.register();
};

/** */
OK_Object_Box2.prototype = new OK_Object;

/**
 *
 */
OK_Object_Box2.prototype.add = function (id, type, size)
{
    size = size == null ? "100%" : size;

    this.items.push({id: id, type: type, size: size});
};

/**
 *
 */
OK_Object_Box2.prototype.get = function (index)
{
    return this.items[index];
};

/**
 *
 */
OK_Object_Box2.prototype.redraw = function ()
{
    ok.layout.resize(this.id);
};

/**
 *
 */
OK_Object_Box2.prototype.remove = function (index)
{
    var node, item = this.items[index];

    if (item) {
        if (item.type !== "spacer") {
            node = ok.$(item.id);
            node.parentNode.removeChild(node);
        };
        return [this.items.splice(index, 1)[0], node];
    };

    return null;
};

/**
 *
 */
OK_Object_Box2.prototype.getItemIndex = function (id)
{
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id == id) {
            return i;
        };
    };

    return -1;
};

/**
 *
 */
OK_Object_Box2.prototype.set = function (index, size, redraw)
{
    if (typeof index == "string") {
        index = this.getItemIndex(index);
    };
    if (this.items[index].size != size) {
        this.items[index].size = size;
    };
    if (redraw) {
        this.redraw();
    };
};

// --

/**
 *
 */
OK_Object_Box2.prototype.__beforeresize = function ()
{
    if (this.bubble("beforeresize")) {
        return 1;
    };

    // --

    var _b = ok.$(this.id);
    for (var i = 0, l = _b.childNodes.length; i < l; i++) {
        var n = _b.childNodes.item(i);
        if (n.nodeType != 1) {
            n.parentNode.removeChild(n);
            i--;
        };
    };

    //--

    return 1;
};

/**
 *
 */
OK_Object_Box2.prototype.__resize = function ()
{
    var _b = ok.$(this.id),
        _pl = ok.layout.get(_b, "padding-left"),
        _pt = ok.layout.get(_b, "padding-top"),
        _tx = _b.clientWidth - _pl - ok.layout.get(_b, "padding-right"),
        _ty = _b.clientHeight - _pt - ok.layout.get(_b, "padding-bottom"),
        _ts = this.orientation == "horizontal" ? _tx : _ty,
        matches, _n;

    if (!this.isDisplayed()) {
        return;
    };

    for (var i = 0, n = 0, _s = [], _d = [], _i, l = this.items.length; i < l; i++, n++) {
        _s[i] = 0;
        _i = this.items[i];
        if (/^\+?\-?[0-9]+$/.test(_i.size)) {
            _s[i] = _i.size;
        } else if ((matches = _i.size.match(/^([0-9]+)%$/)) && matches[1] != 100) {
            _s[i] = Math.floor((this.orientation == "horizontal" ? _tx : _ty) * (matches[1] / 100));
        };

        if (_i.type == "spacer") {
            n--;
        } else if (_s[i] > 0) {
            _n = _b.childNodes.item(n);
            _n.style.position = "absolute";
            _n.style.display = "";
            _n.style.top = 0;
            _n.style.left = 0;
            if (this.orientation == "horizontal") {
                    _i.currentWidth = _s[i];
                    _i.currentHeight = _ty;
                } else {
                    _i.currentWidth = _tx;
                    _i.currentHeight = _s[i];
                };
            _n.style.width = _i.currentWidth + "px";
            _n.style.height = _i.currentHeight + "px";
            _s[i] = this.orientation == "horizontal" ? _n.offsetWidth : _n.offsetHeight;
            _d[i] = 1;
        } else {
            _n = _b.childNodes.item(n);
            _n.style.display = "none";
        };
    };

    for (var i = 0, __s = 0, _i, __i = 0; i < l; i++) {
        _i = this.items[i];
        __s += _s[i];
        if (_s[i] == 0 && _i.size == "100%") {
            __i++;
        };
    };

    __s = _ts - __s;

    for (var i = 0, n = 0, ___s = 0; i < l; i++, n++) {
        _i = this.items[i];
        if (_s[i] == 0 && _i.size == "100%") {
            _s[i] = (__s / __i);
        };
        if (_i.type != "spacer") {
            _n = _b.childNodes[n];
            _n.style.position = "absolute";
            _n.style.display = _s[i] == 0 ? "none" : "";
            if (_d[i] !== 1 && _s[i] !== -1) {
                if (this.orientation == "horizontal") {
                    _i.currentWidth = _s[i];
                    _i.currentHeight = _ty;
                } else {
                    _i.currentWidth = _tx;
                    _i.currentHeight = _s[i];
                };
                _n.style.width = _i.currentWidth + "px";
                _n.style.height = _i.currentHeight + "px";
            };

            if (this.orientation == "horizontal") {
                _i.currentLeft = ___s + _pl;
                _i.currentTop = _pt;
            } else {
                _i.currentLeft = _pl;
                _i.currentTop = ___s + _pt;
            };

            _n.style.top = _i.currentTop + "px";
            _n.style.left = _i.currentLeft + "px";

            if (_s[i] > 0) {
                ok.layout.resize(_n);
            };
        } else {
            n--;
        };

        ___s += _s[i];
    };

    this.bubble("resize");

    return 1;
};

