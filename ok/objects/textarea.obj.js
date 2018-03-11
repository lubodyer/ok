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
function OK_Object_TextArea (id, tabindex)
{
    /** @public */
    this.id = id;
    /** @public */
    this._type = "textarea";
    /** @public */
    this.tabindex = tabindex;

    // --

    this.register();
    this.capture("mousedown");
};

/** */
OK_Object_TextArea.prototype = new OK_Object;

/**
 *
 */
OK_Object_TextArea.prototype.__focus = function (e)
{
    ok.$(this.id).focus();
};

/**
 *
 */
OK_Object_TextArea.prototype.__blur = function (e)
{
    ok.$(this.id).blur();
};

/**
 *
 */
OK_Object_TextArea.prototype.__mousedown = function (e)
{
    e.stopPropagation();
};

/**
 *
 */
OK_Object_TextArea.prototype.__keydown = function (e)
{
    ok.kb._cancel=0;
};
