/**
 * Copyright (c) 2004-2018 Lubo Dyer. All Rights Reserved.
 *
 * OK v.5 - okay-os.com
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
function OK_Queue ()
{
    this.completed = 0;
    this.length = 0;
    this.items = [];
};

/**
 *
 */
OK_Queue.prototype.add = function (item) {
    var queue = this;
    this.length = this.items.push({
        item: item,
        start: function () {
            if (item instanceof OK_Request) {
                item.onload = function (e) {
                    ok.events.route("itemload", queue);
                };
                item.send();
            };
        },
        stop: function () {
            if (item instanceof OK_Request) {
                item.abort();
            };
        }
    });
};

/**
 *
 */
OK_Queue.prototype.start = function () {
    for (var i = 0; i < this.length; i++) {
        this.items[i].start();
    };
};

/**
 *
 */
OK_Queue.prototype.stop = function () {
    for (var i = 0; i < this.length; i++ ) {
        this.items[i].stop();
    };
};

/**
 *
 */
OK_Queue.prototype.__itemload = function (item) {
    this.completed++;
    ok.events.bubble({type:"itemload"}, this);
    if (this.completed >= this.length) {
        ok.events.route({type:"load"}, this);
    };
};
