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
function OK_Object_SlideShow (id, className, tabindex)
{
    /**
     *
     */
    this._type = "slideshow";

    /**
     *
     */
    this.id = id;

    /**
     *
     */
    this.className = className || "OK_SLIDESHOW";

    /**
     *
     */
    this.tabindex = tabindex;

    /**
     *
     */
    this.slide = 1;

    /**
     *
     */
    this.item = 0;

    /**
     *
     */
    this.items = [];

    /**
     *
     */
    this.speed =  vc;

    /**
     *
     */
    this.tm = 3000;

    /**
     *
     */
    this.index = {};

    /**
     *
     */
     *
     */
    this.ease = "ease-in";

    /**
     *
     */
    this.width = null;
    this.height = null;

    // --

    this.register();
    this.capture("mousedown");
    this.capture("mousemove");
    this.capture("mouseup");
    this.capture("dblclick");
};

/** */
OK_Object_SlideShow.prototype = new OK_Object;

/**
 *
 */
OK_Object_SlideShow.prototype.add = function (id, src)
{
    this.items.push({id: id, src: src ? src : null});
};

/**
 *
 */
OK_Object_SlideShow.prototype.clear = function ()
{
    for (var i = 0, img; i < this.items.length; i++) {
        img = ok.$(this.id + ":IMG:" + i);
        if (img) {
            img.parentNode.removeChild(img);
        };
    };

    this.slide = 1;
    this.now = null;
    this.item = 0;
    this.items = [];
};

/**
 *
 */
OK_Object_SlideShow.prototype.set = function (index)
{
    if (this.item != index && index >= 0 && index < this.items.length) {

        img = ok.$(this.id + ":IMG:" + this.item);
        if (img) {
            img.style.visibility = "hidden";
        };

        this.item = index;
        this.redraw();
    };
};

/**
 *
 */
OK_Object_SlideShow.prototype.play = function ()
{
    this.slide = 1;
    this.now = new Date().getTime();
    ok.route('slide', this);
};

/**
 *
 */
OK_Object_SlideShow.prototype.stop = function ()
{
    this.slide = 0;
};

/**
 *
 */
OK_Object_SlideShow.prototype.load = function (index)
{
    var item = this.items[index],
        p = ok.get(this.id + ":PROGRESS"),
        _p = ok.$(p.id);

    if (!item || !item._src || item.src || item.loading || item.loaded) {
        return;
    };

    // --

    item.cid = ok.fn.md5(item._src);
    if (ok.cache.isLoaded(item.cid)) {
        item.loaded = 1;
        item.loading = 0;
        item.src = window.URL.createObjectURL(ok.cache.get(item.cid));
        this.next();
        return;
    };

    // --

    item.loading = 1;

    _p.style.display = "";
    ok.layout.resize(_p);
    p.set(0);

    this.http = new XMLHttpRequest();
    this.http._complteted = 0;
    this.http._gid = this.id;
    this.http._index = index;
    this.http._item = item;
    this.http._p = p;
    this.http.open('GET', item._src, true);
    this.http.responseType = 'arraybuffer';
    this.http.onprogress = function (e) {
        var total = e.lengthComputable ? e.total : 0;

        total = total ? total : this.getResponseHeader("X-Content-Length");

        if (total) {
            this._completed = parseInt((e.loaded / total) * 100);
            this._p.set(this._completed);
        };
    };
    this.http.onload = function (e)
    {
        var g = ok.get(this._gid),
            p = ok.get(g.id + ":PROGRESS"),
            _p = ok.$(p.id),
            item = g.items[this._index],
            h = this.getAllResponseHeaders(),
            m = h.match(/^Content-Type\:\s*(.*?)$/mi),
            mimeType = m[ 1 ] || 'image/png',
            blob, src;

        p.set(100);
        _p.style.display = "none";

        if (item === this._item) {
            item.loading = 0;
            item.loaded = 1;

            blob = new Blob([this.response], {type: mimeType});
            ok.cache.add(item.cid, 'gimage', blob);
            item.src = window.URL.createObjectURL(blob);
            g.next();
        };

        g.http = null;
    };
    this.http.send();
};

