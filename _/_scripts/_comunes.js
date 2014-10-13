 //
// Nombre:      comunes.js
// Version:     20061019
// Descripcion: Funciones comunes JS usadas por todo el portal elmundo.es.
// Copyright:   (c) Mundinteractivos - elmundo.es
//
//////
// 20120703 : Se anade la funcion controlDOM
// 20120123 : Se anade la funcion ajustaDominio
// 20111115 : Se anade recargarPixeles
// 20101028 : Se aniade funcion escribeIframe
// 20101027 : Se aniade escribereproductorFlashV3 para pasar ancho y alto de los fotogramas para hacerlo mas bonito
// 20090225 : Se anade addClass, delClass, delClassRetardo y addClassRetardo. Util para desplegables puntuales. Gestion de clases.
// 20090120 : Se cambia el detector de versiones de flash a unos mas escalable
// 20081112 : Cambios en EscribeReproductorFlashV2, parametros en flashvar
// 20081030 : Se añade la version 10 de flash
// 20080611 : Se anade 'escritura de nodos en tiempo de ejecucion' y 'reproduceItem y thisMovie' para operar con el reproductor
// 20080604 : Se anade EscribeReproductorFlashV2 y flash_id_v2, solo se cambia el valor que retornan y se fija wmode a opaque siempre!!!
// 20061019 : Recolocacion del fichero en el servidor y cambio de nombre.
//            Cambio del path del fichero "noflashc.swf".
// 20060802 : Definida nueva funcion EscribeReproductorFlash para usar el reproductor elastico de audio/video
// 20060517 : Aniadidas funciones para insertar objetos media player y applets
// 20060504 : Se permite devolver el codigo a la llamada de la funcion EscribeBloquePublicidadFlash pasando el parametro retornacodigo a true
// 20051110 : Se aniaden funciones para nuevos disenios css
// 20051021 : Modificacion funcion wRefresh para acceso a metodo scrolltop
// 20050715 : Se habilita soporte para version 8 de flash (damos margen hasta la 9)
// 20050512 : Se utiliza el nombre del swf para identificar del objeto flash o el que se pase por parametro idflash
// 20050319 : Se incluyen funciones para el sky deslizable y click en gifs de las creatividades
// 20050310 : Mejorada la deteccion de las versiones flash 5,6 y 7 en explorer
// 20050124 : Elimino la segmentacion para navegadores khtml
// 20050114 : Paso de parametro al tag del flash en EscribreGraficoFlash
//            con la url al directorio que contine en flash que se inserta
// 20040401 : Aniadida justificacion en funcion EscribeGraficoFlash
//	      y modificada la salida en caso de no disponer de flash
//
//////

//Notifica la inclusion o no del codigo
var JSIncludePubli = true;

var JSflashVersion = 0;
var JSflashVersion_DONTKNOW = -1;

