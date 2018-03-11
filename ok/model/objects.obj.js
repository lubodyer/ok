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
function OK_Objects ()
{
    this.items = new OK_Collection;
    this.focused = null;
    this.last = null;
};

OK_Objects.prototype.get = function (id)
{
    return this.items.get(id);
};

OK_Objects.prototype.focus = function (o)
{
    if (this.focused && !this.focused.blur(o)) {
        return 0;
    };

    this.focused = o;
    var item = ok.kb.exists(o);
    ok.kb.tabindex = item ? item : null;
    return 1;
};

OK_Objects.prototype.blur = function ()
{
    if (this.focused) {
        this.focused.blur();
        return 1;
    };
    return 0;
};

OK_Objects.prototype.register = function (o) {
    this.items.add(o.id, o);
    ok.kb.register(o);
};

OK_Objects.prototype.remove = function (id)
{
    var o = ok.get(id);
    if (o) {
        ok.kb.remove(o);
        this.items.remove(id);
        return 1;
    };
    return 0;
};

OK_Objects.prototype.removeAll = function (node, bFromTop)
{
    node = ok.$(node);

    for (var i=0, cs = this.scan(node, bFromTop), l=cs.length; i<l; i++) {
        var c = this.get(cs[i]);
        if (c && this.focused == c && c._type !== "dialog" && c._type !== "aspect") {
            c.blur();
        };
        this.remove(cs[i]);
        if (c) { c.unload(); };
    }
};

OK_Objects.prototype.remove_focus = function (node, bFromTop)
{
    if (this.focused && ok.fn.in_array(this.focused.id, this.scan(node, bFromTop))) {
        this.focused.blur();
    };
};

OK_Objects.prototype.scan = function (node, bFromTop)
{
    if (typeof node == "string") {
        node = ok.$(node);
    };

    if (!node) return [];

    var c = [], nodes = [node], n;

    while (n = nodes.shift())
    {
        if (bFromTop && n.id && this.get(n.id)) {
            c.push(n.id);
        };

        bFromTop = 1;

        if (n.nodeType == 1) {
            for (var i=0; i < n.childNodes.length; i++) {
                nodes.unshift(n.childNodes.item(i));
            };
        };
    };

    return c;
};

OK_Objects.prototype._restore = function (state)
{
    this.focused = state.focused;
    this.last = state.last;
};

OK_Objects.prototype._save = function ()
{
    var state = {focused: this.focused, last: this.last};
    this.focused = this.last = null;
    return state;
};