/**
 *
 */
OK_Object_SlideShow.prototype.next = function ()
{
    var item, index = this.item,
        _this = ok.$(this.id),
        img, width, height, left, top;

    if (this.__FX__) {
        return;
    };

    index++;
    if (index >= this.items.length) {
        index = 0;
    };

    item = this.items[index];

    if (!item) {
        return;
    };

    if (!item.src) {
        this.load(index);
        return;
    }
    else
    {
        img = ok.$(this.id + ":IMG:" + index);
        if (!img) {
            img = document.createElement("IMG");
            img.id = this.id + ":IMG:" + index;
            img._id = this.id;
            img._index = index;
            img.style.opacity = this.opacity;
            img.style.position = "absolute";
            img.style.visibility = "hidden";
            img.onload = function () {
                var g = ok.get(this._id),
                    item = g.items[this._index];

                if (item) {
                    item.width = this.width;
                    item.height = this.height;
                    item.ratio = this.width / this.height;
                    g.next();
                };
            };
            _this.insertBefore(img, ok.$(this.id + ":IMG:" + this.item));
            img.src = item.src;
            this._create(img);
            return;
        };

        width = item.width;
        height = item.height;

        if (width !== this.width) {
            width = this.width;
            height = Math.ceil(width / item.ratio);
        };

        if (height < this.height) {
            height = this.height;
            width = Math.ceil(height * item.ratio);
        };

        item.left = left = Math.floor((this.width - width) / 2);
        item.top = top = Math.floor((this.height - height) / 2);

        img.style.width = width + "px";
        img.style.height = height + "px";
        img.style.left = left + "px";
        img.style.top = top + "px";
        img.style.visibility = "visible";

        this.__FX__ = ok.fx.create(this.id, function (delta) {
            var g = ok.get(this._id),
                img, item,
                left = Math.floor(g.width * delta),
                index;

            item = g.items[g.item];
            if (item) {
                img = ok.$(g.id + ":IMG:" + g.item);
                if (img) {
                    img.style.left = -1 * left + item.left + "px";

                    index = g.item + 1;
                    if (index >= g.items.length) {
                        index = 0;
                    };

                    item = g.items[index];
                    if (item) {
                        img = ok.$(g.id + ":IMG:" + index);
                        img.style.left = g.width - left + item.left + "px";
                    };
                };
            };
        }, 0, 1, 240, { onfinish: function () {
            var g = ok.get(this._id),
                img = ok.$(g.id + ":IMG:" + g.item);

            ok.$(g.id + ":NAV:" + g.item).className = g.className + "_DOT";

            g.__FX__ = null;
            if (img) {
                ok.objects.remove(img.id);
                img.parentNode.removeChild(img);
                g.item = this.index;

                ok.$(g.id + ":NAV:" + g.item).className = g.className + "_DOT_ACTIVE";

                if (g.slide && g.items.length > 1)
                {
                    g.now = new Date().getTime();
                    var self = g;
                    if (this.__SLIDE__) {
                        window.clearTimeout(this.__SLIDE__);
                        this.__SLIDE__ = null;
                    };
                    this.__SLIDE__ = ok.thread(function () {
                        ok.route({type: "slide"}, self);
                        self.__SLIDE__ = null;
                    }, this.tm);
                };
            };
        }});
        this.__FX__.gid = this.id;
        this.__FX__.index = index;
    };
};


/**
 *
 */