function getFlashVersion() {
    if (JSflashVersion > 0) {
        return JSflashVersion;
    }
    
    
    playerVersion = [0, 0, 0], 
    d = null;
    if (typeof navigator.plugins != "undefined" && typeof navigator.plugins["Shockwave Flash"] == "object") {
        d = navigator.plugins["Shockwave Flash"].description;
        if (d && !(typeof navigator.mimeTypes != "undefined" && navigator.mimeTypes["application/x-shockwave-flash"] && !navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
            d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
            playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
            playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
            playerVersion[2] = /r/.test(d) ? parseInt(d.replace(/^.*r(.*)$/, "$1"), 10) : 0;
        }
    } 
    else if (typeof window.ActiveXObject != "undefined") {
        var a = null, fp6Crash = false;
        try {
            a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash" + ".7");
        } 
        catch (e) {
            try {
                a = new ("ShockwaveFlash.ShockwaveFlash" + ".6");
                playerVersion = [6, 0, 21];
                a.AllowScriptAccess = "always"; // Introduced in fp6.0.47
            } 
            catch (e) {
                if (playerVersion[0] == 6) {
                    fp6Crash = true;
                }
            }
            if (!fp6Crash) {
                try {
                    a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                } 
                catch (e) {
                }
            }
        }
        if (!fp6Crash && a) { // a will return null when ActiveX is disabled
            try {
                d = a.GetVariable("$version"); // Will crash fp6.0.21/23/29
                if (d) {
                    d = d.split(" ")[1].split(",");
                    playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                }
            } 
            catch (e) {
            }
        }
    }
    
    JSflashVersion = playerVersion[0];
    
    return JSflashVersion;
}

function flash_id(cadena) 
// devuelve un identificador para el objeto flash basado en el nombre del swf.
//nos quedamos con el nombre del swf sin path ni extension
{
    var patron = /.*\/([\w-]+)\.swf$/i;
    if (patron.test(cadena)) 
    {
        return (RegExp.$1);
    }
    return "PeliculaFlash";
}

// devuelve un identificador "UNICO" para el objeto flash basado en el nombre del swf.
//nos quedamos con el nombre del swf sin path ni extension y anadimos un timeStamp
function flash_id_v2(cadena) {
    
    var addName = '_' + Math.round(Math.random() * 100000000);
    var patron = /.*\/([\w-]+)\.swf$/i;
    if (patron.test(cadena)) {
        return (RegExp.$1) + addName;
    }
    return ("PeliculaFlash" + addName);

}


// Abre una nueva ventana cada vez que se pide
function abre_ventana_foto_grande(url, params) 
{
    var wname = Math.round(Math.random() * 100000000);
    window.open(url, wname, params);
}



//Escritura bloque flash para publicidad
//archivoswf: url al archivo swf
//cadenaclicktag: parametros  que se le pasa al swf (cadena completa desde ? incluido)
//ancho: dimension x
//alto: dimension y
//wmode:    window, opaque, transparent  Uno de ellos
//idflash : Nombre del objeto para referenciarlo desde js
//retornacodigo : booleano que indica si el objeto se escribe o se devuelve una cadena con el codigo
function EscribeBloquePublicidadFlash(archivoswf, cadenaclicktag, ancho, alto, wmode, idflash, retornacodigo, bgcolor) 
{
    if (idflash == "") 
    {
        idflash = flash_id(archivoswf);
    }
    if (wmode != "transparent") 
    {
        wmode = "opaque";
    }
    var cadena = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' + 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' + 'width="' + ancho + '" height="' + alto + '" id="' + idflash + '">\n';
    cadena = cadena + '<param name="movie" value="' + archivoswf + cadenaclicktag + '" />\n';
    cadena = cadena + '<param name="wmode" value="' + wmode + '" />\n';
    cadena = cadena + '<param name="quality" value="high" />\n';
    cadena = cadena + '<param name="allowScriptAccess" value="always" />\n';
    var colorstr = "";
    if (bgcolor) 
    {
        cadena = cadena + '<param name="bgcolor" value="' + bgcolor + '" />\n';
        colorstr = 'bgcolor=' + bgcolor + '"'
    }
    cadena = cadena + '<embed wmode="' + wmode + '" src="' + archivoswf + cadenaclicktag + '" quality="high" allowScriptAccess="always" ' + colorstr + ' menu="false" width="' + ancho + '" height="' + alto + '" name="' + idflash + '" type="application/x-shockwave-flash"' + ' pluginspage="http://www.macromedia.com/go/getflashplayer">\n';
    cadena = cadena + '</embed></object>';
    if (retornacodigo) 
    {
        return cadena;
    } 
    else 
    {
        document.write(cadena);
    }
}

//Utilizada en el caso del desplegable para salvar la patente de EOLAS
// Rellena el elemento id, con el codigo code
function writeCodeToElement(id, code) 
{
    var bloque = (typeof (id) == 'string') ? document.getElementById(id) : id;
    bloque.innerHTML = code;
}


//Escritura bloque flash para graficos
//archivoswf: url al archivo swf
//cadenaclicktag: parametros  que se le pasa al swf (cadena completa desde ? incluido)
//ancho: dimension x
//alto: dimension y
//wmode:    window (opaco) transparent (transparente)
//version: version para la que ha sido creado el swf
//justificacion : alineacion del grafico : right, left, center
function EscribeGraficoFlash(archivoswf, cadenaclicktag, ancho, alto, wmode, version, justificacion) 
{
    
    var LocalVersion = getFlashVersion();
    var cadena;
    if (wmode != "transparent") 
    {
        wmode = "opaque";
    }
    
    if (LocalVersion > 0) 
    {
        //Si no se dispone de la version adecuada mostramos un flash version 1, respetando las dimensiones
        if (LocalVersion < version) 
        {
            archivoswf = "http://cache.elmundo.es/js/data/noflashc.swf";
            cadenaclicktag = "?clickTag=http://www.macromedia.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash";
        //ancho = 300;
        //alto = 300;
        }
        //Escribimos el bloque
        //Reparamos la url al swf si es www.elmundo.es o elmundodeporte
        archivoswf = archivoswf.replace(/http:\/\/www\.elmundo\.es/i, "http:\/\/estaticos\.elmundo\.es");
        archivoswf = archivoswf.replace(/http:\/\/elmundodeporte\.elmundo\.es/i, "http:\/\/estaticos\.elmundo\.es");
        //Extraemos la url del swf
        var urlflash = "";
        var re_url = /(http:\/\/.*)\/[\w-]+\.swf$/i;
        
        if (re_url.test(archivoswf)) 
        {
            urlflash = RegExp.$1;
        }
        var idflash = flash_id(archivoswf);
        cadena = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' + 
        'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' + 
        'width="' + ancho + 
        '" height="' + alto + 
        '" align="' + justificacion + 
        '" id="' + idflash + '">\n';
        cadena = cadena + '<param name="movie" value="' + archivoswf + cadenaclicktag + '" />\n';
        cadena = cadena + '<param name="wmode" value="' + wmode + '" />\n';
        cadena = cadena + '<param name="quality" value="high" />\n';
        cadena = cadena + '<param name="menu" value="false" />\n';
        cadena = cadena + '<param name="allowScriptAccess" value="always" />\n';
        cadena = cadena + '<param name="flashvars" value="urldirectorioswf=' + urlflash + '" />\n';
        cadena = cadena + '<embed wmode="' + wmode + '" src="' + archivoswf + cadenaclicktag + '" quality="high" menu="false" width="' + ancho + '" height="' + alto + '" align="' + justificacion + '" name="' + idflash + '" flashvars="urldirectorioswf=' + urlflash + '" type="application/x-shockwave-flash" ' + ' pluginspage="http://www.macromedia.com/go/getflashplayer" allowScriptAccess="always">\n';
        cadena = cadena + '</embed>\n';
        cadena = cadena + '</object>\n';
        document.write(cadena);
    } 
    else 
    {
        cadena = '<table cellspacing="0" cellpadding="10" bgcolor="eeeeee" border="0" width="' + ancho + '" height="' + alto + '" align="' + justificacion + '"><tr><td align="center"><a href="http://www.macromedia.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" target="_blank">Instale el plug-in de Flash para ver correctamente este contenido</a></td></tr></table>\n'
        document.write(cadena);
    }
}

//Escritura bloque para videos
//archivowmv: url al archivo vmv
//ancho: dimension x
//alto: dimension y
//justificacion : alineacion del grafico : right, left, center
//autostart : true, false
function EscribeObjectVideo(archivowmv, ancho, alto, justificacion, autostart, retornaCodigo) 
{
    
    cadena = '<object CLASSID="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" id="reproductorwmv" ' + 
    'width="' + ancho + 
    '" height="' + alto + 
    '" align="' + justificacion + 
    '" type="application/x-oleobject">\n';
    cadena = cadena + '<param name="url" value="' + archivowmv + '" />\n';
    cadena = cadena + '<param name="AutoStart" value="' + autostart + '" />\n';
    cadena = cadena + '<embed type="application/x-mplayer2" src="' + archivowmv + '" width="' + ancho;
    cadena = cadena + '" height="' + alto + '" align="' + justificacion + '" autostart="' + autostart + '">\n';
    cadena = cadena + '</embed>\n';
    cadena = cadena + '</object>\n';

    //Escribimos el object
    if (retornaCodigo) 
    {
        return cadena;
    
    } 
    else 
    {
        document.write(cadena);
    }
}




//
//Escritura bloque applet de java
//

function CParametro(n, v) {
    this.nombre = n;
    this.valor = v;
}


function EscribeAppletJava(valor_code, valor_codebase, valor_name, valor_width, valor_height, array_parametros_applet) 
{
    
    var cadena = '<applet code="' + valor_code + '" codebase="' + valor_codebase + '" name="' + valor_name + 
    '" width=' + valor_width + ' height=' + valor_height + ' MAYSCRIPT>\n';

    // Se generan los parametros
    var numero_parametros = array_parametros_applet.length;
    
    for (var i = 0; i < numero_parametros; i++) {
        nuevo_parametro = array_parametros_applet[i];

        // Se obtienen el nombre y el valor de cada parametro
        nombre_parametro = nuevo_parametro.nombre;
        valor_parametro = nuevo_parametro.valor;
        cadena = cadena + '<param name="' + nombre_parametro + '" value="' + valor_parametro + '" />\n';
    
    }
    
    cadena = cadena + 'Java support is required for panoramic images.\n';
    cadena = cadena + '</applet>\n';

    // Se escribe la cadena
    document.write(cadena);
}



//Funcion para el click del anunciante
function clickAnunciante(url) 
{
    //Caso de existir url de enlace
    if (url.indexOf("+http%3A//+") == -1) 
    {
        window.open(url);
    }
}

//Codigo para creatividad de 240x500 deslizable
function Is() 
{ // convert all characters to lowercase to simplify testing
    var agt = navigator.userAgent.toLowerCase();
    
    this.major = parseInt(navigator.appVersion);
    this.minor = parseFloat(navigator.appVersion);
    
    this.nav = ((agt.indexOf('mozilla') != -1) && (agt.indexOf('spoofer') == -1) 
    && (agt.indexOf('compatible') == -1) && (agt.indexOf('opera') == -1) 
    && (agt.indexOf('webtv') == -1) && (agt.indexOf('hotjava') == -1));
    this.nav2 = (this.nav && (this.major == 2));
    this.nav3 = (this.nav && (this.major == 3));
    this.nav4 = (this.nav && (this.major == 4));
    this.nav4up = (this.nav && (this.major >= 4));
    this.navonly = (this.nav && ((agt.indexOf(";nav") != -1) || 
    (agt.indexOf("; nav") != -1)));
    this.nav6 = (this.nav && (this.major == 5));
    this.nav6up = (this.nav && (this.major >= 5));
    this.gecko = (agt.indexOf('gecko') != -1);
    
    
    this.ie = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
    this.ie3 = (this.ie && (this.major < 4));
    this.ie4 = (this.ie && (this.major == 4) && (agt.indexOf("msie 4") != -1));
    this.ie4up = (this.ie && (this.major >= 4));
    this.ie5 = (this.ie && (this.major == 4) && (agt.indexOf("msie 5.0") != -1));
    this.ie5_5 = (this.ie && (this.major == 4) && (agt.indexOf("msie 5.5") != -1));
    this.ie5up = (this.ie && !this.ie3 && !this.ie4);
    this.ie5_5up = (this.ie && !this.ie3 && !this.ie4 && !this.ie5);
    this.ie6 = (this.ie && (this.major == 4) && (agt.indexOf("msie 6.") != -1));
    this.ie6up = (this.ie && !this.ie3 && !this.ie4 && !this.ie5 && !this.ie5_5);
    this.mac = (agt.indexOf("mac") != -1);
    this.CSS1 = (document.compatMode == "CSS1Compat");
}

var is;
var isIE3Mac = false;
// this section is designed specifically for IE3 for the Mac

if ((navigator.appVersion.indexOf("Mac") != -1) && (navigator.userAgent.indexOf("MSIE") != -1) && 
(parseInt(navigator.appVersion) == 3))
    isIE3Mac = true;
else
    is = new Is();

function GetObjectStyle(objectId) {
    // cross-browser function to get an object's style object given its id
    if (document.layers && document.layers[objectId]) {
        // NN 4 DOM.. note: this won't find nested layers
        return document.layers[objectId];
    } else if (document.getElementById && document.getElementById(objectId)) {
        // W3C DOM
        return document.getElementById(objectId).style;
    } else if (document.all && document.all(objectId)) {
        // MSIE 4 DOM
        return document.all(objectId).style;
    } else {
        return false;
    }
} // GetObjectStyle

//Opciones de cerrar, maximizar, minimizar publicidad en Netscape
function cerrarPubNetscape() {
    document.Flotante.visibility = "hidden";
}

function miniPubNetscape() {
    document.Flotante.resizeTo(240, 11);
}

function maxiPubNetscape() {
    document.Flotante.resizeTo(240, 515);
}

//Opciones de cerrar, maximizar, minimizar publicidad en Explorer

function cerrarPubExplorer(capa) {
    if (document.all) 
    {
        document.all(capa).style.visibility = "hidden";
        document.all("anunciante").style.visibility = "hidden";
    } 
    else 
    {
        document.getElementById(capa).style.visibility = "hidden";
        document.getElementById("anunciante").style.visibility = "hidden";
    }
}

function miniPubExplorer(capa) {
    if (document.all) 
    {
        document.all(capa).style.clip = 'rect(' + 0 + ' ' + 240 + ' ' + 11 + ' ' + 0 + ')';
    } 
    else 
    {
        //document.getElementById(capa).style.clip =
        document.getElementById("anunciante").style.visibility = "hidden";
    }
}

function maxiPubExplorer(capa) {
    if (document.all) 
    {
        document.all(capa).style.clip = 'rect(' + 0 + ' ' + 240 + ' ' + 515 + ' ' + 0 + ')';
    } 
    else 
    {
        document.getElementById("anunciante").style.visibility = "visible";
    }
}

function wRefresh() 
{
    var distanciaTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) 
    {
        distanciaTop = document.documentElement.scrollTop;
    } 
    else 
    {
        if (window.pageYOffset) 
        {
            distanciaTop = window.pageYOffset;
        } 
        else 
        {
            distanciaTop = document.body.scrollTop;
        }
    }
    
    wMark.top = (posY + distanciaTop) + 'px';
}


