$(document).ready(function () {
    $('[data-tabs-role="tabs"]').tabs();

    $(window).on('change.tabs', function (event) {
        event.preventDefault();
        console.log('change');
    });
/*
    $("section").css({
        "background-color": "blue"

    });
*/

});

$('.datepicker').datepicker();
$.fn.datepicker.defaults.format = "dd/mm/yyyy";
$.fn.datepicker.defaults.startView = 2;
$.fn.datepicker.defaults.language = "ru";
$.fn.datepicker.defaults.autoclose = true;