OK_Object_SlideShow.prototype.prev = function ()
{
    var item, index = this.item,
        _this = ok.$(this.id),
        img, width, height, left, top;

    index--;
    if (index < 0) {
        index = this.items.length - 1;
    };

    item = this.items[index];
    if (!item.src) {
        this.load(index);
        return;
    } else {
        img = ok.$(this.id + ":IMG:" + index);
        if (!img) {
            img = document.createElement("IMG");
            img.id = this.id + ":IMG:" + index;
            img._id = this.id;
            img._index = index;
            img.style.opacity = this.opacity;
            img.style.position = "absolute";
            img.style.visibility = "hidden";
            img.onload = function () {
                var g = ok.get(this._id),
                    item = g.items[this._index];

                if (item) {
                    item.width = this.width;
                    item.height = this.height;
                    item.ratio = this.width / this.height;
                    g.prev();
                };
            };
            _this.insertBefore(img, ok.$(this.id + ":IMG:" + this.item));
            img.src = item.src;
            this._create(img);
            return;
        };

        width = item.width;
        height = item.height;

        if (width !== this.width) {
            width = this.width;
            height = Math.ceil(width / item.ratio);
        };

        if (height < this.height) {
            height = this.height;
            width = Math.ceil(height * item.ratio);
        };

        item.left = left = Math.floor((this.width - width) / 2);
        item.top = top = Math.floor((this.height - height) / 2);

        img.style.width = width + "px";
        img.style.height = height + "px";
        img.style.left = left + "px";
        img.style.top = top + "px";
        img.style.visibility = "visible";

        this.__FX__ = ok.fx.create(this.id, function (delta) {
            var g = ok.get(this._id),
                img, item,
                left = Math.floor(g.width * delta),
                index;

            item = g.items[g.item];
            if (item)
            {
                img = ok.$(g.id + ":IMG:" + g.item);
                img.style.left = left + item.left + "px";

                index = g.item - 1;
                if (index < 0) {
                    index = g.items.length - 1;
                };

                item = g.items[index];
                if (item) {
                    img = ok.$(g.id + ":IMG:" + index);
                    img.style.left = left + item.left - g.width + "px";
                };
            };

        }, 0, 1, 240, { onfinish: function () {
            var g = ok.get(this._id),
                img = ok.$(g.id + ":IMG:" + g.item);

            ok.$(g.id + ":NAV:" + g.item).className = g.className + "_DOT";

            ok.objects.remove(img.id);
            img.parentNode.removeChild(img);
            g.item = this.index;
            g.__FX__ = null;

            ok.$(g.id + ":NAV:" + g.item).className = g.className + "_DOT_ACTIVE";
        }});
        this.__FX__.gid = this.id;
        this.__FX__.index = index;
    };
};

/**
 *
 */
OK_Object_SlideShow.prototype.redraw = function ()
{
    var _this = ok.$(this.id),
        item = this.items[this.item],
        img, width, height, left, top,
        b, _b, i, _c;

    this.width = _this.clientWidth;
    this.height = _this.clientHeight;

    if (item && item.src)
    {
        img = ok.$(this.id + ":IMG:" + this.item);
        if (!img) {
            img = document.createElement("IMG");
            img.id = this.id + ":IMG:" + this.item;
            img._id = this.id;
            img._index = this.item;
            img.style.opacity = this.opacity;
            img.style.position = "absolute";
            img.style.visibility = "hidden";
            img.onload = function () {
                var g = ok.get(this._id),
                    item = g.items[this._index];

                if (item) {
                    item.width = this.width;
                    item.height = this.height;
                    item.ratio = this.width / this.height;
                };

                g.redraw();
            };
            _this.insertBefore(img, _this.firstChild);
            img.src = item.src;
            this._create(img);

            return;
        };

        width = item.width;
        height = item.height;

        if (width !== this.width) {
            width = this.width;
            height = Math.ceil(width / item.ratio);
        };

        if (height < this.height) {
            height = this.height;
            width = Math.ceil(height * item.ratio);
        };

        item.left = left = Math.floor((this.width - width) / 2);
        item.top = top = Math.floor((this.height - height) / 2);

        img.style.width = width + "px";
        img.style.height = height + "px";
        img.style.left = left + "px";
        img.style.top = top + "px";
        img.style.visibility = "visible";
    };

    // --

    _c = ok.$(this.id + ":NAV");
    ok.objects.removeAll(_c);
    _c.innerHTML = "";
    _this.appendChild(_c);

    if (this.items.length > 1) {
        for (i = 0; i < this.items.length; i++)
        {
            _b = document.createElement("DIV");
            _b.id = this.id + ":NAV:" + i;
            _b.className = this.className + "_DOT" + (i == this.item ? "_ACTIVE" : "");
            _c.appendChild(_b);
        };
    };

    // --

    if (this.slide && this.items.length > 1)
    {
        this.now = new Date().getTime();
        var self = this;
        if (this.__SLIDE__) {
            ok.unthread(this.__SLIDE__);
            this.__SLIDE__ = null;
        };
        this.__SLIDE__ = ok.thread(function () {
            ok.route({type: "slide"}, self);
            self.__SLIDE__ = null;
        }, this.tm);
    };

};