//////////////////////////////////////////////////////////////////////////

function setVals() {

    //barW = 0; // scrollbar compensation for PC Nav
    //barH = 0;
    if (navDOM) 
    {
    //if (document.height > innerHeight) barW = 20;
    //	if (document.width > innerWidth) barH = 20;
    } 
    else 
    {
        innerWidth = document.body.clientWidth;
        innerHeight = document.body.clientHeight;
    }
    
    posX = 250;
    if (primeravez) 
    {
        posY = altura - 2;
    } 
    else 
    {
        posY = 2;
    }
    primeravez = false;
    wRefresh();
}

function pinta() 
{
    
    if (posY >= 29) 
    {
        posY -= 20;
        setTimeout('pinta()', 30);
    } 
    else 
    {
        posY = 2;
    }
    if ((is.nav4 || is.nav4up) && posY < 30 && !(is.CSS1)) 
    {
        markid = setInterval("wRefresh()", markRefresh);
    }
    wRefresh();
}

function markMe() {
    if (is.nav4) 
    {
        document.layers["Flotante"].visibility = "show";
    } 
    else 
    {
        var ObjectStyleBarra = GetObjectStyle("Flotante");
        var ObjectStyleCreatividad = GetObjectStyle("anunciante");
        if (ObjectStyleBarra) {
            ObjectStyleBarra.visibility = "visible";
        }
        if (ObjectStyleCreatividad) {
            ObjectStyleCreatividad.visibility = "visible";
        }
    }
    if ((is.ie5up || is.nav4up) && !(is.mac)) 
    {
        setVals();
        if (!is.CSS1) 
        {
            window.onresize = setVals;
            window.onscroll = setVals;
        }
        pinta();
    }
}


// Aumentar y disminuir letra

var tamanoLetrapordefecto = 5;
var tamanoLetra = tamanoLetrapordefecto;
var tamanoLetraminimo = 3;
var tamanoLetramaximo = 7;
var identidadLetra;

function aumentaLetra() {
    if (tamanoLetra < tamanoLetramaximo) {
        tamanoLetra += 1;
        identidadLetra = document.getElementById('tamano');
        identidadLetra.className = 'tamanoletra' + tamanoLetra;
    }
}

function disminuyeLetra() {
    if (tamanoLetra > tamanoLetraminimo) {
        tamanoLetra -= 1;
        identidadLetra = document.getElementById('tamano');
        identidadLetra.className = 'tamanoletra' + tamanoLetra;
    }
}

// FIN Aumentar y disminuir letra

function imprimir() {
    window.print();
}


//Menu desplegable Otras Secciones

