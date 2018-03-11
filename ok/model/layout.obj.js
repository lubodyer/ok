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
 *
 * @class
 */
function OK_Layout () { };

/**
 *
 */
OK_Layout.prototype.append = function (node, data, script)
{
    var nodes = [], _node, buffer = [];

    if (!node) {
        node = document.body;
    };

    try {
        node = (typeof node == "string") ? ok.$(node) : node;

        var d = document.createElement("DIV");
        d.innerHTML = data;

        while (d.childNodes.length) {
            _node = d.firstChild;
            node.appendChild(_node);
            nodes.push(_node);
        };

        if (script) {
            ok.eval(script);
        };

        for (var p = 0; p < nodes.length; p++) {
            this._process(nodes[p]);
            for (var i = 0, cs = ok.objects.scan(nodes[p], 1); i < cs.length; i++) {
                ok.events.route({type:"beforeload"}, ok.get(cs[i]));
            };
            buffer.push(this._scan(nodes[p], 1));
        };

        this._resize(buffer);

        for (var p = 0; p < nodes.length; p++) {
            ok.events.broadcast({type:"resize"}, nodes[p], 1);
        };

        return 1;
    }
    catch (ex)
    {
        ok.trigger_error("Error appending content: " + ex.message, ok.E_ERROR);
    };
};

OK_Layout.prototype.get = function (node, property)
{
    node = node && node.constructor == String ? ok.$(node) : node;

    // --

    if (property && property.constructor == String)
    {
        var value = window.getComputedStyle(node, null).getPropertyValue(property);

        if (/^-?[0-9]+px$/.test(value)) {
            value = parseInt(value);
        } else if (/^-?[0-9]+(\.[0-9]+)?px$/.test(value)) {
            value = parseFloat(value);
        };

        return value;
    };

    // --

    var i = 0, left = 0, top = 0, width = node.offsetWidth, height = node.offsetHeight, t, m, oL, oT, pL, pT, cs;

    do {
        oL = pL = node.offsetLeft;
        oT = pT = node.offsetTop;


        /*
        t = null;
        cs = window.getComputedStyle(node, null);
        if (typeof node.style.transform === "string") {
            t = cs.getPropertyValue("transform");
        } else if (typeof node.style.webkitTransform === "string") {
            t = cs.getPropertyValue("-webkit-transform");
        } else if (typeof node.style.MozTransform === "string") {
            t = cs.getPropertyValue("-moz-transform");
        } else if (typeof node.style.OTransform === "string") {
            t = cs.getPropertyValue("-o-transform");
        } else if (typeof node.style.msTransform === "string") {
            t = cs.getPropertyValue("-ms-transform");
        };

        if (t && t !== "none") {
            m = t.match(/^matrix(?:3d)?\(([0-9-.]+), ([0-9-.]+), ([0-9-.]+), ([0-9-.]+), ([0-9-.]+), ([0-9-.]+)/);
            m = [[parseFloat(m[1]), parseFloat(m[3]), parseFloat(m[5])],
                 [parseFloat(m[2]), parseFloat(m[4]), parseFloat(m[6])]];
            pL = m[0][0] * oL + m[0][1] * oT + m[0][2] * 1;
            pT = m[1][0] * oL + m[1][1] * oT + m[1][2] * 1;
        };

        */

        left += pL;
        top += pT;

        if (!ok.client.moz) {
            var bleft = this.get(node, 'border-left-width');
            var btop = this.get(node, 'border-top-width');
            if (ok.client.ie) {
                bleft = /^[0-9]+$/.test(bleft) ? bleft : 0;
                btop = /^[0-9]+$/.test(btop) ? btop : 0;
            };
            left += bleft;
            top += btop;
        };
    } while (node = node.offsetParent);

    return {left: left, top: top, width: width, height: height};
};

/**
 *
 *
 */
OK_Layout.prototype.move = function (source, target) {
    source = ok.$(source);
    target = ok.$(target);
    if (source && target) {
        while (source.firstChild) {
            target.appendChild(source.firseChild);
        };
        return 1;
    };
    return 0;
};

/**
 *
 *
 */