// --

/**
 *
 */
OK_Object_SlideShow.prototype._create = function (img)
{
    var b = ok.get(img.id);
    if (!b) {
        b = new OK_Object_Button(img.id, -1, 1, this.id + "_BTN");
        b._gid = this.id;
        b.__action = function (e) {
            return ok.route(e, this._gid);
        };
        b.__swiping = function (e) {
            return ok.route(e, this._gid);
        };
    };
};

/**
 *
 */
OK_Object_SlideShow.prototype.__slide = function (e)
{
    if (!this.slide || !this.isDisplayed()) { return; };

    var now = new Date().getTime(),
        delta = now - this.now;

    if (!this.now) {
        return;
    };

    if (delta > this.tm)
    {
        this.next();
    }
    else if (delta >= 0)
    {
        var self = this;
        this.__SLIDE__ = ok.thread(function () {
            ok.route({type: "slide"}, self);
        }, this.tm - delta);
    };
};

/**
 *
 */
OK_Object_SlideShow.prototype.__focus = function (e)
{
    this.bubble(e);
};

/**
 *
 */
OK_Object_SlideShow.prototype.__blur = function (e)
{
    this.bubble(e);
};

// --

/**
 *
 */
OK_Object_SlideShow.prototype.__beforeresize = function ()
{
    return 1;
};

/**
 *
 */
OK_Object_SlideShow.prototype.__resize = function (e)
{
    var _this = ok.$(this.id);

    if (!this.items.length || !this.isDisplayed()) { return; };

    this.width = _this.clientWidth;
    this.height = _this.clientHeight;

    this.redraw();
    return 1;
};

// --

/**
 *
 */
OK_Object_SlideShow.prototype.__keydown = function(e)
{
    var key = ok.kb.key(e);

    switch (key)
    {
        // Left key
        case 37:
//          ok.route("prev", this.id);
            e.preventDefault();
            e.stopPropagation();
            return 1;
            break;

        // Right key
        case 39:
//          ok.route("next", this.id);
            e.preventDefault();
            e.stopPropagation();
            return 1;
            break;
    };
};

// --

OK_Object_SlideShow.prototype.__unload = function (e)
{
    this.clear();
};

// --

OK_Object_SlideShow.prototype.__swiping = function (e)
{
    if (this.__FX__) {
        return;
    };

    switch (e.gesture.swipe.direction)
    {
        case "left":
            if (this.item < this.items.length - 1) {
                this.slide = 0;
                this.next();
                ok.touch.clear();
            };
            break;
        case "right":
            if (this.item > 0 ) {
                this.slide = 0;
                this.prev();
                ok.touch.clear();
            };
            break;
    };
};

// --

OK_Object_SlideShow.prototype.__action = function (e)
{
    if (this.__FX__) {
        return;
    };

    if (this.__SLIDE__) {
        window.clearTimeout(this.__SLIDE__);
        this.__SLIDE__ = null;
    };

    if (this.http) {
        this.http.abort();
        ok.$(this.id + ":PROGRESS").style.display = "";
    };

    this.slide = 0;
    this.bubble(e);
};

