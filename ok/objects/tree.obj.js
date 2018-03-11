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
function OK_Object_Tree(id, tabindex, autoExpand, service, collapse)
{
    this.id = id;
    this._type = "tree";
    this.custom = {};

    this.service = service;
    this.tabindex = tabindex == null ? -1 : tabindex;
    this.collapse = collapse ? 1 : 0;
    this.autoExpand = autoExpand;
    this.allowUnselect = false;
    this.nodes = [];
    this.selected = null;
    this.html = 0;

    this.register(this);

    if (this.html) {
        this.capture("mousedown");
    };
};

/** */
OK_Object_Tree.prototype = new OK_Object;

/*
OK_Object_Tree.prototype.images = {
    'blank':        "url(tree/blank.gif)",
    'branch':       "url(tree/branch.gif)",
    'branchbottom': "url(tree/branchbottom.gif)",
    'branchtop':    "url(tree/branchtop.gif)",
    'line':         "url(tree/line.gif)",
    'linebottom':   "url(tree/linebottom.gif)",
    'minus':        "url(tree/minus.gif)",
    'minusbottom':  "url(tree/minusbottom.gif)",
    'minustop':     "url(tree/minustop.gif)",
    'plus':         "url(tree/plus.gif)",
    'plusbottom':   "url(tree/plusbottom.gif)",
    'plustop':      "url(tree/plustop.gif)"
};
*/

OK_Object_Tree.prototype.add = function (node)
{
    node.root = this;
    this.nodes[this.nodes.length] = node;
    if (node.selected) {
        this.selected = node;
        if (this.isFocused())
            node.focus();
        else
            node.blur();
    };
};

/**
 *
 */
OK_Object_Tree.prototype.__beforefocus = function ()
{
    if (!this.html) {
        return 1;
    };
};

/**
 *
 */
OK_Object_Tree.prototype.__focus = function ()
{
    if (ok.menu) {
        ok.menu.hide(1);
    };

    if (this.selected && this.html) {
        this.selected.focus();
    };
};

/**
 *
 */
OK_Object_Tree.prototype.__blur = function ()
{
    if (this.selected && this.html) {
        this.selected.blur();
    };
};

/**
 *
 */
OK_Object_Tree.prototype.getFormValue = function ()
{
    if (this.selected != null)
        return this.id + "=" + this.selected.id;
};

/**
 *
 */
OK_Object_Tree.prototype.__keydown = function (e)
{
    var key = ok.kb.event2key(e);

    var node = this.selected, index, parent;
    if (!node) {
        node = this.nodes[0];
    } else switch (key) {
        case 13:
            if (node != null)
                node._onaction();
            break;
        case 39:
        case 40:
            if (!node.loading)
            {
                if (node.expanded && node.nodes.length)
                    node = node.nodes[0];
                else {
                    parent = node.parent ? node.parent : node.root;
                    while (parent != null && (index = this.getNodeIndex(node, parent.nodes)) == parent.nodes.length -1) {
                        node = node.parent;
                        if (node) parent = node.parent ? node.parent : node.root;
                    };
                    if (index != -1)
                        node = parent.nodes[index + 1];
                    else
                        node = this.selected;
                };
            };
            this.cancelEvent(e);
            break;
        case 37:
        case 38:
            node = this.findPrevious(node);
            this.cancelEvent(e);
            break;
        case 107:
            node.expand();
            break;
        case 109:
            node.collapse();
            break;
    };

    if (node && node != this.selected)
        node.select();
};

/**
 *
 */
OK_Object_Tree.prototype.getNodeIndex = function (node, nodes)
{
    if (nodes == null)
        nodes = this.nodes;

    for (var i=0,l=nodes.length; i<l; i++)
        if (nodes[i] == node)
            return i;

    return -1;
};

/**
 *
 */
OK_Object_Tree.prototype.getNodeById = function (node_id, nodes)
{
    if (nodes == null)
        nodes = this.nodes;

    for (var i=0,l=nodes.length; i<l; i++) {
        var node = nodes[i];
        if (node.id == node_id)
            return node;
        else if (node.nodes.length)
            if (node = this.getNodeById(node_id, node.nodes))
                return node;
    };

    return false;
};

/**
 *
 */
OK_Object_Tree.prototype.findLast = function (node)
{
    if (node.expanded && node.nodes.length) {
        node = node.nodes[node.nodes.length - 1];
        node = this.findLast(node);
    };
    return node;
};

/**
 *
 */
OK_Object_Tree.prototype.findPrevious = function (node)
{
    var parent = node.parent ? node.parent : node.root;
    var index = this.getNodeIndex(node, parent.nodes);
    if (index > 0)
        node = this.findLast(parent.nodes[index - 1]);
    else if (node.parent)
        node = node.parent;
    return node;
};

/**
 *
 */
OK_Object_Tree.prototype.walk = function (func, nodes)
{
    nodes = nodes instanceof Array ? nodes : this.nodes;

    for (var i = 0, l = nodes.length; i < l; i++) {
        var node = nodes[i];
        func(node);
        if (node.nodes.length) {
            node.root.walk(func, node.nodes);
        };
    };
};

/**
 *
 */
OK_Object_Tree.prototype.__mousedown = function (e)
{
    if (this.bubble(e)) {
        return true;
    };

    if (this.selected != null && this.allowUnselect) {
        this.selected.unselect();
    };

    this.focus();

    this.cancelEvent(e);
};