OK_Layout.prototype.getPos = function (node) {
    var top = node.offsetTop, pnode = node;
    while (pnode.parentNode && pnode.parentNode != document.body) {
        pnode = pnode.parentNode;
        if (pnode.tagName != "TR") {
            var o = this.computed(pnode, 'overflow');
            if (ok.fn.in_array(o, ["auto", "hidden", "scroll"])) {
                top -= pnode.scrollTop;
                if (top < 0) {
                    top = -2000;
                    break;
                };
            };
            top += pnode.offsetTop;
        };
    };

    var left = node.offsetLeft, pnode = node;
    while (pnode.parentNode && pnode.parentNode != document.body) {
        pnode = pnode.parentNode;
        if (pnode.tagName != "TR") {
            var o = this.computed(pnode, 'overflow');
            if (ok.fn.in_array(o, ["auto", "hidden", "scroll"])) {
                left -= pnode.scrollLeft;
                if (left < 0) {
                    left = -2000;
                    break;
                };
            };
            left += pnode.offsetLeft;
        };
    };

    return {left: left, top: top, width: node.offsetWidth, height: node.offsetHeight};
};

/**
 *
 *
 */
OK_Layout.prototype.position = function (node, parent, direction)
{
    var left = 0,
        top = 0,
        rn = this.get(node),
        rp = this.get(parent),
        screen = this.get(document.body);

    if (direction == ok.VERTICAL)
    {
        if (rp.left + rn.width - document.body.scrollLeft <= screen.width)
            left = rp.left;
        else if (screen.width >= rn.width)
            left = screen.width + document.body.scrollLeft - rn.width;
        else
            left = document.body.scrollLeft;

        if (rp.top + rp.height + rn.height <= screen.height + document.body.scrollTop)
            top = rp.top + rp.height;
        else if (rp.top - rn.height >= document.body.scrollTop)
        top = rp.top - rn.height;
        else if (screen.height >= rn.height)
            top = screen.height + document.body.scrollTop - rn.height;
        else
            top = document.body.scrollTop;
    }
    else
    {
        if (rp.top + rn.height <= screen.height + document.body.scrollTop)
            top = rp.top - 3;
        else if (rp.top + rp.height - rn.height + 3 >= 0)
            top = rp.top + rp.height - rn.height + 3;
        else if (screen.height >= rn.height)
            top = screen.height + document.body.scrollTop - rn.height;
        else
            top = document.body.scrollTop;

        if (rp.left + rp.width + rn.width <= screen.width + document.body.scrollLeft)
            left = rp.left + rp.width;
        else if (rp.left - rn.width - 2 >= 0)
            left = rp.left - rn.width - 2;
        else if (screen.width >= rn.width)
            left = screen.width  + document.body.scrollLeft - rn.width;
        else
            left = document.body.scrollLeft;
    };

    return {top: top, left: left};
};

OK_Layout.prototype.position2 = function (node, parent, hpos, vpos)
{
    var left = 0,
        top = 0,
        rn = this.get(node),
        rp = this.get(parent),
        screen = this.get(document.body);

    if (hpos == "left") {
        left = rp.left;
    } else if (hpos == "center") {
        left = rp.left + (rp.width / 2);
    } else if (hpos == "right") {
        left = rp.left + rp.width;
    };

    if (vpos == "top") {
        top = rp.top
    } else if (vpos == "middle") {
        top = rp.top + (rp.height / 2);
    } else if (vpos == "bottom") {
        top = tp.top + rp.height;
    };

    return {top: top, left: left};
};

/**
 *
 */
OK_Layout.prototype.write = function (node, data, script, process) {
    if (!node) node = document.body;

    process = process == null ? 1 : process;

    try {
        node = (typeof node == "string") ? ok.$(node) : node;
        if (node.tagName == "TABLE") {
            node = node.getElementsByTagName("TD").item(0);
        };

        ok.objects.removeAll(node);
        node.innerHTML = "";

        var d = document.createElement("DIV");
        d.innerHTML = data;
        while (d.childNodes.length) {
            node.appendChild(d.firstChild);
        };

        if (script) {
            ok.eval(script);
            if (process) {
                this._process(node);
            };
            for (var i=0,cs=ok.objects.scan(node),l=cs.length; i<l; i++) {
                ok.events.route({type:"beforeload"}, ok.get(cs[i]));
            };
        } else if (process) {
            this._process(node);
        };

        this._resize(this._scan(node));

        ok.events.broadcast({type:"load"}, node);
        ok.events.broadcast({type:"resize"}, node);

        return 1;
    }
    catch (ex)
    {
        ok.trigger_error("Error writting content: " + ex.message, ok.E_ERROR);
    };
};

