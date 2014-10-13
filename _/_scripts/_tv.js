function parseInt2(a) {
    if (a == '') {
        return 0;
    }
    return parseInt(a);
}
var gp = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
var dS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function Programa(ax, bH, aA, cb, cP, gs, O, dA, dL, url) {
    this.ax = ax;
    this.bH = bH;
    this.aA = parseInt2(aA);
    this.cb = parseInt2(cb);
    this.cP = cP;
    this.O = O;
    this.dA = dA;
    this.url = url;
    this.dL = parseInt2(dL);
    return this;
};

function Canal(ax, fz, t) {
    this.ax = ax, this.fz = fz, this.t = t, this.J = 0, this.T = 0, this.aj = t.length;
    return this;
};

function TV(dv, ey, ez, dh, cW, dg, dk, dp, cU) {
    this.capaProgramacion = document.getElementById(dv);
    this.capaCanales = document.getElementById(ey);
    this.capaHorario = document.getElementById(ez);
    this.capaNavegacionDias = document.getElementById(dh);
    this.capaNavegacionHoras = document.getElementById(cW);
    this.C;
    this.ao;
    this.capaHorarioAux;
    this.ae = document.getElementById(dg);
    this.bm = document.getElementById(dk);
    this.bv = document.getElementById(dp);
    this.bt = document.getElementById(cU);
    this.capaHoraActual;
    this.capaProgramacion.ad = false;
    this.capaProgramacion.eX = false;
    this.co = false;
    this.capaHorario.ad = false;
    this.capaCanales.ad = false;
    this.capaProgramacion.c = null;
    this.capaProgramacion.A = 0;
    this.capaProgramacion.P = 0;
    this.capaProgramacion.aO = fu(this.capaProgramacion, 3) - 50;
    this.capaProgramacion.aF = fc(this.capaProgramacion);
    this.capaCanales.A = 0;
    this.capaCanales.P = 0;
    this.capaHorario.A = 0;
    this.capaHorario.P = 0;
    this.capaProgramacion.TV = this;
    this.capaCanales.TV = this;
    this.capaHorario.TV = this;
    this.ap = Array();
    this.L = 0;
    this.aG = 0;
    this.ba = 0;
    this.bb = 0;
    this.aP = 0;
    this.eH = 4;
    this.B = 65;
    this.n = 20;
    this.bU = 7;
    this.bc = 0;
    this.aa = 9999999999;
    this.aZ = 0;
    this.cL = 400;
    this.fN = 400;
    this.cA = 400;
    this.al = 0;
    this.aN = 0;
    this.ci = 0;
    this.arrayCanales = new Array();
    this.t = new Array();
    this.fP = function(arrayCanales, bb) {
        this.arrayCanales = arrayCanales;
        this.bb = bb;
        this.bc = arrayCanales.length;
        if (this.bc <= this.bU) {
            this.bm.style.visibility = 'hidden';
            this.ae.style.visibility = 'hidden';
        }
        var gj = new Date(this.bb * 1000);
        var fA = new Date(gj.getFullYear(), gj.getMonth(), gj.getDate(), 0, 0);
        this.ba = parseInt2((fA.getTime()) / 1000);
        var cq = arrayCanales[0].t[0].aA;
        var db = arrayCanales[0].t[arrayCanales[0].t.length - 1].cb;
        for (var i = 1; i != arrayCanales.length; ++i) {
            if (arrayCanales[i].t[0].aA < cq) {
                cq = arrayCanales[i].t[0].aA;
            }
            if (arrayCanales[i].t[arrayCanales[i].t.length - 1].cb > db)
                db = arrayCanales[i].t[arrayCanales[i].t.length - 1].cb;
        }
        var eu = parseInt2((cq - this.ba + (this.aP * 86400)) / this.n);
        if (this.aa > eu) {
            this.aa = eu;
        }
        var ep = parseInt2((db - this.ba + (this.aP * 86400)) / this.n);
        if (this.aZ < ep) {
            this.aZ = ep;
        }
        this.al = this.capaProgramacion.parentNode.offsetWidth - this.aZ;
        var de = parseInt2(((this.bb - this.ba) + (86400 * this.aP)) / this.n);
        var aL = parseInt2(((this.aP + this.eH + 2) * 86400) / this.n);
        this.capaProgramacion.style.left = -(de) + 'px';
        this.capaProgramacion.style.height = ((arrayCanales.length < this.bU) ? this.bU : arrayCanales.length) * this.B + 'px';
        this.capaProgramacion.style.width = aL + 'px';
        this.capaHorario.style.left = -(de) + 'px';
        this.capaHorario.style.width = aL + 'px';
        this.aN = this.capaProgramacion.parentNode.offsetHeight - this.capaProgramacion.offsetHeight;
        this.ci = this.capaProgramacion.parentNode.offsetWidth - this.capaProgramacion.offsetWidth;
        this.dI();
        this.dG();
        this.cX();
        this.eD();
        this.eC();
        this.da(de);
        this.Q('forze');
        this.mueveProgramacionHorizontal(1);
    };
    this.capaProgramacion.movimientoCapa = function() {
        this.eX = true;
        var bM = posRatonY - this.P;
        if ((this.TV.aN > 0) || (bM > 0))
            this.style.top = '0';
        else if (bM < this.TV.aN)
            this.style.top = this.TV.aN + 'px';
        else
            this.style.top = bM + 'px';
        this.TV.capaCanales.style.top = this.style.top;
        if (posRatonX < (this.parentNode.offsetWidth - this.TV.aZ + this.A)) {
            this.style.left = (this.parentNode.offsetWidth - this.TV.aZ) + 'px';
        } else if (this.A - posRatonX < this.TV.aa) {
            this.style.left = -(this.TV.aa) + 'px';
        } else if (this.TV.ci > 0) {
            this.style.left = '0';
        } else if (posRatonX < (this.TV.ci + this.A)) {
            this.style.left = this.TV.ci + 'px';
        } else {
            this.style.left = (posRatonX - this.A) + 'px';
        }
        this.TV.capaHorario.style.left = this.style.left;
        this.TV.Q();
    };
    this.capaProgramacion.dx = function() {
        if ((this.aF < posRatonX) && (this.aO < posRatonY)) {
            var bq = this.parentNode.offsetTop + this.offsetTop + this.aO - posRatonY;
            var bj = this.offsetLeft + this.aF - posRatonX;
            if (this.c != null) {
                var bu = this.c.offsetTop + bq;
                var aT = this.c.offsetLeft + bj;
                if ((bu < 0) && (aT < 0) && (bu > -this.c.offsetHeight) && (aT > -this.c.offsetWidth))
                    return 0;
            }
            var aH = this.childNodes;
            for (i = 0; i < aH.length; ++i) {
                if (this.ad)
                    break;
                var bu = aH[i].offsetTop + bq;
                var aT = aH[i].offsetLeft + bj;
                if ((bu < 0) && (aT < 0) && (bu > -aH[i].offsetHeight) && (aT > -aH[i].offsetWidth)) {
                    if ((this.c != null) && (i != this.c)) {
                        this.c.className = this.c.className.replace('hover', '');
                    }
                    aH[i].className = aH[i].className + ' hover';
                    var eh = aH[i].getElementsByTagName('a');
                    if ((eh.length > 0) && (eh[0].href != undefined) && (eh[0].href != '#'))
                        this.parentNode.style.cursor = 'pointer';
                    else
                        this.parentNode.style.cursor = '';
                    this.c = aH[i];
                    return 0;
                }
            }
        } else {
            if ((this.c != null)) {
                this.c.className = this.c.className.replace('hover', '');
                this.c = null;
            }
        }
        return 0;
    };
    this.capaProgramacion.cy = function() {
        if ((this.aF < posRatonX) && (this.aO < posRatonY)) {
            var bq = this.parentNode.offsetTop + this.offsetTop + this.aO - posRatonY;
            var bj = this.offsetLeft + this.aF - posRatonX;
            if (this.c != null) {
                var bu = this.c.offsetTop + bq;
                var aT = this.c.offsetLeft + bj;
                if ((bu < 0) && (aT < 0) && (bu > -this.c.offsetHeight) && (aT > -this.c.offsetWidth))
                    return this.c.url;
            }
            var aH = this.childNodes;
            for (i = 0; i < aH.length; ++i) {
                if (this.ad)
                    break;
                var bu = aH[i].offsetTop + bq;
                var aT = aH[i].offsetLeft + bj;
                if ((bu < 0) && (aT < 0) && (bu > -aH[i].offsetHeight) && (aT > -aH[i].offsetWidth)) {
                    if ((this.c != null) && (i != this.c)) {
                        this.c.className = this.c.className.replace('hover', '');
                    }
                    aH[i].className = aH[i].className + ' hover';
                    this.c = aH[i];
                    return this.c.url;
                }
            }
        } else {
            if ((this.c != null)) {
                this.c.className = this.c.className.replace('hover', '');
                this.c = null;
            }
        }
        return '';
    };
    this.Q = function(mode) {
        if (this.aB() || (mode == 'forze'))
            this.cR();
        if (this.Y() || (mode == 'forze'))
            this.cD();
        if (this.capaProgramacion.style.left == (-(this.aa) + 'px'))
            this.bt.style.visibility = 'hidden';
        else if (this.capaHorario.style.left == ((this.al) + 'px'))
            this.bv.style.visibility = 'hidden';
        else {
            this.bt.style.visibility = 'visible';
            this.bv.style.visibility = 'visible';
        }
        if (this.bc > this.bU) {
            if ((this.capaCanales.style.top == '0px') || (this.capaCanales.style.top == ''))
                this.ae.style.visibility = 'hidden';
            else if (this.capaCanales.style.top == this.aN + 'px')
                this.bm.style.visibility = 'hidden';
            else {
                this.bm.style.visibility = 'visible';
                this.ae.style.visibility = 'visible';
            }
        }
    };
    this.cR = function() {
        var aB = this.L;
        var D = document.createElement('UL');
        this.capaNavegacionDias.innerHTML = '';
        D.TV = this;
        D.aR = function(fn) {
            this.TV.mueveProgramacionHorizontalDia(fn, 0, true);
        };
        var gi = 0;
        for (var i = 0; i < this.ap.length; ++i) {
            gi = (this.bb + ((i - this.aP) * 86400)) * 1000;
            var ej = new Date(gi);
            var bl = document.createElement('LI');
            var Z;
            if (i == aB) {
                bl.innerHTML = '<h1>' + dS[ej.getDay()] + ', ' + ej.getDate() + ' de ' + gp[ej.getMonth()] + '</h1>';
            } else {
                Z = document.createElement('A');
                Z.href = '#';
                Z.innerHTML = '' + dS[ej.getDay()] + ', ' + ej.getDate() + ' - ' + (ej.getMonth() + 1);
                bl.appendChild(Z);
                Z.id = i;
                Z.onclick = function() {
                    this.parentNode.parentNode.aR(this.id);
                    return false;
                }
            }
            D.appendChild(bl);
        }
        this.capaNavegacionDias.appendChild(D);
    };
    this.cD = function() {
        var aB = this.L;
        var Y = this.aG;
        this.capaNavegacionHoras.innerHTML = '';
        var D = document.createElement('UL');
        D.className = 'pestanas';
        D.TV = this;
        D.aR = function(fn, ga) {
            this.TV.mueveProgramacionHorizontalDia(fn, ga);
        };
        var activa = 'class="activa"';
        cj = '<li ' + (((Y >= 0) && (Y < 6)) ? activa : '') + '><a href="#" onclick=" this.parentNode.parentNode.aR(' + aB + ',0); return false;">Madrugada <em>(0h-6h)</em></a></li>';
        cj += '<li ' + (((Y >= 6) && (Y < 12)) ? activa : '') + '><a href="#" onclick=" this.parentNode.parentNode.aR(' + aB + ',6); return false;\">Mañana <em>(6h-12h)</em></a></li>';
        cj += '<li ' + (((Y >= 12) && (Y < 15)) ? activa : '') + '><a href="#" onclick=" this.parentNode.parentNode.aR(' + aB + ',12); return false;\">Sobremesa <em>(12h-15h)</em></a></li>';
        cj += '<li ' + (((Y >= 15) && (Y < 21)) ? activa : '') + '><a href="#" onclick=" this.parentNode.parentNode.aR(' + aB + ',15); return false;\">Tarde <em>(15h-21h)</em></a></li>';
        cj += '<li ' + (((Y >= 21) && (Y < 24)) ? activa : '') + '><a href="#" onclick=" this.parentNode.parentNode.aR(' + aB + ',21); return false;\">Noche <em>(21h-0h)</em></a></li>';
        D.innerHTML = cj;
        this.capaNavegacionHoras.appendChild(D);
    };
    this.cX = function() {
        var l = document.createElement('DIV');
        l.id = 'C';
        l.style.position = 'absolute';
        l.style.zIndex = parseInt2(this.capaProgramacion.style.zIndex) + 1;
        l.style.backgroundColor = '#FFFFFF';
        l.style.opacity = 0;
        l.style.MozOpacity = 0;
        l.style.filter = 'alpha(opacity=0)';
        l.style.top = 0 + 'px';
        l.style.left = 0 + 'px';
        this.capaProgramacion.parentNode.appendChild(l);
        this.C = l;
        this.C.TV = this;
        this.C.onmousedown = function() {
            this.TV.capaProgramacion.ad = true;
            this.TV.capaProgramacion.A = posRatonX - this.TV.capaProgramacion.style.left.substr(0, this.TV.capaProgramacion.style.left.length - 2);
            this.TV.capaProgramacion.P = posRatonY - this.TV.capaProgramacion.style.top.substr(0, this.TV.capaProgramacion.style.top.length - 2);
        };
        this.C.onmouseup = function() {
            if (this.TV.capaProgramacion.ad) {
                this.TV.capaProgramacion.ad = false;
                this.TV.H();
            }
            if (this.c != null) {
                this.c.className = '';
                this.c = null;
            }
        };
        this.C.onmouseout = function() {
            if (this.TV.capaProgramacion.ad) {
                this.TV.capaProgramacion.ad = false;
                this.TV.H();
            }
            if (this.c != null) {
                this.c.className = '';
                this.c = null;
            }
        }
    };
    this.H = function() {
        var cE = parseInt2(this.capaProgramacion.parentNode.offsetHeight);
        var cB = parseInt2(this.capaProgramacion.parentNode.offsetWidth);
        var bT = parseInt2(this.capaProgramacion.style.left.substr(0, this.capaProgramacion.style.left.length - 2));
        var ca = parseInt2(this.capaProgramacion.style.top.substr(0, this.capaProgramacion.style.top.length - 2));
        var fe = -ca - this.cA;
        var ff = -ca + this.cA + cE;
        var aQ = -bT - this.cL;
        var ak = -bT + cB + this.cL;
        var bR = 0;
        var aS = 0;
        var bQ = 0;
        var cw = 0;
        var aw = null;
        for (var i = 0; i < this.arrayCanales.length; ++i) {
            var af = parseInt2(i * this.B);
            if ((fe <= af) && (ff >= af)) {
                bR = 0;
                aS = 0;
                bQ = 0;
                for (var f = this.arrayCanales[i].J; f > 0; --f) {
                    aw = this.aC(aQ, ak, af, i, f - 1, false);
                    if (aw == 0) {
                        ++aS;
                        --bR;
                    } else if (aw == 2) {
                        ++bQ;
                        --bR;
                    } else if (aw == 1)
                        break;
                }
                cw = this.arrayCanales[i].aj;
                for (var f = 0; f < cw; ++f) {
                    aw = this.aC(aQ, ak, af, i, this.arrayCanales[i].J + this.arrayCanales[i].T + f, false);
                    if (aw == 0) {
                        ++aS;
                        --bQ;
                    } else if (aw == 1) {
                        ++bR;
                        --bQ;
                    } else if (aw == 2)
                        break;
                }
                if (aS != 0) {
                    cw = this.arrayCanales[i].J + this.arrayCanales[i].T;
                    for (var f = this.arrayCanales[i].J; f < cw; f++) {
                        aw = this.aC(aQ, ak, af, i, f, true);
                        if (aw == 0)
                        ++aS;
                        else if (aw == 1)
                        ++bR;
                        else if (aw == 2)
                        ++bQ;
                    }
                } else {
                    aS = this.arrayCanales[i].T;
                }
                this.arrayCanales[i].J = this.arrayCanales[i].J + bR;
                this.arrayCanales[i].T = aS;
                this.arrayCanales[i].aj = this.arrayCanales[i].aj + bQ;
            } else {
                if (this.arrayCanales[i].T != 0) {
                    for (var f = this.arrayCanales[i].J; f < this.arrayCanales[i].T + this.arrayCanales[i].J; ++f) {
                        var X = parseInt2((this.arrayCanales[i].t[f].aA - this.ba + (this.aP * 86400)) / this.n);
                        this.capaProgramacion.removeChild(document.getElementById(af + "x" + X));
                    }
                    this.arrayCanales[i].J = this.arrayCanales[i].J + this.arrayCanales[i].T + this.arrayCanales[i].aj;
                    this.arrayCanales[i].T = 0;
                    this.arrayCanales[i].aj = 0;
                }
            }
        }
        this.C.style.height = this.C.parentNode.offsetHeight + 'px';
        this.C.style.width = this.C.parentNode.offsetWidth + 'px';
    };
    this.aC = function(aQ, ak, af, canal, f, actual) {
        var I = this.arrayCanales[canal].t[f];
        var X = parseInt2((I.aA - this.ba + (this.aP * 86400)) / this.n);
        var bW = parseInt2(X + ((I.cb - I.aA) / this.n));
        if (((aQ <= X) && (ak >= X)) || ((aQ <= bW) && ((ak >= bW) || (ak > X)))) {
            if (!actual) {
                var eA = parseInt2(((I.cb - I.aA) / this.n) - 1);
                var F = document.createElement("DIV");
                F.id = af + 'x' + X;
                if (I.dL == 0) {
                    F.innerHTML = this.dU(I);
                } else
                    F.innerHTML = this.cQ(I);
                F.style.position = "absolute";
                F.className = "tipo_" + I.cP + "_";
                F.url = I.url;
                F.style.height = this.B + 'px';
                F.style.width = eA + 'px';
                F.style.top = af + 'px';
                F.style.left = X + 'px';
                this.capaProgramacion.appendChild(F);
            }
            return 0;
        } else if (actual) {
            this.capaProgramacion.removeChild(document.getElementById(af + "x" + X));
        }
        if (X < ak)
            return 1;
        if (X > aQ)
            return 2;
        return 0;
    };
    this.capaCanales.movimientoCapa = function() {
        if ((this.parentNode.offsetHeight > this.offsetHeight) || ((posRatonY - this.P) > 0)) {
            this.style.top = 0 + 'px';
        } else if ((posRatonY - this.P) < (this.parentNode.offsetHeight - this.offsetHeight)) {
            this.style.top = (this.parentNode.offsetHeight - this.offsetHeight) + 'px';
        } else {
            this.style.top = (posRatonY - this.P) + 'px';
        }
        this.TV.capaProgramacion.style.top = this.style.top;
    };
    this.dG = function() {
        var w = document.createElement("DIV");
        w.id = "ao";
        w.style.position = "absolute";
        w.style.zIndex = parseInt2(this.capaCanales.style.zIndex) + 1;
        w.style.backgroundColor = "#FFFFFF";
        w.style.opacity = 0;
        w.style.MozOpacity = 0;
        w.style.filter = "alpha(opacity=0)";
        w.style.width = this.capaCanales.style.width;
        w.style.top = 0 + 'px';
        w.style.left = 0 + 'px';
        this.capaCanales.parentNode.appendChild(w);
        this.ao = w;
        this.ao.TV = this;
        this.ao.onmousedown = function() {
            this.TV.capaCanales.ad = true;
            this.TV.capaCanales.A = posRatonX - this.TV.capaCanales.style.left.substr(0, this.TV.capaCanales.style.left.length - 2);
            this.TV.capaCanales.P = posRatonY - this.TV.capaCanales.style.top.substr(0, this.TV.capaCanales.style.top.length - 2);
        };
        this.ao.onmouseup = function() {
            this.TV.capaCanales.ad = false;
            this.TV.H();
        };
        this.ao.onmouseout = function() {
            this.TV.capaCanales.ad = false;
            this.TV.H();
        }
    };
    this.capaHorario.movimientoCapa = function() {
        if ((posRatonX - this.A) < (this.parentNode.offsetWidth - this.TV.aZ)) {
            this.style.left = (this.parentNode.offsetWidth - this.TV.aZ) + 'px';
        } else if ((posRatonX - this.A) > -(this.TV.aa)) {
            this.style.left = -(this.TV.aa) + 'px';
        } else if (this.parentNode.offsetWidth > this.offsetWidth) {
            this.style.left = "0px";
        } else if (this.parentNode.offsetWidth > this.offsetWidth) {
            this.style.left = "0px";
        } else if ((posRatonX - this.A) > 0) {
            this.style.left = "0px";
        } else if ((posRatonX - this.A) < (this.parentNode.offsetWidth - this.offsetWidth)) {
            this.style.left = (this.parentNode.offsetWidth - this.offsetWidth) + 'px';
        } else {
            this.style.left = (posRatonX - this.A) + 'px';
        }
        this.TV.capaProgramacion.style.left = this.style.left;
        this.TV.Q();
    };
    this.dI = function() {
        var v = document.createElement("DIV");
        v.id = "capaHorarioAux";
        v.style.position = "absolute";
        v.style.zIndex = parseInt2(this.capaHorario.style.zIndex) + 1;
        v.style.backgroundColor = "#FFFFFF";
        v.style.opacity = 0;
        v.style.MozOpacity = 0;
        v.style.filter = "alpha(opacity=0)";
        v.style.height = this.capaHorario.style.height;
        v.style.top = 0 + 'px';
        v.style.left = 0 + 'px';
        this.capaHorario.parentNode.appendChild(v);
        this.capaHorarioAux = v;
        this.capaHorarioAux.TV = this;
        this.capaHorarioAux.onmousedown = function() {
            this.TV.capaHorario.ad = true;
            this.TV.capaHorario.A = posRatonX - this.TV.capaHorario.style.left.substr(0, this.TV.capaHorario.style.left.length - 2);
            this.TV.capaHorario.P = posRatonY - this.TV.capaHorario.style.top.substr(0, this.TV.capaHorario.style.top.length - 2);
        };
        this.capaHorarioAux.onmouseup = function() {
            this.TV.capaHorari, ad = false;
            this.TV.H();
        };
        this.capaHorarioAux.onmouseout = function() {
            this.TV.capaHorario, ad = false;
            this.TV.H();
        }
    };
    this.mueveProgramacionVertical = function(bc) {
        if ((this.arrayCanales.length) > this.bU) {
            var aJ = bc * this.B;
            var aU = 0;
            if (this.capaCanales.style.top != '')
                aU = parseInt2(this.capaCanales.style.top.substr(0, this.capaCanales.style.top.length - 2));
            if ((aJ + aU) >= 0) {
                this.capaCanales.style.top = 0 + 'px';
                this.capaProgramacion.style.top = 0 + 'px';
            } else if ((aJ + aU) <= this.aN) {
                this.capaCanales.style.top = this.aN + 'px';
                this.capaProgramacion.style.top = this.aN + 'px';
            } else {
                this.capaCanales.style.top = (aJ + aU) + 'px';
                this.capaProgramacion.style.top = (aJ + aU) + 'px';
            }
            this.Q();
            this.H();
        }
    };
    this.mueveProgramacionHorizontal = function(fV) {
        var aJ = fV * (3600 / this.n);
        var capaHorarioLeft = parseInt2(this.capaHorario.style.left.substr(0, this.capaHorario.style.left.length - 2));
        if ((aJ + capaHorarioLeft) >= -(this.aa)) {
            this.capaHorario.style.left = -(this.aa) + 'px';
            this.capaProgramacion.style.left = -(this.aa) + 'px';
        } else if ((aJ + capaHorarioLeft) < (this.al)) {
            this.capaHorario.style.left = ((this.al) + 'px');
            this.capaProgramacion.style.left = ((this.al) + 'px')
        } else {
            this.capaHorario.style.left = (aJ + capaHorarioLeft) + 'px';
            this.capaProgramacion.style.left = (aJ + capaHorarioLeft) + 'px';
        }
        this.H();
        this.Q();
    };
    this.mueveProgramacionHorizontalDia = function(fn, ga, actual) {
        var pos = 0;
        if ((fn == this.aP) && actual)
            pos = -parseInt2(((this.bb - this.ba) + (86400 * this.aP) - 3600) / this.n);
        else
            pos = -(this.ap[fn] + ((3600 * ga) / this.n));
        if (pos >= -(this.aa)) {
            this.capaHorario.style.left = -(this.aa) + 'px';
            this.capaProgramacion.style.left = -(this.aa) + 'px';
        } else if (pos <= ((this.al) + 'px')) {
            this.capaHorario.style.left = ((this.al) + 'px');
            this.capaProgramacion.style.left = ((this.al) + 'px');
        } else {
            this.capaHorario.style.left = pos + 'px';
            this.capaProgramacion.style.left = pos + 'px';
        }
        this.H();
        this.Q("forze");
    };
    this.mueveProgramacionSuave = function(dB, cP) {
        if (!this.eV) {
            if (cP == 'horizontal')
                this.mueveProgramacionHorizontal(dB);
            else if (cP == 'vertical')
                this.mueveProgramacionVertical(dB);
            setTimeout('programacionTV.mueveProgramacionSuave(' + dB + ',"' + cP + '")', 50);
        } else {
            this.eV = false;
        }
    };
    this.pararMueveProgramacionSuave = function() {
        this.eV = true;
    };
    this.permitirMueveProgramacionSuave = function() {
        this.eV = false;
    };
    this.mueveProgramacionPasos = function(dB, cP) {
        if (cP == 'horizontal')
            this.mueveProgramacionHorizontal(dB);
        else if (cP == 'vertical')
            this.mueveProgramacionVertical(dB);
    };
    this.eC = function() {
        this.capaCanales.innerHTML = '';
        var bL = 0;
        for (var i = 0; i != this.arrayCanales.length; ++i) {
            var au = document.createElement("DIV");
            au.innerHTML = this.eF(this.arrayCanales[i].fz, this.arrayCanales[i].ax);
            au.style.position = "absolute";
            au.style.overflow = "hidden";
            au.style.height = this.B + 'px';
            au.style.top = bL + 'px';
            au.style.left = "0px";
            this.capaCanales.appendChild(au);
            bL += this.B;
        }
        this.capaCanales.style.height = bL + 'px';
        this.ao.style.height = this.capaCanales.parentNode.offsetHeight + 'px';
    };
    this.eD = function() {
        this.capaHorario.innerHTML = '';
        var aL = parseInt2(((this.aP + this.eH) * 86400) / this.n);
        var bz = 0;
        var i = 0;
        while (bz < (aL)) {
            if (i == 0)
                this.ap.push(bz - 50);
            var ah = document.createElement("DIV");
            ah.innerHTML = this.fg(i + ".00");
            ah.style.position = "absolute";
            ah.style.overflow = "hidden";
            ah.style.width = parseInt2(3600 / this.n) + 'px';
            ah.style.top = "0px";
            ah.style.left = bz + 'px';
            this.capaHorario.appendChild(ah);
            bz += parseInt2(3600 / this.n);
            if (i == 23) {
                i = 0;
            } else {
                ++i;
            }
        }
        this.capaHorario.style.width = aL + 'px';
        this.capaHorarioAux.style.width = this.capaHorarioAux.parentNode.offsetWidth + 'px';
    };
    this.eF = function(fW, ax) {
        var fC = "<img src=\"http://estaticos.elmundo.es" + fW + "\" alt=\"" + ax + "\" title=\"" + ax + "\" height=\"50\" width=\"50\">";
        return fC;
    };
    this.fg = function(ge) {
        var fS = "<div class=\"periodo1\"><strong>" + ge + "</strong></div>";
        return fS;
    };
    this.dU = function(programa) {
        var r = "<div class=\"infoPrincipal\"><span>&nbsp;" + programa.dA + "</span> ";
        if (programa.url != '')
            r += "<a href=\"" + programa.url + "\" class=\"titulo_programa\">" + programa.ax + "</a></div>";
        else
            r += "<strong>" + programa.ax + "</strong></div>";
        if (programa.bH != '')
            r += "<span class=\"informacionadicional\"> " + programa.bH + "</span>";
        var O = programa.O;
        if (O == "TP") {
            r += "<img style=\"position:absolute; margin-left: 5px; top:" + (this.B - 15) + "px;\" src=\"images/nrtp.gif\" alt=\"Programa recomendado para todos los públicos\">";
        } else if (O == "Infantil") {
            r += "<img style=\"position:absolute; margin-left: 5px; top:" + (this.B - 15) + "px;\" src=\"images/infantil.gif\" alt=\"Programa recomendado para la niños\">";
        } else if (O == "18") {
            r += "<img style=\"position:absolute; margin-left: 5px; top:" + (this.B - 15) + "px;\" src=\"images/nr18.gif\" alt=\"Programa no recomendado para menores de 18 años\">";
        } else if (O == "16") {
            r += "<img style=\"position:absolute; margin-left: 5px; top:" + (this.B - 15) + "px;\" src=\"images/nr16.gif\" alt=\"Programa no recomendado para menores de 16 años\">";
        } else if (O == "13") {
            r += "<img style=\"position:absolute; margin-left: 5px; top:" + (this.B - 15) + "px;\" src=\"images/nr13.gif\" alt=\"Programa no recomendado para menores de 13 años\">";
        } else if (O == "10") {
            r += "<img style=\"position:absolute; margin-left: 5px; top:" + (this.B - 15) + "px;\" src=\"images/nr10.gif\" alt=\"Programa no recomendado para menores de 10 años\">";
        } else if (O == "7") {
            r += "<img style=\"position:absolute; margin-left: 5px; top:" + (this.B - 15) + "px;\" src=\"images/nr7.gif\" alt=\"Programa no recomendado para menores de 7 años\">";
        } else if (O == "X") {
            r += "<img style=\"position:absolute; margin-left: 5px; top:" + (this.B - 15) + "px;\" src=\"images/nrx.gif\" alt=\"Programa calificado como X\">";
        }
        r = "<div>" + r + "</div>";
        return r;

    };
    this.cQ = function(programa) {
        var r = "&nbsp;" + programa.dA + " - " + programa.ax + " " + programa.bH + '';
        r = "<div><a href=\"" + ((programa.url != '') ? programa.url : '#') + "\" class=\"mas\"><img alt=\"mostrar información\" src=\"http://estaticos.elmundo.es/elmundo/iconos/v2.1/television/guiatv/mas.gif\"><span><div class=\"nombre\">" + r + "</div></span></a></div>";
        return r;
    };
    this.da = function(eU) {
        var ac = document.createElement("DIV");
        ac.id = "capaHoraActual";
        ac.style.position = "absolute";
        ac.style.overflow = "hidden";
        ac.style.height = this.capaProgramacion.style.height;
        ac.style.top = 0 + 'px';
        ac.style.left = eU + 'px';
        this.capaProgramacion.appendChild(ac);
    };
    this.abrePrograma = function() {
        if (!this.capaProgramacion.eX) {
            var url = this.capaProgramacion.cy();
            if (url != '')
                abrirCapa(url);
        }
    };
    this.aB = function() {
        var cc = -parseInt2(this.capaHorario.style.left.substring(0, this.capaHorario.style.left.length - 2));
        var length = this.ap.length;
        for (var i = 0; i < length - 1; ++i)
            if ((this.ap[i] <= cc) && (this.ap[i + 1] > cc)) {
                if (this.L != i) {
                    this.L = i;
                    return true;
                } else
                    return false;
            }
        if (this.ap[length - 1] <= cc) {
            if (this.L != length - 1) {
                this.L = length - 1;
                return true;
            } else
                return false;
        }
        this.L = 0;
        return true;
    };
    this.Y = function() {
        var cc = -parseInt2(this.capaHorario.style.left.substring(0, this.capaHorario.style.left.length - 2));
        var fH = this.ap[this.L];
        for (var i = 0; i < 24; ++i)
            if ((fH + ((i * 3600) / this.n) <= cc) && ((fH + (((i + 1) * 3600) / this.n)) > cc)) {
                if (this.aG != i) {
                    this.aG = i;
                    return true;
                } else
                    return false;
            }
        this.aG = 0;
        return true;
    };
    return this;
};
var posRatonX = 0;
var posRatonY = 0;

