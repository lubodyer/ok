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
function OK_Object_Form(id, service, method, action)
{
    this.id = id;
    this.service = service;
    this.method = method;
    this.action = action;
    this.submitted = 0;
    this.tabindex = -1;
    this.request = new OK_Request(this.service);
    this.request.form_id = this.id;
    this.request.method = this.method;
    if (this.action) {
        this.request.uri = this.action;
    };
    this.request.onprocess = function (e) {
        return ok.route(e, ok.get(this.form_id));
    };
    this.request.onsuccess = function (e) {
        return ok.route(e, ok.get(this.form_id));
    };

    this.register();
    this.capture("submit");
}

/** */
OK_Object_Form.prototype = new OK_Object;

/**
 *
 */
OK_Object_Form.prototype.isValid = function (node)
{
    for (var i=0,c,n,v,node=node ? node : ok.$(this.id),l=node.childNodes.length; i<l; i++) {
        n = node.childNodes.item(i);
        if (n.id && (c = ok.get(n.id)) && typeof c.isValid == "function" && !c.isValid())
            return 0;
        if (!this.isValid(n))
            return 0;
    };
    return 1;
};

/**
 *
 */
OK_Object_Form.prototype.reset = function ()
{
    this.submitted = 0;
    this.request = new OK_Request(this.action);
};

/**
 *
 */
OK_Object_Form.prototype.submit = function (force)
{
    if (this.submitted || (!force && ok.events.route("beforesubmit", this)))
        return 0;

    this.submitted = 1;
    this._scan(ok.$(this.id));
    this.request.send();
    this.bubble("submit");

    return 1;
};

OK_Object_Form.prototype._scan = function (node) {
    for (var i = 0, c, n, v, l = node.childNodes.length; i<l; i++)
    {
        n = node.childNodes.item(i);
        switch (n.tagName)
        {
            // --

            case "INPUT":
            case "TEXTAREA":
                if (n.type == "file") {
                    this.request.post.append(n.name ? n.name : n.id, n.files[0]);
                } else {
                    this.request.add(n.name ? n.name : n.id, n.value);
                };
                break;

            case "SELECT":
                if (n.selectedIndex > -1) {
                    this.request.add(n.id, n.options[n.selectedIndex].value);
                };
                break;

            // --

            default:
                if (n.id) {
                    c = ok.get(n.id);
                    if (c) {
                        if (c.focused) c.blur();
                        switch (c._type) {
                            case "input":
                            case "textbox":
                                this.request.add(c.id, c.getText());
                                break;
                            case "checkbox":
                                this.request.add(c.id, c.value ? "1" : "0");
                                break;
                        };
                    };
                };
                break;
        };

        // --

        if (n.nodeType == 1) {
            this._scan(n);
        };
    };
};

/**
 *
 */
OK_Object_Form.prototype.toString = function () {
    var elements = this._scan(ok.$(this.id));
    var s = "";
    var len = elements.length;
    for (var i=0; i<len; i++) {
        s += elements[i] + "\n";
    }
    alert(s);
};

/**
 *
 */
OK_Object_Form.prototype.__submit = function (e) {
    e.stopPropagation();
    e.preventDefault();
    return this.submit();
};
