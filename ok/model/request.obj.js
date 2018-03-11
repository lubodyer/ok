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
function OK_Request(cmd, container)
{
    this.id = 'REQUEST#' + OK_Request.prototype.reqIndex;
    this.name = "ok";
    this.async = 1;
    this.connecting = 0;
    this.loaded = 0;
    this.loading = 0;
    this.cmd = cmd;
    this.headers = new OK_Collection();
    this.post = new OK_Collection();
    this.receiving = 0;
    this.progress = 0;
    this.length = 0;
    this.method = "POST";
    this.container = container;

    if (typeof cmd == "string") {
        this.cmd = new OK_Command(cmd);
    };
    ok.requests.add(this.id, this);
    OK_Request.prototype.reqIndex++;
    if (typeof FormData != "undefined") {
        this.post = new FormData();
    };
};

OK_Request.prototype.add = function (name, value)
{
    this.cmd.add(name, value);
};

OK_Request.prototype.send = function ()
{
    this.loading = 1;

    var idx = this.id;

    this.http = new XMLHttpRequest();
    this.http.onerror = function (e) {
        ok.route(e, ok.requests.get(idx));
    };
    this.http.onreadystatechange = function () {
        ok.route("statechange", ok.requests.get(idx));
    };
    this.http.onprogress = function (e) {
        ok.route(e, ok.requests.get(idx));
    };
    if (this.http.upload) {
        this.http.upload.onprogress = function (e) {
            ok.route("uploadprogress", ok.requests.get(idx));
        };
    };

    // --

    if (this.cmd instanceof OK_Command) {
        if (typeof this.onstatuschange == "function") {
            this.cmd.add("OK_CLIENT_REQUEST_ID", this.id);
        };
    };

    // --

    this.method = "POST";

//  ok.request.uri = "/";
//  var uri = ok.request.uri ? ok.request.uri : window.location.protocol + "//" + window.location.host + window.location.pathname;
    var uri = ok.request.uri ? ok.request.uri : "/";
    var cmd = this.cmd.encode();


    if (this.method == "POST") {
        if (typeof FormData != "undefined") {
            this.post.append(this.name, cmd);
        } else {
            this.post.set(this.name, cmd);
        };
    } else {
        uri += "?" + this.name + "=" + cmd;
    };

    this.http.open(this.method, uri, this.async);

    if (this.post.length && !this.headers.get("Content-Type")) {
        this.headers.set("Content-Type", "application/x-www-form-urlencoded");
    };

    var h = this.headers.items;
    for (var p in h) if (typeof h[p] == "string") {
        this.http.setRequestHeader(p, h[p]);
    };

    // --

    if (typeof FormData != "undefined") {
        this.http.send(this.post);
    } else {
        var s = "";
        var pi = this.post.items;
        for (var p in pi) if (typeof pi[p] == "string" || typeof pi[p] == "number") {
            if (s.length) s += "&";
            s += p + "=" + ok.fn.urlencode(pi[p]);
        };
        this.http.send(s);
    };

    // --

//  ok.stats.bytes_sent += uri.length + s.length;

    // --

    this.__statuschange(); // TODO
};

/**
 *
 */
OK_Request.prototype.__progress = function (e)
{
    if (e.loaded && this.length) {
        this.progress = Math.floor((e.loaded * 100) / this.length);
    };
    ok.events.bubble(e, this);
};

/**
 *
 */
OK_Request.prototype.__uploadprogress = function (e)
{
    ok.events.bubble(e, this);
};

OK_Request.prototype.__statechange = function (e)
{
    var header, headers, matches;

    switch (this.http.readyState) {
        case 1:
            if (!this.connecting) {
                ok.stats.http.connecting++;
                ok.stats.http.onchange(this.cmd.command);
                this.connecting = 1;
            };
            ok.events.bubble(e, this);
            break;
        case 2:
            header = this.http.getResponseHeader("X-Content-Length");
            if (header) {
                header = parseInt(header);
                if (header > 0) {
                    this.length = header - 10;
                };
            };
            ok.events.bubble(e, this);
            break;
        case 3:
            if (!this.receiving) {
                this.receiving = 1;
                this.connecting = 0;
                ok.stats.http.receiving++;
                ok.stats.http.connecting--;
                ok.stats.http.onchange(this.cmd.command);
            };
            ok.events.bubble(e, this);
            break;
        case 4:
            this.receiving = 0;
            ok.stats.http.receiving--;
            ok.stats.http.onchange(this.cmd.command);
            this.loading = 0;
            this.loaded = 1;

            if (!ok.events.bubble(e, this) && this.http.responseText)
            {
                this.response = new OK_Response(this);
                this.response.request = this;
                this.response.container = this.container;
                this.response.text = this.http.responseText;
                this.response.xml = this.http.responseXML;
                this.response.status = this.http.status;

                // Extract response headers
                headers = this.http.getAllResponseHeaders().split(/\r?\n/);
                for (var i = 0; i < headers.length; i++) {
                    if (matches = headers[i].match(/^([^\:]+):[ \t]?(.+)$/i)) {
                        this.response.headers.add(matches[1], matches[2]);
                    };
                };

    //          ok.stats.bytes_received += this.response.text.length;

                if (!ok.events.route({type: 'process', text: this.http.responseText}, this)) {
                    this.response._process();
                };
            };

            this.http = null;
            break;
    };

};

/**
 *
 *
 */
OK_Request.prototype.__statuschange = function (stamp)
{
    if (this.loading && !this.loaded && typeof this.onstatuschange == "function") {
        var rid = this.id, stamp = stamp ? stamp : 0;
        window.setTimeout(function () {
            ok.request(".ok/status", {
                id: rid,
                stamp: stamp
            }, {
                onprocess: function () {
                    var request = ok.requests.get(rid), status = eval(this.response.text);
                    if (typeof (status) != "object") {
                        ok.trigger_error("Error processing request status report.", -1, ok.E_ERROR);
                    } else if (status.modified && request.loading && !request.loaded && !request.onstatuschange({
                        type: "statuschange", item: status.item, items: status.items, status: status.status, stamp: status.stamp
                        })) {
                            request.__statuschange(status.stamp);
                    } else {
                        request.__statuschange(status.stamp);
                    };
                    return 1;
            }});
        }, 750);
    };
};

/**
 *
 */
OK_Request.prototype.reqIndex = 0;

/**
 *
 */
OK_Request.prototype.onbeforedisplay = function () {};

OK_Request.prototype.onitemload = function (request_id) {};

/**
 *
 */
OK_Request.prototype.onload = function () {};

/**
 *
 */
OK_Request.prototype.onresponse = function () {};
