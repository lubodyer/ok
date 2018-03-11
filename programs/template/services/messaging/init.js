/**
 * Matching Palette

#5EBB55
 
text #3F4A3C
 
#A2AF9F
 
#00B2FF
 
#007EDF

 * 
 * @class
 */
var _ok = 
{
    /**
     * 
     */
    modules: [{
        id: "ABOUT",
        cid: "ABOUT_BOX",               // Content ID
        bid: "MAIN_MENU_ABOUT",         // Main Menu ID
    }, {
        id: "MODULE",
        cid: "MODULE_BOX",
        bid: "MAIN_MENU_MODULE"
    }],
    
    /**
     * 
     */
    activate: function (id)
    {
        var i, index = -1, 
            m = ok.get("MODULES");
        
        for (i = 0; i < this.modules.length; i++) {
            if (this.modules[i].cid === id) {
                index = 0;
                break;
            };
        };
        
        if (index > -1) {
            m.activate(index);
        };
    },
    
    /**
     * 
     */
    point: function (id)
    {
        ok.fx.create(id, 'opacity', 1, 0, 120, { onfinish: function (e) {
            ok.fx.create(id, 'opacity', 0, 1, 120, { onfinish: function (e) {
                ok.fx.create(id, 'opacity', 1, 0, 120, { onfinish: function (e) {
                    ok.fx.create(id, 'opacity', 0, 1, 120, { onfinish: function (e) {
                        ok.fx.create(id, 'opacity', 1, 0, 120, { onfinish: function (e) {
                            ok.fx.create(id, 'opacity', 0, 1, 120, { onfinish: function (e) {
                            }}, 'ease-in');
                        }}, 'ease-out');
                    }}, 'ease-in');
                }}, 'ease-out');
            }}, 'ease-in');
        }}, 'ease-out');
    },
    
    /**
     * 
     */
    __activate: function (e) {
        var i, s = ok.get("SPLIT_MAIN_MENU");
        
        for (i = 0; i < this.modules.length; i++) {
            ok.get(this.modules[i].bid).setEnabled(i != e.index);
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
        var _c = ok.$("MAIN");
        
        _c.style.opacity = 0;
        _c.style.display = "";
        ok.layout.resize(_c);
        ok.fx.create("MAIN", "opacity", 0, 1, 240);
    },
    
    /**
     * 
     */
    __action: function (e) {
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
    thereshold: 1600,
    
    /**
     * 
     */
    unread: 6,
    
    /**
     * 
     */
    __beforeresize: function (e) {
        var _o = ok.$(e.source.id),
            match = _o.parentElement.clientWidth >= this.thereshold;
        
        e.source.state = this.open || (match && !this.closed) ? (match && !this.expanded) ? "default" : "expanded" : "closed";
        this.unread = e.source.state === "closed" ? this.unread : 0;
    },
    
    /**
     * 
     */
    __resize: function (e) {
        var _o = ok.$(e.source.id),
            match = _o.parentElement.clientWidth >= this.thereshold,
            b = ok.get("TOGGLE_MESSAGING"),
            _u = ok.$("MESSAGING_UNREAD");
        
        b.setValue(this.open || (match && !this.closed) ? 1 : 0, 1);
        
        _u.style.opacity = this.unread ? 1 : 0.4;
        _u.innerHTML = "" + this.unread;
    },
    
    /**
     * 
     */
    __toggle: function (e) {
        var state = e.source.getValue(),
            _o = ok.$("SPLIT_MESSAGING"),
            match = _o.parentElement.clientWidth >= this.thereshold;
            
        this.open = state ? 1 : 0;
        this.closed = state ? 0 : match ? 1 : 0;
        this.expanded = 0;
        
        ok.layout.resize("SPLIT_MESSAGING");
        return;
    },
    
    /**
     * 
     */
    __expand: function (e) {
        var o = ok.get("SPLIT_MESSAGING"),
            _o = ok.$("SPLIT_MESSAGING"),
            match = _o.parentElement.clientWidth >= this.thereshold;
            
        if (this.expanded) {
            this.expanded = 0;
        } else if (o.state === "expanded") {
            this.open = 0;
        } else {
            this.expanded = 1;
        };
        
        ok.layout.resize(_o);
    }
};

// --

/**
 * 
 */
_ok.about =
{
    /**
     * 
     */
    open: 0,
    
    /**
     * 
     */
    thereshold: 720,

    /**
     * 
     */
    __beforeresize: function (e) {
        var _c = ok.$("SPLIT_ABOUT_HELP"),
            _m = ok.$("PAGE_MEDIA"),
            _g = ok.$("PAGE_MEDIA_GRADIENT"),
            _w = ok.$("PAGE_WRAPPER"),
            h = _c.clientHeight;
            
        _m.style.height = h * .6 + "px";
        _g.style.height = h * .2 + "px";
        _w.style.marginTop = - h * .2 + "px";
    },
    
    /**
     * 
     */
    __resize: function (e) {
        var _i = ok.$("IMAGE_ABOUT"),
            _p = _i.parentNode,
            w, h, r;
        
        _i.style.width = "";
        _i.style.height = "";
        
        w = _i.width;
        h = _i.height;
        r = w/h;
        
        if (w !== _p.clientWidth) {
            w = _p.clientWidth;
            h = w / r;
        };
        
        if (h < _p.clientHeight) {
            h = _p.clientHeight;
            w = h * r;
        };
        
        _i.style.width = w + "px";
        _i.style.height = h + "px";
    },
    
    /**
     * 
     */
    __scroll: function (e) {
        var _i = ok.$("IMAGE_ABOUT");
        
        _i.style.top = e.top > 0 ? e.top * .8 + "px" : "0";
    }
};

/**
 * 
 */
_ok.about.help = 
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
    thereshold: 1000,

    /**
     * 
     */
    __beforeresize: function (e) {
        var _o = ok.$(e.source.id),
            match = _o.parentElement.clientWidth >= this.thereshold;
        
        e.source.state = this.open || (match && !this.closed) ? match ? "default" : "expanded" : "closed";
    },
    
    /**
     * 
     */
    __resize: function (e) {
        var _o = ok.$(e.source.id),
            match = _o.parentElement.clientWidth >= this.thereshold,
            b = ok.get("TOGGLE_ABOUT_HELP");
        
        b.setValue(this.open || (match && !this.closed) ? 1 : 0, 1);
    },
    
    /**
     * 
     */
    __toggle: function (e) {
        var state = e.source.getValue(),
            _o = ok.$("SPLIT_ABOUT_HELP"),
            match = _o.parentElement.clientWidth >= this.thereshold;
            
        this.open = state ? 1 : 0;
        this.closed = state ? 0 : match ? 1 : 0;
        
        ok.layout.resize("SPLIT_ABOUT_HELP");
        return;
    }
};

// --

/**
 * 
 */
_ok.module =
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
    thereshold: 720,
    
    /**
     * 
     */
    __beforeselect: function (e)
    {
        if (e.target.id === "MODULE_ACTION_1") {        
            ok.route('action', _ok);
            return 1;
        };
    },

    /**
     * 
     */
    __select: function (e)
    {
        var id = e.source.id,
            txt = ok.$(id + "_TITLE").innerHTML;
        
        ok.get("MODULE_INPUT_TEXT").value = txt;
        ok.$("MODULE_TAB:cell").innerHTML = txt;
        ok.get("MODULE_CHECKBOX").setValue(ok.$(id + "_CHECKED").style.display === "none" ? 0 : 1, 1);
        ok.$("MODULE_INPUT_SELECT").selectedIndex = ok.$(id + "_SELECTED").style.display === "none" ? 0 : 1;
        
        ok.get("MODULE_DECK").activate(1);
    },

    /**
     * 
     */
    __beforeresize: function (e) {
        var _o = ok.$(e.source.id),
            match = _o.parentElement.clientWidth >= this.thereshold;
        
        e.source.state = this.open || (match && !this.closed) ? match ? "default" : "expanded" : "closed";
    },
    
    /**
     * 
     */
    __resize: function (e) {
        var _o = ok.$(e.source.id),
            match = _o.parentElement.clientWidth >= this.thereshold,
            b = ok.get("TOGGLE_MODULE_EDIT"),
            t = ok.get("MODULE_NAVIGATION");
        
        b.setValue(this.open || (match && !this.closed) ? 1 : 0, 1);
        
        if (!t.selected && ok.fn.in_array(e.source.state, ["default", "expanded"])) {
            t.nodes[0].select();
        };
    },
    
    /**
     * 
     */
    __toggle: function (e) {
        var state = e.source.getValue(),
            _o = ok.$("SPLIT_MODULE_CONTENT"),
            match = _o.parentElement.clientWidth >= this.thereshold;

        this.open = state ? 1 : 0;
        this.closed = state ? 0 : match ? 1 : 0;
        
        ok.layout.resize("SPLIT_MODULE_CONTENT");
    } 
};

