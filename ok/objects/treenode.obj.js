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
function OK_Object_TreeNode(id, text, icon, visible, enabled, selected, expanded, loaded, html, changed)
{
    this.id = id;
    this._type = 'treenode';

    this.nodes = [];
    this.root = null;
    this.parent = null;

    this.icon = icon;
    this.text = text;

    this.loading = 0;
    this.loaded = loaded ? 1 : 0;
    this.expanded = expanded ? 1 : 0;
    this.selected = selected ? 1 : 0;
    this.changed = changed ? 1 : 0;
    this.visible = visible ? 1 : 0;
    this.enabled = enabled ? 1 : 0;

    this.custom = {};

    this.register(this);

    this.html = html ? 1 : 0;
    if (this.html) {
        this.capture("mousedown");
        this.capture("dblclick");
        this.capture("mouseup");
    };
};

/** */
OK_Object_TreeNode.prototype = new OK_Object;

/**
 *
 */
OK_Object_TreeNode.prototype.add = function (node)
{
    node.parent = this;
    node.root = this.root;
    this.nodes[this.nodes.length] = node;
    if (node.selected) {
        this.root.selected = node;
        if (this.root.isFocused())
            node.focus();
        else
            node.blur();
    };
};

/**
 *
 */
OK_Object_TreeNode.prototype.blur = function ()
{
    if (this.selected && this.html) {
        var _n = ok.$(this.id+":text");
        ok.fn.removeClass(_n, 'item');
        ok.fn.removeClass(_n, 'selected');
        ok.fn.addClass(_n, 'blured');
    };
};

/**
 *
 */
OK_Object_TreeNode.prototype.focus = function ()
{
    if (this.selected && this.html) {
        var _n = ok.$(this.id+":text");
        ok.fn.removeClass(_n, 'item');
        ok.fn.removeClass(_n, 'blured');
        ok.fn.addClass(_n, 'selected');
    };
};

/**
 *
 */
OK_Object_TreeNode.prototype.getIcon = function ()
{
    return ok.cache.get(this.icon);
};

/**
 *
 */
OK_Object_TreeNode.prototype.getText = function ()
{
    return this.text;
};

/**
 *
 */
OK_Object_TreeNode.prototype.enable = function () {
    this.setEnabled(1);
};

/**
 *
 */
OK_Object_TreeNode.prototype.disable = function () {
    this.setEnabled(0);
};

/**
 *
 */
OK_Object_TreeNode.prototype.setEnabled = function (enabled) {
    if (this.enabled != enabled) {
        this.enabled = enabled ? 1 : 0;
        if (this.html) {
            ok.$(this.id+":text").className = enabled ? 'item' : 'disabled';
        };
    };
};

/**
 *
 */
OK_Object_TreeNode.prototype.setChanged = function (changed) {
    if (this.changed != changed) {
        this.changed = changed ? 1 : 0;
        if (this.html) {
            var _n = ok.$(this.id+":text");
            if (this.changed) {
                ok.fn.addClass(_n, 'changed');
                _n.innerHTML = this.text + " *";
            } else {
                ok.fn.removeClass(_n, 'changed');
                _n.innerHTML = this.text;
            };
        };
    };
};

/**
 *
 */
OK_Object_TreeNode.prototype.setText = function (text) {
    if (text && this.text != text) {
        this.text = text;
        if (this.html) {
            ok.$(this.id+":text").innerHTML = text;
        };
    };
};

/**
 *
 */
OK_Object_TreeNode.prototype.select = function (_noEvents, _noExpand, _direct)
{
    if (!this.enabled || this.selected || (!_noEvents && (ok.events.route({type:'beforeselect'}, this) || ok.events.route({type:'beforeselect', target: this, source: this, direct: _direct}, this.root)))) {
        return 0;
    };

    if (this.root.selected != null) { this.root.selected.unselect(this); };
    if (this.parent && !this.parent.expanded) { this.parent.expand(); };
    this.selected = true;
    this.root.selected = this;

    if (!_noExpand && this.root.autoExpand == true) { this.expand(); };

    if (this.html) {
        var _n = ok.$(this.id + ":text");
        ok.fn.removeClass(_n, 'item');
        ok.fn.removeClass(_n, 'blured');
        ok.fn.addClass(_n, 'selected');


        var w = ok.$(this.root.id);
    //  var padding = parseInt(w.getElementsBy.getAttribute('cellpadding'));
        var padding = 0; // todo!
        var r = ok.layout.get(this.id);
        var p = ok.layout.get(w);

        if (r.top - p.top + r.height - w.scrollTop > w.clientHeight)
            w.scrollTop = r.top - p.top + r.height - w.clientHeight + padding;
        else if (r.top - p.top - w.scrollTop < 0)
            w.scrollTop = r.top - p.top - padding;
    };

    if (this.root.isFocused()) {
        this.focus();
    } else {
        this.blur();
    };

    if (this.root.collapse) {
        for (var i=0,l=this.root.nodes.length; i<l; i++) {
            if (this.root.nodes[i].expanded && this.root.nodes[i] !== this.root.selected && !this.root.nodes[i].isChildSelected()) {
                this.root.nodes[i].collapse();
            };
        };
    };

    if (!_noEvents && !ok.events.route({type:'select'}, this)) {
        ok.events.route({type:'select', source: this, direct: _direct}, this.root);
    };

    return 1;
};

