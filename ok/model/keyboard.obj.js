/**
 * This file contains OK Keyboard System Model.
 *
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
 * @package System
 * @subpackage Model
 */

/**
 * @class OK Keyboard Handler
 */
function OK_Keyboard ()
{
    /**
     * Cancel keyboard event flag
     * @type bool
     */
    this._cancel = 1;

    this._init();
};

/**
 *
 *
 */
OK_Keyboard.prototype._init = function ()
{
    /**
     * Retrieves a reference to the first object of the Tabulation list.
     * @type object
     */
    this.tablist = null;

    /**
     * Pointer to the current Tabulation list item.
     * @type object
     */
    this.tabindex = null;

    /**
     * Keys object contains handler for different key states - up, down and press. Key
     * handler can be a function or OK Object (or its ID).
     * @type object
     */
    this.keys = {
        /**
         * The 'keyup' key-handler map.
         * @type array
         */
        up : [],

        /**
         * The 'keydown' key-handler map.
         * @type array
         */
        down : [],

        /**
         * The 'keypress' key-handler map.
         * @type array
         */
        press : []
    };

    /**
     * The default 'keydown' event handler for 'Tab' key
     * @param object e Event object
     */
    this.keys.down["9"] = function (e) {
        if (ok.kb.tablist && (ok.objects.focused == null || ok.kb.exists(ok.objects.focused))) {
            if (ok.kb.tabindex && ok.kb.tabindex.next)
                ok.kb.tabindex = ok.kb.tabindex.next;
            else
                ok.kb.tabindex = ok.kb.tablist;

            var i = 0, max = 0, el = ok.kb.tablist;
            while (el) { max++; el = el.next; };
            el = ok.kb.tabindex;
            while (ok.kb.tabindex && !(ok.kb.tabindex.item.isVisible() && ok.kb.tabindex.item.enabled) && i<max) {
                ok.kb.tabindex = ok.kb.tabindex.next;
                if (!ok.kb.tabindex)
                    ok.kb.tabindex = ok.kb.tablist;
                i++;
            };

            if (ok.kb.tabindex && i != max) {
                ok.kb.tabindex.item.focus();
                ok.events.prevent(e);
            };
        };
    };

    /**
     * The default 'keydown' event handler for 'Shift-Tab' shortcut
     * @param object e Event object
     */
    this.keys.down["s9"] = function (e) {
        var c = ok.objects;
        var kb = ok.kb;

        if (kb.tablist && (c.focused == null || kb.exists(c.focused))) {
            if (kb.tabindex && kb.tabindex.prev) {
                kb.tabindex = kb.tabindex.prev;
            } else {
                kb.tabindex = kb.tablist;
                while (kb.tabindex.next) kb.tabindex = kb.tabindex.next;
            };

            var i = 0, max = 0, el = kb.tablist;
            while (el) {
                max++;
                el = el.next;
            };
            el = kb.tabindex;
            while (kb.tabindex && !(kb.tabindex.item.isVisible() && kb.tabindex.item.enabled) && i<max)
            {
                kb.tabindex = kb.tabindex.prev;
                if (!kb.tabindex) {
                    kb.tabindex = kb.tablist;
                    while (kb.tabindex.next)
                        kb.tabindex = kb.tabindex.next;
                };
                i++;
            };

            if (kb.tabindex && i != max) {
                kb.tabindex.item.focus();
                ok.events.prevent(e);
            };
        };
    };

    this.keys.down[27] = function (e) {
        if (ok.menu) {
            ok.menu.hide();
        } else if (ok.dialog && ok.dialog.focused && ok.dialog._close) {
            ok.dialog.close();
        }
    };

    // Browser frientdly mode - allow Ctrl-Shift-J, F5, ctrl-U, ctrl-T, F12 and alt menu shortcuts
    this.keys.down["cs74"] = this.keys.down["c78"] = this.keys.down["c84"] = this.keys.down["c85"] = this.keys.down["116"] = this.keys.down["123"] = function (e) {
        ok.kb._cancel = 0;
    };

    for (var i=18; i<255; i++)
    {
        this.keys.down["a" + i] = function (e) {
            ok.kb._cancel = 0;
        };
    };

    // arrows
    for (var i=33; i<40; i++)
    {
        this.keys.down[i] = function (e) {
            ok.kb._cancel = 0;
        };
    };

/*DEBUG*/   this.keys.down['cas67'] = function (e) {
/*DEBUG*/       ok.debug.buffer = [];
/*DEBUG*/   };
/*DEBUG*/
/*DEBUG*/   this.keys.down['cas68'] = function (e) {
/*DEBUG*/       alert(ok.debug.buffer.join("\n"));
/*DEBUG*/   };
};