function despliegaOS(estado) {
    
    if (document.getElementById) {
        var boton = document.getElementById("boton");
        boton.setAttribute("href", "#");
        var menu = document.getElementById("caja").firstChild;
        while (menu.nodeType != 1) {
            menu = menu.nextSibling;
        }
        ponClaseOS(boton, estado);
        ponClaseOS(menu, estado);
    }
}

function despliegaOSPortada(estado) {
    
    if (document.getElementById) {
        var boton = document.getElementById("boton");
        boton.setAttribute("href", "#");
        var menuDiv = document.getElementById("caja").firstChild;
        while (menuDiv.nodeType != 1) {
            menuDiv = menuDiv.nextSibling;
        }
        var botonDiv = document.getElementById("boton").firstChild;
        while (botonDiv.nodeType != 1) {
            botonDiv = botonDiv.nextSibling;
        }
        ponClaseOS(botonDiv, estado);
        ponClaseOS(menuDiv, estado);
    }
}

function obtenClaseOS(elemento) {
    
    if (elemento.getAttribute("class")) {
        return elemento.getAttribute("class");
    } 
    
    else 
    
    if (elemento.getAttribute("className")) {
        return elemento.getAttribute("className");
    }
}


function ponClaseOS(elemento, valorClase) {
    
    if (elemento.setAttribute("class", valorClase)) {
        elemento.setAttribute("class", valorClase);
    } 
    
    else 
    
    if (elemento.setAttribute("className", valorClase)) {
        elemento.setAttribute("className", valorClase);
    }
}

// FIN Menu desplegable Otras Secciones


// Estadisticas de resoluciones
function inserta_pixel_resoluciones() 
{
    var screenWidth = screen.width;
    var screenHeight = screen.height;
    
    var browserWidth;
    var browserHeight;
    
    var random = Math.random() * 1000000000;
    var re = /\s/g;
    var agent = navigator.userAgent.toLowerCase().replace(re, "_");
    
    if (document.all) 
    {
        browserWidth = document.body.clientWidth;
        browserHeight = document.body.clientHeight;
    } 
    else 
    {
        browserWidth = innerWidth;
        browserHeight = innerHeight;
    }
    document.write('<!--- ##IBEXCLU ---><!-- INICIO PIXELCOUNTER --><div style="position:absolute;top:0px;left:0px;width:1px;height:1px;visibility:hidden;z-Index:2"><img src="http://anapixel.elmundo.es/banner.gif?campaign=generico&group=generico&page=generico&creativity=generico&endpartialtimestamp=77359400&sign=BA4A9F01B3AFADEF9D0003A96FBDEF6D&type=' + 
    escape('S' + screenWidth + 'x' + screenHeight + '.B' + browserWidth + 'x' + browserHeight + ".U" + agent) + 
    '&rnd=' + random + '" width="1" height="1" border="0" alt="anapixel" /></div><!-- FIN PIXELCOUNTER --><!--- ##FBEXCLU --->');
}

//inserta_pixel_resoluciones();


// Estadisticas de version de flash
function inserta_pixel_versionflash() 
{
    var version = getFlashVersion();
    var random = Math.random() * 1000000000;
    document.write('<!--- ##IBEXCLU ---><!-- INICIO PIXELCOUNTER --><div style="position:absolute;top:0px;left:0px;width:1px;height:1px;visibility:hidden;z-Index:2"><img src="http://anapixel.elmundo.es/banner.gif?campaign=generico&group=generico&page=generico&creativity=generico&endpartialtimestamp=77359400&sign=BA4A9F01B3AFADEF9D0003A96FBDEF6D&type=flashversion' + 
    version + '&rnd=' + random + '" width="1" height="1" border="0" alt="anapixel" /></div><!-- FIN PIXELCOUNTER --><!--- ##FBEXCLU --->');
}

//inserta_pixel_versionflash();

function EscribeReproductorFlash(archivoswf, parametros, ancho, alto, retornaCodigo) 
{
    var LocalVersion = getFlashVersion();
    var cadena = "";
    var wmode = (parametros.indexOf('mini=si') != -1);
    
    
    parametros += "&amp;referer=" + document.location;
    
    if (LocalVersion > 0) 
    {
        // Si no se dispone de la version adecuada mostramos un flash version 1, respetando las dimensiones
        if (LocalVersion < 7) 
        {
            archivoswf = "http://cache.elmundo.es/js/data/noflashc.swf";
            parametros = "?clickTag=http://www.macromedia.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash";
        //ancho = 300;
        //alto = 300;
        } 
        else 
        {
            if (LocalVersion > 7) 
            {
                archivoswf = archivoswf.replace(/reproductorelastico\.swf/, "reproductorelastico_flash8\.swf");
            }
        }
        // Escribimos el bloque
        // Reparamos la url al swf si es www.elmundo.es o elmundodeporte
        archivoswf = archivoswf.replace(/http:\/\/www\.elmundo\.es/i, "http:\/\/estaticos\.elmundo\.es");
        archivoswf = archivoswf.replace(/http:\/\/elmundodeporte\.elmundo\.es/i, "http:\/\/estaticos\.elmundo\.es");
        // Extraemos la url del swf
        var urlflash = "";
        var re_url = /(http:\/\/.*)\/[w-]+\.swf$/i;
        
        if (re_url.test(archivoswf)) 
        {
            urlflash = RegExp.$1;
        }
        
        var idflash = flash_id(archivoswf);
        cadena = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' + 
        'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' + 
        'width="' + ancho + 
        '" height="' + alto + 
        '" id="' + idflash + '">\n';
        cadena = cadena + '<param name="movie" value="' + archivoswf + parametros + '" />\n';
        cadena = cadena + '<param name="quality" value="high" />\n';
        //cadena = cadena + '<param name="scale" value="exactfit" />\n';
        if (wmode) {
            cadena = cadena + '<param name="wmode" value="transparent" />\n';
        } else {
            cadena = cadena + '<param name="allowFullScreen" value="true" />\n';
        }
        cadena = cadena + '<param name="menu" value="false" />\n';
        cadena = cadena + '<param name="allowScriptAccess" value="always"/>\n';
        cadena = cadena + '<param name="flashvars" value="urldirectorioswf=' + urlflash + '" />\n';
        cadena = cadena + '<embed src="' + archivoswf + 
        parametros + 
        '" quality="high" menu="false"  width="' + ancho + 
        '" height="' + alto + 
        '" name="' + idflash + '"' + 
        (wmode ? ' wmode="transparent" ' : ' allowFullScreen="true" ') + 
        '  allowScriptAccess=always "' + 
        '" flashvars="urldirectorioswf=' + urlflash + 
        '" type="application/x-shockwave-flash" ' + 
        ' pluginspage="http://www.macromedia.com/go/getflashplayer">\n';
        cadena = cadena + '</embed>\n';
        cadena = cadena + '</object>\n';
    } 
    else 
    {
        cadena = '<table cellspacing="0" cellpadding="10" bgcolor="eeeeee" border="0" width="' + ancho + 
        '" height="' + alto + 
        '"><tr><td align="center"><a href="http://www.macromedia.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" target="_blank">Instale el plug-in de Flash para ver correctamente este contenido</a></td></tr></table>\n'
    }
    if (retornaCodigo) 
    {
        return cadena;
    } 
    else 
    {
        document.write(cadena);
    }
}