/**
 *
 */
OK_Object_TreeNode.prototype.unselect = function (target)
{
    if (this.selected && !this.bubble('unselect')) {
        this.selected = false;
        this.root.selected = null;

        if (this.html) {
            var _n = ok.$(this.id + ":text");
            ok.fn.removeClass(_n, 'selected');
            ok.fn.removeClass(_n, 'blured');
            ok.fn.addClass(_n, 'item');
        };

        ok.events.route({type:'unselect', source: this, target: target}, this.root);
    };
};

OK_Object_TreeNode.prototype.expand = function ()
{
    if (this.expanded || (!this.nodes.length && this.loaded) || this.bubble('expand') || this.root.bubble('expand', this))
        return;

    ok.debug("TREENODE: Expanding node [id " + this.id + "].", 254);

    this.expanded = true;
    for (var i=0,l=this.nodes.length; i<l; i++)
        this.nodes[i].show();
    this.swapImage();

    this.load();

    if (!this.loading) {
        var scb = ok.get(this.root.id + ":BOX");
        if (scb) ok.thread(function () {
            ok.route('beforeresize', scb);
            ok.route('resize', scb);
        });
    };
};

OK_Object_TreeNode.prototype.collapse = function ()
{
    if (!this.expanded || this.loading || this.bubble('collapse') || this.root.bubble('collapse', this))
        return;

    this.expanded = false;
    for (var i=0,l=this.nodes.length; i<l; i++)
        this.nodes[i].hide();
    this.swapImage();

    var scb = ok.get(this.root.id + ":BOX");
    if (scb) ok.thread(function () {
        ok.route('beforeresize', scb);
        ok.route('resize', scb);
    });

    if (this.isChildSelected())
        this.select(0, 1);
};

OK_Object_TreeNode.prototype.show = function ()
{
    if (!this.visible && !this.bubble('show')) {
        this.visible = true;
        if (this.parent && !this.parent.visible)
            this.parent.show();
        if (this.parent && !this.parent.expanded)
            this.parent.expand();

        if (this.html) {
            ok.$(this.id).style.display = "";
        };

        if (this.expanded) {
            var l = this.nodes.length;
            if (l) for (var i=0;i<l;i++)
                this.nodes[i].show();
        };
    };
};

OK_Object_TreeNode.prototype.hide = function ()
{
    if (this.visible && !this.bubble('hide')) {
        this.visible = false;
        if (this.html) {
            ok.$(this.id).style.display = "none";
        };
        var l = this.nodes.length;
        if (l) for (var i=0;i<l;i++)
            this.nodes[i].hide();
    };
};

OK_Object_TreeNode.prototype.swapImage = function ()
{
    // TODO
};

OK_Object_TreeNode.prototype.isChildSelected = function ()
{
    var ok = false;
    for (var i=0; i<this.nodes.length && !ok; i++) {
        if (this.nodes[i].selected)
            ok = true;
        else
            ok = this.nodes[i].isChildSelected();
        if (ok) return true;
    };
    return false;
};

OK_Object_TreeNode.prototype.load = function ()
{
    if (!this.loaded && !this.loading) {
        var node = this, nodes;
        this._prepend = [];
        while (node) {
            if (node.parent && node.parent.nodes[node.parent.nodes.length - 1] == node)
                this._prepend.unshift(2);
            else if (node.parent)
                this._prepend.unshift(1);
            else if (!node.parent && node.root.nodes.length == 1)
                this._prepend.unshift(0);
            else if (!node.parent && node.root.nodes[node.root.nodes.length - 1] == node)
                this._prepend.unshift(2);
            else if (!node.parent)
                this._prepend.unshift(1);
            node = node.parent;
        };

        if (!this.bubble('contentloading') && !this.root.bubble('contentloading', this)) {
            var t = this;
            this.loading = true;
            ok.pause();
            ok.set_cursor('wait');
            this.setLoading(1);
            ok.request(this.root.service, { id: this.root.id, node_id: this.id, _path: this._prepend.join(",") }, { onbeforeload: function() {
                t.setLoading(0);
                ok.set_cursor();
                ok.resume();
            }, onload: function () {
                t.loaded = true;
                t.loading = false;
                t.swapImage();

                var scb = ok.get(t.root.id + ":BOX");
                if (scb) ok.thread(function () {
                    ok.route('beforeresize', scb);
                    ok.route('resize', scb);
                });

                t.bubble("contentloaded");
            }});
        };
    };
};

