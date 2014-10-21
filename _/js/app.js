var guiaTV = (function($) {

    'use strict';
    //console.log('Usa jQuery version: ' + $.fn.jquery);

    var canalesUsuario = ['la1', 'la2', 'antena3', 'cuatro', 'telecinco', 'lasexta'],
        canalesGlobal = {},
        categoriasUsuario = [],
        arrayCanales = [],
        arrayDias = [];
    var altoBarraHoras = 60,
        anchoBarraCanales = 150,
        altoCanal = 90,
        pixelsPorHora = 260,
        pixelsPorMinuto = pixelsPorHora / 60,
        anchoPorDia = pixelsPorHora * 24;

    // TODO Ahora mismo forzamos esta fecha de inicio
    var diaActual = new Date(),
        horaActual = {
            'h': leftPad(diaActual.getHours(), 2),
            'm': leftPad(diaActual.getMinutes(), 2)
        };
    //diaActual.setTime(Date.parse("Mon, Jul 14 2014 00:00:00 GMT+0200"));
    diaActual.setTime(Date.parse("Mon, Jul 14 2014"));

    var $viewPort = $('.viewPort');
    var $selectorCategorias = $('.selectorCategorias');
    var $selectorDias = $('.selectorDias');
    var $contProgramas = $('.contProgramas');
    //var $itemPrograma = $('.itemPrograma');
    var $contCanales = $('.contCanales');
    var $barraHoras = $('.barraHoras');
    var $horaActual = $('.horaActual');
    var $fichaPrograma = $('.fichaPrograma');
    var $barrasCanales = $('.barrasCanales');
    var $barraLetras = $('.barraLetras');
    var $ordenCanales = $('.ordenCanales');

    /**
     * Accede a las cookies del usuario para ver personalización de canales
     * @return {array} Lista de canales personalizados por el usuario
     */
    function cargaCookies() {
        // TODO Cargar canales desde una cookie, y generar ésta cuando se accede por primera vez
        // TODO Cargar de las cookies los canales resaltados del selectorCategorias
        // Lógica de lectura de cookies
        var def = $.Deferred(),
            canales, categorias;
        setTimeout(function() {
            canales = ['telecinco', 'antena3', 'la2', 'la1', 'cuatro', 'lasexta', 'historia'];
            categoriasUsuario = [1, 2, 3, 4, 5, 6, 7];
            def.resolve(canales);
        }, 3000);
        return def.promise();
    };

    /**
     * Recibe la lista de canales a cargar y hace las llamadas asíncronas
     * @param {array} canales Listado de canales a cargar
     * @return {json} Datos json de la programación al completo para los canales seleccionados
     */
    function cargaDatosCanales(canales) {
        // Cargas asíncronas de varios canales
        // por cada canal, carga un json
        var json = [],
            promises = [],
            numElementos = canales.length;

        $.when.apply(null, $.map(canales, function(canal, i) {
            var fichero = 'datos/' + canal + '.json';

            promises.push($.get(fichero).done(function(data) {
                arrayCanales[i] = json[i] = data;
            }).fail(function() {
                arrayCanales[i] = json[i] = '';
            }));

        }));
        // Resolver deferrer cuando se hayan cargado todos los json
        return $.when.apply(null, promises).promise();

    };

    /**
     * Recibe la lista de programas a pintar por canal y lanza el pintado del canal
     * @return {[type]} [description]
     */
    function pintaParrilla(listaCanales, arrayCompleto) {
        var lista = listaCanales || canalesUsuario;
        var completo = arrayCompleto || arrayCanales;

        var context = {};
        var template = '<div id="{{idcanal}}" class="lineaCanal clearfix"></div>';

        $.each(lista, function(i, v) {
            context.idcanal = v;
            var resultado = Mark.up(template, context);
            $contProgramas.append(resultado);
        });

        // Pintamos programas en sus canales
        $.each(completo, function(i, v) {
            var canal = v.canal.nombre;
            var divCanal = $('#' + canal);

            $.each(v.programas, function(i, v) {
                var div = pintaParrillaPrograma(i, v);
                divCanal.append(div);
            });
        });
    };

    /**
     * Recorre el json de programas de de un canal y los pinta en 'contProgramas'
     * @param  {int} qCanal Identificador de qué canal pintamos
     * @return {}
     */
    function pintaParrillaPrograma(i, v) {

        var context = {};
        var templatePrograma = '' +
            '<div class="itemPrograma" id="{{id_programa}}" data-url="{{url_ficha}}"' +
            'style="width:{{dur}}; left:{{diffHoraDia}}; user-selected:none;">' +
            '<div class="itemProgramaInner {{clase}}">' +
            '<a href="http://elmundo.es/television/programa/{{id_programa}}" style="display:none;">{{nombre}}</a>' +
            '<span class="categoria">{{categoria}}</span>' +
            '<h4>{{nombre}}</h4>' +
            '{{if episodio}}<p>{{episodio}}</p>{{/if}}' +
            '<span class="duracion">{{duracion}}</span>' +
            '<span class="fecha">{{infoHoraDuracion}}</span>' +
            '{{if fav}}<span class="favorito"><i class="fa fa-bookmark"></i></span>{{/if}}' +
            '{{if ale}}<span class="alerta"><i class="fa fa-clock-o"></i></span>{{/if}}' +
            '</div></div>"';

        // Selección de categoría
        // mCine "104" / mConcursos "INT_2" / mCorazon / mDeportes "90" /
        // mInformativos "20" / mMagazines "31" / mSeries "1"
        var cat = v.categoria,
            categoria,
            clase;
        switch (cat) {
            case "1":
                clase = "catSeries";
                categoria = "series";
                break;
            case "104":
                clase = "catCine";
                categoria = "cine";
                break;
            case "31":
                clase = "catMagazines";
                categoria = "magazines";
                break;
            case "20":
                clase = "catInformativos";
                categoria = "informativos";
                break;
            case "90":
                clase = "catDeportes";
                categoria = "deportes";
                break;
            case "INT_2":
                clase = "catConcursos";
                categoria = "concursos";
                break;
            case "INT_1":
                clase = "catCorazon";
                categoria = "corazón";
                break;
        }

        // El ancho va a depender de la duración del programa
        var duracion = v.duracion + ' mins.';
        var dur = Math.floor(pixelsPorMinuto * v.duracion),
            hora_inicio = new Date(v.hora_inicio),
            hora_final = new Date(v.hora_fin);
        var diffHoraDia = Math.floor(hora_inicio - diaActual); // TODO diaActual forzado
        diffHoraDia = Math.floor(((diffHoraDia / 1000) / 60) * pixelsPorMinuto);

        var hora_i = hora_inicio.getHours();
        hora_i = leftPad(hora_i, 2);
        var mins_i = hora_inicio.getMinutes();
        mins_i = leftPad(mins_i, 2);

        var hora_f = hora_final.getHours();
        hora_f = leftPad(hora_f, 2);
        var mins_f = hora_final.getMinutes();
        mins_f = leftPad(mins_f, 2);

        var infoHoraDuracion = '' + hora_i + ':' + mins_i + ' - ' + hora_f + ':' + mins_f;

        // TODO Random para poder ver programas favoritos y alertas de programas. ELIMINAR
        if (Math.random() * 100 < 5) {
            var fav = true;
        }
        if (Math.random() * 100 < 5) {
            var ale = true;
        }

        // TODO Si el elemento es pequeño, aparece una cruz

        context = {
            clase: clase,
            dur: dur + 'px',
            diffHoraDia: diffHoraDia + 'px',
            id_programa: v.id_programa,
            url_ficha: v.url_ficha,
            infoHoraDuracion: infoHoraDuracion,
            duracion: duracion,
            categoria: categoria.toUpperCase(),
            nombre: v.nombre,
            episodio: v.episodio,
            fav: fav | undefined,
            ale: ale | undefined
        };

        var resultado = Mark.up(templatePrograma, context);
        return resultado;
    };

    /**
     * Pinta los iconos de canales en el componente 'contCanales'
     */
    function pintaCanales(listaCanales) {

        var lista = listaCanales || canalesUsuario;
        var context = {};
        var template = '<div class="itemCanal"><img src="http://estaticos.elmundo.es{{icono}}" /></div>';

        $.each(lista, function(i, v) {
            context.icono = arrayCanales[i].canal.icono;
            var resultado = Mark.up(template, context);
            $contCanales.append(resultado);
        });
    };

    /**
     * Pinta una barra horizonal con la marca de horas, que se desplaza con el viewPort
     * @return {}
     */
    function pintaHorasParrilla() {
        var dia = new Date(),
            i, j;

        var context = {};
        context.dias = [];
        context.horas = [];
        var template = '' +
            '{{dias}}<div class="itemDia" style="left:{{pos}}px">{{dia}}</div>{{/dias}}' +
            '{{horas}}<div class="itemHoras" style="left:{{pos}}px;">{{texto}}</div>{{/horas}}';

        // Generamos una barra para los días (4) de los que disponemos de datos
        for (j = 0; j <= 3; j++) {

            dia.setTime(diaActual.getTime() + (j * 86400000));
            var diaText = dia.toLocaleDateString('es-ES', {
                weekday: 'long',
                //year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            var lDia = (j * pixelsPorHora * 24);
            context.dias.push({
                'dia': diaText,
                'pos': lDia
            });
            arrayDias.push([diaText, lDia]);

            for (i = 0; i < 24; i++) {
                var t = leftPad(i, 2) + ":00";
                var l = (j * pixelsPorHora * 24) + i * pixelsPorHora;

                context.horas.push({
                    'texto': t,
                    'pos': l
                });
            }
        }

        var resultado = Mark.up(template, context);
        console.log(resultado);

        $barraHoras.append(resultado);

    };

    /**
     * Pinta un selector de acceso directo a los días incluídos en la programación
     * Dependemos de arrayDias que ha generado datos en pintaHorasParrilla
     * @return {}
     */
    function pintaSelectorDias() {

        var context = {};
        var template = '<li class="itemDia" data-px="{{px}}"><a href="javascript://">{{diaText}}</a></li>';

        arrayDias.forEach(function(item, index) {

            var diaText = item[0];
            var px = item[1];

            context = {
                diaText: diaText,
                px: px
            };

            var resultado = Mark.up(template, context);
            $selectorDias.find('ul').append(resultado);
        });
    };

    /**
     * Pinta una franja que marca la hora actual en el componente Parrilla
     * @return {}
     */
    function pintaHoraActual() {

        var horas = horaActual.h,
            minutos = horaActual.m;

        var divHora = $('.horaActual')
            .hide()
            .find('p').text(horas + ":" + minutos).end()
            .show();

        var posX = parseInt(horas) * pixelsPorHora + parseInt(minutos) * pixelsPorMinuto;
        divHora.css({
            'left': posX
        });
    };

    /**
     * Sitúa la Parrilla en el momento actual, fecha y hora
     * @return {}
     */
    function situaParrillaAhora() {
        var mitadAnchoViewport = $viewPort.width() * .5;
        var mueveA = parseInt($horaActual.css('left'));
        mueveA = parseInt(mitadAnchoViewport - mueveA);

        $contProgramas.stop().animate({
            'left': mueveA + 'px'
        }, 300);
        $barraHoras.stop().animate({
            'left': mueveA + 'px'
        }, 300);
        var horaLeft = parseInt(horaActual.h) * pixelsPorHora;
        var minutosLeft = parseInt(horaActual.m) * pixelsPorMinuto;
        var posX = horaLeft + minutosLeft + mueveA;
        $horaActual.stop().animate({
            'left': posX + 'px'
        }, 300);
    };

    /**
     * Obtendríamos datos de favoritos y alertas de usuario validado (si hubiera)
     * @return {json} Objeto json con todos los programas favoritos y alertas del usuario
     */
    function cargaInfoUsuario() {};

    /**
     * Decora los programas en Parrilla con las alertas y favoritos recorriendo el json de usuario
     * @return {[type]} [description]
     */
    function pintaProgsUsuario() {};

    /**
     * Asocia todos los event listeners a los diferentes elementos de ui
     * @return {[type]} [description]
     */
    function lanzaHandlers() {

        /*var $viewPort = $('.viewPort');
        var $contProgramas = $('.contProgramas');
        var $contCanales = $('.contCanales');
        var $barraHoras = $('.barraHoras');
        var $horaActual = $('.horaActual');
        var $fichaPrograma = $('.fichaPrograma');*/

        var altoViewport = $viewPort.height(),
            anchoViewport = $viewPort.width(),
            altoContProgramas = $contProgramas.height(),
            anchoContProgramas = $contProgramas.offsetWidth,
            anchoBarraCanales = $contCanales.width();
        var isDrag = false,
            seHaMovido = false;

        var primerosDiv = $('.contProgramas > div > div:first-child'),
            offsetsIzda = [];
        $.each(primerosDiv, function(i, v) {
            offsetsIzda.push(this.offsetLeft);
        });
        var minIzda = offsetsIzda.min();

        var ultimosDiv = $('.contProgramas > div > div:last-child'),
            offsetsDrch = [];
        $.each(ultimosDiv, function(i, v) {
            offsetsDrch.push(this.offsetLeft + $(this).width());
        });
        var maxDrch = offsetsDrch.max();

        // Nos cargamos el preloader
        $viewPort.find('.preload-wrapper').remove();


        // Generamos un handler para mousedown/touchstart
        $contProgramas.on('mousedown touchstart', dragOn);
        // Generamos un handler para mouseup/touchend
        // $contProgramas.on('mouseup touchend', dragOff);
        // Generamos un handler para mousemove/touchmove
        // $contProgramas.on('mousemove touchmove', dragMove);

        // Saca panel con información ajax de programa
        $contProgramas.on('click', clickPrograma);

        // Handler para la selección de una hora
        $barraHoras.on('click', '.itemHoras', clickHora);

        // Handler para filtrado por categorías
        $selectorCategorias.on('click', 'li', marcaCategoria);
        marcarCategoriasSeleccionadas();

        // Handler para selección de día
        $selectorDias.on('click', 'li', clickDia);

        function dragOn(event) {
            console.log(this);
            event.preventDefault();
            this.startTop = this.offsetTop;
            this.startLeft = this.offsetLeft;
            this.initialMouseX = event.clientX;
            this.initialMouseY = event.clientY;
            isDrag = true;
            seHaMovido = false;

            // Generamos un handler para mouseup/touchend
            $contProgramas.on('mouseup touchend', dragOff);
            // Generamos un handler para mousemove/touchmove
            $contProgramas.on('mousemove touchmove', dragMove);
        };

        function dragOff(event) {
            if (isDrag) {
                isDrag = false;
                $contProgramas.off('mouseup touchend', dragOff);
                $contProgramas.off('mousemove touchmove', dragMove);
            }
        };

        function dragMove(event) {
            if (isDrag) {

                var dX = event.clientX - this.initialMouseX;
                var dY = event.clientY - this.initialMouseY;

                // Marcamos con un flag si ha habido diferencia de más de 3 píxeles
                seHaMovido = Math.abs(dX) > 2 || Math.abs(dY) > 2;

                var ntop = this.startTop + dY;
                var nleft = this.startLeft + dX;
                // Límite top (35px alto $barraHoras)
                if (ntop > altoBarraHoras) {
                    ntop = altoBarraHoras;
                }
                // Límite bottom (altoViewport - altoProgramas)
                if (ntop < (altoViewport - altoContProgramas)) {
                    ntop = (altoViewport - altoContProgramas);
                }
                // Límite right (70px ancho $contCanales)
                if (nleft > anchoBarraCanales + Math.abs(minIzda) + 50) {
                    nleft = anchoBarraCanales + Math.abs(minIzda) + 50;
                }
                // Límite left (anchoViewport menos el ancho total de programas)
                if (nleft < anchoViewport - 50 - Math.abs(maxDrch)) {
                    nleft = anchoViewport - 50 - Math.abs(maxDrch);
                }

                $(this).css({
                    'top': ntop + 'px',
                    'left': nleft + 'px'
                });
                $contCanales.css({
                    'top': ntop + 'px'
                });
                $barraHoras.css({
                    'left': nleft + 'px'
                });
                var horaLeft = parseInt(horaActual.h) * pixelsPorHora,
                    minutosLeft = parseInt(horaActual.m) * pixelsPorMinuto,
                    posX = horaLeft + minutosLeft + nleft;
                $horaActual.css({
                    'left': posX + 'px'
                });
            }
        };

        /**
         * Handler del click en un itemHoras
         * @param  {event} event Objeto evento con toda la info del click
         * @return {}
         */
        function clickHora(event) {
            var mueveA = parseInt($(this).css('left'));
            mueveA = parseInt((anchoViewport * .5) - mueveA);
            mueveProgramasAPunto(mueveA);
        };

        /**
         * Handler del click en un día
         * @param  {event} event Objeto event con toda la info del click
         * @return {}
         */
        function clickDia(event) {
            var mueveA = parseInt($(this).data('px')) * -1;
            mueveProgramasAPunto(mueveA);
        };

        /**
         * Handler del click en un itemPrograma
         * @param  {event} event Objeto evento con toda la info del click
         * @return {}
         */
        function clickPrograma(event) {
            if (!seHaMovido) {
                isDrag = false;
                var elem = document.elementFromPoint(event.clientX, event.clientY),
                    $elemPadre = $(elem).is('.itemPrograma') ? $(elem) : $(elem).closest('.itemPrograma');

                var progUrl = $elemPadre.find('a').attr('href'),
                    progId = $elemPadre.attr('id');
                cargaFichaPrograma(progId, progUrl);

                var mueveA = parseInt($elemPadre.css('left')) + $elemPadre.width() * .5;
                mueveA = parseInt((anchoViewport * .5) - mueveA);
                mueveProgramasAPunto(mueveA);
            }
        };

        /**
         * Carga por ajax la información básica de la ficha de programa
         * @param  {int} progId  Id del programa
         * @param  {string} progUrl Url completa de la ruta para cargar la ficha
         * @return {}
         */
        function cargaFichaPrograma(progId, progUrl) {
            // TODO Probar en entorno de pruebas elmundo.es
            //progUrl = 'http://www.elmundo.es' + progUrl;
            cierraFicha();

            $.ajax({
                url: "fichaPrograma.html",
                data: {
                    'progId': progId
                },
                dataType: 'html',
                cache: false
            })
                .done(function(html) {
                    $fichaPrograma
                        .find('.contenido')
                        .html(html);
                    $fichaPrograma
                        .find('.nano').nanoScroller({
                            scroll: 'top'
                        });
                    $fichaPrograma.animate({
                        right: 0
                    }, 500, 'swing', creaCierre);
                });

            function creaCierre() {
                var cierra = $('<div/>')
                    .text('X')
                    .addClass('cierra')
                    .appendTo($fichaPrograma)
                    .on('click', function(event) {
                        event.preventDefault();
                        cierraFicha();
                        this.remove();
                    });
            };

            function cierraFicha() {
                if (parseInt($fichaPrograma.css('right')) === 0) {
                    $fichaPrograma.stop().animate({
                        right: -300
                    }, 300, 'swing');
                }
            };

        };

        function marcaCategoria(event) {
            var clase = $(event.currentTarget).attr('class').split(' ')[0];
            console.log(clase);

            if ($contProgramas.hasClass(clase)) {
                $contProgramas.removeClass(clase);
                $(this).removeClass('activo');
            } else {
                $contProgramas.addClass(clase);
                $(this).addClass('activo');
            };
        };

        function marcarCategoriasSeleccionadas() {
            if (categoriasUsuario.length >= 1) {
                $.each(categoriasUsuario, function(i, v) {
                    $selectorCategorias.find('li:nth-child(' + v + ')').trigger('click');
                });
            }
        };

        /**
         * Mueve el contProgramas a la posición dada
         * @param  {int} coordX Coordenada left
         * @return {}
         */
        function mueveProgramasAPunto(coordX) {
            var nleft = coordX || 0;
            $contProgramas.stop().animate({
                'left': nleft + 'px'
            }, 300);
            $barraHoras.stop().animate({
                'left': nleft + 'px'
            }, 300);
            var horaLeft = parseInt(horaActual.h) * pixelsPorHora;
            var minutosLeft = parseInt(horaActual.m) * pixelsPorMinuto;
            var posX = horaLeft + minutosLeft + nleft;
            $horaActual.stop().animate({
                'left': posX + 'px'
            }, 300);
        };
    };

    /**
     * Pinta el total de canales a los que se puede suscribir y las letras correspondientes
     * @return {}
     */
    function pintaListadoCanalesSuscripcion() {

        var ulLetras = $('<ul>'),
            fichero = 'datos/listadocanales.json';

        // TODO mover la carga a una función diferente con promises
        // (Genera el backend)
        $.get(fichero)
            .done(function(data) {
                canalesGlobal = data;

                var context = {};
                var templateLetra = '<li class="itemLetra"><h4>{{letra}}</h4>' +
                    '<div class="divLetra nano"><div class="nano-content"><ul>' +
                    '{{canales}}<li class="itemCanal" data-idcanal="{{id_programa}}"><img src="{{icono}}" />{{nombre_completo}}<span class="check"></span></li>{{/canales}}' +
                    '</ul></div></div></li>';

                $.each(canalesGlobal, function(i, v) {

                    context = {
                        letra: i,
                        canales: v
                    };

                    var resultLetra = Mark.up(templateLetra, context);
                    ulLetras.append(resultLetra);
                });

                $barraLetras.html(ulLetras);

                //Comprobamos si ya estamos suscritos a ese canal
                $.each($barraLetras.find('.itemCanal'), function(i, v) {

                    if (canalesUsuario.indexOf($(this).data('idcanal')) != -1) {
                        //console.log($(this).data('idcanal'));
                        $(this).find('.check').addClass('sel');
                    }
                });

                $barraLetras
                    .find('.nano').nanoScroller({
                        scroll: 'top',
                        flash: true,
                        preventPageScrolling: true
                    });

            });
    };

    /**
     * Pinta los canales a los que está suscrito el usuario (o defecto)
     * Permite reordenar los canales, desuscribirse y guardar la configuración
     * @return {}
     */
    function pintaListadoCanalesSeleccionados() {

        var ulCanales = $('<ul class="orden vertical">');

        var context = {};
        var template = '<li class="itemCanal" data-idcanal="{{nombre}}"><img src="http://estaticos.elmundo.es{{icono}}" />{{nombre_completo}}<span class="check sel"></span></li>';

        $.each(arrayCanales, function(i, v) {
            context = v.canal;
            var result = Mark.up(template, context);
            ulCanales.append(result);
        });

        $ordenCanales.find('.nano-content').html(ulCanales);
        $ordenCanales
            .find('.nano').nanoScroller({
                scroll: 'top',
                flash: true,
                preventPageScrolling: true
            });
    };

    function lanzaHandlersSuscripicion() {

        /*var $barraLetras = $('.barraLetras');
        var $ordenCanales = $('.ordenCanales');*/

        // Click en items de suscripción
        $barraLetras.on('click', '.itemCanal', clickItemCanal);

        // Reordenación de elementos de canal, drag & drop
        var adjustment;
        var group = $('.ordenCanales ul.orden').sortable({
            group: 'orden',
            pullPlaceholder: true,
            // animation on drop
            onDrop: function($item, container, _super) {
                var data = group.sortable("serialize").get();
                var jsonString = JSON.stringify(data, null, ' ');

                var $clonedItem = $('<li/>').css({
                    height: 0
                });
                $item.before($clonedItem);
                $clonedItem.detach();

                _super($item, container);
            },

            // set $item relative to cursor position
            onDragStart: function($item, container, _super) {
                var offset = $item.offset(),
                    pointer = container.rootGroup.pointer;

                // Tenemos en cuenta la posición del nanoScroller en ese momento
                var posIniScroller = $('.ordenCanales .nano .nano-content').get(0).scrollTop;
                posIniScroller = Math.floor(posIniScroller);

                adjustment = {
                    left: pointer.left - offset.left,
                    top: pointer.top - offset.top - posIniScroller
                };

                _super($item, container);
            },
            onDrag: function($item, position) {
                $item.css({
                    left: position.left - adjustment.left,
                    top: position.top - adjustment.top
                });
            }
        });

        // Click en checks en el panel de suscritos
        $ordenCanales.on('click', '.check', clickCheckOrdenCanal);

        /**
         * Funcionalidad de clickar en un itemCanal de la lista de canales de suscripción
         * @param  {[event]} event Evento completo
         * @return {}
         */
        function clickItemCanal(event) {

            var $check = $(this).find('.check');
            var bool = $check.hasClass('sel');
            var idcanal = $(this).data('idcanal');
            var $itemsCanal = $ordenCanales.find('.itemCanal').filter(function(index) {
                return $(this).data('idcanal') === idcanal;
            });

            if (!bool) { // si nuestro elemento no está seleccionado

                $check.toggleClass('sel');
                if ($itemsCanal.length) { // si ya existe este canal en el panel de orden
                    $itemsCanal.find('.check').toggleClass('sel');
                } else { // si no existe este canal en el panel de orden
                    $(this).clone().appendTo($ordenCanales.find('ul'));
                }

            } else { // si nuestro elemento está seleccionado
                $check.toggleClass('sel');
                $itemsCanal.find('.check').toggleClass('sel');
            }

            $ordenCanales
                .find('.nano').nanoScroller().nanoScroller({
                    scroll: 'bottom'
                });
        };

        /**
         * Funcionalidad para reordenar los elementos itemCanal en el panel de orden
         * @param  {event} event Evento completo
         * @return {}
         */
        function clickOrdenCanal(event) {
            console.log('click en itemCanal');
        };

        /**
         * Funcionalidad de clickar el checkbox en los itemsCanal del panel de orden
         * @param  {[event]} event Evento completo
         * @return {}
         */
        function clickCheckOrdenCanal(event) {
            event.stopPropagation();
            var idcanal = $(this).parent('.itemCanal').data('idcanal');
            var $itemsCanal = $barraLetras.find('.itemCanal').filter(function(index) {
                return $(this).data('idcanal') === idcanal;
            });

            $(this).toggleClass('sel');
            $itemsCanal.find('.check').toggleClass('sel');
        };

    };

    /** INIT **/
    (function init() {

        //console.time('Init');

        var cargaInfoCookies = cargaCookies();
        var cargaInfoCanales = cargaInfoCookies.then(function(res) {
                canalesUsuario = res;
                return cargaDatosCanales(canalesUsuario);
            })
            .done(function() {
                pintaCanales(canalesUsuario); // Pintar en el orden en que llegan de la cookie
                pintaParrilla(canalesUsuario, arrayCanales); // Pintar en el orden en que llegan de la cookie
                pintaHorasParrilla(); // Pintar la barra superior de horario
                pintaHoraActual(); // Posiciona el marcador de hora actual en la parrilla
                pintaSelectorDias(); // Pintamos los literales de los días contemplados en parrilla
                situaParrillaAhora(); // Posiciona la parrilla y elementos en la fecha y hora actual

                lanzaHandlers(); // Lanza todos los event listeners

                pintaListadoCanalesSuscripcion(); // Pintamos el selector de canales completo al pie
                pintaListadoCanalesSeleccionados(); // Pintamos el área de canales seleccionados

                lanzaHandlersSuscripicion(); // Lanza todos los events listeners de suscripción a canales

                //console.timeEnd('Init');
            });

        //cargaInfoUsuario(); // Carga la información sobre programas favoritos y alertas de un usuario validado
        //pintaProgsUsuario(); // Modifica las clases de los programas que el usuario tenga como favoritos o alertas

    })();

    /** Helper **/
    $.fn.exists = function() {
        return this.length > 0;
    }

    return this;

})(jq111);

/**
 * Crea una cookie
 * @param  {string} name  Nombre de la cookie
 * @param  {object} value Valor de la cookie
 * @param  {int} days  Número de días de vigencia
 * @return {}
 */
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}
/**
 * Lee una cookie
 * @param  {string} name Nombre de la cookie
 * @return {string}      Valor de la cookie
 */
function readCookie(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}
/**
 * Elimina una cookie
 * @param  {string} name Nombre de la cookie
 * @return {}
 */
function eraseCookie(name) {
    createCookie(name, "", -1);
}

/**
 * Devuelve un número como cadena formateada con ceros a la izda
 * @param  {number} number       El número original
 * @param  {integer} targetLength Número de caracteres que queremos obtener
 * @return {string}              Cadena compuesta de ceros y el número original
 */
function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

/**
 * Prototipo para obtener números máximo y mínimo en un array
 * @return {int} Devuelve el max/min de un array dado
 */
Array.prototype.max = function() {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++)
        if (this[i] > max) max = this[i];
    return max;
};
Array.prototype.min = function() {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++)
        if (this[i] < min) min = this[i];
    return min;
};