/**
 *
 *
 */
OK_Keyboard.prototype.cancel = function () {
    this._cancel = 1;
};

/**
 * Checks if object is registered in the Tabulation list.
 * @param {object} OK Object.
 * @return {object} Tablist item (if any)
 * @access private
 */
OK_Keyboard.prototype.exists = function (object) {
    if (this.tablist) {
        var item = this.tablist;
        while (item) {
            if (item.item == object)
                return item;
            item = item.next;
        };
    };
};

/**
 * Converts keyboard event keyCode to OK Key String
 * @param object e Event object
 * @return string OK Key String.
 */
OK_Keyboard.prototype.key = function (e) {
    var key = (e.type == "keypress") ? e.charCode : e.keyCode;
    if (e.shiftKey) key = "s" + key;
    if (e.altKey) key = "a" + key;
    if (e.ctrlKey) key = "c" + key;
    return key;
};

/**
 * Registers Object in the Tabulation list
 * @param object o OK Object
 */
OK_Keyboard.prototype.register = function (o)
{
    if (o.tabindex != null && o.tabindex > -1)
    {
        if (this.tablist == null) {
            this.tablist = { 'item': o, 'next': null, 'prev': null };
        }
        else
        {
            if (o.tabindex != 0 && (this.tablist.item.tabindex == 0 || this.tablist.item.tabindex > o.tabindex)) {
                this.tablist = { 'item': o, 'next': this.tablist, 'prev': null };
                this.tablist.next['prev'] = this.tablist;
            }
            else
            {
                var found = 0;
                var item = this.tablist;
                while (item.next && !found) {
                    if (o.tabindex > 0 && item.next.item.tabindex > o.tabindex)
                        found = 1;
                    else if (o.tabindex > 0 && item.next.item.tabindex == 0)
                        found = 1;
                    else
                        item = item.next;
                };
                var newItem = { 'item': o, 'next': item.next, 'prev': item };
                if (item.next)
                    item.next['prev'] = newItem;
                item['next'] = newItem;
            };
        };
    };
};

/**
 *
 */
OK_Keyboard.prototype.remove = function (o)
{
    var item = this.tablist,
        last;

    while (item) {
        if (item.item === o) {
            if (last) {
                last.next = item.next;
            } else {
                this.tablist = item.next;
            };
            return 1;
        };
        last = item;
        item = item.next;
    };

    return 0;
};

/**
 *
 */
OK_Keyboard.prototype._restore = function (state)
{
    this.tablist = state.tablist;
    this.tabindex = state.tabindex;
    this.keys = state.keys;
};

OK_Keyboard.prototype._save = function ()
{
    var state = {tablist: this.tablist, tabindex: this.tabindex, keys: this.keys};
    this._init();
    return state;
};

/**
 * Internal keyboard event handler.
 * @access private
 */
OK_Keyboard.prototype.__eventHandler = function (e)
{
    var o;

    //ok.debug("KEYBOARD: [" + e.type + "] [" + this.key(e) + "]");

    if (ok.paused) {
        return this.___doCancel(e);
    };

    ok.client.keyboard = 1;

    if (!ok.objects.focused && e.target && ok.fn.in_array(e.target.tagName, ["INPUT", "SELECT", "OPTION", "TEXTAREA"])) {
        return;
    };

//  if (ok.menu)
//  {
//      if ((o = ok.objects.focused) && ok.fn.isChildObject(o, ok.menu)) {
//          if (ok.events.route(e, o)) {
//              return this.___doCancel(e);
//          };
//      } else {
//          if (ok.events.route(e, ok.menu)) {
//              return this.___doCancel(e);
//          };
//      };
//  } else {
        var o = ok.objects.focused;

        if (e.type == "keydown") {
            ok.kb._cancel = 1;
        };

        if (o && ok.events.route(e, o)) {
            return this.___doCancel(e);
        };

        var keys = this.keys;
        switch (e.type.replace(/^key/, "")) {
            case "up":
                keys = keys.up;
                break;
            case "down":
                keys = keys.down;
                break;
            case "press":
                keys = keys.press;
                break;
        };

        o = keys[this.key(e)];

        if (typeof o == "string") {
            o = ok.get(o);
        };

        if (o && ok.events.route(e, o)) {
            return this.___doCancel(e);
        };
//  };

    this.___doCancel(e);
};

/**
 * Internal event router.
 * @access private
 */
OK_Keyboard.prototype.__eventRouter = function (e)
{
    ok.kb.__eventHandler(e);
};

/**
 *
 */
OK_Keyboard.prototype.___doCancel = function (e)
{
    if (this._cancel) {
        e.preventDefault();
    } else if (e.type == "keypress") {
        this._cancel = 1;
    };
    return true;
};
