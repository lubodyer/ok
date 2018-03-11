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
function OK_DragAndDrop()
{
    this.dragging = 0;
    this.source;
    this.target;
    this.targets = [];
    this._object;
    this._attempt;
    this._startx;
    this._starty;
};

OK_DragAndDrop.prototype.set = function (o)
{
    if (!this.dragging) this.source = o;
};

OK_DragAndDrop.prototype.addTarget = function (id)
{
    this.targets.push({id:id});
};

OK_DragAndDrop.prototype._dragattempt = function (e)
{
    var x = e.clientX;
    var y = e.clientY;
    if (!this.dragging && this.source) {
        if (this._attempt) {
            if (x > this._startx + 3 || x < this._startx - 3 || y > this._starty + 3 || y < this._starty - 3) {
                var o = this.source._dragstart(e);
                if (o && typeof o == "object") {
                    this.dragging = 1;
                    this._calculate();
                    this._object = o;
                    o.style.cursor = "no-drop";
                };
            };
        } else {
            this._attempt = 1;
            this._startx = x;
            this._starty = y;
        };
    };
};

OK_DragAndDrop.prototype.__mousemove = function (e)
{
    var d = ok.dragdrop;
    if (!e) e = window.event;

    if (d.dragging)
    {
        var x = e.clientX;
        var y = e.clientY;
        var o = d._object;

        o.style.top = y - (o.offsetHeight / 2);
        o.style.left = x - (o.offsetWidth / 2);
        o.style.visibility = "visible";

        var tl = d.targets.length;
        for (var i=0; i<tl; i++) {
            var t = d.targets[i];
            if (x > t.r.left && x < t.r.left + t.r.width && y > t.r.top && y < t.r.top + t.r.height) {
                var c = ok.get(t.id);
                if (d.target != c) {
                    if (d.target)
                        d.target.ondragout();
                    d.target = c;
                    if (c.ondragover(d.source))
                        o.style.cursor = "pointer";
                };
                break;
            } else {
                if (d.target)
                {
                    d.target.ondragout(d.source);
                    d.target = null;
                };
                o.style.cursor = "no-drop";
            };
        };
        return;
    };
    d._dragattempt(e);
};

OK_DragAndDrop.prototype.__mouseup = function (e)
{
    var d = ok.dragdrop;
    if (!e) e = window.event;

    if (d.dragging)
    {
        if (d._object)
            d._object.parentNode.removeChild(d._object);
        if (d.target)
            d.target.ondrop(d.source);
    };
    d.dragging = d.source = d.target = d._object = d._startx = d._starty = d._attempt = null;
};

OK_DragAndDrop.prototype._calculate = function ()
{
    var tl = this.targets.length;
    for (var i=0; i<tl; i++)
    {
        var t = this.targets[i];
        var e = ok.$(t.id);
        if (e)
            t.r = ok.layout.getPos(e);
        else
        {
            this.targets.splice(i,1);
            i--; tl--;
        };
    };
};
