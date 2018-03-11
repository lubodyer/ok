/**
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
 * @class
 */
var ok =
{
    BUTTON_LEFT: 0,
    BUTTON_RIGHT: 2,
    CURSOR_DEFAULT: 'default',
    CURSOR_MOVE: 'move',
    CURSOR_POINTER: 'pointer',
    CURSOR_WAIT: "url(wait.png)",
    E_ERROR: 1,
    E_WARNING: 2,
    E_NOTICE: 4,
    E_SERVER: 8,
    E_UNKNOWN: 16,
    E_ALL: 31,
    ICON_LOADING: "url(loading.gif)",
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    LAYOUT_REPLACE_CONTENT: 1,
    LAYOUT_INSERT_AFTER: 2,
    LAYOUT_APPEND_CHILD: 3,
    sid: "",
    wid: "",
    paused: 1,
    allowSelect: 0,
    x: null,
    y: null,
    blur: 1,
    bubble: function (event, object)
    {
        return this.events.bubble(event, object);
    },
    cache: new OK_Cache,
    client: {
        name: null,
        version: null,
        platform: null,
        moz: null,
        opera: null,
        webkit: null,
        ie: null
    },
    colors: {},    
    cursor: "",
    debug: function (message, level, module)
    {
        level = level == null ? 0 : level;
        module = module == null ? 'CDEBUG' : module;

        ok.debug.level = ok.debug.level == null ? 1 : ok.debug.level;
        ok.debug.buffer = ok.debug.buffer == null ? [] : ok.debug.buffer;
        ok.debug.console = ok.debug.console == null ? 0 : ok.debug.console;

        if (level <= ok.debug.level)
        {
            if (ok.debug.buffer.length > 15) {
                ok.debug.buffer.splice(0, ok.debug.buffer.length - 15);
            };

            if (message instanceof Object) {
                message = this.fn.print(message, 1);
            };

            if (ok.debug.console) {
                console.log(message);
            };

            ok.debug.buffer.push("[" + module + "] " + message);

            this.log(message, module);
        };
    },
    dialog: null,
    dialogs: new OK_Collection,
    dragdrop: new OK_DragAndDrop,
    error_reporting: 31,
    eval: function (code, uri)
    {
        var _s;

        if (typeof code === "string" && code)
        {
            uri = typeof uri === "string" ? uri : ok.uniqid("x-eval-");
            code += "//# sourceURL=" + uri + ".js";

            try
            {
                s = document.createElement("SCRIPT");
                s.text = code;
                document.head.appendChild(s).parentNode.removeChild(s);
                return 1;
            }
            catch (x)
            {
                ok.trigger_error("ECMAScript Error: " + x.message + ".", 1, ok.E_ERROR, uri + ":: " + code);
            };
        };

        return 0;
    },
    events: new OK_Events,
    get: function (id)
    {
        if (id instanceof OK_Object) {
            return id;
        };
        return this.objects.get(id);
    },
    q: function (s, e) {
        return (e ? this.$(e) : document).querySelector(s);
    },
    qq: function (s, e) {
        return Array.prototype.slice.call((e ? this.$(e) : document).querySelectorAll(s));
    },
    kb: new OK_Keyboard,
    layout: new OK_Layout,
    log: function (message, module)
    {
        module = (module == null) ? 'CLIENT' : ('CLIENT:' + module.toUpperCase());
        ok.log.enabled = ok.log.enabled == null ? 1 : ok.log.enabled;
        ok.log.buffer = ok.log.buffer == null ? [] : ok.log.buffer;
        ok.log.timeout = ok.log.timeout == null ? null : ok.log.timeout;
        ok.log.buffer.push({time: new Date().getTime(), module: module, message: message});
        window.clearTimeout(ok.log.timeout);
        if (ok.log.buffer.length > 50) {
            ok.route("log", ok);
        } else {
            ok.log.timeout = this.thread(function () {
                ok.route("log", ok);
            }, 300); // TODO
        };
    },
    menu: null,
    objects: new OK_Objects,
    pause: function ()
    {
        this.paused++;
        this.events.disable();
    },
    requests: new OK_Collection,
    resume: function()
    {
        if (this.paused > 0) {
            this.paused--;
        };

        if (!this.paused) {
            this.events.enable();
        };
    },
    route: function (event, object)
    {
        return this.events.route(event, object);
    },
    set_cursor: function (state)
    {
        var _cursor = ok.$("OK_OS_CURSOR");

        if (state == "wait") {
            this.cursor = this.cache.get(this.CURSOR_WAIT);
        } else {
            this.cursor = "";
        };

        if (this.cursor) {
            if (this.x !== null && this.y !== null) {
                if (!_cursor) {
                    _cursor = document.createElement("img");
                    document.body.appendChild(_cursor);
                };

                _cursor.id = "OK_OS_CURSOR";
                _cursor.style.position = "absolute";
                _cursor.style.width = "20px";
                _cursor.style.height = "22px";
                _cursor.style.top = this.y + "px";
                _cursor.style.left = (this.x + 10) + "px";
                _cursor.src = this.cursor;
            };
        } else if (_cursor) {
            _cursor.parentNode.removeChild(_cursor);
        };
    },
    setValue: function (id, value)
    {
        var c = ok.get(id),
            _c = ok.$(id);

        value = value == null ? "" : value;

        if (c && c._type == "input") {
            c.setText(value);
        } else if (c && c._type == "textbox") {
            c.setText(value);
        } else if (c && c._type == "checkbox") {
            c.setValue(value);
        } else if (_c && _c.tagName == "DIV" || _c.tagName == "TD") {
            _c.innerHTML = value;
        } else if (_c && _c.tagName == "INPUT") {
            _c.value = value;
        } else if (_c && _c.tagName == "SELECT") {
            _c.selectedIndex = 0;
            for (var k = 0; k < _c.options.length; k++) {
                if (_c.options[k].value == value) {
                    _c.selectedIndex = k;
                    break;
                };
            };
        } else if (_c && _c.tagName == "TEXTAREA") {
            _c.value = value;
        };
    },
    getValue: function (id)
    {
        var c = ok.get(id),
            _c = ok.$(id),
            value, _value;

        if (c && (c._type == "input" || c._type == "inputicon")) {
            value = c.getText();
        } else if (c && c._type == "textbox") {
            value = c.getText();
        } else if (c && c._type == "checkbox") {
            value = c.getValue();
        } else if (_c && _c.tagName == "INPUT") {
            value = _c.value;
        } else if (_c && _c.tagName == "SELECT") {
            value = _c.options[_c.selectedIndex].value;
        } else if (_c && _c.tagName == "TEXTAREA") {
            value = _c.value;
        };

        if (value !== "") {
            _value = parseInt(value);
            if (_value == value) {
                return _value;
            };
            _value = parseFloat(value);
            if (_value == value) {
                return _value;
            };

            return value;
        };

        return "";
    },
    stats: {
        http:   {
            connecting:     0,
            receiving:      0,
            onchange:       function () {}  // TODO
        },

        bytes_received:     0,
        bytes_sent:         0,
        started:        new Date
    },
    touch: new OK_Touch,
    uniqid: function (salt)
    {
        ok.uniqid.counter = ok.uniqid.counter == null ? 0 : ok.uniqid.counter;
        salt = salt ? salt : "uid";
        return salt + (++ok.uniqid.counter);
    },
    write: function (node, data, script)
    {
        return this.layout.write(node, data, script);
    },
    __focus: function (e)
    {
        ok.focused = 1;
        if (!ok.objects.focused) {
            if (ok.objects.last) {
                ok.objects.last.focus();
            };
        };
        ok.events.bubble(e, ok);
    },
    __blur: function (e)
    {
        ok.focused = 0;
        if (ok.objects.focused) {
            ok.objects.focused.blur();
        };
        ok.events.bubble(e, ok);
    },
    __contextmenu: function (e)
    {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (!target || !ok.fn.in_array(target.tagName, ['A', 'INPUT', 'TEXTAREA'])) {
            if (!(e.ctrlKey && e.shiftKey)) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                };
            };
        };
    },
    __error: function (message, url, line)
    {
        var msg = "";

        if (message instanceof ErrorEvent)
        {
            msg = message.message;

            if (msg instanceof Object) {
                msg = ok.fn.print(msg, 1);
            };
            if (message.lineno != null) {
                msg += " on line " + message.lineno;
            };
            if (message.colno != null) {
                msg += " on col " + message.colno;
            };
            if (message.filename != null) {
                msg += " in file " + message.filename;
            };
            if (message.stack) {
                msg = msg + ".\n\nStack: \n" + message.stack.toString();
            };
        }
        else
        {
            msg = message;
            if (line != null) {
                msg += " on line " + line;
            };
        };
        if (message.error) {
            msg += ".\nError: " + ok.fn.print(message.error, 1);
        };

        ok.trigger_error(msg, -1, ok.E_ERROR, "SCRIPT");
    },
    __init: function ()
    {
        this.qq("script[type='text/javascript']").forEach(function (v, i, a) {
            v.parentNode.removeChild(v);
        });

        // --

        this.css.transform = this.css.getVendorStyle('transform');
        this.css.transformJS = this.css.getVendorStyleJS('transform');
        this.css.transition = this.css.getVendorStyle('transition');
        this.css.transitionJS = this.css.getVendorStyleJS('transition');
        this.css.filter = this.css.getVendorStyle('filter');
        this.css.filterJS = this.css.getVendorStyleJS('filter');

        // --

        document.addEventListener("mousedown", ok.__mousedown, true);
        document.addEventListener("mousemove", ok.__mousemove, true);
        document.addEventListener("mouseover", ok.__mouseover, true);
        ok.events.capture("onblur", window, ok.__blur);
        ok.events.capture("onfocus", window, ok.__focus);
        ok.events.capture("oncontextmenu", document, ok.__contextmenu);
        ok.events.capture("onmousemove", document, ok.dragdrop.__mousemove);
        ok.events.capture("onmouseup", document, ok.dragdrop.__mouseup);
        ok.events.capture("onkeydown", document, ok.kb.__eventRouter);
        ok.events.capture("onkeyup", document, ok.kb.__eventRouter);
        ok.events.capture("onkeypress", document, ok.kb.__eventRouter);
        ok.events.capture("onresize", window, ok.__resize);
        ok.events.capture("onerror", window, ok.__error);
        ok.events.capture("onload", window, ok.__load);
        ok.events.capture("onunload", window, ok.__unload);
        ok.events.capture("onselectstart", document, ok.__selectstart);
        ok.events.capture("onorientationchange", document, ok.__orientationchange);
        ok.events.capture("ontouchstart", document, function (e) { return ok.route(e, ok.touch); }, {passive: 0});
        ok.events.capture("ontouchmove", document, function (e) { ok.route(e, ok.touch); }, {passive: 0});
        ok.events.capture("ontouchend", document, function (e) { ok.route(e, ok.touch); }, {passive: 0});
        ok.events.capture("ontouchcancel", document, function (e) { ok.route(e, ok.touch); }, {passive: 0});
        ok.layout._process(document.body);
        ok.events.broadcast("beforeload", document.body);
        this.route("init", this.history);
        this.events.bubble("init", this);
    },
    __orientationchange: function (e)
    {
        window.scrollTo(0, 0);
    },
    __load: function (e)
    {
        ok.resume();
        if (!ok.events.bubble("load", ok)) {
            ok.layout.resize(document.body);
            ok.events.bubble("ready", ok);
        };
    },
    ___LOG_COUNTER___: 0,
    __log: function ()
    {
        if (ok.log.enabled && this.___LOG_COUNTER___ < 20)
        {
            var blen = ok.log.buffer.length,
                req = new OK_Request(".ok/log");

            this.___LOG_COUNTER___++;

            req.post.append("messages", blen);

            for (var i = 0; i < blen; i++) {
                req.post.append("time" + i, ok.log.buffer[i].time);
                req.post.append("module" + i, ok.log.buffer[i].module);
                req.post.append("message" + i, ok.fn.urlencode(ok.log.buffer[i].message));
            };

            ok.log.buffer = [];
            req.send();
        };
    },
    __mousedown: function (e)
    {
        var target = e.target, c;

        if (!ok.menu) {
            if (ok.objects.focused && ok.blur) {
                if (!(c = ok.fn.isObject(target)) || ok.fn.in_array(ok.get(c)._type, ["deck", "split", "box2", "scrollbox", "sidebar"])) {
                    ok.objects.focused.blur();
                };
            };

            if (!ok.fn.isObject(e.target) && (e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA")) {
                if (ok.objects.focused) {
                    ok.objects.focused.blur();
                };
            } else if (!ok.allowSelect && e.target.tagName !== "SELECT" && e.target.tagName !== "OPTION" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                e.preventDefault();
            };

            return;
        };

        if (!ok.fn.isMenu(target)) {
            ok.menu.hide(1);
        };

        if (!ok.allowSelect) {
            e.preventDefault();
        };
    },
    __mousemove: function (e)
    {
        ok.x = e.clientX;
        ok.y = e.clientY;

        ok.client.mouse = 1;

        var _cursor = ok.$("OK_OS_CURSOR");
        if (_cursor) {
            _cursor.style.top = (ok.y - 9) + "px";
            _cursor.style.left = (ok.x + 9) + "px";
            if (document.body.lastChild !== _cursor) {
                document.body.appendChild(_cursor);
            };
        };
    },
    __mouseover: function (e)
    {
        ok.x = e.clientX;
        ok.y = e.clientY;

        var _cursor = ok.$("OK_OS_CURSOR");
        if (_cursor) {
            _cursor.style.top = (ok.y - 9) + "px";
            _cursor.style.left = (ok.x + 9) + "px";
            if (document.body.lastChild !== _cursor) {
                document.body.appendChild(_cursor);
            };
        };
    },
    __resize: function (e)
    {
        window.clearTimeout(ok.___RESIZE_TIMEOUT___);
        ok.___RESIZE_TIMEOUT___ = ok.thread(function () {
            ok.route("resize", ok.layout);
        }, 250);
    },
    __selectstart: function () {
        if (!ok.allowSelect) {
            return false;
        };
    },
    __unload: function ()
    {
//      var r = new OK_Request(".ok/unload");
//      r.async = 0;
//      r.send();

        ok.events.unload();
        ok.objects.removeAll(document.body);
        ok.bubble('unload', ok);
    }
};

