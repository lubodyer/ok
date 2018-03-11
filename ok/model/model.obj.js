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
function OK_Model () {};

/**
 *
 */
OK_Model.prototype.get = function (id)
{
    return ok.get(id);
};

/**
 *
 */
OK_Model.prototype.pause = function ()
{
    return ok.pause();
};

/**
 *
 */
OK_Model.prototype.resume = function ()
{
    return ok.resume();
};

/**
 *
 */
OK_Model.prototype._get = function (id)
{
    return ok.$(id);
};
