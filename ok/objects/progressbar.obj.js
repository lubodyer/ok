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
function OK_Object_ProgressBar (id, value)
{
    /** @public */
    this.id = id;
    /** @public */
    this.value = value;
    /** @public */
    this.width = 0;
    /** @public */
    this.height = 0;

    // --

    this._margin = 0;
    this._step = 3;
    this._thumb = 35;

    // --

    this.register();
};

/** */
OK_Object_ProgressBar.prototype = new OK_Object;

/**
 *
 */
OK_Object_ProgressBar.prototype.set = function (value)
{
    if (value > 100) value = 100;
    if (value < 0) value = 0;
    this.value = value;
    this._set();
};

OK_Object_ProgressBar.prototype.play = function ()
{
    this.set(this._thumb);
    this._margin = 0;
    this._direction = 1;
    this._iid = window.setInterval("try { ok.get('"+this.id+"')._play(); } catch (ex) {};", 50);
};

OK_Object_ProgressBar.prototype.stop = function ()
{
    window.clearInterval(this._iid);
    try {
        ok.$(this.id + ":THUMB").style.left = 0 + 'px';
        this.set(0);
    } catch (ex) {};
};

/**
 *
 */
OK_Object_ProgressBar.prototype._set = function ()
{
    var t = ok.$(this.id + ":THUMB"),
        v = Math.floor((this.width * this.value) /  100);

    t.style.display = v > 0 ? "" : "none";
    t.style.width = v + "px";
    t.style.height = this.height + "px";
    //t.style.left = Math.floor(this.width * this._margin / 100) + "px";
    //t.style.left = "0px";
};

/**
 *
 */
OK_Object_ProgressBar.prototype._play = function ()
{

    if (this._direction) {
        this._margin += this._step;
    } else {
        this._margin -= this._step;
    };

    // --

    if (this._margin > 100 - this._thumb)
    {
        this._direction = 0;
        this._margin = 100 - this._thumb;
    }
    else if (this._margin < 0)
    {
        this._direction = 1;
        this._margin = 0;
    };

    // --

    this._set();
};

/**
 *
 */
OK_Object_ProgressBar.prototype.__resize = function ()
{
    var _bar = ok.$(this.id);

    if (this.isDisplayed()) {
        this.width = _bar.clientWidth;
        this.height = _bar.clientHeight;
        this._set();
    };
};

/**
 *
 */
OK_Object_ProgressBar.prototype.__unload = function ()
{
    if (this._iid) {
        window.clearInterval(this._iid)
    };
};
