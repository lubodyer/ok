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
function OK_Cache ()
{
    this._index = {};
    this._data = [];
};

OK_Cache.prototype.add = function (id, type, data, executed)
{
    this._index[id] = this._data.push({id: id, type: type, data: data, executed: executed ? executed : false }) - 1;
};

OK_Cache.prototype.get = function (id)
{
    return this.isLoaded(id) ? this._data[this._index[id]].data : null;
};

OK_Cache.prototype.clear = function (id)
{
    if (this.isLoaded(id)) {
        this._data[this._index[id]] = null;
    };
};

OK_Cache.prototype.isLoaded = function (id) {
    return this._index[id] != null;
 };

OK_Cache.prototype.isExecuted = function (id) {
    var i = this._index[id];
    if (i != null) {
        return this._data[i].executed == true;
    };

    return false;
};

OK_Cache.prototype.setExecuted = function (id, executed)
{
    if (this.isLoaded(id))
        this._data[this._index[id]].executed = executed;
};