function gestMovimientoCapas(e) {
    var eS = posRatonX;
    var eO = posRatonY;
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
    if ((eS != posRatonX) || (eO != posRatonY)) {
        for (var i = 0; i != bD.length; ++i) {
            var o = document.getElementById(bD[i]);
            if (!o.ad) {
                if (!o.co) {
                    o.co = true;
                    o.dx();
                    o.co = false;
                }
            } else {
                break;
            }
        }
        var o;
        for (var i = 0; i != ab.length; ++i) {
            o = document.getElementById(ab[i]);
            if (o.ad) {
                o.movimientoCapa();
                break;
            }
        }
    }
};

function fu(o, gz) {
    var top = 0;
    for (var i = 0; i < gz; ++i) {
        top = top + o.offsetTop;
        o = o.parentNode;
    }
    return top;
};

function fc(o) {
    var left = 0;
    while (o.nodeName != "HTML") {
        left = left + o.offsetLeft;
        o = o.parentNode;
    }
    return left;
};

function finalizaMovimientoCapas() {
    for (var i = 0; i != ab.length; ++i) {
        var o = document.getElementById(ab[i]);
        if (o.ad) {
            o.ad = false;
        }
    }
};

function K(aY) {
    if (navigator.userAgent.toLowerCase().indexOf("msie") == -1)
        return az(aY);
    var x = 0;
    var parent = aY;
    while (parent) {
        var eB = 0;
        x += parent.offsetLeft - parent.scrollLeft + eB;
        parent = parent.offsetParent;
    }
    return x;
};

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
};

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
        box = document.getBoxObjectFor(el);
        pos = box.y;
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
};

