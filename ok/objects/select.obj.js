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
function OK_Object_Select (id, tabindex)
{
    /** @public */
    this.id = id;
    /** @public */
    this._type  = "select";
    /** @public */
    this.tabindex = tabindex;

    // --

    this.register();
    this.capture('change');
    this.capture('mousedown');
};

/** */
OK_Object_Select.prototype = new OK_Object;

/**
 *
 */
OK_Object_Select.prototype.__focus = function (e)
{
    ok.$(this.id).focus();
};

/**
 *
 */
OK_Object_Select.prototype.__blur = function (e)
{
    ok.$(this.id).blur();
};

OK_Object_Select.prototype.__change = function (e)
{
    e.source = this;
    this.bubble(e);
};

/**
 *
 */
OK_Object_Select.prototype.__mousedown = function (e)
{
    e.stopPropagation();
};

/**
 *
 */
OK_Object_Select.prototype.__keydown = function (e)
{
    ok.kb._cancel=0;
};
