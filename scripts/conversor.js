(function($) {
    'use strict';

    console.log('jQuery version: ' + $.fn.jquery);

    var json_canal = {},
        fichero = "datos/lasexta.js";

    function init() {

        $('.js-fichero').text(fichero);

        $.getScript(fichero)
            .done(function(script, textStatus) {
                console.log(textStatus);
                exportarJson();
            })
            .fail(function(jqxhr, settings, exception) {
                $('.resultado').text("Triggered ajaxError handler.");
            });
    }

    function exportarJson() {
        json_canal.canal = canal;
        json_canal.programas = [];

        $.each(arrayProgramas, function(index, value) {
            var elem = arrayProgramas[index];
            var aPrograma = JSON.stringify({
                "id_programa": elem[9].substring(elem[9].indexOf('?p=') + 3, elem[9].indexOf('&')),
                "nombre": elem[0],
                "episodio": elem[1],
                "hora_inicio": elem[2] * 1000,
                "hora_fin": elem[3] * 1000,
                "duracion": (elem[3] - elem[2]) / 60,
                "categoria": elem[4],
                "url_ficha": elem[9]
            });
            aPrograma = $.parseJSON(aPrograma);
            json_canal.programas.push(aPrograma);
        });
        console.log(json_canal);

        var salida = JSON.stringify(json_canal);
        $('.resultado textarea').text(salida);
    }

    init();

})(jq111);