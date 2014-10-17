(function($) {
    'use strict';

    var json_canal = {},
        $TabbedPanelsContent = $('.TabbedPanelsContent'),
        $guiaprograma = $('.guiaprograma');

    function init() {

        $.each($TabbedPanelsContent, function(i, v) {
            var id = $(this).attr('id').substr(4, 1);
            json_canal[id] = importarCanal($(this));
        });
        console.log(json_canal);

        var salida = JSON.stringify(json_canal);
        $('.resultado textarea').text(salida);
    }

    function importarCanal($qElem) {

        var arrayLetra = [];
        var coleccion = $qElem.find('.guiaprograma');

        $.each(coleccion, function(i, v) {
            var id_programa = $(this).find('input').attr('value');
            var icono = $(this).find('img').attr('src');
            var nombre_canal = $(this).find('label').find('span').text();
            arrayLetra.push({
                'nombre_canal': nombre_canal,
                'id_programa': id_programa,
                'icono': icono
            });
        });

        return arrayLetra;
    }


    init();

})(jq111);