/**
 * 
 */
_ok.module.input = 
{
    /**
     * 
     */
    __change: function (e)
    {
        var t = ok.get("MODULE_NAVIGATION"),
            id = t.selected.id, txt;
    
        if (e.source instanceof OK_Object_Input) {
            txt = e.source.value ? e.source.value : "Untitled Item";
            ok.$(id + "_TITLE").innerHTML = txt;
            ok.$("MODULE_TAB:cell").innerHTML = txt;
        } else {
            ok.$(id + "_SELECTED").style.display = ok.$(e.source.id).selectedIndex ? "" : "none";
        };
    },
    
    /**
     * 
     */
    __toggle: function (e)
    {
        t = ok.get("MODULE_NAVIGATION"),
            id = t.selected.id;
        
        ok.$(id + "_CHECKED").style.display = e.source.getValue() ? "" : "none";
    }
}

/**
 * 
 */
_ok.module.help = 
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
    thereshold: 1040,

    /**
     * 
     */
    __beforeresize: function (e) {
        var _o = ok.$(e.source.id),
            match = _o.parentElement.clientWidth >= this.thereshold;
        
        e.source.state = this.open || (match && !this.closed) ? "default" : "closed";
    },
    
    /**
     * 
     */
    __resize: function (e) {
        var _o = ok.$(e.source.id),
            match = _o.parentElement.clientWidth >= this.thereshold,
            b = ok.get("TOGGLE_MODULE_HELP");
        
        b.setValue(this.open || (match && !this.closed) ? 1 : 0, 1);
    },
    
    /**
     * 
     */
    __toggle: function (e) {
        var state = e.source.getValue(),
            _o = ok.$("SPLIT_MODULE_HELP"),
            match = _o.parentElement.clientWidth >= this.thereshold;
            
        this.open = state ? 1 : 0;
        this.closed = state ? 0 : match ? 1 : 0;
        
        ok.layout.resize("SPLIT_MODULE_HELP");
        return;
    }
};

// --

ok.onload = function (e) {
    ok.route(e, _ok);
    return 1;
};