ok.fetch = function (service, params, callback)
{
    var cmd = new OK_Command(service), params, r;

    if (params) {
        for (param in params) {
            if (typeof param == "string") {
                cmd.params.set(param, params[param]);
            };
        };
    };

    r = new OK_Request(cmd);
    r.onprocess = function (e) {
        ok.fn.callback(callback, e.text);
        return 1;
    };
    r.send();
};

ok.request = function (command, params, events, send, container)
{
    var cmd = new OK_Command(command);

    if (params)
        for (var param in params)
            if (typeof param == "string")
                cmd.params.set(param, params[param]);

    var r = new OK_Request(cmd, container);

    if (events)
        for (var event in events)
            if (typeof event == "string")
                switch (typeof events[event]) {
                    case "string":
                        r[event] = new Function("e", events[event]);
                        break;
                    case "function":
                        r[event] = events[event];
                        break;
            };

    if (send || send == null)
        r.send();

    return r;
};

ok.event2key = function(e)
{
    return this.kb.key(e);
};

ok.thread = function (script, delay)
{
    return window.setTimeout(function ()
    {
        try
        {
            if (typeof script == "string") {
                window.eval(script);
            } else if (typeof script == "function") {
                script();
            };

        }
        catch (ex) {
            var msg = ex.message;

            if( ex.hasOwnProperty('lineNumber') && ex.lineNumber > 0 ){
                var lineNum = ex.lineNumber - 2 ;
                var src = document.documentElement.innerHTML.split("\n").slice( lineNum - 5, lineNum + 5 );
                src[4] = src[4].replace(/^(\s)/,">>>$1");
                msg = msg + ". \nLine number: " + lineNum + ", \nNear: " + src.join("\n");
            }
            if( ex.stack ){
                msg = msg + ".\n\nStack: \n" + ex.stack.toString();
            }

            ok.trigger_error('Error executing thread: ' + msg, -2, ok.E_ERROR, 'SCRIPT');
        };

    }, delay);
};

