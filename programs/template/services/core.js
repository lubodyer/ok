/**
 *
 * @class
 */
_ok.core =
{
    /**
     *
     */
    modules: [],

    /**
     *
     */
    activate: function (id) {
        var i, m, o,
            d = ok.get("MODULES_DECK");

        for (i = 0; i < this.modules.length; i++) {
            if (this.modules[i].id === id) {
                m = this.modules[i];
                break;
            };
        };

        if (m) {
            if (!m.loaded) {
                _ok.pause();
                ok.request(_ok.app_id + "/" + id, null, { onprogress: function (e) {
                    ok.$("OK_PROGRESS_MODULE").innerHTML = this.progress + "%";
                }, onsuccess: function (e) {
                    var o = m.o ? ok.fn.resolve(m.o) : null;

                    ok.$("TOGGLE_MENU").style.display = "";
                    _ok.resume();
                    m.loaded = 1;
                    if (o) {
                        ok.route("load", o);
                    };
                    _ok.core.activate(m.id);
                }});
                return;
            };

            // --

            o = m.o ? ok.fn.resolve(m.o) : null;
            if (o) {
                ok.route("beforeactivate", o);
            };
            d.activate(m.node);
            if (o) {
                ok.route("activate", o);
            };
        };
    },

    /**
     *
     */
    point: function (channel, index) {
        var s = ok.get(channel.split_id),
            t = ok.get(channel.toggle_id),
            value = t.getValue(),
            lead = (ok.fn.in_array(s.lead, ['left', 'top']) && index === 1) ||
                (ok.fn.in_array(s.lead, ['right', 'bottom']) && index === 2) ? 1 : 0,
            id = s.id + ":" + index;

        if (lead && !ok.fn.in_array(s.state, ['default', 'expanded'])) {
            t.setValue(1);
            return;
        } else if (!lead && s.state === "expanded") {
            t.setValue(0);
            return;
        };

        if (s.state !== "expanded") {
            ok.fx.create(id, 'opacity', 1, 0, 80, { onfinish: function (e) {
                ok.fx.create(id, 'opacity', 0, 1, 80, { onfinish: function (e) {
                    ok.fx.create(id, 'opacity', 1, 0, 80, { onfinish: function (e) {
                        ok.fx.create(id, 'opacity', 0, 1, 80, { onfinish: function (e) {
                            ok.fx.create(id, 'opacity', 1, 0, 80, { onfinish: function (e) {
                                ok.fx.create(id, 'opacity', 0, 1, 80, { onfinish: function (e) {
                                }}, 'ease-in');
                            }}, 'ease-out');
                        }}, 'ease-in');
                    }}, 'ease-out');
                }}, 'ease-in');
            }}, 'ease-out');
        };
    },

    /**
     *
     */
    __activate: function (e) {
        var i, s = ok.get("SPLIT_MAIN_MENU");

        for (i = 0; i < this.modules.length; i++) {
            ok.get("ok://" + this.modules[i].id).setEnabled(i != e.index - 1);
        };

        if (s.mode === "menu" && s.state === "default") {
            _ok.menu.open = 0;
            s.close();
        };
    },

    /**
     *
     */
    __load: function (e) {
        var _c = ok.$("SPLIT_MESSAGING");

        // --

        ok.fn.extend(_ok.messaging, _ok.core.channel);

        // --

        _c.style.opacity = 0;
        _c.style.display = "";
        ok.layout.resize(_c);
        ok.fx.create("SPLIT_MESSAGING", "opacity", 0, 1, 240, { onfinish: function (e) {
            _ok.core.activate(_ok.core.modules[0].id);
        }});
    },

    /**
     *
     */
    __action: function (e) {
        var m = ok.get("SPLIT_MAIN_MENU");

        if (m.mode === "menu" && m.state === "default") {
            _ok.menu.open = 0;
            m.close();
        };

        // --

        ok.get("ACTION").show();
    },

    /**
     *
     */
    __beforeresize: function (e) {

    },

    /**
     *
     */
    __resize: function () {

    }
};

// --

/**
 * Channel Tempate
 *
 * @class
 */