/**
 *
 */
OK_Layout.prototype.insertAfter = function (node, data, script) {
    if (!node) node = document.body;

    try {
        node = (typeof node == "string") ? ok.$(node) : node;

        var d = document.createElement("DIV");
        d.innerHTML = data;

        var pnode = node.parentNode, node_index = 0;
        while (node_index < pnode.childNodes.length && node != pnode.childNodes.item(node_index))
            node_index++;

        while (d.childNodes.length) {
            if (node_index < pnode.childNodes.length - 1)
                pnode.insertBefore(d.lastChild, pnode.childNodes.item(node_index + 1));
            else
                pnode.appendChild(d.lastChild);
        };

        if (script) {
            ok.eval(script);
            this._process(pnode);
            for (var i=0,cs=ok.objects.scan(node),l=cs.length; i<l; i++) {
                ok.events.route({type:"beforeload"}, ok.get(cs[i]));
            };
        } else {
            this._process(pnode);
        };

        this._resize(this._scan(node));

        ok.events.broadcast({type:"resize"}, node);

        return 1;
    }
    catch (ex)
    {
        ok.trigger_error("Error inserting content: " + ex.message, ok.E_ERROR);
    }
};

OK_Layout.prototype.resize = function (node)
{
    node = node ? ok.$(node) : document.body;

    ok.events.broadcast({type:"beforeresize"}, node, 1);

    this._restore(node);
    this._resize(this._scan(node, 1));

    ok.events.broadcast({type:"resize"}, node, 1);
};

/**
 *
 */
OK_Layout.prototype._process = function (node)
{
    var images = node.getElementsByTagName("img");

    for (var i = 0; i < images.length; i++)
    {
        var img = images[i],
            src = img.getAttribute("src"), id;

        if (src === "//:0" && (id = img.getAttribute("data-ok-id"))) {
            img.loaded = 0;
            img.onload = function (e) {
                this.loaded = 1;
            };
            img.setAttribute("src", ok.cache.get(id));
        };
    };

};

/**
 *
 */
OK_Layout.prototype._scan = function (n, _fromTop)
{
    var node, nodes = [n], rx = /^[0-9]+px$/, t = Date.now(), buffer = [], _ok = {};

    while (node = nodes.shift())
    {
        if (_fromTop && node.nodeType === 1 && !node.getAttribute("data-ok-noresize") && (node.tagName == "TABLE" || node.tagName == "DIV" || node.tagName == "IFRAME" || node.tagName == "SELECT" || node.tagName == "INPUT"))
        {
            if (node.style.display == "none") {
                continue;
            };

            // ok.debug("scan: " + (node === document.body ? "BODY" : node.id));

            _ok = {
                display: node.style.display,
                _width: node.style.width,
                _height: node.style.height,
                _overflow: node.style.overflow
            };

            if (window.getComputedStyle) {
                _ok.width = window.getComputedStyle(node, "").getPropertyValue("width");
                _ok.height = window.getComputedStyle(node, "").getPropertyValue("height");
                _ok.overflow = window.getComputedStyle(node, "").getPropertyValue("overflow");
            } else if (node.currentStyle) {
                _ok.width = node.currentStyle.width;
                _ok.height = node.currentStyle.height;
                _ok.overflow = node.currentStyle.overflow;
            };

            if (ok.client.webkit) {
                if (node.tagName == "TABLE") {
                    _ok.width = node.getAttribute("width");
                    _ok.height = node.getAttribute("height");
                } else if (node.tagName == "DIV") {
                    node._width = node.style.width;
                    node._height = node.style.height;
                };
            };

            if (!_ok.width) {
                _ok.width = _ok._width;
            };

            if (!_ok.height) {
                _ok.height = _ok._height;
            };

            if ((_ok.overflow == "hidden" || _ok._width == "100%" || _ok._height == "100%") && !(rx.test(_ok._width) && rx.test(_ok._height)) && this._countVisibleChildren(node.parentNode) <= 1) {
                // ok.debug("found: " + (node === document.body ? "BODY" : node.id));
                node.style.display = "none";
                node._ok = _ok;
                buffer.push(node);
            };
        };

        // --

        _fromTop = 1;
        if (node.nodeType == 1 && !node.getAttribute('data-ok-nochildrenresize') && (!_ok.display || (_ok.display && _ok.display != "none"))) {
            for (var i=0, l=node.childNodes.length; i<l; i++) {
                if (node.childNodes.item(i).nodeType === 1) {
                    nodes.push(node.childNodes.item(i));
                };
            };
        };
    };

    return buffer;
};