ok.trigger_error = function (errmsg, errcode, errtype, context)
{
    var errtypemsg, msg;

    if (errmsg == null) errmsg = "Unknown error.";
    if (errcode == null) errcode = -1;
    if (errtype == null) errtype = ok.E_UNKNOWN;

    if (!(this.error_reporting & errtype))
        return;

    if (errtype == this.E_ERROR) {
        errtypemsg = "ERROR";
    } else if (errtype == this.E_WARNING) {
        errtypemsg = "WARNING";
    } else if (errtype == this.E_NOTICE) {
        errtypemsg = "NOTICE";
    } else if (errtype == this.E_SERVER) {
        errtypemsg = "SERVER ERROR";
    } else if (errtype == this.E_UNKNOWN) {
        errtypemsg = "UNKNOWN ERROR";
    };

    msg = errtypemsg + ": (" + errcode + ") " + errmsg + (context ? (" [context: " + context.replace(/\n/g, "") + "]") : "") + ".";
    msg = msg.length > 2048 ? msg.substr(0, 2048) : msg;

    // --

    this.log(msg, "ERROR");

    ok.resume();
};

ok.unthread = function (thread_id)
{
    return window.clearTimeout(thread_id);
};

ok._tplc = {};
ok.tmpl = function (str, data)
{
    // John Resig - http://ejohn.org/ - MIT Licensed
    var fn = !/\W/.test(str) ?
            this._tplc[str] = this._tplc[str] ||
            this.tmpl(this.$(str).innerHTML) :
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" +
                    str.replace(/[\r\t\n]/g, " ")
                    .split("{{").join("\t")
                    .replace(/((^|\}\})[^\t]*)'/g, "$1\r")
                    .replace(/\t(.*?)\}\}/g, "',$1,'")
                    .split("\t").join("');")
                    .split("}}").join("p.push('")
                    .split("\r").join("\\'")
                    + "');}return p.join('');");

    return data ? fn( data ) : fn;
};