// Idem EscribeReproductorFlash
// retorna el id unico del objeto para manipularlo desde js
function EscribeReproductorFlashV2(archivoswf, parametros, ancho, alto, retornaCodigo) 
{
    var LocalVersion = getFlashVersion();
    var cadena = "";
    
    
    parametros += "&amp;referer=" + document.location;
    
    if (LocalVersion > 0) 
    {
        // Si no se dispone de la version adecuada mostramos un flash version 1, respetando las dimensiones
        if (LocalVersion < 7) 
        {
            archivoswf = "http://cache.elmundo.es/js/data/noflashc.swf";
            parametros = "?clickTag=http://www.macromedia.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash";
        } 
        else 
        {
            if (LocalVersion > 7) 
            {
                archivoswf = archivoswf.replace(/reproductorelastico\.swf/, "reproductorelastico_flash8\.swf");
            }
        }
        // Escribimos el bloque
        // Reparamos la url al swf si es www.elmundo.es o elmundodeporte
        archivoswf = archivoswf.replace(/http:\/\/www\.elmundo\.es/i, "http:\/\/estaticos\.elmundo\.es");
        archivoswf = archivoswf.replace(/http:\/\/elmundodeporte\.elmundo\.es/i, "http:\/\/estaticos\.elmundo\.es");
        // Extraemos la url del swf
        var urlflash = "";
        var re_url = /(http:\/\/.*)\/[w-]+\.swf$/i;
        
        if (re_url.test(archivoswf)) {
            urlflash = RegExp.$1;
        }
        
        var idflash = flash_id_v2(archivoswf);
        
        parametros = parametros.replace('?', '');
        
        cadena = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' + 
        'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" ' + 
        'width="' + ancho + 
        '" height="' + alto + 
        '" id="' + idflash + '">\n';
        cadena = cadena + '<param name="movie" value="' + archivoswf + '" />\n';
        cadena = cadena + '<param name="quality" value="high" />\n';
        //cadena = cadena + '<param name="scale" value="exactfit" />\n';
        cadena = cadena + '<param name="wmode" value="opaque" />\n';
        cadena = cadena + '<param name="allowFullScreen" value="true" />\n';
        cadena = cadena + '<param name="menu" value="false" />\n';
        cadena = cadena + '<param name="allowScriptAccess" value="always"/>\n';
        cadena = cadena + '<param name="flashvars" value="urldirectorioswf=' + urlflash + '&' + parametros + '" />\n';
        
        cadena = cadena + '<embed src="' + archivoswf + 
        '" quality="high" menu="false"  width="' + ancho + 
        '" height="' + alto + 
        '" name="' + idflash + '"' + 
        '  wmode="opaque"  allowFullScreen="true" ' + 
        '  allowScriptAccess="always' + 
        '" flashvars="urldirectorioswf=' + urlflash + '&' + parametros + 
        '" type="application/x-shockwave-flash" ' + 
        ' pluginspage="http://www.macromedia.com/go/getflashplayer">\n';
        cadena = cadena + '</embed>\n';
        cadena = cadena + '</object>\n';
    } 
    else 
    {
        cadena = '<table cellspacing="0" cellpadding="10" bgcolor="eeeeee" border="0" width="' + ancho + 
        '" height="' + alto + 
        '"><tr><td align="center"><a href="http://www.macromedia.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" target="_blank">Instale el plug-in de Flash para ver correctamente este contenido</a></td></tr></table>\n'
    }
    if (retornaCodigo) 
    {
        return cadena;
    } 
    else 
    {
        document.write(cadena);
        return idflash;
    }

}


//escritura de nodos en tiempo de ejecucion
var createElement = function(element, attr, events, child) {
    var el = document.createElement(element);
    if (attr != undefined)
        for (var i in attr) {
            if (i == 'class')
                el.className = attr[i];
            else if (i == 'style') {
                for (var j in attr[i]) {
                    eval('el.style.' + j + '=attr["' + i + '"]["' + j + '"]');
                }
            } else
                el.setAttribute(i, attr[i]);
        }
    if (events != undefined)
        for (var i in events)
            el[i] = events[i];
    if (child != undefined)
        for (var i in child) {
            try {
                el.appendChild(child[i]);
            } catch (e) {
            }
        }
    return el;
};
var createTextElement = function(text) {
    return document.createTextNode(text);
};
var $ = function(id) {
    return document.getElementById(id)
};
var $_$ = createElement;
var $_$_ = createTextElement;
//fin escritura de nodos en tiempo de ejecucion

//comunicacion con el reproductor
function reproduceItem(id, url, texto, fecha, img, autoreproduccion, href_noticia) {
    var objeto = thisMovie(id);
    objeto.reproduceItem(url, texto, fecha, img, autoreproduccion, href_noticia);
}


//Carga objeto flash
function thisMovie(movieName) {
    if (navigator.appName.indexOf("Microsoft") != -1)
        return window[movieName];
    else
        return document[movieName];
}

//gestion de clases
function addClass(id, className, duplicar) {
    var n = $(id);
    var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
    if (!((duplicar == undefined || duplicar == false) && pattern.test(n.className))) {
        n.className += ' ' + className;
    }
}

function delClass(id, className) {
    var n = $(id);
    var pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");
    n.className = n.className.replace(pattern, ' ');
}

function delClassRetardo(id, className) {
    var n = $(id);
    clearInterval(n.interval_delclass);
    n.interval_delclass = setTimeout('delClass("' + id + '","' + className + '")', 1000);
}

function addClassRetardo(id, className, duplicar) {
    var n = $(id);
    clearInterval(n.interval_delclass);
    addClass(id, className, duplicar);
}


// nuevos ajustes para reproductor flash

//Escritura del resproduccion en tiempo de ejecucion
//node: Elemento padre, donde se pintara el reproductor
// archivoswf: url al archivo swf
//parametros: parametros del flash
//ancho: dimension x
//alto: dimension y

function pintaReproductorLive(node, archivoswf, parametros, ancho, alto) {
    
    node.innerHTML = controlMultimedia("video", "", ancho, alto, true, archivoswf, parametros);
}


//Escritura del resproduccion en tiempo de ejecucion modifcando alto y ancho de la capa que lo contine
//node: Elemento padre, donde se pintara el reproductor
// archivoswf: url al archivo swf
//parametros: parametros del flash
//ancho: dimension x
//alto: dimension y

function pintaReproductorLiveV2(node, archivoswf, parametros, ancho, alto) {

    // Modificamos ancho y alto de la capa para meter el video dentro 
    node.style.height = alto + "px";
    node.style.width = ancho + "px";
    
    node.innerHTML = controlMultimedia("video", "", ancho, alto, true, archivoswf, parametros);

}