/**
 *
 */
OK_Layout.prototype._resize = function (buffer)
{
    var node, pnode, _ok, td, tr, tarr, counter = 0, now = Date.now();

    while (node = buffer.shift())
    {
        if (node instanceof Array)
        {
            this._resize(node);
            continue;
        };

        // --

        counter++;

        pnode = node.parentNode;
        _ok = node._ok;

        if (ok.client.ie) {
            var ph = parseInt(pnode.currentStyle.paddingLeft) + parseInt(pnode.currentStyle.paddingRight);
            var pv = parseInt(pnode.currentStyle.paddingTop) + parseInt(pnode.currentStyle.paddingBottom);

            var m1 = node.currentStyle.marginLeft;
            var m2 = node.currentStyle.marginRight;
            if (m1 == 'auto') m1 = 0;
            if (m2 == 'auto') m2 = 0;
            var mh = parseInt(m1) + parseInt(m2);

            var m1 = node.currentStyle.marginTop;
            var m2 = node.currentStyle.marginBottom;
            if (m1 == 'auto') m1 = 0;
            if (m2 == 'auto') m2 = 0;
            var mv = parseInt(m1) + parseInt(m2);
        } else {
            var ph = this.get(pnode, "padding-left") + this.get(pnode, "padding-right");
            var pv = this.get(pnode, "padding-top") + this.get(pnode, "padding-bottom");
            var mh = this.get(node, "margin-left") + this.get(node, "margin-right");
            var mv = this.get(node, "margin-top") + this.get(node, "margin-bottom");
        };

        if ((node.tagName !== "TABLE" && _ok.overflow && !_ok.width) || (_ok.width && (_ok.width == "100%" || _ok._width == "100%")))
        {
            if (ok.client.webkit) {
                var nsw = pnode.clientWidth ? pnode.clientWidth : pnode.offsetWidth;
            } else {
                var nsw = pnode.clientWidth;
            };

            nsw = nsw - ph - mh;
            if (nsw > 0) {
                node.style.width = nsw + "px";
                _ok.resized = 1;
            };
        };

        if ((node.tagName !== "TABLE" && _ok.overflow && !_ok.height) || (_ok.height && (_ok.height == "100%" || _ok._height == "100%")))
        {
            if (ok.client.webkit) {
                var nsh = pnode === document.body ? window.innerHeight : pnode.clientHeight ? pnode.clientHeight : pnode.offsetHeight;
            } else {
                var nsh = pnode === document.body ? window.innerHeight : pnode.clientHeight;
            };

            nsh = nsh - pv - mv;
            if (nsh > 0) {
                node.style.height = nsh + "px";
                _ok.resized = 1;
            };
        };

        tarr = [];

        if (node.tagName == "TABLE")
        {
            var cells = 0, thead = node.getElementsByTagName("TR").item(0).parentNode;

            for (var rws = 0; rws < thead.rows.length; rws++) {
                if (cells < thead.rows[rws].cells.length)
                    cells = thead.rows[rws].cells.length;
            };

            if (_ok.width != "auto" && cells >= 1)
            {
                for (var j=0,k=thead.rows.length; j<k; j++) {
                    var tr = thead.rows[j].cells;
                    for (var t=0,z=tr.length; t<z; t++) {
                        var td = tr[t];

                        if (!this._countVisibleChildren(td))
                        {
                            td._removeDummy = 1;
                            var d = document.createElement("DIV");
                            d.className = "DUMMY";
                            td.appendChild(d);
                        };
                    };

                    if (td.getAttribute('height') || td.getAttribute('width') || td.style.height || td.style.width) {
                        tarr.push(td);
                    };
                };
            };
        };

        node.style.display = _ok.display;

        if (node.tagName == "TABLE")
        {
            while (td = tarr.shift()) {
                td._ok = {
                    resized: 1,
                    _width: td.style.width,
                    _height: td.style.height
                };

                if (ok.client.moz) {
                    var ph = this.get(td, "padding-left") + this.get(td, "padding-right") + this.get(td, "border-left-width") + this.get(td, "border-right-width");
                    var pv = this.get(td, "padding-top") + this.get(td, "padding-bottom") + this.get(td, "border-top-width") + this.get(td, "border-bottom-width");
                    td.style.height = (td.offsetHeight - pv) + "px";
                    td.style.width = (td.offsetWidth - ph) + "px";
                } else {
                    if (td.getAttribute('width')) {
                        td.style.width = td.getAttribute('width') + "px";
                    } else {
                        td.style.width = td.offsetWidth + "px";
                    };

                    if (td.getAttribute('height')) {
                        td.style.height = td.getAttribute('height') + "px";
                    } else {
                        td.style.height = td.offsetHeight + "px";
                    };
                };
            };

            for (var j=0,k=thead.rows.length; j<k; j++) {
                tr = thead.rows[j].cells;
                for (var t=0,z=tr.length; t<z; t++) {
                    var td = tr[t];
                    if (!td._ok || !td._ok.resized) {
                        td._ok = {
                            resized: 1,
                            _width: td.style.width,
                            _height: td.style.height
                        };

                        if (ok.client.webkit) {
                            var ph = this.computed(td, "padding-left") + this.computed(td, "padding-right") + this.computed(td, "border-left-width") + this.computed(td, "border-right-width");
                            var pv = this.computed(td, "padding-top") + this.computed(td, "padding-bottom") + this.computed(td, "border-top-width") + this.computed(td, "border-bottom-width");
                            td.style.height = (td.offsetHeight - pv) + "px";
                            td.style.width = (td.offsetWidth - ph) + "px";
                        } else {
                            td.style.width = td.offsetWidth + "px";
                            td.style.height = td.offsetHeight + "px";
                        };
                    };

                    if (td._removeDummy) {
                        td.removeChild(td.lastChild);
                        td._removeDummy = null;
                    };
                };
            };
            tarr = null;
        };
    };
};