_ok.core.channel =
{
    /**
     *
     */
    closed: 0,

    /**
     *
     */
    expanded: 0,

    /**
     *
     */
    open: 0,

    /**
     *
     */
    __beforeresize: function (e) {
        var _o = ok.$(e.source.id),
            show = this.showAt ? _o.parentElement.clientWidth >= this.showAt : 0,
            expand = this.expandAt ? _o.parentElement.clientWidth >= this.expandAt : 0;

        e.source.state = (this.closed || !show) && !this.open && !this.expanded ? "closed" : this.expanded || (!show && !expand) ? "expanded" : "default";
        ok.events.bubble(e, this);
    },

    /**
     *
     */
    __resize: function (e) {
        var _o = ok.$(e.source.id),
            match = this.showAt ? _o.parentElement.clientWidth >= this.showAt : 0,
            b = ok.get(this.toggle_id);

        b.setValue(this.open || (match && !this.closed) || this.expanded ? 1 : 0, 1);
        ok.events.bubble(e, this);
    },

    /**
     *
     */
    __toggle: function (e) {
        var state = ok.get(this.toggle_id).getValue(),
            _o = ok.$(this.split_id),
            match = this.showAt ? _o.parentElement.clientWidth >= this.showAt : 0;

        this.open = state ? 1 : 0;
        this.closed = state ? 0 : match ? 1 : 0;
        this.expanded = 0;

        if (!ok.events.bubble(e, this)) {
            ok.layout.resize(_o);
        };
    },

    /**
     *
     */
    __expand: function (e) {
        var o = ok.get(this.split_id),
            _o = ok.$(this.split_id),
            match = this.showAt ? _o.parentElement.clientWidth >= this.showAt : 0;

        if (this.expanded) {
            this.expanded = 0;
        } else if (o.state === "expanded") {
            this.open = 0;
        } else {
            this.expanded = 1;
        };

        if (!ok.events.bubble(e, this)) {
            ok.layout.resize(_o);
        };
    }
};

// --

/**
 * @class
 */
_ok.menu =
{
    /**
     *
     */
    closed: 0,

    /**
     *
     */
    open: 0,

    /**
     *
     */
    thereshold: 1024,

    /**
     *
     */
    __beforecancel: function (e)
    {
        this.open = 0;
    },

    /**
     *
     */
    __beforeresize: function (e) {
        var _o = ok.$(e.source.id),
            match = _o.parentElement.clientWidth >= this.thereshold,
            mode = match ? "default" : "menu";

        e.source.mode = mode;
        e.source.state = this.open ? "default" : match && !this.closed ? "default" : "closed";
    },

    /**
     *
     */
    __resize: function (e) {
        var _o = ok.$(e.source.id),
            match = _o.parentElement.clientWidth >= this.thereshold,
            b = ok.get("TOGGLE_MENU");

        b.setValue(this.open || (match && !this.closed) ? 1 : 0, 1);
    },

    /**
     *
     */
    __toggle: function (e) {
        var state = e.source.getValue(),
            _o = ok.$("SPLIT_MAIN_MENU"),
            match = _o.parentElement.clientWidth >= this.thereshold,
            s = ok.get("SPLIT_MAIN_MENU");

        this.open = state ? 1 : 0;
        this.closed = state ? 0 : match ? 1 : 0;

        if (this.open) {
            s.restore();
        } else {
            s.close();
        };
    }
};

// --

/**
 * @class
 */
_ok.messaging =
{
    /**
     *
     */
    toggle_id: "TOGGLE_MESSAGING",

    /**
     *
     */
    split_id: "SPLIT_MESSAGING",

    /**
     *
     */
    showAt: 1640,

    /**
     *
     */
    expandAt: 720,

    /**
     *
     */
    unread: 6,

    /**
     *
     */
    onbeforeresize: function (e) {
        this.unread = e.source.state === "closed" ? this.unread : 0;
        ok.$("MAIN_MENU_NOTIFICATION_table").style.display = this.unread ? "" : "none";
    },

    /**
     *
     */
    onresize: function (e) {
        var _u = ok.$("MESSAGING_UNREAD");

        _u.style.opacity = this.unread ? 1 : 0.4;
        _u.innerHTML = "" + this.unread;
    },

    /**
     *
     */
    ontoggle: function (e) {
        var m = ok.get("SPLIT_MAIN_MENU");

        if (m.mode === "menu" && m.state === "default") {
            _ok.menu.open = 0;
            //m.close();
        };
    }
};
