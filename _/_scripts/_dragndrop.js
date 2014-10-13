function gestMovimientoCapas(e) {
    if (!e)
        var e = window.event;
    if (e.pageX || e.pageY) {
        posRatonX = e.pageX;
        posRatonY = e.pageY;
    } else if (e.clientX || e.clientY) {
        var fv = document.documentElement.scrollLeft || document.body.scrollLeft;
        posRatonX = e.clientX + fv;
        var fU = document.documentElement.scrollTop || document.body.scrollTop;
        posRatonY = e.clientY + fU;
    }
    ec = e.clientX;
    cd = e.clientY;
    var bZ = false;
    var M = false;
    for (var i = 0; i != G.length; ++i) {
        if (G[i].ad) {
            if (G[i].style.position != "absolute") {
                G[i].fk();
            }
            fd(G[i]);
            bZ = true;
            M = G[i];
        }
    }
    if (bZ) {
        for (var i = 0; i != aK.length; i++) {
            if (aK[i].fh()) {
                var ag = aK[i].bV(M);
                if (ag) {
                    dq(an);
                    ag.dc();
                }
            }
        }
    }
}
;
function finalizaMovimientoCapas() {
    for (var i = 0; i != G.length; i++) {
        if (G[i].ad) {
            G[i].eT();
        }
    }
}
;
function dM() {
    try {
        if (window["getSelection"]) {
            if (gx.gu) {
                window.getSelection().collapse();
            } else {
                window.getSelection().removeAllRanges();
            }
        } else if ((document.selection) && (document.selection.clear)) {
            document.selection.clear();
        } else if (document.selection) {
            document.selection.empty;
            ;
        }
        return true;
    } catch (e) {
    }
}
;
function K(aY) {
    if (navigator.userAgent.toLowerCase().indexOf("msie") == -1)
        return az(aY);
    var x = 0;
    var parent = aY;
    while (parent) {
        x += parent.offsetLeft - parent.scrollLeft;
        parent = parent.offsetParent;
    }
    return x;
}
;
function az(aY) {
    var x = 0;
    var parent = aY;
    while (parent) {
        x += parent.offsetLeft;
        parent = parent.offsetParent;
    }
    parent = aY;
    while (parent && parent != document.body && parent != document.documentElement) {
        if (parent.scrollLeft)
            x -= parent.scrollLeft;
        parent = parent.parentNode;
    }
    return x;
}
;
function R(el) {
    if (el.parentNode === null || el.style.display == 'none') {
        return false;
    }
    var parent = null;
    var pos = [];
    var box;
    if (el.getBoundingClientRect) {
        box = el.getBoundingClientRect();
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        return (box.top + scrollTop);
    } else if (document.getBoxObjectFor) {
        try {
            box = document.getBoxObjectFor(el);
            pos = box.y;
        } catch (e) {
            pos = el.offsetTop;
            parent = el.offsetParent;
            if (parent != el) {
                while (parent) {
                    pos += parent.offsetTop;
                    parent = parent.offsetParent;
                }
            }
        }
    } else {
        pos = el.offsetTop;
        parent = el.offsetParent;
        if (parent != el) {
            while (parent) {
                pos += parent.offsetTop;
                parent = parent.offsetParent;
            }
        }
        var gh = navigator.userAgent.toLowerCase();
        if (gh.indexOf('opera') != -1 || (gh.indexOf('safari') != -1 && el.style.position == 'absolute')) {
            pos -= document.body.offsetTop;
        }
    }
    if (el.parentNode) {
        parent = el.parentNode;
    } else {
        parent = null;
    }
    return pos;
}
;
var aM = null;
function dq(dT) {
    for (var i = 0; i != dT.length; i++) {
        dT[i].at();
    }
}
;
function es(bf) {
    var cG = new Array();
    var aD = 0;
    for (i = 0; i != an.length; i++) {
        if (an[i].id != bf.id) {
            cG[aD] = an[i];
            aD++;
        }
    }
    bf.parentNode.removeChild(bf);
    an = cG;
}
;
function aI(ei, fJ) {
    for (var j = 0; j != fJ.bF.length; j++) {
        if (ei == fJ.bF[j]) {
            return true;
        }
    }
    return false;
}
;
function fq(eW) {
    this.bp;
    if (arguments.length == 0) {
        this.bp = document.createElement("DIV");
        var du = new Date();
        this.bp.id = bo + "_" + du.getTime();
    } else {
        this.bp = eW;
        if (!this.bp) {
            this.bp = document.createElement("DIV");
            var du = new Date();
            this.bp.id = eW.id + du.getTime();
        }
    }
    this.bp.dN = cI;
    this.bp.at = function() {
        this.className = bo;
    };
    this.bp.dc = function() {
        if (this.parentNode.aW) {
            this.className = this.parentNode.aW;
        } else {
            this.className = this.aW;
        }
        aM = this;
    };
    this.bp.at();
    return this.bp;
}
;
function fK(cS, cJ, U) {
    this.d = document.getElementById(cS);
    this.d.aW = cI;
    this.d.gk = 0;
    this.d.gw = K(this.d);
    this.d.gv = R(this.d);
    this.d.U = U;
    this.d.fh = function() {
        if ((K(this) < posRatonX) && ((K(this) + this.offsetWidth) > posRatonX) && (R(this) < posRatonY) && ((R(this) + this.offsetHeight + 10) > posRatonY)) {
            return true;
        } else {
            return false;
        }
    };
    this.d.dO = function() {
        for (var i = this.childNodes.length - 1; i >= 0; i--) {
            if (typeof this.childNodes[i].id == "undefined") {
                this.removeChild(this.childNodes[i]);
            }
        }
    };
    var ag = null;
    if (cJ == "horizontal")
        this.d.bV = function(M) {
            if (aI(this.className, M)) {
                bP = posRatonX - this.U;
                var bK = null;
                var ai = am('slot', this);
                var bk = ai.length;
                for (var i = 0; i < bk; ++i) {
                    bK = ai[i];
                    if (K(bK) > bP)
                        return (bK);
                    else
                        ag = ai[i];
                }
                return (ag);
            }
        };
    else if (cJ == "vertical")
        this.d.bV = function(M) {
            if (aI(this.className, M)) {
                bO = posRatonY - this.U;
                var bK = null;
                var ai = am('slot', this);
                var bk = ai.length;
                for (var i = 0; i < bk; ++i) {
                    bK = ai[i];
                    if (R(bK) > bO)
                        return (bK);
                    else
                        ag = ai[i];
                }
                return (ag);
            }
        };
    else
        this.d.bV = function(M) {
            if (aI(this.className, M)) {
                bP = posRatonX - this.U;
                bO = posRatonY - this.U;
                var bK = null;
                var ai = am('slot', this);
                var bk = ai.length;
                for (var i = 0; i < bk; ++i) {
                    bK = ai[i];
                    if ((R(bK) > bO) && (K(bK) > bP))
                        return (bK);
                    else
                        ag = ai[i];
                }
                return (ag);
            }
        };
    this.d.gc = function() {
        return (this.childNodes[this.childNodes.length - 1]);
    };
    this.d.fB = function() {
        for (var i = 0; i != aK.length; i++) {
            if (aK[i].id == this.id) {
                return i;
            }
        }
    };
    this.d.fX = function() {
        var aX = new Array();
        for (var i = 0; i != this.childNodes.length; i++) {
            if (eG(this.childNodes[i].id, G)) {
                aX[aX.length] = this.childNodes[i].id;
            }
        }
        return aX;
    };
    this.d.gd = function() {
        var dZ = 0;
        for (var i = 0; i != this.childNodes.length; i++) {
            if (eG(this.childNodes[i].id, G)) {
                dZ++;
            }
        }
        return dZ;
    };
    this.d.gl = function(html, ce, en) {
        var g = document.createElement("DIV");
        g.innerHTML = html;
        document.body.appendChild(g);
        g.className = document.getElementById(ce).className;
        g.innerHTML = document.getElementById(ce).innerHTML;
        g.id = ce;
        if (en) {
            var firstChild = this.childNodes[0];
            this.insertBefore(g, firstChild);
        } else {
            this.appendChild(g);
        }
        an[an.length] = new fq(bo + "_" + ce);
        an[an.length - 1].dN = this.aW;
        dq(an);
        if (en) {
            var firstChild = this.childNodes[0];
            this.insertBefore(an[an.length - 1], firstChild);
        } else {
            this.appendChild(an[an.length - 1]);
        }
    };
    this.d.dO();
    return this.d;
}
;
function Bloque(fs, eI) {
    this.av = fs;
    this.av.gy = eI;
    this.av.bF = new Array();
    this.av.fM = 0;
    this.av.fL = 0;
    this.av.fk = function() {
        var bf = this.nextSibling;
        this.eq = this.parentNode.id;
        this.style.top = R(this) + "px";
        this.style.left = K(this) + "px";
        this.A = posRatonX - this.style.left.substr(0, this.style.left.length - 2);
        this.P = posRatonY - this.style.top.substr(0, this.style.top.length - 2);
        this.style.zIndex = 20;
        this.style.position = "absolute";
        this.aV();
        es(bf);
    };
    this.av.eT = function() {
        if (this.ad && this.style.position == "absolute") {
            var ag;
            if (navigator.appName == "Opera") {
                this.style.visibility = "hidden";
            }
            this.style.zIndex = 1;
            this.style.position = "relative";
            this.style.top = 0 + "px";
            this.style.left = 0 + "px";
            this.style.width = "";
            this.style.height = "";
            if (navigator.appName == "Opera") {
                this.style.visibility = "visible";
            }
            cK = new fq();
            var d = null;
            if (aM != null) {
                d = aM.parentNode;
                d.insertBefore(this, aM);
                d.insertBefore(cK, this);
            } else {
                d = document.getElementById(this.eq);
                d.insertBefore(cK, this.nextSibling);
            }
            cK.dN = d.aW;
            this.eq = this.parentNode.id;
            an[an.length] = cK;
            dq(an);
            this.bs();
        }
        this.ad = false;
    };
    this.av.cZ = function(fx) {
        var dJ = document.getElementById(fx);
        dJ.ct = this.id;
        dJ.onmousedown = dD;
        dJ.onmouseup = eb;
    };
    this.av.cM = function(cS) {
        this.bF.push(cS);
    };
    this.av.eN = function() {
        var bf = this.nextSibling;
        es(bf);
        var cs = new Array();
        var aD = 0;
        for (i = 0; i != G.length; i++) {
            if (G[i].id != this.id) {
                cs[aD] = G[i];
                aD++;
            }
        }
        var d = this.parentNode;
        d.removeChild(this);
        G = cs;
        if (navigator.appName == "Opera") {
            d.style.visibility = "hidden";
            d.style.visibility = "visible";
        }
    };
    this.av.aV = function() {
        void (0);
    };
    this.av.bs = function() {
        void (0);
    };
    return this.av;
}
;
function dD() {
    document.getElementById(this.ct).ad = true;
}
;
function eb() {
    document.getElementById(this.ct).eT();
}
;
function eG(ce, aX) {
    for (var i = 0; i != aX.length; i++) {
        if (aX[i].id == ce) {
            return true;
        }
    }
    return false;
}
;
function fd(o) {
    d = o;
    if (d.gg) {
        o.style.left = (posRatonX - o.A - K(d)) + "px";
        o.style.top = (posRatonY - o.P - R(d)) + "px";
    } else {
        o.style.left = (posRatonX - o.A) + "px";
        o.style.top = (posRatonY - o.P) + "px";
    }
    fb();
    dM();
}
;
function fb() {
    var aq = document.documentElement.clientHeight;
    if (navigator.appName == "Opera") {
        aq = document.body.clientHeight;
    }
    var bh = parseInt(aq * 0.1);
    if ((cd < bh) && (document.documentElement.scrollTop > 0)) {
        document.documentElement.scrollTop -= 20;
    } else if (((aq - cd) < bh) && (((document.documentElement.scrollTop + aq) < document.body.offsetHeight) || ((document.documentElement.scrollTop + aq) < document.documentElement.offsetHeight))) {
        document.documentElement.scrollTop += 20;
    }
}
;
function gf(dr) {
    var o = document.getElementById(dr);
    if (o.style.display == "none") {
        o.style.display = "block";
    } else {
        o.style.display = "none";
    }
}
;
function bw(cO, dF, fE) {
    var bi = new Array();
    if (dF == null)
        dF = document;
    if (fE == null)
        fE = '*';
    var eL = dF.getElementsByTagName(fE);
    var eJ = eL.length;
    var ed = new RegExp("(^|\\s)" + cO + "(\\s|$)");
    for (var i = 0, j = 0; i < eJ; i++) {
        if (ed.test(eL[i].className)) {
            bi[j] = eL[i];
            j++;
        }
    }
    return bi;
}
;
function am(cO, dF) {
    var bi = new Array();
    if (dF == null)
        dF = document;
    var eL = dF.childNodes;
    var eJ = eL.length;
    var ed = new RegExp("(^|\\s)" + cO + "(\\s|$)");
    for (var i = 0, j = 0; i < eJ; i++) {
        if (ed.test(eL[i].className)) {
            bi[j] = eL[i];
            j++;
        }
    }
    return bi;
}
;
function ds(cN, fR) {
    cz = cN;
    for (var i = 0; i < fR; ++i)
        cz = cz.parentNode;
    return cz;
}
;
var aK = new Array();
var G = new Array();
var an = new Array();
function fa() {
    aK = new Array();
    {
        for (var contenedor = 0, k = 0; contenedor < ay.length; ++contenedor) {
            var bg = bw(ay[contenedor].ax, null, null);
            for (i = 0; i < bg.length; ++i, ++k) {
                if (!bg[i].id)
                    bg[i].id = 'container_drag_' + k;
                {
                    g = document.createElement('DIV');
                    g.className = bo;
                    bg[i].appendChild(g);
                }
                aK[k] = new fK(bg[i].id, ay[contenedor].cJ, ay[contenedor].U);
                aK[k].gg = true;
            }
        }
    }
    G = new Array();
    {
        for (var j = 0, k = 0; j < as.length; ++j) {
            var by = bw(as[j].ax, null, as[j].fE);
            for (i = 0; i < by.length; ++i, ++k) {
                if (!by[i].id)
                    by[i].id = 'arrastrable_' + k;
                var aE;
                if (as[j].be > 0) {
                    aE = ds(by[i], as[j].be);
                    if (!aE.id)
                        aE.id = 'arrastrable_Drag_' + k;
                } else {
                    aE = by[i];
                }
                {
                    g = document.createElement('DIV');
                    g.className = bo;
                    aE.parentNode.insertBefore(g, aE);
                }
                G[k] = new Bloque(aE, '');
                G[k].cZ(by[i].id);
                G[k].aV = function() {
                    this.dK = this.className;
                    this.className += " " + cH;
                };
                G[k].bs = function() {
                    this.className = this.dK;
                };
                for (var bn = 0; bn < as[j].cv.length; ++bn)
                    G[k].cM(as[j].cv[bn]);
            }
        }
    }
    an = new Array();
    {
        var eg = bw('slot', null, 'DIV');
        for (i = 0; i < eg.length; ++i) {
            eg[i].id = 'slot_' + i;
            an[i] = new fq(eg[i]);
            an[i].at();
        }
    }
}
