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
ok.fn =
{
    /**
     * Request next animation frame
     */
    requestAnimationFrame: function (callback)
    {
        var tm;

        if (typeof window.requestAnimationFrame == "function") {
            tm = window.requestAnimationFrame(function () {
                ok.fn.callback(callback);
            });
        } else if (typeof window.mozRequestAnimationFrame == "function") {
            tm = window.mozRequestAnimationFrame(function () {
                ok.fn.callback(callback);
            });
        } else if (typeof window.webkitRequestAnimationFrame == "function") {
            tm = window.webkitRequestAnimationFrame(function () {
                ok.fn.callback(callback);
            });
        } else if (typeof window.msRequestAnimationFrame == "function") {
            tm = window.msRequestAnimationFrame(function () {
                ok.fn.callback(callback);
            });
        } else {
            tm = window.setTimeout(function () {
                ok.fn.callback(callback);
            }, Math.round(1000 / 60));
        };

        return tm;
    },

    cancelAnimationFrame: function (tm)
    {
        if (typeof window.cancelAnimationFrame == "function") {
            window.cancelAnimationFrame(tm);
        } else if (typeof window.mozCancelAnimationFrame == "function") {
             window.mozCancelAnimationFrame(tm);
        } else if (typeof window.webkitCancelAnimationFrame == "function") {
            window.webkitCancelAnimationFrame(tm);
        } else if (typeof window.msCancelAnimationFrame == "function") {
            window.msCancelAnimationFrame(tm);
        } else {
            window.clearTimeout(tm);
        };

        return null;
    },

    /**
     *
     */
    angle: function (x1, y1, x2, y2)
    {
        var angle = Math.atan((y2 - y1) * -1 / (x2 - x1)) * (180 / Math.PI);
        return angle < 0 ? angle + 180 : angle;
    },

    addslashes: function (s) {
        return (s+'').replace(/([\\"'])/g, "\\$1").replace(/\u0000/g, "\\0");
    },

    array_search: function (value, array) {
        for (var i = 0, l = array.length; i < l; i++)
            if (array[i] == value)
                return i;
        return -1;
    },

    callback: function (fn, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        if (typeof fn == 'string') {
            try { eval(fn); }
            catch (c) { return false; };
        } else if (typeof fn == 'function') {
            try { fn(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9); }
            catch (c) { return false; };
        };
        return true;
    },

    clone: function (obj, sub_rq, clone_depth) {
        if (!sub_rq) sub_rq = 0;
        if (!clone_depth) clone_depth = 1;
        if (typeof obj != 'object' || obj == null || sub_rq >= clone_depth) return obj;

        var new_obj = (this.isArray(obj) ? new Array() : new Object());
        new_obj.prototype = obj.prototype;
        for (var elm in obj) {
            new_obj[elm] = this.clone(obj[elm], sub_rq + 1);
        };
        return new_obj;
    },

    clone2: function (obj, deep)
    {
        var _obj, e;

        if (typeof obj != 'object' || obj == null) {
            return obj;
        };

        _obj = (this.isArray(obj) ? new Array() : new Object());
        _obj.prototype = obj.prototype;


        for (e in obj) {
            _obj[e] = deep ? this.clone2(obj[e], 1) : obj[e];
        };

        return _obj;
    },

    /**
     *
     */
    direction: function (x1, y1, x2, y2)
    {
        var angle = this.angle(x1, y1, x2, y2);

        if ((angle <= 45) && (angle >= 0)) {
            return 'left';
        } else if ((angle <= 360) && (angle >= 315)) {
            return 'left';
        } else if ((angle >= 135) && (angle <= 225)) {
            return 'right';
        } else if ((angle > 45) && (angle < 135)) {
            return 'down';
        };

        return 'up';
    },

    /**
     *
     */
    distance: function (x1, y1, x2, y2)
    {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * -1;
    },
    
    /**
     * 
     */
    extend: function (target, source) {
        var p;
        for (p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            };
        };
        return target;
    },

    /**
     *
     */
    rgb2hex: function (color)
    {
        if (color.substr(0, 1) !== '#') {
            var _n = /^rgb\((\d+), *(\d+), *(\d+)\);?$/.exec(color),
                rgb = _n[1] | (_n[2] << 8) | (_n[3] << 16);
            return '#' + rgb.toString(16);
        };
        return color;
    },

    /**
     *
     */
    hex2rgba: function (hex)
    {
        if (hex[0]=="#") {
            hex=hex.substr(1);
            if (hex.length==3) {
                var temp=hex; hex='';
                temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
                for (var i=0;i<3;i++) hex+=temp[i]+temp[i];
            }
            var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
            return {
                red:   parseInt(triplets[0],16),
                green: parseInt(triplets[1],16),
                blue:  parseInt(triplets[2],16),
                alpha: 1
            };
        };
    },

    /**
     *
     *
    rgb2hsv: function (rgb)
    {
        var hsv = {},
            max = ((rgb.red > rgb.green) ? ((rgb.red > rgb.blue) ? rgb.red : rgb.blue) : ((rgb.green > rgb.blue) ? rgb.green : rgb.blue)),
            diff = max - ((rgb.red < rgb.green) ? ((rgb.red < rgb.blue) ? rgb.red : rgb.blue) : ((rgb.green < rgb.blue) ? rgb.green : rgb.blue));

        hsv['saturation'] = max == 0 ? 0 : 100 * diff / max;

        if (hsv['saturation'] == 0) {
            hsv['hue'] = 0;
        } else if (rgb.red == max) {
            hsv['hue'] = 60 * (rgb.green - rgb.blue) / diff;
        } else if (rgb.green == max) {
            hsv['hue'] = 120 + 60 * (rgb.blue - rgb.red) / diff;
        } else if (rgb.blue == max) {
            hsv['hue'] = 240 + 60 * (rgb.red - rgb.green) / diff;
        };

        if (hsv['hue'] < 0) {
            hsv['hue'] += 360;
        };

        hsv['value'] = Math.round(max * 100 / 255);
        hsv['hue'] = Math.round(hsv['hue']);
        hsv['saturation'] = Math.round(hsv['saturation']);

        return hsv;
    },

    /**
     *
     *
    hsv2rgba: function (hsv)
    {
        var rgb = {}, i, f, p, q, t;

        if (hsv.saturation == 0) {
            rgb['red'] = rgb['green'] = rgb['blue'] = Math.round(hsv.value * 2.55);
        } else {
            hsv.hue /= 60;
            hsv.saturation /= 100;
            hsv.value /= 100;
            i = Math.floor(hsv.hue);
            f = hsv.hue - i;
            p = hsv.value * (1 - hsv.saturation);
            q = hsv.value * (1 - hsv.saturation * f);
            t = hsv.value * (1 - hsv.saturation * (1 - f));
            switch (i) {
                case 0:
                    rgb['red'] = hsv.value;
                    rgb['green'] = t;
                    rgb['blue'] = p;
                    break;
                case 1:
                    rgb['red'] = q ;
                    rgb['green'] = hsv.value;
                    rgb['blue'] = p;
                    break;
                case 2:
                    rgb['red'] = p;
                    rgb['green'] = hsv.value;
                    rgb['blue'] = t;
                    break;
                case 3:
                    rgb['red'] = p;
                    rgb['green'] = q;
                    rgb['blue'] = hsv.value;
                    break;
                case 4:
                    rgb['red'] = t;
                    rgb['green'] = p;
                    rgb['blue'] = hsv.value;
                    break;
                default:
                    rgb['red'] = hsv.value;
                    rgb['green'] = p;
                    rgb['blue'] = q;
            };

            rgb['red'] = Math.round(rgb['red'] * 255);
            rgb['green'] = Math.round(rgb['green'] * 255);
            rgb['blue'] = Math.round(rgb['blue'] * 255);
        };

        rgb['alpha'] = 1;

        return rgb;
    },

    /**
     *
     */
    coloropposite: function (hex)
    {
        var temp = hex.toUpperCase(), opp = "";

        if (temp[0] == "#") {
            temp = temp.substr(1);
        };

        for (i = 0; i < 6; i++) {
            if (temp.charAt(i) == "F") opp = opp + "0";
            if (temp.charAt(i) == "E") opp = opp + "1";
            if (temp.charAt(i) == "D") opp = opp + "2";
            if (temp.charAt(i) == "C") opp = opp + "3";
            if (temp.charAt(i) == "B") opp = opp + "4";
            if (temp.charAt(i) == "A") opp = opp + "5";
            if (temp.charAt(i) == "9") opp = opp + "6";
            if (temp.charAt(i) == "8") opp = opp + "7";
            if (temp.charAt(i) == "7") opp = opp + "8";
            if (temp.charAt(i) == "6") opp = opp + "9";
            if (temp.charAt(i) == "5") opp = opp + "A";
            if (temp.charAt(i) == "4") opp = opp + "B";
            if (temp.charAt(i) == "3") opp = opp + "C";
            if (temp.charAt(i) == "2") opp = opp + "D";
            if (temp.charAt(i) == "1") opp = opp + "E";
            if (temp.charAt(i) == "0") opp = opp + "F";
        };

        return "#" + opp;
    },

    /**
     *
     */
    rgba2css: function (rgba)
    {
        rgba.alpha = (rgba.alpha >= 0 && rgba.alpha <= 1) ? rgba.alpha : 1;
        return "rgba(" + rgba.red + "," + rgba.green + "," + rgba.blue + "," + rgba.alpha + ")";
    },

    /**
     *
     */
    defined: function (o) {
        return o !== null && o !== undefined;
    },

    /**
     *
     * @original http://phpjs.org/functions/dirname
     */
    dirname: function (path)
    {
        return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
    },

    /**
     *
     *
    ellipsis: function (node, _root)
    {
        return;
        // --

        _root = _root || node;

        try
        {
            if (_root.scrollWidth > _root.clientWidth || _root.scrollHeight > _root.clientHeight)
            {
                if (node.nodeType == 1 && node.childNodes.length > 0) {
                    for (var i = node.childNodes.length; i > 0; i--) {
                        this.ellipsis(node.childNodes[i - 1], _root);
                    };
                };

                if (node.nodeType == 3) {
                    while (node.nodeValue && (_root.scrollWidth > _root.clientWidth || _root.scrollHeight > _root.clientHeight)) {
                        node.nodeValue = node.nodeValue.substr(0, node.nodeValue.length - 1);
                    };

                    if (node.nodeValue && node.nodeValue.length > 3) {
                        node.nodeValue = node.nodeValue.substr(0, node.nodeValue.length - 3) + "...";
                    };
                };
            };
        }
        catch (x)
        {
            ok.trigger_error("OK Ellipsis Error: " + x.message);
        };
    },
    */

    empty: function (mixed_var, skip_str) {
        if (!this.isset(mixed_var) || mixed_var === false || (!skip_str && mixed_var === "")) return true;
        if (typeof mixed_var == 'object') {
            try {
                for (var key in mixed_var) { return false; };
            } catch (ex) { return false; };
            return true;
        } else if (typeof mixed_var == "array") {
            return mixed_var.length > 0;
        };
        return false;
    },

    /**
     *
     *
    extend: function (target, source)
    {
        if (arguments.length > 2) {
            for (var a = 1; a < arguments.length; a++) {
                ok.fn.extend(target, arguments[a]);
            }
        } else {
            for (var i in source) {
                target[i] = source[i];
            };
        };
        return target;
    },
    */

    in_array: function (key, source) {
        for (var i=0, l=source.length; i<l; i++)
            if (source[i] == key)
                return 1;
        return 0;
    },

    is_scalar: function (mixed_var) {
        return (/boolean|number|string/).test(typeof mixed_var);
    },

    isArray: function (a) {
        return a instanceof Array;
    },

    isChildOf: function (node, parent)
    {
        while (node) {
            if (node == parent) {
                return 1;
            };
            node = node.parentNode;
        };
        return 0;
    },

    isChildObject: function (node, parent)
    {
        var _node = ok.$(node.id),
            _parent = ok.$(parent.id);

        while (_node) {
            if (_node == _parent) {
                return 1;
            };
            _node = _node.parentNode;
        };
        return 0;
    },

    isObjectNode: function (node, type)
    {
        var c;

        node = ok.$(node);

        while (node.parentNode != null) {
            if (node.id && (c = ok.get(node.id)) && (type instanceof Array ? ok.fn.in_array(c._type, type) : c._type === type)) {
                return node.id;
            };
            node = node.parentNode;
        };
        return null;
    },

    isObject: function (node)
    {
        while (node.parentNode != null) {
            if (node.id && ok.get(node.id)) {
                return node.id;
            };
            node = node.parentNode;
        };
        return null;
    },

    isFunc: function (f) {
        return typeof f === "function";
    },

    isMenu: function (e)
    {
        var c;
        while (e.parentNode != null) {
            if (e.id && (c = ok.get(e.id)) && (c._type == 'menu' || c._type == 'menuitem' || (c._type == 'button' && c.childMenu))) {
                return true;
            };
            e = e.parentNode;
        };
        return false;
    },

    isset: function (mixed_var) {
        if (typeof mixed_var == 'undefined' || mixed_var === null) return false;
        return true;
    },

    isString: function (s) {
        return typeof s === "string";
    },

    isUndef: function(o) {
        return o === undefined;
    },

    htmlentities: function (text) {
        return typeof text == "string" ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;") : text;
    },

    htmlentities_decode: function (text) {
        return typeof text == "string" ? text.replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&nbsp;/gi, " ").replace(/&copy;/gi, String.fromCharCode("169")) : text;
    },

    getNodeIndex: function (node) {
        for (var i = 0, p = node.parentNode, l = p.childNodes.length; i < l; i++)
            if (p.childNodes.item(i) == node)
                return i;
        return -1;
    },

    /**
     *
     */
    lcfirst: function (string)
    {
        return string.charAt(0).toLowerCase() + string.slice(1);
    },

    /**
     *
     *
     * @original http://phpjs.org/functions/parse_url
     */
    parse_url: function (uri)
    {
        var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'],
            m = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(uri),
            uri = {},
            i = 14;

        while (i--) {
            if (m[i]) {
                uri[key[i]] = m[i];
            };
        };

        delete uri.source;
        return uri;
    },

    /**
     *
     */
    print: function (o, bReturnString)
    {
        if (o instanceof Object) {
            var s = [];
            for (var property in o)
                try {
                    s.push(property + "=" + o[property]);
                } catch (ex) {
                    s.push(property + "=<access denied>");
                };
            if (bReturnString)
                return s.join(";");
            else
                alert(s.join("\n"));
        };

        // TODO
    },

    /**
     *
     * @deprecated
     */
    printObject: function (o, bReturnString) {
        this.print(o, bReturnString);
    },


    /**
     * F.E.
     * Sort by price high to low
     * [].sort(ok.fn.asortby('price', true, parseInt));
     * Sort by city, case-insensitive, A-Z
     * [].sort(ok.fn.asortby('city', false, function(a){return a.toUpperCase()}));
     */
    asortby: function (field, reverse, primer)
    {
        var key = primer ? function(x) {return primer(x[field])} : function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },

    strpadleft: function (str, len, pad) {
        return Array(len + 1 - str.length).join(pad) + str;
    },

    strpadright: function (str, len, pad) {
        return str + Array(len + 1 - str.length).join(pad);
    },

    strpadcenter: function (str, len, pad) {
        var plen = len - str.length;
        var right = Math.ceil((len - str.length) / 2);
        return Array(plen-right+1).join(pad) + str + Array(right+1).join(pad);
    },

    trim: function (str) {
        var str = str.replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
        while (ws.test(str.charAt(--i)));
        return str.slice(0, i + 1);
    },

    hasClass: function(element, _className) {
        if (!element) return;

        var upperClass = _className.toUpperCase();
        if (element.className){
            var classes = element.className.split(' ');
            for (var i=0; i<classes.length; i++) if (classes[i].toUpperCase() == upperClass) return true;
        };
        return false;
    },

    addClass: function (element,_class){
        if (!element) return;
        if (!this.hasClass(element, _class)) element.className += element.className ? (" "+_class) : _class;
    },

    insertClass: function (element,_class){
        if (!element) return;
        if (!this.hasClass(element, _class)) element.className = _class + (element.className ? (" " + element.className) : "");
    },

    setClass: function (element,_class){
        if (!element) return;
        element.className = _class;
    },

    removeClass: function (element,_class){
        if (!element) return;

        var upperClass = _class.toUpperCase();
        var remainingClasses = new Array();
        if (element.className){
            var classes = element.className.split(' ');
            for (var i=0; i<classes.length; i++){
                if (classes[i].toUpperCase() != upperClass){
                    remainingClasses[remainingClasses.length] = classes[i];
                };
            };
            element.className = remainingClasses.join(' ');
        };
    },
    
    /**
     * 
     */
    resolve: function (name, context) {
        var ns = name.split("."),
            fn = ns.pop(), i;
            
        context = context ? context : window;
        for (i = 0; i < ns.length; i++) {
            context = context[ns[i]];
        };
        
        return context[fn];
    },

    /**
     *
     * @see @see http://phpjs.org/functions/serialize
     */
    serialize: function (mixed_value) {
        var _utf8Size = function (str) {
            var size = 0,
                i = 0,
                l = str.length,
                code = '';
            for (i = 0; i < l; i++) {
                code = str.charCodeAt(i);
                if (code < 0x0080) {
                    size += 1;
                } else if (code < 0x0800) {
                    size += 2;
                } else {
                    size += 3;
                }
            }
            return size;
        };
        var _getType = function (inp) {
            var type = typeof inp,
                match;
            var key;

            if (type === 'object' && !inp) {
                return 'null';
            }
            if (type === "object") {
                if (!inp.constructor) {
                    return 'object';
                }
                var cons = inp.constructor.toString();
                match = cons.match(/(\w+)\(/);
                if (match) {
                    cons = match[1].toLowerCase();
                }
                var types = ["boolean", "number", "string", "array"];
                for (key in types) {
                    if (cons == types[key]) {
                        type = types[key];
                        break;
                    }
                }
            }
            return type;
        };
        var type = _getType(mixed_value);
        var val, ktype = '';

        switch (type) {
        case "function":
            val = "";
            break;
        case "boolean":
            val = "b:" + (mixed_value ? "1" : "0");
            break;
        case "number":
            val = (Math.round(mixed_value) == mixed_value ? "i" : "d") + ":" + mixed_value;
            break;
        case "string":
            val = "s:" + _utf8Size(mixed_value) + ":\"" + mixed_value + "\"";
            break;
        case "array":
        case "object":
            val = "a";
    /*
                if (type == "object") {
                    var objname = mixed_value.constructor.toString().match(/(\w+)\(\)/);
                    if (objname == undefined) {
                        return;
                    }
                    objname[1] = this.serialize(objname[1]);
                    val = "O" + objname[1].substring(1, objname[1].length - 1);
                }
                */
            var count = 0;
            var vals = "";
            var okey;
            var key;
            for (key in mixed_value) {
                if (mixed_value.hasOwnProperty(key)) {
                    ktype = _getType(mixed_value[key]);
                    if (ktype === "function") {
                        continue;
                    }

                    okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
                    vals += this.serialize(okey) + this.serialize(mixed_value[key]);
                    count++;
                }
            }
            val += ":" + count + ":{" + vals + "}";
            break;
        case "undefined":
            // Fall-through
        default:
            // if the JS object has a property which contains a null value, the string cannot be unserialized by PHP
            val = "N";
            break;
        }
        if (type !== "object" && type !== "array") {
            val += ";";
        }
        return val;
    },

    /**
     *
     * @see http://phpjs.org/functions/strip_tags
     */
    strip_tags: function (str, allowed_tags) {

        var key = '', allowed = false;
        var matches = [];
        var allowed_array = [];
        var allowed_tag = '';
        var i = 0;
        var k = '';
        var html = '';

        var replacer = function (search, replace, str) {
            return str.split(search).join(replace);
        };

        // Build allowes tags associative array
        if (allowed_tags) {
            allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi);
        }

        str += '';

        // Match tags
        matches = str.match(/(<\/?[\S][^>]*>)/gi);

        // Go through all HTML tags
        for (key in matches) {
            if (isNaN(key)) {
                // IE7 Hack
                continue;
            }

            // Save HTML tag
            html = matches[key].toString();

            // Is tag not in allowed list? Remove from str!
            allowed = false;

            // Go through all allowed tags
            for (k in allowed_array) {
                // Init
                allowed_tag = allowed_array[k];
                i = -1;

                if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+'>');}
                if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+' ');}
                if (i != 0) { i = html.toLowerCase().indexOf('</'+allowed_tag)   ;}

                // Determine
                if (i == 0) {
                    allowed = true;
                    break;
                }
            }

            if (!allowed) {
                str = replacer(html, "", str); // Custom replace. No regexing
            }
        }

        return str;
    },

    /**
     *
     */
    ucfirst: function (string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    /**
     *
     */
    urlencode: function (str) {
        str = (str + "").toString();
        if (encodeURIComponent)
            return encodeURIComponent(str).replace(/!/g, '%21').replace(/\'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
        if (escape)
            return escape(str);
    },

    /**
     *
     * @see http://phpjs.org/functions/utf8_encode
     */
    utf8_encode: function( argString ) {
        var string = (argString+''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");

        var utftext = "";
        var start, end;
        var stringl = 0;

        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;

            if (c1 < 128) {
                end++;
            } else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
            } else {
                enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
            };
            if (enc !== null) {
                if (end > start) {
                    utftext += string.substring(start, end);
                };
                utftext += enc;
                start = end = n+1;
            };
        };
        if (end > start) {
            utftext += string.substring(start, string.length);
        };
        return utftext;
    },

    /**
     *
     */
    md5: function (str) {
        // Calculate the md5 hash of a string
        //
        // version: 909.322
        // discuss at: http://phpjs.org/functions/md5
        // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
        // + namespaced by: Michael White (http://getsprink.com)
        // +    tweaked by: Jack
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // -    depends on: utf8_encode
        var xl;

        var rotateLeft = function (lValue, iShiftBits) {
            return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
        };

        var addUnsigned = function (lX,lY) {
            var lX4,lY4,lX8,lY8,lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        };

        var _F = function (x,y,z) { return (x & y) | ((~x) & z); };
        var _G = function (x,y,z) { return (x & z) | (y & (~z)); };
        var _H = function (x,y,z) { return (x ^ y ^ z); };
        var _I = function (x,y,z) { return (y ^ (x | (~z))); };

        var _FF = function (a,b,c,d,x,s,ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var _GG = function (a,b,c,d,x,s,ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var _HH = function (a,b,c,d,x,s,ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var _II = function (a,b,c,d,x,s,ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        };

        var convertToWordArray = function (str) {
            var lWordCount;
            var lMessageLength = str.length;
            var lNumberOfWords_temp1=lMessageLength + 8;
            var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
            var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
            var lWordArray=new Array(lNumberOfWords-1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while ( lByteCount < lMessageLength ) {
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount)<<lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
            lWordArray[lNumberOfWords-2] = lMessageLength<<3;
            lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
            return lWordArray;
        };

        var wordToHex = function (lValue) {
            var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;
            for (lCount = 0;lCount<=3;lCount++) {
                lByte = (lValue>>>(lCount*8)) & 255;
                wordToHexValue_temp = "0" + lByte.toString(16);
                wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);
            }
            return wordToHexValue;
        };

        var x=[],
            k,AA,BB,CC,DD,a,b,c,d,
            S11=7, S12=12, S13=17, S14=22,
            S21=5, S22=9 , S23=14, S24=20,
            S31=4, S32=11, S33=16, S34=23,
            S41=6, S42=10, S43=15, S44=21;

        str = this.utf8_encode(str);
        x = convertToWordArray(str);
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

        xl = x.length;
        for (k=0;k<xl;k+=16) {
            AA=a; BB=b; CC=c; DD=d;
            a=_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
            d=_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
            c=_FF(c,d,a,b,x[k+2], S13,0x242070DB);
            b=_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
            a=_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
            d=_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
            c=_FF(c,d,a,b,x[k+6], S13,0xA8304613);
            b=_FF(b,c,d,a,x[k+7], S14,0xFD469501);
            a=_FF(a,b,c,d,x[k+8], S11,0x698098D8);
            d=_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
            c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
            b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
            a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);
            d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);
            c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);
            b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);
            a=_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
            d=_GG(d,a,b,c,x[k+6], S22,0xC040B340);
            c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
            b=_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
            a=_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
            d=_GG(d,a,b,c,x[k+10],S22,0x2441453);
            c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
            b=_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
            a=_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
            d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
            c=_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
            b=_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
            a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
            d=_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
            c=_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
            b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
            a=_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
            d=_HH(d,a,b,c,x[k+8], S32,0x8771F681);
            c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
            b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
            a=_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
            d=_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
            c=_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
            b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
            a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
            d=_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
            c=_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
            b=_HH(b,c,d,a,x[k+6], S34,0x4881D05);
            a=_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
            d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
            c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
            b=_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
            a=_II(a,b,c,d,x[k+0], S41,0xF4292244);
            d=_II(d,a,b,c,x[k+7], S42,0x432AFF97);
            c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
            b=_II(b,c,d,a,x[k+5], S44,0xFC93A039);
            a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);
            d=_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
            c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
            b=_II(b,c,d,a,x[k+1], S44,0x85845DD1);
            a=_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
            d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
            c=_II(c,d,a,b,x[k+6], S43,0xA3014314);
            b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
            a=_II(a,b,c,d,x[k+4], S41,0xF7537E82);
            d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
            c=_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
            b=_II(b,c,d,a,x[k+9], S44,0xEB86D391);
            a=addUnsigned(a,AA);
            b=addUnsigned(b,BB);
            c=addUnsigned(c,CC);
            d=addUnsigned(d,DD);
        };

        var temp = wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);

        return temp.toLowerCase();
    }
};
