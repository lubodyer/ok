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
function OK_Collection ()
{
    this.length = 0;
    this.items = {};
};

OK_Collection.prototype.add = function (name, value)
{
        this.set(name, value);
};

OK_Collection.prototype.append = function (name, value)
{
        this.set(name, value);
};

OK_Collection.prototype.set = function (name, value)
{
    if (name == null)
        return;
    if (value == null) {
        this.remove(name);
        return;
    };
    if (this.items[name] == null)
        this.length++;
    this.items[name] = value;
};

OK_Collection.prototype.get = function (name)
{
    return this.items[name];
};

OK_Collection.prototype.remove = function (name)
{
    if (this.items[name] != null) {
        delete this.items[name];
        this.length--;
    };
};

OK_Collection.prototype.keys = function ()
{
    var a = [];
    for (var p in this.items)
        if (typeof this.items[p] != "function")
            a.push(p);
    return a;
};

OK_Collection.prototype.values = function ()
{
    var a = [];
    var keys = this.keys();
    for (var i=0,l=keys.length; i<l; i++)
        a.push(this.items[keys[i]]);
    return a;
};

OK_Collection.prototype.clear = function ()
{
    this.items = [];
};
