/**
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
function OK_Object_Input (id, tabindex)
{
    /** @public */
    this.id = id;
    /** @public */
    this._type  = "input";
    /** @public */
    this.tabindex = tabindex;

    // --

    Object.defineProperty(this, "type", {
        get: function () {
            return ok.$(this.id).type;
        },
        set: function (value) {
            return ok.$(this.id).type = value;
        }
    });

    Object.defineProperty(this, "value", {
        get: function () {
            return ok.$(this.id).value;
        },
        set: function (value) {
            return ok.$(this.id).value = value;
        }
    });

    // --

    this.register();
    this.capture('input');
    this.capture('mousedown');
};

/** */
OK_Object_Input.prototype = new OK_Object;

/**
 *
 */
OK_Object_Input.prototype.getCursorPosition = function ()
{
    var _this = ok.$(this.id), pos = 0;

    if (typeof _this.selectionStart === "number") {
        pos = _this.selectionDirection === "backward" ? _this.selectionStart : _this.selectionEnd;
    };

    return pos;
};

/**
 *
 */
OK_Object_Input.prototype.getText = function ()
{
    return this.value;
};

/**
 *
 */
OK_Object_Input.prototype.setText = function (text)
{
    this.value = text;
};

/**
 *
 */
OK_Object_Input.prototype.__focus = function (e)
{
    ok.$(this.id).focus();
    this.bubble(e);
};

/**
 *
 */
OK_Object_Input.prototype.__blur = function (e)
{
    ok.$(this.id).blur();
    return this.bubble(e);
};

/**
 *
 */
OK_Object_Input.prototype.__change = function (e)
{
    e.source = this;
    return this.bubble(e);
};

/**
 *
 */
OK_Object_Input.prototype.__input = function (e)
{
    return ok.route('change', this);
};

/**
 *
 */
OK_Object_Input.prototype.__mousedown = function (e)
{
    e.stopPropagation();
};

/**
 *
 */
OK_Object_Input.prototype.__keydown = function (e)
{
    var key = ok.kb.key(e);

    if (key == 13) {
        this.blur();
    } else {
        ok.kb._cancel = 0;
    };
};