//Escritura del resproduccion en tiempo de ejecucion
//archivoswf: url al archivo swf
//parametros: parametros del flash
//ancho: dimension x
//alto: dimension y
//imagen: imagen que sustituira al flash
// funcion_adicional_str anade un str al onclick de la imagen del repro

function EscribeReproductorFlashPrevisualizacion(archivoswf, parametros, ancho, alto, imagen, funcion_adicional_str) {

    // COMPROBAR SI ES HTML5

    // COMPROBAR SI ES QUICKTIME


    // SI ES FLASH --->>>
    
    var LocalVersion = getFlashVersion();
    parametros += "&autoStart=si";
    var className = 'boton_play';
    var functionClick = '';
    if (LocalVersion == 0) {
        className += ' no_flash';
        functionClick = 'this.className = \'' + className + ' activo\'; window.open(\'http://www.adobe.com/go/getflashplayer\'); return false;';
    } else {
        if (LocalVersion < 8) {
            className += ' actualice_flash';
            functionClick = 'this.className = \'' + className + ' activo\'; window.open(\'http://www.adobe.com/go/getflashplayer\'); return false;';
        } else {
            className += '';
            functionClick = 'pintaReproductorLive(this.parentNode,\'' + archivoswf + '\' , \'' + parametros + '\' , ' + ancho + ' , ' + alto + ');'
            
            if (funcion_adicional_str != undefined) {
                functionClick = funcion_adicional_str + ' ' + functionClick;
            }
            
            functionClick += ' return false;'
        
        }
    }
    var clickable = '<a class="' + className + '" onclick="' + functionClick + '" href="#" >play</a>';
    document.write('<div class="cubre_reproductor"  style="display:block; height:' + alto + 'px; width:' + ancho + 'px">' + clickable + 
    '<img src="' + imagen + '" style="display:block; height:' + alto + 'px; width:' + ancho + 'px" /></div>');
}



//Escritura del resproduccion en tiempo de ejecucion
//archivoswf: url al archivo swf
//parametros: parametros del flash
//ancho: dimension x
//alto: dimension y
//imagen: imagen que sustituira al flash
// funcion_adicional_str anade un str al onclick de la imagen del repro

function EscribeReproductorFlashPrevisualizacionV2(archivoswf, ruta, parametros, ancho, alto, imagen, funcion_adicional_str) {
    
    
    
    var plataforma = compruebaPlataforma();
    var className = 'boton_play';
    var functionClick = '';
    
    
    
    
    if (plataforma == "flash") 
    {
        var LocalVersion = getFlashVersion();
        parametros += "&autoStart=si";
        
        if (LocalVersion == 0) {
            className += ' no_flash';
            functionClick = 'this.className = \'' + className + ' activo\'; window.open(\'http://www.adobe.com/go/getflashplayer\'); return false;';
        } else {
            if (LocalVersion < 8) {
                className += ' actualice_flash';
                functionClick = 'this.className = \'' + className + ' activo\'; window.open(\'http://www.adobe.com/go/getflashplayer\'); return false;';
            } else {
                className += '';
                functionClick = 'pintaReproductorLive(this.parentNode,\'' + archivoswf + '\' , \'' + parametros + '\' , ' + ancho + ' , ' + alto + ');'
                
                if (funcion_adicional_str != undefined) {
                    functionClick = funcion_adicional_str + ' ' + functionClick;
                }
                
                functionClick += 'return false;'
            
            }
        }
    } 
    else 
    {
        
        functionClick = "this.parentNode.innerHTML = controlMultimedia('video','" + ruta + "'," + ancho + "," + alto + ",true,'','','','" + plataforma + "')";
    
    }
    
    
    var clickable = '<a class="' + className + '" onclick="' + functionClick + '" href="javascript:void(0);" >play</a>';
    document.write('<div class="cubre_reproductor"  style="display:block; height:' + alto + 'px; width:' + ancho + 'px">' + clickable + 
    '<img src="' + imagen + '" style="display:block; height:' + alto + 'px; width:' + ancho + 'px" /></div>');

}



//Escritura del resproduccion en tiempo de ejecucion
//archivoswf: url al archivo swf
//parametros: parametros del flash
//ancho: dimension x
//alto: dimension y
//imagen: imagen que sustituira al flash
// funcion_adicional_str anade un str al onclick de la imagen del repro
// anchoImg
// altoImg

function EscribeReproductorFlashPrevisualizacionV3(archivoswf, ruta, parametros, ancho, alto, imagen, funcion_adicional_str, anchoImg, altoImg) {
    
    
    
    var plataforma = compruebaPlataforma();
    var className = 'boton_play';
    var functionClick = '';
    
    
    
    
    if (plataforma == "flash") 
    {
        var LocalVersion = getFlashVersion();
        parametros += "&autoStart=si";
        
        if (LocalVersion == 0) {
            className += ' no_flash';
            functionClick = 'this.className = \'' + className + ' activo\'; window.open(\'http://www.adobe.com/go/getflashplayer\'); return false;';
        } else {
            if (LocalVersion < 8) {
                className += ' actualice_flash';
                functionClick = 'this.className = \'' + className + ' activo\'; window.open(\'http://www.adobe.com/go/getflashplayer\'); return false;';
            } else {
                className += '';
                functionClick = 'pintaReproductorLiveV2(this.parentNode,\'' + archivoswf + '\' , \'' + parametros + '\' , ' + ancho + ' , ' + alto + ');'
                
                if (funcion_adicional_str != undefined) {
                    functionClick = funcion_adicional_str + ' ' + functionClick;
                }
                
                functionClick += 'return false;';
            
            }
        }
    } 
    else 
    {
        
        
        functionClick = "this.parentNode.style.width='" + ancho + "px'; this.parentNode.style.height='" + alto + "px'; this.parentNode.innerHTML = controlMultimedia('video','" + ruta + "'," + ancho + "," + alto + ",true,'','','','" + plataforma + "')";
    
    }
    
    
    var clickable = '<a class="' + className + '" onclick="' + functionClick + '" href="javascript:void(0);" >play</a>';
    document.write('<div class="cubre_reproductor"  style="display:block; height:' + altoImg + 'px; width:' + anchoImg + 'px">' + clickable + 
    '<img src="' + imagen + '" style="display:block; height:' + altoImg + 'px; width:' + anchoImg + 'px" /></div>');

}






// escribeGlobo Escribe el logo de elmundo.es en su version flash
// params son los parametros de escritura, de momento no se utiliza y 
//   se pasa como null, sera un Array de parametros
// retornacodigo Si es true la función retorna la cadena con el object
//    y el embed si es false se vale del document.wirte para pintarla

