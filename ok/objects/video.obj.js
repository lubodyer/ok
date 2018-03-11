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
function OK_Object_Video (id)
{
    this.id = id;

    this.register();
    this.capture("loadeddata");
    this.capture("loadedmetadata");
    this.capture("loadstart");
    this.capture("ended");
    this.capture("canplay");
    this.capture("canplaythrough");
}

/** */
OK_Object_Video.prototype = new OK_Object;

/**
 *
 */
OK_Object_Video.prototype.play = function ()
{
    ok.$(this.id).play();
};

/**
 *
 */
OK_Object_Video.prototype.pause = function ()
{
    ok.$(this.id).pause();
};

/**
 *
 */
OK_Object_Video.prototype.setSource = function (source)
{
    var video = ok.$(this.id);
    video.setAttribute("src", source);
    video.load();
};

/**
 *
 */
OK_Object_Video.prototype.setVolume = function (volume)
{
    volume = parseFloat(volume);
    if (volume >= 0 && volume <=1) {
        ok.$(this.id).volume = volume;
        return 1;
    };
    return 0;
};

/**
 *
 */
OK_Object_Video.prototype.pause = function ()
{
    ok.$(this.id).pause();
};