OK_Object_TreeNode.prototype._onaction = function ()
{
    window.clearTimeout(this.root.oatm);
    if (!this.bubble('action'))
        this.root.bubble('action', this);
};

// ----------

OK_Object_TreeNode.prototype.__mousedown = function (e)
{
    var target = ok.client.ie ? e.srcElement.id : e.target.id;

    this.root.focus();

    if (target == this.id + ":nav" && this.enabled) {
        if (this.expanded) {
            this.collapse();
        } else {
            this.expand();
        };
    } else {
        if (!this.bubble(e)) {
            this.select(0);
            //~ ok.dragdrop.set(this);
        };
    };
};

OK_Object_TreeNode.prototype.__mouseup = function (e)
{
    var target = ok.client.ie ? e.srcElement.id : e.target.id;

    if ((target == this.id + ":text" || target == this.id + ":icon")) {
        if (e.button == ok.BUTTON_RIGHT) {
            e = ok.fn.clone(e);
            e.type = 'contextmenu';
            if (!this.bubble(e)) {
                e.target = this;
                this.root.bubble(e);
            };
        }
        else if (this.selected && !this.expanded && this.nodes.length && this.root.autoExpand == true)
            this.expand();
    };
};

/**
 *
 */
OK_Object_TreeNode.prototype.__dblclick = function (e)
{
    var target = ok.client.ie ? e.srcElement.id : e.target.id;

    if ((target == this.id + ":text" || target == this.id + ":icon") && !this.bubble(e))
        this._onaction();
};

/**
 *
 */
OK_Object_TreeNode.prototype.__tap = function (e)
{
    this.select();
};

/**
 *
 */
OK_Object_TreeNode.prototype._dragstart = function ()
{
    var div = document.createElement("DIV");
    div.style.display = "inline";
    div.className = "DRAG_OBJECT";
    document.body.appendChild(div);
    var c = "<table class='treenode' cellspacing='0' cellpadding='0'><tr>";
    var icon = ok.$(this.id + ":icon");
    if (icon) c += "<td class='icon'><img src='" + icon.src + "'></td>";
    c += "<td class='item'>" + ok.$(this.id + ":text").innerHTML + "</td>";
    c += "</tr></table>";
    div.innerHTML = c;
    return div;
};

/**
 *
 */
OK_Object_TreeNode.prototype.countNodes = function ()
{
    var c = 0, l = this.nodes.length;
    for (var i=0; i<l; i++)
        c += this.nodes[i].countNodes() + 1;
    return c;
};

/**
 *
 */
OK_Object_TreeNode.prototype.remove = function ()
{
    this.onremove();
    this.root.onremove(this);

    while (this.nodes.length)
        this.nodes[this.nodes.length - 1].remove();

    if (this.selected)
        this.root.findPrevious(this).select(0, 1);

    var parent = this.parent ? this.parent : this.root;
    parent.nodes.splice(this.root.getNodeIndex(this, parent.nodes), 1);

    if (this.html) {
        ok.objects.remove(this.id);
        var e = ok.$(this.id);
        e.parentNode.removeChild(e);
    };

    if (this.parent) {
        this.parent.swapImage();
    };
};

/**
 *
 */
OK_Object_TreeNode.prototype.setLoading = function (loading)
{
    if (!this.html) { return; };

    if (loading) {
        if (this.icon) {
            ok.$(this.id + ":icon").src = ok.cache.get(ok.ICON_LOADING);
        } else if (this.text){
            ok.$(this.id + ":text").innerHTML = "Loading...";
        }
    } else {
        if (this.icon) {
            ok.$(this.id + ":icon").src = ok.cache.get(this.icon);
        } else if (this.text) {
            ok.$(this.id + ":text").innerHTML = this.text;
        }
    };
};

// ------------------------------------------------------------ //

function getNodeIndex (node)
{
    var p = node.parentNode, pl = p.childNodes.length;
    for (var i=0; i<pl; i++)
        if (p.childNodes.item(i) == node)
            return i;
    return -1;
};

function treeRemoveLoading (node_id)
{
    var node = ok.$(node_id);
    var parent = node.parentNode;
    var node_index = getNodeIndex(node);
    parent.removeChild(parent.childNodes.item(node_index + 1));
    ok.get(node_id).nodes = [];
};

function treeInsertAfter (node_id, data)
{
    var node = ok.$(node_id);
    var parent = node.parentNode;
    var treenode = ok.get(node_id);
    if (treenode.nodes.length) {
        var n = treenode.nodes[treenode.nodes.length-1];
        var node_index = getNodeIndex(ok.$(n.id)) + n.countNodes();
    } else
        var node_index = getNodeIndex(node);
    if (typeof data == "string") {
        var t = document.createElement("DIV");
        t.innerHTML = data;
        data = t.firstChild;
    };
    if (node_index < parent.childNodes.length)
        parent.insertBefore(data, parent.childNodes.item(node_index + 1));
    else
        parent.appendChild(data);
};