function escribeGlobo(params, retornacodigo) {
    
    if (getFlashVersion() < 8)
        return false;
    
    var ancho = 40;
    var alto = 46;
    var idflash = "mundo_girando";
    var archivoswf = 'http://estaticos.elmundo.es/iconos/flash/mundo_girando.swf';
    
    var cadena = '<object id="' + idflash + '"  classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" width="' + ancho + '"  height="' + alto + '" >\n' 
    + '      <param name="movie" value="' + archivoswf + '" /> \n' 
    + '      <param name="wmode" value="transparent" />\n' 
    + '      <param name="quality" value="high" />\n' 
    + '      <param name="allowScriptAccess" value="always" />\n' 
    + '      <embed wmode="transparent" src="' + archivoswf + '" quality="high"  allowScriptAccess="always"   menu="false" width="' + ancho + '" height="' + alto + '" name="' + idflash + '" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"> </embed>' 
    + ' </object>';
    
    if (retornacodigo) {
        return cadena;
    } else {
        document.write(cadena);
    }

}

var script_fb_control = false;

function poneme_facebook() 
{
    if (script_fb_control)
        return false;
    var script_fb = document.createElement('SCRIPT');
    script_fb.src = "http://www.facebook.com/connect.php/js/FB.SharePro/";
    script_fb.type = "text/javascript";
    document.getElementsByTagName('BODY')[0].appendChild(script_fb);
    script_fb_control = true;
}




/* FUNCIONES CONTROL MULTIMEDIA */
/********************************/


function undo_root13(ls_cadena) 
{
    var resultado = "";
    for (var i = 0; i < ls_cadena.length; i++) 
    {
        c = ls_cadena[i].charCodeAt(0);
        
        if (c >= 'n'.charCodeAt(0) && c <= 'z'.charCodeAt(0) || c >= 'N'.charCodeAt(0) && c <= 'Z'.charCodeAt(0))
            c -= 13;
        else if (c >= 'a'.charCodeAt(0) && c <= 'm'.charCodeAt(0) || c >= 'A'.charCodeAt(0) && c <= 'M'.charCodeAt(0))
            c += 13;
        
        
        resultado += String.fromCharCode(c);
    
    
    }
    
    return resultado;
}


function addStyles(file_name) 
{
    var headID = document.getElementsByTagName("head")[0];
    var cssNode = document.createElement('link');
    cssNode.type = 'text/css';
    cssNode.rel = 'stylesheet';
    cssNode.href = file_name;
    cssNode.media = 'screen';
    headID.appendChild(cssNode);
}

function escribeAlbum(ruta, ancho, alto, estilos, id) 
{
    
    
    var reproductor_imagenes = (
    {
        rp_idImgReproductor: id + 'contenedorImagenes',
        rp_idImagen: id + 'idImagen',
        rp_idContenedor: id + 'contenedor_reproductor',
        rp_idBotonera: id + 'botonera_reproductor',
        rp_claseSeleccionada: 'seleccionada',
        rp_clasebotonera: 'sinSeleccionar',
        rp_idPieFoto: id + 'pie_foto',
        rp_botonNext: id + 'boton_next',
        rp_botonPrev: id + 'boton_prev',
        rp_botonAuto: id + 'boton_auto',
        rp_autoClass: 'rp_autoClass',
        rp_autoClassStop: 'rp_autoClassStop',
        rp_delay: 2000,
        rp_actual: 0,
        rp_xml: ruta,
        rp_ancho: ancho,
        rp_alto: alto,
        rp_domPregenerado: true
    
    });
    
    reproductorImagenes(reproductor_imagenes);
    addStyles(estilos);
}



function ieVersion() {
    if (isIE())
        return parseFloat(navigator.appVersion.split("MSIE")[1]);
    else
        return 0;
}

function isIE() {
    return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
}

function isSafary() {
    return navigator.userAgent.match(/safari/i) != null;
}

function isIpad() {
    return navigator.userAgent.match(/iPad/i) != null;
}
function isIphone() {
    return navigator.userAgent.match(/iPhone/i) != null;
}
function isChrome() {
    return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}

function isFlash() {
    
    if (getFlashVersion() > 8)
        return true;
    else
        return false;

}


function compruebaPlataforma()  //(node, archivoswf, parametros ,ancho, alto)
{

    // If quicktime
    if (isIpad() || isIphone()) 
    {
        return "quicktime";
    } 
    else if (isFlash()) 
    {
        return "flash";
    } 
    // If HTML5
    else 
    {
        return "html5";
    }

}




function html5Player(ruta, ancho, alto, tipo, retornaCodigo, id) {
    if (tipo == 'audio') {
        var cadena = '<audio id="' + id + '" src="' + ruta + '" autoplay="true" width="' + ancho + '" height="' + alto + '" controls="controls">Tu navegador no soporta html5</audio>';
    } 
    else if (tipo == 'video') {
        var cadena = "<video id='" + id + "'  autoplay='true' width='" + ancho + "' height='" + alto + "' controls='controls' >";
        cadena += "<source src='" + ruta + "' type=\"video/mp4; codecs='amp4v.20.8, mp4a.40.2\">";
        cadena += "</video>";
    }
    if (retornaCodigo)
        return cadena;
    else
        document.write(cadena);
}




function quickTimePlayer(ruta, ancho, alto, retornaCodigo, autoplay, id) {
    
    var cadena = '<embed id="' + id + '" class="quicktime" scale="tofit" src="' + ruta + '" width="' + ancho + '" height="' + alto + '" autoplay="' + autoplay + '"  bgcolor="white" >';
    if (retornaCodigo)
        return cadena;
    else
        document.write(cadena);

}


