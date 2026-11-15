/* Amavi: language routing (real /ro/ URLs), mobile menu, header shadow. */
(function () {
    'use strict';
    var KEY = 'amavi-lang';
    function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
    function altUrl(lang) {
        var l = document.querySelector('link[rel="alternate"][hreflang="' + lang + '"]');
        return l ? new URL(l.getAttribute('href'), location.href).pathname + location.hash : null;
    }
    function route() {
        var fixed = document.documentElement.dataset.langFixed;
        if (!fixed) return;
        var q = new URLSearchParams(location.search).get('lang');
        var want = (q === 'ro' || q === 'en') ? q : read();
        if (want && want !== fixed) {
            var url = altUrl(want);
            if (url) { location.replace(url); return; }
        }
        var toggle = document.getElementById('lang-toggle');
        if (toggle) {
            toggle.textContent = fixed === 'en' ? 'RO' : 'EN';
            toggle.addEventListener('click', function () {
                var other = fixed === 'en' ? 'ro' : 'en';
                write(other);
                var url = altUrl(other);
                if (url) location.href = url;
            });
        }
    }
    function menu() {
        var btn = document.querySelector('.mobile-menu-btn'), links = document.querySelector('.nav-links');
        if (!btn || !links) return;
        function set(open) { links.classList.toggle('active', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
        btn.addEventListener('click', function () { set(!links.classList.contains('active')); });
        document.addEventListener('click', function (e) { if (!btn.contains(e.target) && !links.contains(e.target)) set(false); });
        links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    }
    function scroll() {
        var h = document.querySelector('header');
        if (!h) return;
        function f() { h.classList.toggle('is-scrolled', window.scrollY > 8); }
        window.addEventListener('scroll', f, { passive: true }); f();
    }
    route(); menu(); scroll();
})();

/* overscroll:start  status bar color + rubber-band stretch (same as vistoapps.com) */
(function () {
    var meta = document.querySelector('meta[name="theme-color"]');
    var root = document.documentElement;
    var top = meta ? meta.getAttribute("content") : "";
    var scrolled = meta ? meta.getAttribute("data-scrolled") || top : "";
    var last = top, pending = false, stretched = false;
    var apply = function () {
        pending = false;
        var y = window.scrollY;
        var theme = y > 8 ? scrolled : top;
        if (meta && theme !== last) { meta.setAttribute("content", theme); last = theme; }
        if (y < 0) { root.style.setProperty("--osy", String(-y)); stretched = true; }
        else if (stretched) { root.style.removeProperty("--osy"); stretched = false; }
    };
    window.addEventListener("scroll", function () {
        if (!pending) { pending = true; window.requestAnimationFrame(apply); }
    }, { passive: true });
    apply();
})();
/* overscroll:end */
