/**
 * Created by siarheisheleh on 10/6/16.
 */

/* adaptive_navbar */
function nav_bar_adaptive() {
    var x = document.getElementById("adaptive");
    if (x.className == "acive_box_app_header_navigation_bar") {
        x.className += " acive_box_app_header_adaptive_bar";
    } else {
        x.className = "acive_box_app_header_navigation_bar";
    }
}

/* fancybox */
$(document).ready(function fancybox() {
    $("a.fancyimage").fancybox({
        "padding": 0,
        "imageScale": false,
        "zoomOpacity": false,
        "zoomSpeedIn": 1000,
        "zoomSpeedOut": 1000,
        "zoomSpeedChange": 1000,
        "frameWidth": 1000,
        "frameHeight": 1000,
        "overlayShow": true,
        "overlayOpacity": 0.8,
        "hideOnContentClick": false,
        "centerOnScroll": false,
    });
});

/* owl_slider */
$(document).ready(function owl_slider() {
    $("#owl-example").owlCarousel({
        // Most important owl features
        items: 1,
        itemsCustom: false,
        itemsDesktop: [1199, 1],
        itemsDesktopSmall: [980, 1],
        itemsTablet: [768, 1],
        itemsTabletSmall: false,
        itemsMobile: [479, 1],
        singleItem: false,
        itemsScaleUp: false,

        //Basic Speeds
        slideSpeed: 200,
        paginationSpeed: 800,
        rewindSpeed: 1000,

        //Autoplay
        autoPlay: true,
        stopOnHover: true,

        // Navigation
        navigation: false,
        navigationText: ["prev", "next"],
        rewindNav: true,
        scrollPerPage: false,

        //Pagination
        pagination: true,
        paginationNumbers: false,

        // Responsive
        responsive: true,
        responsiveRefreshRate: 200,
        responsiveBaseWidth: window,

        // CSS Styles
        baseClass: "owl-carousel",
        theme: "owl-theme",

        //Lazy load
        lazyLoad: false,
        lazyFollow: true,
        lazyEffect: "fade",

        //Auto height
        autoHeight: false,

        //JSON
        jsonPath: false,
        jsonSuccess: false,

        //Mouse Events
        dragBeforeAnimFinish: true,
        mouseDrag: true,
        touchDrag: true,

        //Transitions
        transitionStyle: false,

        // Other
        addClassActive: false,

        //Callbacks
        beforeUpdate: false,
        afterUpdate: false,
        beforeInit: false,
        afterInit: false,
        beforeMove: false,
        afterMove: false,
        afterAction: false,
        startDragging: false,
        afterLazyLoad: false
    });
});

/* photo_effect */
$(document).ready(function photo_effect() {
    // handle the mouseenter functionality
    $(".acive_box_app_portfolio_image").mouseenter(function () {
        $(this).addClass("hover");
    })
    // handle the mouseleave functionality
        .mouseleave(function () {
            $(this).removeClass("hover");
        });
});

/* contact_form_widget */
jQuery(document).ready(function () {

    $("#contact-form-widget-send-section-button").click(function () {
        var mail = $("#text-section-mail-adress-form").val();
        var subject = $("#text-section-mail-subject-form").val();
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        var validmail = pattern.test(mail);

        if (validmail !== true) {
            $("#text-section-mail-adress-form").css({"border": "1px solid red", "color": "red"});
            $("#text-section-mail-adress-form").val("This is not mail adress");
            var timerId1 = setTimeout(function () {
                $("#text-section-mail-adress-form").css({"border": "1px solid #e5d4c2", "color": ""});
                $("#text-section-mail-adress-form").val("");
            }, 2000)
        }

        if (mail == "") {
            $("#text-section-mail-adress-form").css({"border": "1px solid red", "color": "red"});
            $("#text-section-mail-adress-form").val("Mail adress is empty");
            var timerId1 = setTimeout(function () {
                $("#text-section-mail-adress-form").css({"border": "1px solid #e5d4c2", "color": ""});
                $("#text-section-mail-adress-form").val("");
            }, 2000)
        }

        if (subject == "") {
            $("#text-section-mail-subject-form").css({"border": "1px solid red", "color": "red"});
            $("#text-section-mail-subject-form").val("Mail must have subject");
            var timerId2 = setTimeout(function () {
                $("#text-section-mail-subject-form").css({
                    "border": "1px solid #e5d4c2",
                    "color": ""
                });
                $("#text-section-mail-subject-form").val("");
            }, 2000)
        }

        if (validmail === true && mail !== "" && subject !== "") {
            if ($("#copycheckbox").prop("checked")) {
                var text = "Your contact information was sent and copy was saved";
                $("#contact-form-widget-send-section-button").css({
                    "backgroundColor": "green"
                });
            } else {
                var text = "Your contact information was sent";
                $("#contact-form-widget-send-section-button").css({
                    "backgroundColor": "green"
                });
            }

            $("#text-section-mail-adress-form").val("");
            $("#text-section-mail-subject-form").val("");
            $("#contact-form-widget-text-section-message-form").val("");
            document.getElementById('modal_sending_info').innerHTML = text;

            $("#contact-form-widget-text-section-emails").fadeOut(5);
            $("#contact-form-widget-text-section-emails").empty();
        }
    });
});

function refresh_contact_form() {
    document.getElementById('modal_sending_info').innerHTML = '';
    document.getElementById('contact-form-widget-send-section-button').style.backgroundColor = '#e84545';
}