function ajustaDominio(ruta, dominio) {
    
    var loc = window.location;
    var domain = loc.host;
    var domainSinW = domain.replace("www.", "");
    
    var ruta_aux = "";
    
    if (ruta.search("-des.") != -1)  // contiene -des.
    {
        return ruta;
    } 
    else if (ruta.search("www.") != -1)  // contiene www.
    {
        return ruta.replace('www.', dominio + '.');
    } 
    else if (ruta.search(dominio) != -1) {
        return ruta;
    } 
    else if (ruta.search('estaticos.') != -1)  //contiene estaticos.
    {
        return ruta.replace('estaticos.', dominio + '.');
    } 
    else if (ruta.match(/^\//))  //empieza por  /
    {
        return "http://" + dominio + "." + domainSinW + ruta;
    } 
    else 
    {
        var pathName = loc.pathname;
        var locSinScript = pathName.substring(0, pathName.lastIndexOf("/") + 1);
        return "http://" + dominio + "." + domainSinW + locSinScript + ruta;
    }
}

function controlMultimedia(tipo, ruta, ancho, alto, retornaCodigo, archivoswf, parametros, id, plataforma) 
{
    
    if ((tipo == "video" || tipo == "audio") && (!ruta.match(/http:\/\//)) && (!ruta.match(/uggc:\/\//))) 
    {
        
        var dominio = document.domain.substr(4, document.domain.length);
        ruta = "http://cachevideos." + dominio + ruta;
    
    }
    
    if (plataforma == "" || plataforma == undefined)
        plataforma = compruebaPlataforma();
    
    switch (plataforma) 
    {
        case ("quicktime"):
            {
                switch (tipo) 
                {
                    case ("video"):
                        {
                            var posExtension = ruta.search('.flv');
                            var extension = ruta.substring(posExtension + 1, posExtension + 4);
                            if (extension != "mp4" && extension != "flv") {
                                ruta = undo_root13(ruta);
                            }
                            
                            ruta = ruta.replace('.flv', '.mp4');
                            
                            ruta = ajustaDominio(ruta, "cachevideos");


                            /*
					var extension = ruta.length-3;
					if(ruta.substring(extension) == "flv")
					    ruta= ruta.substring(0,extension)+'mp4';
							    if(ruta.substring(extension) != "mp4")
								    ruta = undo_root13(ruta);
					*/
                            return quickTimePlayer(ruta, ancho, alto, retornaCodigo, 'true', id);
                            break;
                        }
                    case ("audio"):
                        {
                            if (retornaCodigo)
                                return quickTimePlayer(ruta, ancho, alto, true, 'false', id);
                            else
                                document.write(quickTimePlayer(ruta, ancho, alto, true, 'false', id));
                            break;
                        }
                    case ("album"):
                        {
                            return escribeAlbum(ruta, ancho, alto, parametros, id);
                            break;
                        }
                }
                break;
            }
        case ("html5"):
            {
                switch (tipo) 
                {
                    case ("video"):
                        {
                            var posExtension = ruta.search('.flv');
                            var extension = ruta.substring(posExtension + 1, posExtension + 4);
                            if (extension != "mp4" && extension != "flv") {
                                ruta = undo_root13(ruta);
                            }
                            
                            ruta = ruta.replace('.flv', '.mp4');
                            
                            ruta = ajustaDominio(ruta, "cachevideos");
                            
                            
                            return html5Player(ruta, ancho, alto, tipo, retornaCodigo, id);
                            break;
                        }
                    case ("audio"):
                        {
                            
                            if (retornaCodigo)
                                return html5Player(ruta, ancho, alto, tipo, true, id);
                            else
                                document.write(html5Player(ruta, ancho, alto, tipo, true, id));
                            break;
                        }
                    case ("album"):
                        {
                            return escribeAlbum(ruta, ancho, alto, parametros, id);
                            break;
                        }
                }
                break;
            }
        case ("flash"):
            {
                switch (tipo) 
                {
                    case ("video"):
                        {
                            //COMPROBAR VERSION FLASH
                            return EscribeReproductorFlashV2(archivoswf, parametros, ancho, alto, retornaCodigo);
                            break;
                        }
                    case ("audio"):
                        {
                            if (retornaCodigo)
                                return EscribeReproductorFlashV2(archivoswf, parametros, ancho, alto, true);
                            else
                                document.write(EscribeReproductorFlashV2(archivoswf, parametros, ancho, alto, true));
                            break;
                        }
                    case ("album"):
                        {
                            return escribeAlbum(ruta, ancho, alto, parametros, id);
                            break;
                        }
                }
                break;
            }
    }


}

/* FIN FUNCIONES CONTROL MULTIMEDIA */
/************************************/

function escribeIframe(id, url, ancho, alto, scrolling, allowtransparency) {
    document.getElementById(id).innerHTML = "<iframe src='" + url + "' width='" + ancho + "' height='" + alto + "' scrolling='" + scrolling + "' allowtransparency='" + allowtransparency + "' frameborder='0'></iframe>";
}


//Recarga los pixeles de contabilizacion 
var pixelContabilizacion = undefined;
function recargarPixeles() {
    
    if (pixelContabilizacion == undefined) {
        
        var divs = document.getElementsByTagName('div');
        pixelContabilizacion = false;
        
        var count = divs.length;
        for (var i = 0; i < count; ++i) {
            if (divs[i].className == "pixelcontabilizacion") {
                pixelContabilizacion = divs[i];
                break;
            }
        }
    
    }
    
    if (!pixelContabilizacion)
        return false;
    
    var ANAJS_Date = new Date();
    var ANAJS_ms = ANAJS_Date.getTime();
    var pixeles = pixelContabilizacion.getElementsByTagName('img');
    for (var i = 0; i < pixeles.length; ++i) {
        if (pixeles[i].srcAux == undefined)
            pixeles[i].srcAux = pixeles[i].src;
        pixeles[i].src = pixeles[i].srcAux + '&np=' + ANAJS_ms;
    }
    
    try {
        void (s.t());
    } catch (e) {
        return false;
    }
    
    return true;
}

function GetSiteAndPage() {
    
    var host = window.location.host;
    var path = window.location.pathname;
    
    var R = new Object();
    R.Site = "elmundo";
    R.Page = "generico";
    
    if (-1 != path.search(/\/happy-?fm/)) {
        R.Site = "happyfm";
    }
    
    if (-1 != path.search(/^\/yodona\//)) {
        R.Site = "yodona";
    }
    
    if (("/" == path) || ("/index.html" == path) || ("/elmundo/index.html" == path) || 
    ("/yodona/index.html" == path) || ("/yodona/" == path)) {
        R.Page = "portada";
        return R;
    }
    
    if (("/elmundosalud/index.html" == path) || ("/elmundosalud/" == path)) {
        R.Page = "elmundosalud_p";
    }
    
    if (("/elmundodeporte/index.html" == path) || ("/elmundodeporte/" == path)) {
        R.Page = "elmundodeporte_p";
    }
    
    if (R.Page == "generico") {
        
        var RE = new Array(
        /^\/(traductor|elmundodinero|suvivienda|multimedia|america|diccionarios|especiales|blogs|elmundomotor|movil|buscador|accesible|tiempo|horoscopo|debate|metropoli)\//, false, 
        /^\/elmundo\/(gentes|encuentros)\//, false, 
        /^\/([\w-]+)\/\d{4}\/\d{2}\/\d{2}\/[0-9a-f]{24}\.html/, false, 
        /^\/(?:.+?)\/(.+?)\.html$/, true
        );
        
        for (i = 0; i < RE.length; i += 2) {
            var M = RE[i].exec(path);
            if (M != null) {
                R.Page = M[1];
                if (RE[i + 1]) {
                    R.Page += "_p";
                }
                return R;
            }
        }
    }
    
    return R;
}

var controlaDOM = function(DOMLoaded) 
{
    if (document.addEventListener) 
    { // Mozilla, Opera, Webkit:
        document.addEventListener("DOMContentLoaded", function() 
        {
            document.removeEventListener("DOMContentLoaded", arguments.callee, false);
            DOMLoaded();
        }, false);
    } 
    else if (document.attachEvent) 
    { // IE ...:
        document.attachEvent("onreadystatechange", function() 
        {
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                DOMLoaded();
            }
        });
    }
}


/* FUNCIONES PARA CONTAR UN MINUTO Y ENVIAR EL TITULO DE LA NOTICIA A UNA FUNCION DE S_CODE.JS SI ESTA EXISTE */
/*****************************************************************************/
var titulo_noticia = "";

function timeoutMinuto() {
    window.setTimeout("minutoNoticia(titulo_noticia)", 60000);
}

function activarMinuto(titulo) {
    if (typeof minutoNoticia == 'function') {
        titulo_noticia = titulo;
        controlaDOM(timeoutMinuto);
    }
}

