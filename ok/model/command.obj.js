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
function OK_Command (command)
{
    this.command = command;
    this.params = new OK_Collection();
    this._b64chars = [
        'A','B','C','D','E','F','G','H',
        'I','J','K','L','M','N','O','P',
        'Q','R','S','T','U','V','W','X',
        'Y','Z','a','b','c','d','e','f',
        'g','h','i','j','k','l','m','n',
        'o','p','q','r','s','t','u','v',
        'w','x','y','z','0','1','2','3',
        '4','5','6','7','8','9','-',';'
    ];
};

OK_Command.prototype.add = function (name, value) {
    return this.params.add(name, value);
};

OK_Command.prototype.get = function (name) {
    return this.params.get(name);
};

OK_Command.prototype.set = function (name, value) {
    return this.params.set(name, value);
};

OK_Command.prototype.encode = function ()
{
    this._b64str = this._serialize();
    this._b64len = 0;
    return this._b64encode();
};

OK_Command.prototype._serialize = function ()
{
    var s = JSON.stringify({
        command: this.command,
        params: this.params.items,
        sid: ok.sid,
        wid: ok.wid}, function (k, v) {
            if (typeof v == "string") {
                return ok.fn.utf8_encode(v);
            };
            return v;
        });

    return s;
};

OK_Command.prototype._b64read = function ()
{
    if (!this._b64str)
        return -1;
    if (this._b64len >= this._b64str.length)
        return -1;
    var c = this._b64str.charCodeAt(this._b64len) & 0xff;
    this._b64len++;
    return c;
};

OK_Command.prototype._b64encode = function ()
{
    var r = '';
    var b = new Array(3);
    var done = false;
    while (!done && (b[0] = this._b64read()) != -1){
        b[1] = this._b64read();
        b[2] = this._b64read();
        r += (this._b64chars[ b[0] >> 2 ]);
        if (b[1] != -1){
            r += (this._b64chars [(( b[0] << 4 ) & 0x30) | (b[1] >> 4) ]);
            if (b[2] != -1){
                r += (this._b64chars [((b[1] << 2) & 0x3c) | (b[2] >> 6) ]);
                r += (this._b64chars [b[2] & 0x3F]);
            } else {
                r += (this._b64chars [((b[1] << 2) & 0x3c)]);
                r += ('=');
                done = true;
            }
        } else {
            r += (this._b64chars [(( b[0] << 4 ) & 0x30)]);
            r += ('=');
            r += ('=');
            done = true;
        }
    }
    return r;
};
