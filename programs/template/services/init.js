/**
 *
 */
var _ok =
{
    /**
     * Populated by the PHP Service
     */
    app_id: "",

    /**
     *
     */
    pause: function () {
        ok.pause();
        ok.set_cursor("wait");
    },

    /**
     *
     */
    resume: function () {
        ok.set_cursor("");
        ok.resume();
    },

    /**
     *
     */
    __load: function () {
        _ok.pause();
        ok.request(this.app_id + "/core", null, { onprogress: function (e) {
            ok.$("OK_PROGRESS_INITIAL").innerHTML = this.progress + "%";
        }, onsuccess: function (e) {
            _ok.resume();
            ok.route('load', _ok.core);
        }});
    }
};

/**
 *
 */
ok.onload = function (e) {
    ok.route(e, _ok);
    return 1;
};
