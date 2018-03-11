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
function OK_Response ()
{
    this.id = null;
    this.request = null;
    this.container = null;
    this.method = 0;
    this.type = "default";
    this.status = null;
    this.headers = new OK_Collection;
    this.dialogs = {};
    this.text = null;
    this.xml = null;
    this.attachments = new OK_Collection;
    this.attachments.loaded = 0;
    this._error = false;
};

OK_Response.prototype._process = function ()
{
    var response;

    ok._request = this.request;

    if (!this.xml || !this.xml.documentElement || !this.xml.documentElement.tagName === "okp")
    {
        debugger;
        ok.trigger_error("Error: Not valid response from server. Server responded:\n" + this.text);
        ok.resume();
        return;
    };

    response = this.xml.documentElement.firstChild;

    this.type = response.getAttribute("type") || this.type;
    this.container = response.getAttribute("target") || this.container;
    if (!this.method) {
        this.method = parseInt(response.getAttribute("method"));
    };
    this.onload = response.getAttribute("onload");

    for (var i=0; i<response.childNodes.length; i++) {
        var node = response.childNodes.item(i);
        if (node.nodeType == 1) switch (node.tagName) {
            case "script":
                var script = node.childNodes.item(0).nodeValue;

                if (node.getAttribute("type") == "library") {
                    var id = node.getAttribute("id");
                    // Execute script
                    if (!ok.cache.isLoaded(id))
                        ok.cache.add(id, "script", script);
                    if (!ok.cache.isExecuted(id)) {
                        ok.eval(script, id);
                        ok.cache.setExecuted(id, true);
                    };
                } else
                    this.script = script;
                break;
            case "style":
                var style = node.childNodes.item(0).nodeValue;

                if (node.getAttribute("type") == "library") {
                    var id = node.getAttribute("id");
                    // Install stylesheet
                    if (!ok.cache.isLoaded(id))
                        ok.cache.add(id, 'style', style);
                    if (!ok.cache.isExecuted(id)) {
                        var el = document.createElement("STYLE");
                        el.id = id;
                        el.type = 'text/css';
                        el.rel = 'stylesheet';
                        el.media = 'screen';

                        if (ok.client.ie && el.styleSheet) {
                            el.styleSheet.cssText = style;
                        } else {
                            el.appendChild(document.createTextNode(style));
                        };

                        var head = document.getElementsByTagName("HEAD").item(0);
                        head.appendChild(el);

                        ok.cache.setExecuted(id, true);
                    };
                };
                break;
            case "body":
                this.body = node.childNodes.item(0).nodeValue;

                switch (this.type) {
                    case "script":
                        ok.eval(this.body, this.id);
                        break;
                };
                break;
            case "dialog":
                this.dialogs[node.getAttribute('id')] = {
                    script: node.childNodes.item(0).childNodes.item(0).nodeValue,
                    body: node.childNodes.item(1).childNodes.item(0).nodeValue,
                    type: node.getAttribute("type"),
                    dock: node.getAttribute("dock"),
                    show: node.getAttribute("show"),
                    width: node.getAttribute("width"),
                    height: node.getAttribute("height"),
                    left: node.getAttribute("left"),
                    top: node.getAttribute("top"),
                    center: node.getAttribute("center"),
                    close: node.getAttribute("close"),
                    className: node.getAttribute("class")
                };
                break;
        };
    };

    var a = this.attachments;
    if (a.length) {
        for (var p in a.items) {
            if (typeof a.items[p] == "object") {
                a.items[p].send();
            };
        };
    } else {
        if (typeof this.request.onbeforeload == "function" && this.request.onbeforeload({type: 'beforeload'})) {
            return;
        };

        this.__load();
    };
};

OK_Response.prototype.__itemload = function (request_id)
{
    this.attachments.loaded++;
    this.request.onitemload(request_id);
    if (this.attachments.loaded == this.attachments.length) {
        this.__load();
    };
};

OK_Response.prototype.__load = function ()
{
    var save, d, o;

    ok._request = this.request;
    ok._response = this;

    if ((typeof this.request.onbeforeload == "function" && this.request.onbeforeload({type: 'beforeload'})) ||
            (typeof this.onbeforeload == "function" && this.onbeforeload({type: 'beforeload'}))) {
        ok._request = ok._response = null;
        return;
    };

    for (var dialog_id in this.dialogs)
    {
        o = this.dialogs[dialog_id];

        if (typeof o == "object" && o.body)
        {
            if (o.type == "modal") {
                save = ok._save();
            };

            d = new OK_Object_Dialog(dialog_id, o.type, o.left, o.top, o.width, o.height, o.className, o.center, o.close, o.dock);
            if (!ok.layout.write(ok.$(d.id), o.body, o.script, 0)) {
                ok.trigger_error("System error processing dialog object.", 31308, ok.E_ERROR);
                continue;
            };

            if (o.type == "modal") {
                d.___STATE_SELF___ = ok._save();
                ok._restore(save);
            };
        };
    };

    if (this.body) {
        switch (this.method) {
            case ok.LAYOUT_INSERT_AFTER:
                ok.layout.insertAfter(this.container, this.body, this.script);
                break;
            case ok.LAYOUT_APPEND_CHILD:
                ok.layout.append(this.container, this.body, this.script);
                break;
            default:
                ok.layout.write(this.container, this.body, this.script);
        }
    } else if (this.script) {
        ok.eval(this.script);
    };

    for (var dialog_id in this.dialogs)
    {
        o = this.dialogs[dialog_id];
        if (typeof o == "object" && o.body) {
            ok.layout._process(ok.$(dialog_id));
            if (o.show) {
                ok.get(dialog_id).show();
            };
        };
    };

    if (typeof this.request.onsuccess == "function") {
        this.request.onsuccess({type: 'success'});
    };

    if (typeof this.request.onload == "function") {
        this.request.onload({type: 'load'});
    };

    if (this.onload) {
        ok.eval(this.onload);
    };

    ok._request = ok._response = null;
};
