/**
 * 
 */
_ok.module =
{
    /**
     * 
     */
    split_id: "SPLIT_MODULE_CONTENT",
    
    /**
     * 
     */
    toggle_id: "TOGGLE_MODULE_EDIT",
    
    /**
     * 
     */
    expandAt: 720,
    
    /**
     * 
     */
    showAt: 720,

    /**
     * 
     */
    onload: function (e)
    {
        ok.fn.extend(this, _ok.core.channel);
        ok.fn.extend(this.help, _ok.core.channel);
    },
    
    /**
     * 
     */
    onbeforeselect: function (e)
    {
        if (e.target.id === "MODULE_ACTION_1") {        
            ok.route('action', _ok.core);
            return 1;
        };
    },

    /**
     * 
     */
    onselect: function (e)
    {
        var id = e.source.id,
            txt = ok.$(id + "_TITLE").innerHTML;
        
        ok.get("MODULE_INPUT_TEXT").value = txt;
        ok.$("MODULE_TAB:cell").innerHTML = txt;
        ok.get("MODULE_CHECKBOX").setValue(ok.$(id + "_CHECKED").style.display === "none" ? 0 : 1, 1);
        ok.$("MODULE_INPUT_SELECT").selectedIndex = ok.$(id + "_SELECTED").style.display === "none" ? 0 : 1;
        
        ok.get("MODULE_DECK").activate(1);
        ok.get(this.toggle_id).setValue(1);
    },

    /**
     * 
     */
    onresize: function (e) {
        var t = ok.get("MODULE_NAVIGATION");
        
        if (!t.selected && ok.fn.in_array(e.source.state, ["default", "expanded"])) {
            t.nodes[0].select();
        } else if (t.selected && e.source.state === "closed") {
            t.selected.unselect();
        };
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
    split_id: "SPLIT_MODULE_HELP",
    
    /**
     * 
     */
    toggle_id: "TOGGLE_MODULE_HELP",
    
    /**
     * 
     */
    showAt: 1040,

    /**
     * 
     */
    expandAt: 720,
    
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
