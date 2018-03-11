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
function OK_Object_Deck(id, active)
{
    /**
     * @public
     * @readonly
     */
    this.id = id;

    /**
     * @public
     * @readonly
     */
    this._type = "deck";

    /**
     * @public 1
     * @readonly
     */
    this.active = active;

    // --

    this.register();
};

/** */
OK_Object_Deck.prototype = new OK_Object;

/**
 * Sets the topmost child of the object.
 * @param {int|string}
 */
OK_Object_Deck.prototype.activate = function (index)
{
    var _d = ok.$(this.id), _a, __a;

    if (typeof index == "string") {
        var node = ok.$(index);
        if (node.parentNode === _d) {
            index = ok.fn.getNodeIndex(node);
        };
    };

    if (index != this.active)
    {
        if (ok.objects.focused) {
            var _f = ok.$(ok.objects.focused.id);
            if (ok.fn.isChildOf(_f, _d.childNodes.item(this.active))) {
                ok.objects.focused.blur();
            };
        };

        // --

        if ((_a = _d.childNodes.item(index)) && !this.bubble({type: "beforeactivate", index: index}))
        {
            __a = _d.childNodes.item(this.active);
            ok.objects.remove_focus(__a, 1);
            __a.style.display = "none";

            this.active = index;

            _a.style.width = _d.clientWidth + "px";
            _a.style.height = _d.clientHeight + "px";
            _a.style.display = "";

            // --

            ok.layout.resize(_a);

            // --

            this.bubble({type: "activate", index: index});

            // --

            return 1;
        };
    };

    return 0;
};

/**
 *
 */
OK_Object_Deck.prototype.__resize = function (e)
{
    var _d = ok.$(this.id), _a, __a;
    _a = _d.childNodes.item(this.active);
    _a.style.width = _d.clientWidth + "px";
    _a.style.height = _d.clientHeight + "px";
    ok.layout.resize(_a);
    this.bubble(e);
    return 1;
};
