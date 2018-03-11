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
function OK_Object_Label(id, htmlFor)
{
    this.id = id;
    this.htmlFor = htmlFor;

    this.register();

    this.capture("mousedown");
};

/** */
OK_Object_Label.prototype = new OK_Object;

/**
 *
 */
OK_Object_Label.prototype.__mousedown = function (e)
{
    if (this.htmlFor) {
        var c = ok.get(this.htmlFor);
        if (c && c.enabled) {
            switch (c._type)
            {
                case "checkbox":
                    c.setValue(c.getValue() ? 0 : 1);
                    c.focus();
                    break;
                case "text":
                case "input":
                case "textbox":
                    c.focus();
                    break;
                default:
                    ok.trigger_error("LABEL: Unsupported FOR element type " + c._type + ".", 101, ok.E_WARNING);
            };
        };
    };
};

/**
 *
 */
OK_Object_Label.prototype.__touchdown = function (e)
{
    ok.route("mousedown", this);
};

/**
 *
 */
OK_Object_Label.prototype.__resize = function (e)
{
    var c = this.htmlFor ? ok.get(this.htmlFor) : null, _c;

    if (c && c._type == "checkbox") {
        c.label = this.id;
        _c = ok.$(this.id);
        if (c[this.id + ":COLOR"] === undefined) {
            c[this.id + ":COLOR"] = _c.style.color;
        };
        _c.style.color = c.enabled ? c[this.id + ":COLOR"] === undefined ? _c.style.color : c[this.id + ":COLOR"] : ok.colors.graytext;
    };
};
