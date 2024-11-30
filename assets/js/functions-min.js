! function (t, e, i, n) {
    "use strict";

    function s(t, e, i) {
        return setTimeout(c(t, i), e)
    }

    function r(t, e, i) {
        return Array.isArray(t) ? (o(t, i[e], i), !0) : !1
    }

    function o(t, e, i) {
        var s;
        if (t)
            if (t.forEach) t.forEach(e, i);
            else if (t.length !== n)
            for (s = 0; s < t.length;) e.call(i, t[s], s, t), s++;
        else
            for (s in t) t.hasOwnProperty(s) && e.call(i, t[s], s, t)
    }

    function a(e, i, n) {
        var s = "DEPRECATED METHOD: " + i + "\n" + n + " AT \n";
        return function () {
            var i = new Error("get-stack-trace"),
                n = i && i.stack ? i.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
                r = t.console && (t.console.warn || t.console.log);
            return r && r.call(t.console, s, n), e.apply(this, arguments)
        }
    }

    function l(t, e, i) {
        var n = e.prototype,
            s;
        s = t.prototype = Object.create(n), s.constructor = t, s._super = n, i && Tt(s, i)
    }

    function c(t, e) {
        return function i() {
            return t.apply(e, arguments)
        }
    }

    function h(t, e) {
        return typeof t == ft ? t.apply(e ? e[0] || n : n, e) : t
    }

    function u(t, e) {
        return t === n ? e : t
    }

    function d(t, e, i) {
        o(m(e), function (e) {
            t.addEventListener(e, i, !1)
        })
    }

    function p(t, e, i) {
        o(m(e), function (e) {
            t.removeEventListener(e, i, !1)
        })
    }

    function f(t, e) {
        for (; t;) {
            if (t == e) return !0;
            t = t.parentNode
        }
        return !1
    }

    function v(t, e) {
        return t.indexOf(e) > -1
    }

    function m(t) {
        return t.trim().split(/\s+/g)
    }

    function g(t, e, i) {
        if (t.indexOf && !i) return t.indexOf(e);
        for (var n = 0; n < t.length;) {
            if (i && t[n][i] == e || !i && t[n] === e) return n;
            n++
        }
        return -1
    }

    function T(t) {
        return Array.prototype.slice.call(t, 0)
    }

    function y(t, e, i) {
        for (var n = [], s = [], r = 0; r < t.length;) {
            var o = e ? t[r][e] : t[r];
            g(s, o) < 0 && n.push(t[r]), s[r] = o, r++
        }
        return i && (n = e ? n.sort(function a(t, i) {
            return t[e] > i[e]
        }) : n.sort()), n
    }

    function C(t, e) {
        for (var i, s, r = e[0].toUpperCase() + e.slice(1), o = 0; o < dt.length;) {
            if (i = dt[o], s = i ? i + r : e, s in t) return s;
            o++
        }
        return n
    }

    function E() {
        return Et++
    }

    function x(e) {
        var i = e.ownerDocument || e;
        return i.defaultView || i.parentWindow || t
    }

    function I(t, e) {
        var i = this;
        this.manager = t, this.callback = e, this.element = t.element, this.target = t.options.inputTarget, this.domHandler = function (e) {
            h(t.options.enable, [t]) && i.handler(e)
        }, this.init()
    }

    function w(t) {
        var e, i = t.options.inputClass;
        return new(e = i ? i : It ? k : wt ? W : $t ? L : Y)(t, A)
    }

    function A(t, e, i) {
        var n = i.pointers.length,
            s = i.changedPointers.length,
            r = e & Pt && n - s === 0,
            o = e & (Rt | Mt) && n - s === 0;
        i.isFirst = !!r, i.isFinal = !!o, r && (t.session = {}), i.eventType = e, D(t, i), t.emit("hammer.input", i), t.recognize(i), t.session.prevInput = i
    }

    function D(t, e) {
        var i = t.session,
            n = e.pointers,
            s = n.length;
        i.firstInput || (i.firstInput = b(e)), s > 1 && !i.firstMultiple ? i.firstMultiple = b(e) : 1 === s && (i.firstMultiple = !1);
        var r = i.firstInput,
            o = i.firstMultiple,
            a = o ? o.center : r.center,
            l = e.center = P(n);
        e.timeStamp = gt(), e.deltaTime = e.timeStamp - r.timeStamp, e.angle = z(a, l), e.distance = M(a, l), _(i, e), e.offsetDirection = R(e.deltaX, e.deltaY);
        var c = O(e.deltaTime, e.deltaX, e.deltaY);
        e.overallVelocityX = c.x, e.overallVelocityY = c.y, e.overallVelocity = mt(c.x) > mt(c.y) ? c.x : c.y, e.scale = o ? X(o.pointers, n) : 1, e.rotation = o ? N(o.pointers, n) : 0, e.maxPointers = i.prevInput ? e.pointers.length > i.prevInput.maxPointers ? e.pointers.length : i.prevInput.maxPointers : e.pointers.length, S(i, e);
        var h = t.element;
        f(e.srcEvent.target, h) && (h = e.srcEvent.target), e.target = h
    }

    function _(t, e) {
        var i = e.center,
            n = t.offsetDelta || {},
            s = t.prevDelta || {},
            r = t.prevInput || {};
        e.eventType !== Pt && r.eventType !== Rt || (s = t.prevDelta = {
            x: r.deltaX || 0,
            y: r.deltaY || 0
        }, n = t.offsetDelta = {
            x: i.x,
            y: i.y
        }), e.deltaX = s.x + (i.x - n.x), e.deltaY = s.y + (i.y - n.y)
    }

    function S(t, e) {
        var i = t.lastInterval || e,
            s = e.timeStamp - i.timeStamp,
            r, o, a, l;
        if (e.eventType != Mt && (s > bt || i.velocity === n)) {
            var c = e.deltaX - i.deltaX,
                h = e.deltaY - i.deltaY,
                u = O(s, c, h);
            o = u.x, a = u.y, r = mt(u.x) > mt(u.y) ? u.x : u.y, l = R(c, h), t.lastInterval = e
        } else r = i.velocity, o = i.velocityX, a = i.velocityY, l = i.direction;
        e.velocity = r, e.velocityX = o, e.velocityY = a, e.direction = l
    }

    function b(t) {
        for (var e = [], i = 0; i < t.pointers.length;) e[i] = {
            clientX: vt(t.pointers[i].clientX),
            clientY: vt(t.pointers[i].clientY)
        }, i++;
        return {
            timeStamp: gt(),
            pointers: e,
            center: P(e),
            deltaX: t.deltaX,
            deltaY: t.deltaY
        }
    }

    function P(t) {
        var e = t.length;
        if (1 === e) return {
            x: vt(t[0].clientX),
            y: vt(t[0].clientY)
        };
        for (var i = 0, n = 0, s = 0; e > s;) i += t[s].clientX, n += t[s].clientY, s++;
        return {
            x: vt(i / e),
            y: vt(n / e)
        }
    }

    function O(t, e, i) {
        return {
            x: e / t || 0,
            y: i / t || 0
        }
    }

    function R(t, e) {
        return t === e ? zt : mt(t) >= mt(e) ? 0 > t ? Nt : Xt : 0 > e ? Yt : kt
    }

    function M(t, e, i) {
        i || (i = Ht);
        var n = e[i[0]] - t[i[0]],
            s = e[i[1]] - t[i[1]];
        return Math.sqrt(n * n + s * s)
    }

    function z(t, e, i) {
        i || (i = Ht);
        var n = e[i[0]] - t[i[0]],
            s = e[i[1]] - t[i[1]];
        return 180 * Math.atan2(s, n) / Math.PI
    }

    function N(t, e) {
        return z(e[1], e[0], Lt) + z(t[1], t[0], Lt)
    }

    function X(t, e) {
        return M(e[0], e[1], Lt) / M(t[0], t[1], Lt)
    }

    function Y() {
        this.evEl = Ut, this.evWin = jt, this.pressed = !1, I.apply(this, arguments)
    }

    function k() {
        this.evEl = Zt, this.evWin = Jt, I.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
    }

    function q() {
        this.evTarget = Qt, this.evWin = te, this.started = !1, I.apply(this, arguments)
    }

    function F(t, e) {
        var i = T(t.touches),
            n = T(t.changedTouches);
        return e & (Rt | Mt) && (i = y(i.concat(n), "identifier", !0)), [i, n]
    }

    function W() {
        this.evTarget = ie, this.targetIds = {}, I.apply(this, arguments)
    }

    function H(t, e) {
        var i = T(t.touches),
            n = this.targetIds;
        if (e & (Pt | Ot) && 1 === i.length) return n[i[0].identifier] = !0, [i, i];
        var s, r, o = T(t.changedTouches),
            a = [],
            l = this.target;
        if (r = i.filter(function (t) {
                return f(t.target, l)
            }), e === Pt)
            for (s = 0; s < r.length;) n[r[s].identifier] = !0, s++;
        for (s = 0; s < o.length;) n[o[s].identifier] && a.push(o[s]), e & (Rt | Mt) && delete n[o[s].identifier], s++;
        return a.length ? [y(r.concat(a), "identifier", !0), a] : void 0
    }

    function L() {
        I.apply(this, arguments);
        var t = c(this.handler, this);
        this.touch = new W(this.manager, t), this.mouse = new Y(this.manager, t), this.primaryTouch = null, this.lastTouches = []
    }

    function V(t, e) {
        t & Pt ? (this.primaryTouch = e.changedPointers[0].identifier, U.call(this, e)) : t & (Rt | Mt) && U.call(this, e)
    }

    function U(t) {
        var e = t.changedPointers[0];
        if (e.identifier === this.primaryTouch) {
            var i = {
                x: e.clientX,
                y: e.clientY
            };
            this.lastTouches.push(i);
            var n = this.lastTouches,
                s = function () {
                    var t = n.indexOf(i);
                    t > -1 && n.splice(t, 1)
                };
            setTimeout(s, ne)
        }
    }

    function j(t) {
        for (var e = t.srcEvent.clientX, i = t.srcEvent.clientY, n = 0; n < this.lastTouches.length; n++) {
            var s = this.lastTouches[n],
                r = Math.abs(e - s.x),
                o = Math.abs(i - s.y);
            if (se >= r && se >= o) return !0
        }
        return !1
    }

    function G(t, e) {
        this.manager = t, this.set(e)
    }

    function B(t) {
        if (v(t, he)) return he;
        var e = v(t, ue),
            i = v(t, de);
        return e && i ? he : e || i ? e ? ue : de : v(t, ce) ? ce : le
    }

    function Z() {
        if (!oe) return !1;
        var e = {},
            i = t.CSS && t.CSS.supports;
        return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function (n) {
            e[n] = i ? t.CSS.supports("touch-action", n) : !0
        }), e
    }

    function J(t) {
        this.options = Tt({}, this.defaults, t || {}), this.id = E(), this.manager = null, this.options.enable = u(this.options.enable, !0), this.state = fe, this.simultaneous = {}, this.requireFail = []
    }

    function K(t) {
        return t & ye ? "cancel" : t & ge ? "end" : t & me ? "move" : t & ve ? "start" : ""
    }

    function Q(t) {
        return t == kt ? "down" : t == Yt ? "up" : t == Nt ? "left" : t == Xt ? "right" : ""
    }

    function tt(t, e) {
        var i = e.manager;
        return i ? i.get(t) : t
    }

    function et() {
        J.apply(this, arguments)
    }

    function it() {
        et.apply(this, arguments), this.pX = null, this.pY = null
    }

    function nt() {
        et.apply(this, arguments)
    }

    function st() {
        J.apply(this, arguments), this._timer = null, this._input = null
    }

    function rt() {
        et.apply(this, arguments)
    }

    function ot() {
        et.apply(this, arguments)
    }

    function at() {
        J.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
    }

    function lt(t, e) {
        return e = e || {}, e.recognizers = u(e.recognizers, lt.defaults.preset), new ct(t, e)
    }

    function ct(t, e) {
        this.options = Tt({}, lt.defaults, e || {}), this.options.inputTarget = this.options.inputTarget || t, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = t, this.input = w(this), this.touchAction = new G(this, this.options.touchAction), ht(this, !0), o(this.options.recognizers, function (t) {
            var e = this.add(new t[0](t[1]));
            t[2] && e.recognizeWith(t[2]), t[3] && e.requireFailure(t[3])
        }, this)
    }

    function ht(t, e) {
        var i = t.element;
        if (i.style) {
            var n;
            o(t.options.cssProps, function (s, r) {
                n = C(i.style, r), e ? (t.oldCssProps[n] = i.style[n], i.style[n] = s) : i.style[n] = t.oldCssProps[n] || ""
            }), e || (t.oldCssProps = {})
        }
    }

    function ut(t, i) {
        var n = e.createEvent("Event");
        n.initEvent(t, !0, !0), n.gesture = i, i.target.dispatchEvent(n)
    }
    var dt = ["", "webkit", "Moz", "MS", "ms", "o"],
        pt = e.createElement("div"),
        ft = "function",
        vt = Math.round,
        mt = Math.abs,
        gt = Date.now,
        Tt;
    Tt = "function" != typeof Object.assign ? function Ie(t) {
        if (t === n || null === t) throw new TypeError("Cannot convert undefined or null to object");
        for (var e = Object(t), i = 1; i < arguments.length; i++) {
            var s = arguments[i];
            if (s !== n && null !== s)
                for (var r in s) s.hasOwnProperty(r) && (e[r] = s[r])
        }
        return e
    } : Object.assign;
    var yt = a(function we(t, e, i) {
            for (var s = Object.keys(e), r = 0; r < s.length;)(!i || i && t[s[r]] === n) && (t[s[r]] = e[s[r]]), r++;
            return t
        }, "extend", "Use `assign`."),
        Ct = a(function Ae(t, e) {
            return yt(t, e, !0)
        }, "merge", "Use `assign`."),
        Et = 1,
        xt = /mobile|tablet|ip(ad|hone|od)|android/i,
        $t = "ontouchstart" in t,
        It = C(t, "PointerEvent") !== n,
        wt = $t && xt.test(navigator.userAgent),
        At = "touch",
        Dt = "pen",
        _t = "mouse",
        St = "kinect",
        bt = 25,
        Pt = 1,
        Ot = 2,
        Rt = 4,
        Mt = 8,
        zt = 1,
        Nt = 2,
        Xt = 4,
        Yt = 8,
        kt = 16,
        qt = Nt | Xt,
        Ft = Yt | kt,
        Wt = qt | Ft,
        Ht = ["x", "y"],
        Lt = ["clientX", "clientY"];
    I.prototype = {
        handler: function () {},
        init: function () {
            this.evEl && d(this.element, this.evEl, this.domHandler), this.evTarget && d(this.target, this.evTarget, this.domHandler), this.evWin && d(x(this.element), this.evWin, this.domHandler)
        },
        destroy: function () {
            this.evEl && p(this.element, this.evEl, this.domHandler), this.evTarget && p(this.target, this.evTarget, this.domHandler), this.evWin && p(x(this.element), this.evWin, this.domHandler)
        }
    };
    var Vt = {
            mousedown: Pt,
            mousemove: Ot,
            mouseup: Rt
        },
        Ut = "mousedown",
        jt = "mousemove mouseup";
    l(Y, I, {
        handler: function De(t) {
            var e = Vt[t.type];
            e & Pt && 0 === t.button && (this.pressed = !0), e & Ot && 1 !== t.which && (e = Rt), this.pressed && (e & Rt && (this.pressed = !1), this.callback(this.manager, e, {
                pointers: [t],
                changedPointers: [t],
                pointerType: _t,
                srcEvent: t
            }))
        }
    });
    var Gt = {
            pointerdown: Pt,
            pointermove: Ot,
            pointerup: Rt,
            pointercancel: Mt,
            pointerout: Mt
        },
        Bt = {
            2: At,
            3: Dt,
            4: _t,
            5: St
        },
        Zt = "pointerdown",
        Jt = "pointermove pointerup pointercancel";
    t.MSPointerEvent && !t.PointerEvent && (Zt = "MSPointerDown", Jt = "MSPointerMove MSPointerUp MSPointerCancel"), l(k, I, {
        handler: function _e(t) {
            var e = this.store,
                i = !1,
                n = t.type.toLowerCase().replace("ms", ""),
                s = Gt[n],
                r = Bt[t.pointerType] || t.pointerType,
                o = r == At,
                a = g(e, t.pointerId, "pointerId");
            s & Pt && (0 === t.button || o) ? 0 > a && (e.push(t), a = e.length - 1) : s & (Rt | Mt) && (i = !0), 0 > a || (e[a] = t, this.callback(this.manager, s, {
                pointers: e,
                changedPointers: [t],
                pointerType: r,
                srcEvent: t
            }), i && e.splice(a, 1))
        }
    });
    var Kt = {
            touchstart: Pt,
            touchmove: Ot,
            touchend: Rt,
            touchcancel: Mt
        },
        Qt = "touchstart",
        te = "touchstart touchmove touchend touchcancel";
    l(q, I, {
        handler: function Se(t) {
            var e = Kt[t.type];
            if (e === Pt && (this.started = !0), this.started) {
                var i = F.call(this, t, e);
                e & (Rt | Mt) && i[0].length - i[1].length === 0 && (this.started = !1), this.callback(this.manager, e, {
                    pointers: i[0],
                    changedPointers: i[1],
                    pointerType: At,
                    srcEvent: t
                })
            }
        }
    });
    var ee = {
            touchstart: Pt,
            touchmove: Ot,
            touchend: Rt,
            touchcancel: Mt
        },
        ie = "touchstart touchmove touchend touchcancel";
    l(W, I, {
        handler: function be(t) {
            var e = ee[t.type],
                i = H.call(this, t, e);
            i && this.callback(this.manager, e, {
                pointers: i[0],
                changedPointers: i[1],
                pointerType: At,
                srcEvent: t
            })
        }
    });
    var ne = 2500,
        se = 25;
    l(L, I, {
        handler: function Pe(t, e, i) {
            var n = i.pointerType == At,
                s = i.pointerType == _t;
            if (!(s && i.sourceCapabilities && i.sourceCapabilities.firesTouchEvents)) {
                if (n) V.call(this, e, i);
                else if (s && j.call(this, i)) return;
                this.callback(t, e, i)
            }
        },
        destroy: function Oe() {
            this.touch.destroy(), this.mouse.destroy()
        }
    });
    var re = C(pt.style, "touchAction"),
        oe = re !== n,
        ae = "compute",
        le = "auto",
        ce = "manipulation",
        he = "none",
        ue = "pan-x",
        de = "pan-y",
        pe = Z();
    G.prototype = {
        set: function (t) {
            t == ae && (t = this.compute()), oe && this.manager.element.style && pe[t] && (this.manager.element.style[re] = t), this.actions = t.toLowerCase().trim()
        },
        update: function () {
            this.set(this.manager.options.touchAction)
        },
        compute: function () {
            var t = [];
            return o(this.manager.recognizers, function (e) {
                h(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
            }), B(t.join(" "))
        },
        preventDefaults: function (t) {
            var e = t.srcEvent,
                i = t.offsetDirection;
            if (this.manager.session.prevented) return void e.preventDefault();
            var n = this.actions,
                s = v(n, he) && !pe[he],
                r = v(n, de) && !pe[de],
                o = v(n, ue) && !pe[ue];
            if (s) {
                var a = 1 === t.pointers.length,
                    l = t.distance < 2,
                    c = t.deltaTime < 250;
                if (a && l && c) return
            }
            return o && r ? void 0 : s || r && i & qt || o && i & Ft ? this.preventSrc(e) : void 0
        },
        preventSrc: function (t) {
            this.manager.session.prevented = !0, t.preventDefault()
        }
    };
    var fe = 1,
        ve = 2,
        me = 4,
        ge = 8,
        Te = ge,
        ye = 16,
        Ce = 32;
    J.prototype = {
        defaults: {},
        set: function (t) {
            return Tt(this.options, t), this.manager && this.manager.touchAction.update(), this
        },
        recognizeWith: function (t) {
            if (r(t, "recognizeWith", this)) return this;
            var e = this.simultaneous;
            return t = tt(t, this), e[t.id] || (e[t.id] = t, t.recognizeWith(this)), this
        },
        dropRecognizeWith: function (t) {
            return r(t, "dropRecognizeWith", this) ? this : (t = tt(t, this), delete this.simultaneous[t.id], this)
        },
        requireFailure: function (t) {
            if (r(t, "requireFailure", this)) return this;
            var e = this.requireFail;
            return t = tt(t, this), -1 === g(e, t) && (e.push(t), t.requireFailure(this)), this
        },
        dropRequireFailure: function (t) {
            if (r(t, "dropRequireFailure", this)) return this;
            t = tt(t, this);
            var e = g(this.requireFail, t);
            return e > -1 && this.requireFail.splice(e, 1), this
        },
        hasRequireFailures: function () {
            return this.requireFail.length > 0
        },
        canRecognizeWith: function (t) {
            return !!this.simultaneous[t.id]
        },
        emit: function (t) {
            function e(e) {
                i.manager.emit(e, t)
            }
            var i = this,
                n = this.state;
            ge > n && e(i.options.event + K(n)), e(i.options.event), t.additionalEvent && e(t.additionalEvent), n >= ge && e(i.options.event + K(n))
        },
        tryEmit: function (t) {
            return this.canEmit() ? this.emit(t) : void(this.state = Ce)
        },
        canEmit: function () {
            for (var t = 0; t < this.requireFail.length;) {
                if (!(this.requireFail[t].state & (Ce | fe))) return !1;
                t++
            }
            return !0
        },
        recognize: function (t) {
            var e = Tt({}, t);
            return h(this.options.enable, [this, e]) ? (this.state & (Te | ye | Ce) && (this.state = fe), this.state = this.process(e), void(this.state & (ve | me | ge | ye) && this.tryEmit(e))) : (this.reset(), void(this.state = Ce))
        },
        process: function (t) {},
        getTouchAction: function () {},
        reset: function () {}
    }, l(et, J, {
        defaults: {
            pointers: 1
        },
        attrTest: function (t) {
            var e = this.options.pointers;
            return 0 === e || t.pointers.length === e
        },
        process: function (t) {
            var e = this.state,
                i = t.eventType,
                n = e & (ve | me),
                s = this.attrTest(t);
            return n && (i & Mt || !s) ? e | ye : n || s ? i & Rt ? e | ge : e & ve ? e | me : ve : Ce
        }
    }), l(it, et, {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: Wt
        },
        getTouchAction: function () {
            var t = this.options.direction,
                e = [];
            return t & qt && e.push(de), t & Ft && e.push(ue), e
        },
        directionTest: function (t) {
            var e = this.options,
                i = !0,
                n = t.distance,
                s = t.direction,
                r = t.deltaX,
                o = t.deltaY;
            return s & e.direction || (e.direction & qt ? (s = 0 === r ? zt : 0 > r ? Nt : Xt, i = r != this.pX, n = Math.abs(t.deltaX)) : (s = 0 === o ? zt : 0 > o ? Yt : kt, i = o != this.pY, n = Math.abs(t.deltaY))), t.direction = s, i && n > e.threshold && s & e.direction
        },
        attrTest: function (t) {
            return et.prototype.attrTest.call(this, t) && (this.state & ve || !(this.state & ve) && this.directionTest(t))
        },
        emit: function (t) {
            this.pX = t.deltaX, this.pY = t.deltaY;
            var e = Q(t.direction);
            e && (t.additionalEvent = this.options.event + e), this._super.emit.call(this, t)
        }
    }), l(nt, et, {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function () {
            return [he]
        },
        attrTest: function (t) {
            return this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this.options.threshold || this.state & ve)
        },
        emit: function (t) {
            if (1 !== t.scale) {
                var e = t.scale < 1 ? "in" : "out";
                t.additionalEvent = this.options.event + e
            }
            this._super.emit.call(this, t)
        }
    }), l(st, J, {
        defaults: {
            event: "press",
            pointers: 1,
            time: 251,
            threshold: 9
        },
        getTouchAction: function () {
            return [le]
        },
        process: function (t) {
            var e = this.options,
                i = t.pointers.length === e.pointers,
                n = t.distance < e.threshold,
                r = t.deltaTime > e.time;
            if (this._input = t, !n || !i || t.eventType & (Rt | Mt) && !r) this.reset();
            else if (t.eventType & Pt) this.reset(), this._timer = s(function () {
                this.state = Te, this.tryEmit()
            }, e.time, this);
            else if (t.eventType & Rt) return Te;
            return Ce
        },
        reset: function () {
            clearTimeout(this._timer)
        },
        emit: function (t) {
            this.state === Te && (t && t.eventType & Rt ? this.manager.emit(this.options.event + "up", t) : (this._input.timeStamp = gt(), this.manager.emit(this.options.event, this._input)))
        }
    }), l(rt, et, {
        defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function () {
            return [he]
        },
        attrTest: function (t) {
            return this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this.options.threshold || this.state & ve)
        }
    }), l(ot, et, {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: .3,
            direction: qt | Ft,
            pointers: 1
        },
        getTouchAction: function () {
            return it.prototype.getTouchAction.call(this)
        },
        attrTest: function (t) {
            var e = this.options.direction,
                i;
            return e & (qt | Ft) ? i = t.overallVelocity : e & qt ? i = t.overallVelocityX : e & Ft && (i = t.overallVelocityY), this._super.attrTest.call(this, t) && e & t.offsetDirection && t.distance > this.options.threshold && t.maxPointers == this.options.pointers && mt(i) > this.options.velocity && t.eventType & Rt
        },
        emit: function (t) {
            var e = Q(t.offsetDirection);
            e && this.manager.emit(this.options.event + e, t), this.manager.emit(this.options.event, t)
        }
    }), l(at, J, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 9,
            posThreshold: 10
        },
        getTouchAction: function () {
            return [ce]
        },
        process: function (t) {
            var e = this.options,
                i = t.pointers.length === e.pointers,
                n = t.distance < e.threshold,
                r = t.deltaTime < e.time;
            if (this.reset(), t.eventType & Pt && 0 === this.count) return this.failTimeout();
            if (n && r && i) {
                if (t.eventType != Rt) return this.failTimeout();
                var o = this.pTime ? t.timeStamp - this.pTime < e.interval : !0,
                    a = !this.pCenter || M(this.pCenter, t.center) < e.posThreshold;
                this.pTime = t.timeStamp, this.pCenter = t.center, a && o ? this.count += 1 : this.count = 1, this._input = t;
                var l = this.count % e.taps;
                if (0 === l) return this.hasRequireFailures() ? (this._timer = s(function () {
                    this.state = Te, this.tryEmit()
                }, e.interval, this), ve) : Te
            }
            return Ce
        },
        failTimeout: function () {
            return this._timer = s(function () {
                this.state = Ce
            }, this.options.interval, this), Ce
        },
        reset: function () {
            clearTimeout(this._timer)
        },
        emit: function () {
            this.state == Te && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
        }
    }), lt.VERSION = "2.0.8", lt.defaults = {
        domEvents: !1,
        touchAction: ae,
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [
            [rt, {
                enable: !1
            }],
            [nt, {
                    enable: !1
                },
                ["rotate"]
            ],
            [ot, {
                direction: qt
            }],
            [it, {
                    direction: qt
                },
                ["swipe"]
            ],
            [at],
            [at, {
                    event: "doubletap",
                    taps: 2
                },
                ["tap"]
            ],
            [st]
        ],
        cssProps: {
            userSelect: "none",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    var Ee = 1,
        xe = 2;
    ct.prototype = {
        set: function (t) {
            return Tt(this.options, t), t.touchAction && this.touchAction.update(), t.inputTarget && (this.input.destroy(), this.input.target = t.inputTarget, this.input.init()), this
        },
        stop: function (t) {
            this.session.stopped = t ? xe : Ee
        },
        recognize: function (t) {
            var e = this.session;
            if (!e.stopped) {
                this.touchAction.preventDefaults(t);
                var i, n = this.recognizers,
                    s = e.curRecognizer;
                (!s || s && s.state & Te) && (s = e.curRecognizer = null);
                for (var r = 0; r < n.length;) i = n[r], e.stopped === xe || s && i != s && !i.canRecognizeWith(s) ? i.reset() : i.recognize(t), !s && i.state & (ve | me | ge) && (s = e.curRecognizer = i), r++
            }
        },
        get: function (t) {
            if (t instanceof J) return t;
            for (var e = this.recognizers, i = 0; i < e.length; i++)
                if (e[i].options.event == t) return e[i];
            return null
        },
        add: function (t) {
            if (r(t, "add", this)) return this;
            var e = this.get(t.options.event);
            return e && this.remove(e), this.recognizers.push(t), t.manager = this, this.touchAction.update(), t
        },
        remove: function (t) {
            if (r(t, "remove", this)) return this;
            if (t = this.get(t)) {
                var e = this.recognizers,
                    i = g(e, t); - 1 !== i && (e.splice(i, 1), this.touchAction.update())
            }
            return this
        },
        on: function (t, e) {
            if (t !== n && e !== n) {
                var i = this.handlers;
                return o(m(t), function (t) {
                    i[t] = i[t] || [], i[t].push(e)
                }), this
            }
        },
        off: function (t, e) {
            if (t !== n) {
                var i = this.handlers;
                return o(m(t), function (t) {
                    e ? i[t] && i[t].splice(g(i[t], e), 1) : delete i[t]
                }), this
            }
        },
        emit: function (t, e) {
            this.options.domEvents && ut(t, e);
            var i = this.handlers[t] && this.handlers[t].slice();
            if (i && i.length) {
                e.type = t, e.preventDefault = function () {
                    e.srcEvent.preventDefault()
                };
                for (var n = 0; n < i.length;) i[n](e), n++
            }
        },
        destroy: function () {
            this.element && ht(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
        }
    }, Tt(lt, {
        INPUT_START: Pt,
        INPUT_MOVE: Ot,
        INPUT_END: Rt,
        INPUT_CANCEL: Mt,
        STATE_POSSIBLE: fe,
        STATE_BEGAN: ve,
        STATE_CHANGED: me,
        STATE_ENDED: ge,
        STATE_RECOGNIZED: Te,
        STATE_CANCELLED: ye,
        STATE_FAILED: Ce,
        DIRECTION_NONE: zt,
        DIRECTION_LEFT: Nt,
        DIRECTION_RIGHT: Xt,
        DIRECTION_UP: Yt,
        DIRECTION_DOWN: kt,
        DIRECTION_HORIZONTAL: qt,
        DIRECTION_VERTICAL: Ft,
        DIRECTION_ALL: Wt,
        Manager: ct,
        Input: I,
        TouchAction: G,
        TouchInput: W,
        MouseInput: Y,
        PointerEventInput: k,
        TouchMouseInput: L,
        SingleTouchInput: q,
        Recognizer: J,
        AttrRecognizer: et,
        Tap: at,
        Pan: it,
        Swipe: ot,
        Pinch: nt,
        Rotate: rt,
        Press: st,
        on: d,
        off: p,
        each: o,
        merge: Ct,
        extend: yt,
        assign: Tt,
        inherit: l,
        bindFn: c,
        prefixed: C
    });
    var $e = "undefined" != typeof t ? t : "undefined" != typeof self ? self : {};
    $e.Hammer = lt, "function" == typeof define && define.amd ? define(function () {
        return lt
    }) : "undefined" != typeof module && module.exports ? module.exports = lt : t[i] = lt
}(window, document, "Hammer"), $(document).ready(function () {
    function t(t) {
        var n = $(".side-nav").find(".is-active"),
            s = $(".side-nav").children().index(n),
            r = $(".side-nav").children().length - 1,
            o = 0;
        "swipeup" === t.type || 40 === t.keyCode || t > 0 ? s !== r ? (o = s + 1, e(o), i(s, o, r)) : (e(o), i(s, o, r)) : ("swipedown" === t.type || 38 === t.keyCode || 0 > t) && (0 !== s ? (o = s - 1, e(o), i(s, o, r)) : (o = r, e(o), i(s, o, r)))
    }

    function e(t) {
        $(".side-nav, .outer-nav").children().removeClass("is-active"), $(".side-nav").children().eq(t).addClass("is-active"), $(".outer-nav").children().eq(t).addClass("is-active")
    }

    function i(t, e, i) {
        $(".main-content").children().removeClass("section--is-active"), $(".main-content").children().eq(e).addClass("section--is-active"), $(".main-content .section").children().removeClass("section--next section--prev"), t === i && 0 === e || 0 === t && e === i ? $(".main-content .section").children().removeClass("section--next section--prev") : e > t ? $(".main-content").children().eq(t).children().addClass("section--next") : $(".main-content").children().eq(t).children().addClass("section--prev"), 0 !== e && e !== i ? $(".header--cta").addClass("is-active") : $(".header--cta").removeClass("is-active")
    }

    function n() {
        $(".header--nav-toggle").click(function () {
            $(".perspective").addClass("perspective--modalview"), setTimeout(function () {
                $(".perspective").addClass("effect-rotate-left--animate")
            }, 25), $(".outer-nav, .outer-nav li, .outer-nav--return").addClass("is-vis")
        }), $(".outer-nav--return, .outer-nav li").click(function () {
            $(".perspective").removeClass("effect-rotate-left--animate"), setTimeout(function () {
                $(".perspective").removeClass("perspective--modalview")
            }, 400), $(".outer-nav, .outer-nav li, .outer-nav--return").removeClass("is-vis")
        })
    }

    function s() {
        $(".slider--prev, .slider--next").click(function () {
            var t = $(this),
                e = $(".slider").find(".slider--item-left"),
                i = $(".slider").children().index(e),
                n = $(".slider").find(".slider--item-center"),
                s = $(".slider").children().index(n),
                r = $(".slider").find(".slider--item-right"),
                o = $(".slider").children().index(r),
                a = $(".slider").children().length,
                l = $(".slider--item-left"),
                c = $(".slider--item-center"),
                h = $(".slider--item-right"),
                u = $(".slider--item");
            $(".slider").animate({
                opacity: 0
            }, 400), setTimeout(function () {
                t.hasClass("slider--next") ? a - 1 > i && a - 1 > s && a - 1 > o ? (l.removeClass("slider--item-left").next().addClass("slider--item-left"), c.removeClass("slider--item-center").next().addClass("slider--item-center"), h.removeClass("slider--item-right").next().addClass("slider--item-right")) : i === a - 1 ? (u.removeClass("slider--item-left").first().addClass("slider--item-left"), c.removeClass("slider--item-center").next().addClass("slider--item-center"), h.removeClass("slider--item-right").next().addClass("slider--item-right")) : s === a - 1 ? (l.removeClass("slider--item-left").next().addClass("slider--item-left"), u.removeClass("slider--item-center").first().addClass("slider--item-center"), h.removeClass("slider--item-right").next().addClass("slider--item-right")) : (l.removeClass("slider--item-left").next().addClass("slider--item-left"), c.removeClass("slider--item-center").next().addClass("slider--item-center"), u.removeClass("slider--item-right").first().addClass("slider--item-right")) : 0 !== i && 0 !== s && 0 !== o ? (l.removeClass("slider--item-left").prev().addClass("slider--item-left"), c.removeClass("slider--item-center").prev().addClass("slider--item-center"), h.removeClass("slider--item-right").prev().addClass("slider--item-right")) : 0 === i ? (u.removeClass("slider--item-left").last().addClass("slider--item-left"), c.removeClass("slider--item-center").prev().addClass("slider--item-center"), h.removeClass("slider--item-right").prev().addClass("slider--item-right")) : 0 === s ? (l.removeClass("slider--item-left").prev().addClass("slider--item-left"), u.removeClass("slider--item-center").last().addClass("slider--item-center"), h.removeClass("slider--item-right").prev().addClass("slider--item-right")) : (l.removeClass("slider--item-left").prev().addClass("slider--item-left"), c.removeClass("slider--item-center").prev().addClass("slider--item-center"), u.removeClass("slider--item-right").last().addClass("slider--item-right"))
            }, 400), $(".slider").animate({
                opacity: 1
            }, 400)
        })
    }

    function r() {
        $(".work-request--information input").focusout(function () {
            var t = $(this).val();
            "" === t ? $(this).removeClass("has-value") : $(this).addClass("has-value"), window.scrollTo(0, 0)
        })
    }
    var o = !0,
        a = null;
    $(this).on("mousewheel DOMMouseScroll", function (e) {
        if (!$(".outer-nav").hasClass("is-vis")) {
            e.preventDefault();
            var i = e.originalEvent.wheelDelta ? -e.originalEvent.wheelDelta : 20 * e.originalEvent.detail;
            i > 50 && o ? (o = !1, clearTimeout(a), a = setTimeout(function () {
                o = !0
            }, 800), t(1)) : -50 > i && o && (o = !1, clearTimeout(a), a = setTimeout(function () {
                o = !0
            }, 800), t(-1))
        }
    }), $(".side-nav li, .outer-nav li").click(function () {
        if (!$(this).hasClass("is-active")) {
            var t = $(this),
                n = t.parent().find(".is-active"),
                s = t.parent().children().index(n),
                r = t.parent().children().index(t),
                o = $(this).parent().children().length - 1;
            e(r), i(s, r, o)
        }
    }), $(".cta").click(function () {
        var t = $(".side-nav").find(".is-active"),
            n = $(".side-nav").children().index(t),
            s = $(".side-nav").children().length - 1,
            r = s;
        e(s), i(n, r, s)
    });
    var l = document.getElementById("viewport"),
        c = new Hammer(l);
    c.get("swipe").set({
        direction: Hammer.DIRECTION_VERTICAL
    }), c.on("swipeup swipedown", function (e) {
        t(e)
    }), $(document).keyup(function (e) {
        $(".outer-nav").hasClass("is-vis") || (e.preventDefault(), t(e))
    }), n(), s(), r()
});