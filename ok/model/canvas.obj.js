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
ok.canvas = {
    arrow: function (ctx, x1, y1, x2, y2, hlen)
    {
        var a = Math.atan2(y2 - y1, x2 - x1),
            hlen = hlen ? hlen : 10,
            p6 = Math.PI / 6;

        x1 = x1 - 0.5;
        x2 = x2 - 0.5;
        y1 = y1 - 0.5;
        y2 = y2 - 0.5;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2 - hlen * Math.cos(a - p6), y2 - hlen * Math.sin(a - p6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2-hlen * Math.cos(a + p6), y2 - hlen * Math.sin(a + p6));
        ctx.closePath();
        ctx.stroke();
    },

    arrow2: function (ctx, x1, y1, x2, y2, hlen, awidth)
    {
        var a = Math.atan2(y2 - y1, x2 - x1),
            hlen = hlen ? hlen : 10,
            p6 = Math.PI / 6,
            hwidth = awidth / 2,
            x1c = x2 - hlen * Math.cos(a - p6),
            y1c = y2 - hlen * Math.sin(a - p6);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2 - hlen, y2);
        ctx.lineTo(x2 - hlen, y2 - hlen);
        ctx.lineTo(x2, y2 + hwidth);
        ctx.lineTo(x2 - hlen, y2 + awidth + hlen);
        ctx.lineTo(x2 - hlen, y2 + awidth);
        ctx.lineTo(x1, y1 + awidth);

        ctx.closePath();
        ctx.stroke();
    },

    dashedLine: function(ctx, x1, y1, x2, y2, da)
    {
        if (!da) { da = [10,5]; };

        var dx = (x2 - x1), dy = (y2 - y1),
            len = Math.sqrt(dx * dx + dy * dy),
            rot = Math.atan2(dy, dx),
            dc = da.length,
            di = 0, draw = 1;

        ctx.save();
        ctx.translate(x1, y1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.rotate(rot);

        x1 = 0;
        while (len > x1) {
            x1 += da[di++ % dc];
            if (x1 > len) { x1 = len; };
            draw ? ctx.lineTo(x1, 0) : ctx.moveTo(x1, 0);
            draw = !draw;
        };
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },

    roundRect: function (ctx, x, y, width, height, radius, stroke, fill)
    {
        stroke = stroke == null ? 1 : stroke;
        fill = fill == null ? 0 : fill;

        ctx.beginPath();
        this.getRoundRectPath(ctx, x, y, width, height, radius);
        ctx.closePath();

        if (fill) { ctx.fill(); };
        if (stroke) { ctx.stroke(); };
    },

    getRoundRectPath: function (ctx, x, y, width, height, radius, cw)
    {
        if (!cw) {
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
        } else {
            ctx.moveTo(x + radius, y);
            ctx.quadraticCurveTo(x, y, x, y + radius);
            ctx.lineTo(x, y + height - radius);
            ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
            ctx.lineTo(x + width - radius, y + height);
            ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
            ctx.lineTo(x + width, y + radius);
            ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
            ctx.closePath();
        };
    },

    wrapText: function (ctx, text, x, y, lineHeight, maxWidth, maxLines, stroke)
    {
        return this.fillText(ctx, text, x, y, lineHeight, maxWidth, maxLines);
    },

    fillText: function (ctx, text, x, y, lineHeight, maxWidth, maxLines, align)
    {
        var words = text.split(' '),
            line = '', lines = 1, w,
            elen = ctx.measureText("...").width,

        align = align == "null" ? "left" : align;

        for (var n = 0, _line, _m, __m; n < words.length; n++) {
            _line = line + words[n] + ' ';
            _m = ctx.measureText(_line);
            if (_m.width > maxWidth) {

                if (maxLines && lines == maxLines) {
                    do {
                        _line = _line.slice(0, _line.length - 3);
                        _m = ctx.measureText(_line);
                    } while (_m.width > maxWidth - elen);

                    line = _line + "...";
                };

                if (align == "right") {
                    w = ctx.measureText(line).width;
                    ctx.fillText(line, x + maxWidth - w, y);
                } else {
                    ctx.fillText(line, x, y);
                };

                if (maxLines && lines == maxLines) {
                    return lines;
                };

                line = words[n] + ' ';
                y += lineHeight;
                lines++;

            } else {
                line = _line;
            };
        };

        if (align == "right") {
            w = ctx.measureText(line).width;
            ctx.fillText(line, x + maxWidth - w, y);
        } else {
            ctx.fillText(line, x, y);
        };

        return lines;
    },

    getWrapLines: function (ctx, text, maxWidth)
    {
        var words = text.split(' '),
            line = '', lines = 1;

        for (var n = 0, _line, _m; n < words.length; n++) {
            _line = line + words[n] + ' ';
            _m = ctx.measureText(_line);
            if (_m.width > maxWidth) {
                line = words[n] + ' ';
                lines++;
            } else {
                line = _line;
            };
        };
        return lines;
    }

};
