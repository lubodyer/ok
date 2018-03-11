
/**
 * 
 */
_ok.content =
{
    /**
     * 
     */
    __activate: function (e) {
        if (!this.loaded) {
            this.loaded = 1;
            _ok.pause();
            ok.request(_ok.app_id + "/content/page", null, { onprogress: function (e) {
                ok.$("OK_PROGRESS_PAGE").innerHTML = this.progress + "%";
            }, onsuccess: function (e) {
                var _p = ok.$("CONTENT_PAGE_BOX");
                    _d = ok.$("CONTENT_PAGE_WRAPPER"),
                    _s = ok.$("CONTENT_SPINNER");
                        
                _s.parentNode.removeChild(_s);
                    
                _d.style.visibility = "hidden";
                _p.style.display = "";
                ok.layout.resize(_p);
                
                _d.style.visibility = "visible";
                ok.fx.create("CONTENT_PAGE_WRAPPER", function (delta) {
                    var node = ok.$(this._id);
                    
                    node.style.opacity = delta;
                    node.style.top = ok.fx.current(200, 0, delta) + "px";
                    
                }, 0, 1, 240, { onfinish: function (e) {
                    
                }}, "ease-out");
                
                _ok.resume();                
            }});
            return;
        };
    },
    
    /**
     * 
     */
    __beforeresize: function (e) {
        var _h = ok.$("SPLIT_CONTENT_HELP"),
            _o = ok.$("CONTENT_PAGE_OFFSET"),
            h = _h.clientHeight;
            
        _o.style.height = h * .3 + "px";
        
    },
    
    /**
     * 
     */
    __resize: function (e) {        
        
    },
    
    /**
     * 
     */
    __scroll: function (e) {
        var _i = ok.$("CONTENT_BACKGROUND"),
            _b = ok.$("GITHUB_FORK"),
            height = _i.offsetHeight,
            top, scale;
            
        if (e.top > 0) {
            top = - e.top * .5;
            _i.style[ok.css.transform] = "translate(0, " + top + "px)";
            _b.style.top = 0;
        } else if (e.top < 0) {
            scale = (height - e.top) / height;
            top = ((-e.top) / 2) / scale;
            _i.style[ok.css.transform] = "scale(" + scale + "," + scale + ") translate(0, " + top + "px)";
            _b.style.top = e.top + "px";
        } else {
            _i.style[ok.css.transform] = "";
            _b.style.top = 0;
        };
    },
    
    /**
     * 
     */
    __load: function (e) {
        ok.fn.extend(this.help, _ok.core.channel);
    }
};

/**
 * 
 */
_ok.content.help = 
{
    /**
     * 
     */
    split_id: "SPLIT_CONTENT_HELP",
    
    /**
     * 
     */
    toggle_id: "TOGGLE_CONTENT_HELP",
    
    /**
     * 
     */
    expandAt: 720,
    
    /**
     * 
     */
    showAt: 1000,
    
    /**
     * 
     */
    onresize: function (e) {
        var _c = ok.$("SPLIT_CONTENT_HELP"),
            _m = ok.$("CONTENT_BACKGROUND"),
            _g = ok.$("CONTENT_BACKGROUND_GRADIENT"),
            _i = ok.$("CONTENT_BACKGROUND_IMAGE"),

            h = _c.clientHeight, w, r;
            
        _m.style.height = h * .6 + "px";
        _g.style.height = h * .2 + "px";

        // --
        
        _i.style.width = "";
        _i.style.height = "";
        
        w = _i.width;
        h = _i.height;
        r = w/h;
        
        if (w !== _m.clientWidth) {
            w = _m.clientWidth;
            h = w / r;
        };
        
        if (h < _m.clientHeight) {
            h = _m.clientHeight;
            w = h * r;
        };
        
        _i.style.width = w + "px";
        _i.style.height = h + "px";
    },

};