function bx(gn) {
    cN = document.getElementById(gn);
    if (window.Event) {
        try {
            document.captureEvents(Event.MOUSEMOVE);
            document.captureEvents(Event.MOUSEUP);
            document.captureEvents(Event.MOUSEDOWN);
        } catch (e) {}
    }
    cN.onmousemove = gestMovimientoCapas;
    cN.onmouseup = finalizaMovimientoCapas;
    cN.onmousedown = cn;
    document.body.onselectstart = function() {
        return false;
    };
};

function cn(e) {
    if (!e)
        var e = window.event;
    if (typeof e.preventDefault == 'function' && e.cancelable) {
        gestMovimientoCapas(e);
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
    for (var i = 0; i != ab.length; ++i) {
        var o = document.getElementById(ab[i]);
        if (o.ad) {
            o.eX = false;
            break;
        }
    }
};

function toggle(dr) {
    var o = document.getElementById(dr);
    if (o.style.display == "block")
        o.style.display = "none";
    else
        o.style.display = "block";
};

function onClickSelectedChannel(dX) {
    if (!dX)
        return;
    if (document.getElementById('id_checkbox_canal_' + dX.value)) {
        document.getElementById('id_checkbox_canal_' + dX.value).checked = dX.checked;
    }
    if (dX.checked == false) {
        dX.parentNode.eN();
    }
};

function onClickChannel(dX) {
    if (!dX)
        return;
    cheker = V.getElementById('id_checkbox_canal_seleccionado_' + dX.value);
    if (cheker) {
        cheker.checked = dX.checked;
        if (!dX.checked) {
            cheker.parentNode.eN();
        }
    } else {
        if (dX.checked) {
            cF(dX.value, document.getElementById('nombre_canal_' + dX.value).innerHTML);
        }
    }
};

function cF(id, name) {
    var eK = V.createElement('DIV');
    eK.id = "canal_seleccionado_nuevo_" + id;
    eK.className = "canal_seleccionado nuevo";
    eK.innerHTML = "<input value=\"" + id + "\"" + " id = \"id_checkbox_canal_seleccionado_" + id + "\" " + "name = \"checkbox_canal_seleccionado_" + id + "\" type = \"checkbox\" checked " + "onclick = \"javascript:window.parent.onClickSelectedChannel(this);\" />" + "<div><span id=\"nombre_nuevo_canal_seleccionado_" + id + "\">" + name + "</span></div>";
    var eQ = V.getElementById('canales_seleccionados');
    if (eQ) {
        eQ.appendChild(eK); {
            var cN = eK.getElementsByTagName("SPAN")[0];
            var G = m.G;
            k = G.length;
            var cf = m.as[0];
            var aE;
            if (cf.be > 0) {
                aE = m.ds(cN, cf.be);
            } else {
                aE = cN;
            } {
                var g = V.createElement("DIV");
                g.className = m.bo;
                var du = new Date();
                g.id = m.bo + "_" + du.getTime();
                eQ.appendChild(g);
                var slot = new m.fq(g);
                slot.at();
                m.an[m.an.length] = slot;
            }
            var bJ = new m.Bloque(aE, '');
            G[k] = bJ;
            cN.className = "canalSeleccionado";
            bJ.cZ(cN.id);
            bJ.aV = function() {
                this.dK = this.className;
                this.className += " " + m.cH;
            };
            bJ.bs = function() {
                this.className = this.dK;
            };
            for (var bn = 0; bn < cf.cv.length; ++bn)
                bJ.cM(cf.cv[bn]);
        }
    }
};

function onCancelDialog() {
    location.href = "index.html";
};

function toggleClass(eE, dr) {
    var o = document.getElementById(dr);
    var eM = o.className;
    if (o.className.indexOf(eE) < 0) {
        if (eM != '') {
            eM = eM + " " + eE;
        } else
            eM = eE;
    } else
        eM = eM.replace(eE, '');
    o.className = eM;
};
var dE = 'popUp';
var dV = function() {
    var o = document.getElementById(dE);
    document.body.removeChild(o);
};
var abrirCapa = function(url) {
    if (url != undefined) {
        var o = document.createElement('DIV');
        o.id = dE;
        o.style.height = document.body.offsetHeight + 'px';
        var bd = document.createElement('DIV');
        bd.id = 'transparencia';
        bd.style.height = document.body.offsetHeight + 'px';
        bd.onclick = function() {
            dV();
            return false;
        };
        var cC = document.createElement('DIV');
        cC.id = 'popUpHija';
        cC.style.top = (ew() + parseInt2(et() / 4) - 10) + 'px';
        var dz = document.createElement('IMG');
        dz.id = 'cerrarPopUp';
        dz.src = 'http://estaticos.elmundo.es/elmundo/iconos/v2.1/television/guiatv/cerrar2.gif';
        dz.onclick = function() {
            dV();
            return false;
        };
        var frame = document.createElement('IFRAME');
        frame.src = url;
        frame.id = 'infoPopUp';
        frame.style.height = parseInt2(et() / 2) + 'px';
        cC.appendChild(dz);
        cC.appendChild(frame);
        o.appendChild(bd);
        o.appendChild(cC);
        document.body.appendChild(o);
    }
};
var ew = function() {
    if (self.pageYOffset) {
        return self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
        return document.documentElement.scrollTop;
    } else if (document.body) {
        return document.body.scrollTop;
    }
};
var et = function() {
    var bS;
    if (self.innerHeight) {
        bS = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        bS = document.documentElement.clientHeight;
    } else if (document.body) {
        bS = document.body.clientHeight;
    }
    return bS;
};
var V;
var m;
var cl = function() {
    var bE = '';
    for (var i = 0; i < canalesSeleccionados.length; ++i) {
        var bG = document.getElementById('id_checkbox_canal_' + canalesSeleccionados[i]);
        if (bG != null) {
            bG.checked = 'true';
            var cg = canalesSeleccionados[i];
            bE += '<div class="canal_seleccionado">' + '<input value="' + cg + '" id="id_checkbox_canal_seleccionado_' + cg + '" name="checkbox_canal_seleccionado_' + cg + '" type="checkbox" checked="checked" onclick="javascript:window.parent.onClickSelectedChannel(this);" /><div><span  class="canalSeleccionado">' + document.getElementById('nombre_canal_' + cg).innerHTML + '</span></div>' + '</div>';
        }
    }
    if (document.frames) {
        try {
            V = document.frames('id_canales_seleccionados').document;
            m = document.frames('id_canales_seleccionados').document.parentWindow;
        } catch (e) {
            var cz = document.getElementById('id_canales_seleccionados');
            V = cz.contentDocument;
            m = cz.contentWindow;
        }
    } else {
        var cz = document.getElementById('id_canales_seleccionados');
        V = cz.contentDocument;
        m = cz.contentWindow;
    }
    V.getElementById('canales_seleccionados').innerHTML = bE;
    m.fa();
};
var cargarJs = function(fo) {
    for (var i = 0; i < fo.length; ++i) {
        fI(eP + fo[i] + '.js');
    }
};
var fI = function(gr) {
    var gb = document.getElementsByTagName('head').item(0);
    var js = document.createElement('script');
    js.setAttribute('language', 'javascript');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', gr);
    gb.appendChild(js);
    return false;
};
var fD = 0;
var policiaJS = 0;
var dn = function(fG, bA) {
    fD = fG;
    bI(bA);
};

function bI(bA) {
    if ((bA > 0) && (policiaJS < fD)) {
        setTimeout('bI(' + (--bA) + ')', 100);
    } else {
        dP();
    }
    return true;
};
var dw = false;
var ck = function() {
    if (!dw)
        setTimeout('ck()', 100);
    else
        cl();
};

function ev(dQ, value, dY) {
    var eY = new Date();
    eY.setDate(eY.getDate() + dY);
    document.cookie = dQ + '=' + escape(value) + ((dY == null) ? '' : ';expires=' + eY.toGMTString())
};

function getCookie(dQ) {
    if (document.cookie.length > 0) {
        cV = document.cookie.indexOf(dQ + '=');
        if (cV != -1) {
            cV = cV + dQ.length + 1;
            fr = document.cookie.indexOf(';', cV);
            if (fr == -1)
                fr = document.cookie.length;
            return unescape(document.cookie.substring(cV, fr));
        }
    }
    return ''
};

function guardarCookieCanales() {
    er = '';
    var ef = V.getElementById('canales_seleccionados').getElementsByTagName('INPUT');
    for (var i = 0; i < ef.length; ++i) {
        if (ef[i].checked)
            er += ',' + ef[i].id.substring(31);
    }
    ev('elmundo_parrilla', er.substr(1), 3650);
};

function guardarCookieTiposCanales() {
    cY = '';
    var fy = document.getElementById('formularioresaltar').getElementsByTagName('INPUT');
    for (var i = 0; i < fy.length; ++i) {
        if (fy[i].checked)
            cY += ',' + fy[i].id;
    }
    ev('elmundo_parrilla_tipos', cY.substr(1), 3650);
};

function seleccionarCodigoPostal() {
    var cp = document.getElementById('cod_postal').value;
    cp = parseInt2(parseInt2(cp) / 1000);
    if (typeof(window['canalesAutonomicos_' + cp]) != 'undefined') {
        var eo = eval('canalesAutonomicos_' + cp);
        for (var i = 0; i < eo.length; ++i) {
            var dR = document.getElementById('id_checkbox_canal_' + eo[i]);
            dR.checked = true;
            dR.onclick();
        }
    }
};

function mostrarGuiaCanales(fZ) {
    var o = document.getElementById('formulario_guiacanales');
    if (fZ && (o.style.display == 'block')) {
        o.style.display = 'none';
    } else
        o.style.display = 'block';
    document.getElementById('contenedorPersonalizacionProgramacion').scrollIntoView(true);
}