ok._restore = function (state)
{
    this.objects._restore(state.objects);
    this.kb._restore(state.kb);
};

ok._save = function ()
{
    return {
        objects: this.objects._save(),
        kb: this.kb._save()
    };
};

ok.history =
{
    _current: null,
    _back: [],
    _forward: [],
    back: function () {
        window.history.back();
    },
    get: function ()
    {
        if (window.history.pushState) {
            return window.location.pathname;
        } else if (window.location.hash) {
            return window.location.hash.substr(1);
        };
    },
    set: function (location) {
        if (this._current != location) {
            if (this._current) {
                this._back.push(this._current);
            };
            this._forward = [];
            this._current = location;
            if (window.history.pushState) {
                window.history.pushState(null, null, this._current);
            } else {
                window.location.hash = this._current;
            };

            if (typeof _gaq == "object" && typeof _gaq.push == "function") {
                _gaq.push(['_trackPageview', this._current]);
            };
        };
    },
    onchange: function () {},
    __change: function () {
        var location = this.get(),
            _current = this._current;
        if (location != this._current) {
            var index = -1, l = this._back.length;
            for (var i=0;i<l;i++) {
                if (this._back[i] == location) {
                    index = i;
                    break;
                };
            };

            if (index > -1) {
                this._forward = this._back.splice(index, l-index).concat(this._forward);
            };

            this._current = location;
            ok.events.bubble({type: "change", location: this._current, origin: _current}, this);
        };
    },
    __init: function ()
    {
        if (window.history.pushState) {
            window.addEventListener('popstate', function (e) {
                ok.route("change", ok.history);
            });
        }
        else
        {
            if (window.location.hash) {
                this._current = window.location.hash;
            };
            this.__interval = window.setInterval(function () {
                ok.route("change", ok.history);
            }, 40);
        };
        this.__init = null;
    }
};

ok.$ = function (id)
{
    if (typeof id == "string") {
        return document.getElementById(id);
    };
    return id;
};