OK_Layout.prototype._restore = function (node)
{
    if (node._ok)
    {
        if (node._ok._width)
            node.style.width = node._ok._width;
        else
            node.style.width = "";

        if (node._ok._height)
            node.style.height = node._ok._height;
        else
            node.style.height = "";

        delete node._ok;
    };

    for (var i=0, l=node.childNodes.length; i<l; i++)
        this._restore(node.childNodes.item(i));
};

/**
 *
 */
OK_Layout.prototype.__resize = function (e)
{
    ok.events.bubble("beforeresize", ok);
    this.resize(document.body);
    ok.events.bubble("resize", ok);
};

/**
 *
 */
OK_Layout.prototype._countChildren = function (node)
{
    var c = 0;
    if (node && node.childNodes) for (var i=0,l=node.childNodes.length; i<l; i++)
    {
        var cnode = node.childNodes.item(i);

        if (cnode.nodeType == 1)
        {
            if (ok.client.ie) {
                var position = cnode.currentStyle.position;
            } else {
                var position = window.getComputedStyle(cnode, null).getPropertyValue("position");
            };

            if (position != "absolute") {
                c++;
            };
        } else {
            c++;
        };
    };

    return c;
};

OK_Layout.prototype._countVisibleChildren = function (node)
{
    var c = 0;
    if (node && node.childNodes) for (var i=0,l=node.childNodes.length; i<l; i++) {
        var cnode = node.childNodes.item(i);

        if (cnode.nodeType == 1)
        {
            if (ok.client.ie) {
                var position = cnode.currentStyle.position;
                var display = cnode.currentStyle.display;
            } else {
                var position = window.getComputedStyle(cnode, null).getPropertyValue("position");
                var display = window.getComputedStyle(cnode, null).getPropertyValue("display");
            };

            if (position != "absolute" && position != "relative" && display != "none") {
                c++;
            };
        } else {
            c++;
        };
    };

    return c;
};

/**
 *
 * @deprecated
 */
OK_Layout.prototype.computed = function (node, prop)
{
    return this.get(node, prop);
};
