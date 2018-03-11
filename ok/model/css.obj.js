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
ok.css =
{
    getVendorStyle: function (property)
    {
        var prop = property.split("-"), i;

        for (i = 0; i < prop.length; i++) {
            prop[i] = ok.fn.ucfirst(prop[i]);
        };

        prop = prop.join("");

        if (document.body.style[ok.fn.lcfirst(prop)] != undefined) {
            return property;
        } else if (ok.client.webkit && document.body.style["webkit" + prop] != undefined) {
            return "-webkit-" + property;
        } else if (ok.client.moz && document.body.style["Moz" + prop] != undefined) {
            return "-moz-" + property;
        } else if (ok.client.opera && document.body.style["O" + prop] != undefined) {
            return "-o-" + property;
        } else if (ok.client.ie && document.body.style["ms" + prop] != undefined) {
            return "-ms-" + property;
        };

        return null;
    },

    getVendorStyleJS: function (property)
    {
        var prop = property.split("-"), i;

        for (i = 0; i < prop.length; i++) {
            prop[i] = ok.fn.ucfirst(prop[i]);
        };

        prop = prop.join("");

        if (document.body.style[ok.fn.lcfirst(prop)] != undefined) {
            return ok.fn.lcfirst(prop);
        } else if (ok.client.webkit && document.body.style["webkit" + prop] != undefined) {
            return "webkit" + prop;
        } else if (ok.client.moz && document.body.style["Moz" + prop] != undefined) {
            return "Moz" + prop;
        } else if (ok.client.opera && document.body.style["O" + prop] != undefined) {
            return "O" + prop;
        } else if (ok.client.ie && document.body.style["ms" + prop] != undefined) {
            return "ms" + prop;
        };

        return null;
    }
};
