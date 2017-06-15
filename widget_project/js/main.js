jQuery(document).ready(function () {


    // static round diagram widget scripts
    
    // default variables
    var MAX_DATA = 200;
    var AUDIO_COLOR = "#4daf7b";
    var VIDEO_COLOR = "#e6623d";
    var PHOTO_COLOR = "#ebc85e";
    var REST_COLOR = "#f4ede7";
    var DAYS = 30;
    var HEIGHT = 250;
    var AUDIO_FILE_SPACE = 10;
    var VIDEO_FILE_SPACE = 150;
    var PHOTO_FILE_SPACE = 7;

    var AUDIO_FILES = 10552;
    var VIDEO_FILES = 353;
    var PHOTO_FILES = 1520;
    // -------------------------------------

    // global variables (sorry for that!)
    var currentAudioColor = 0;
    var currentVideoColor = 0;
    var currentPhotoColor = 0;

    var currentAudioFiles = 0;
    var currentVideoFiles = 0;
    var currentPhotoFiles = 0;

    var dataFiles = 0;
    var dataColors = 0;

    var audioSpace = 0;
    var videoSpace = 0;
    var photoSpace = 0;

    var totalSpace = 0;
    var totalFiles = 0;
    var dataSpace = 0;
    // ----------------------------------------------------

    setDefaultSettings ();

    function updateData () {
        dataFiles = {audio: currentAudioFiles, video: currentVideoFiles, photo: currentPhotoFiles, rest: ""};
        audioSpace = Math.round(dataFiles["audio"] * AUDIO_FILE_SPACE / 1024);
        videoSpace = Math.round(dataFiles["video"] * VIDEO_FILE_SPACE / 1024);
        photoSpace = Math.round(dataFiles["photo"] * PHOTO_FILE_SPACE / 1024);
        totalSpace = audioSpace + videoSpace + photoSpace;
        totalFiles = dataFiles['audio'] + dataFiles['video'] + dataFiles['photo'];
        dataSpace = {audio: audioSpace, video: videoSpace, photo: photoSpace, rest: MAX_DATA - totalSpace};
        dataColors = {audio: currentAudioColor, video: currentVideoColor, photo: currentPhotoColor, rest: REST_COLOR};
        monthReportData = makeMonthReportData(dataSpace, DAYS);
        $(".statistic-round-diagram-widget-diagram-space").text(totalSpace + " Gb");
        $(".statistic-round-diagram-widget-diagram-files").text(totalFiles + " files");
        $(".statistic-round-diagram-widget-diagram-files").css({"color": "#8e8071"});
    }

    updateData ();

    function setDefaultSettings () {
        currentAudioColor = AUDIO_COLOR;
        currentVideoColor = VIDEO_COLOR;
        currentPhotoColor = PHOTO_COLOR;

        currentAudioFiles = AUDIO_FILES;
        currentVideoFiles = VIDEO_FILES;
        currentPhotoFiles = PHOTO_FILES;
    }
    // ------------------------------------------------

    // helper functions for Linear Graphic

    function getRandomInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // random load data to make linear graphic
    function makeMonthReportData(data, days) {
        var result = {};
        var centerAudio = data["audio"]/days;
        var centerVideo = data["video"]/days;
        var centerPhoto = data["photo"]/days;
        var dataAudio = 0;
        var dataVideo = 0;
        var dataPhoto = 0;
        var dxAudio = 0;
        var dxVideo = 0;
        var dxPhoto = 0;
        for (var i = 1; i <= days; i++) {
            var dayAudio = getRandomInRange(0, centerAudio+dxAudio);
            dxAudio = centerAudio - dayAudio;
            var dayVideo = getRandomInRange(0, centerVideo+dxVideo);
            dxVideo = centerVideo - dayVideo;
            var dayPhoto = getRandomInRange(0, centerPhoto+dxPhoto);
            dxPhoto = centerPhoto - dayPhoto;
            result[i] = {audio: dayAudio, video: dayVideo, photo: dayPhoto};
            dataAudio += dayAudio;
            dataVideo += dayVideo;
            dataPhoto += dayPhoto;
        }
        var restAudio = (data["audio"] - dataAudio) / days;
        var restVideo = (data["video"] - dataVideo) / days;
        var restPhoto = (data["photo"] - dataPhoto) / days;
        for(var i = 1; i <= days; i++) {
            if (result[i]["audio"] + restAudio < centerAudio) {
                result[i]["audio"] += restAudio;
            }
            if (result[i]["video"] + restVideo < centerVideo) {
                result[i]["video"] += restVideo;
            }
            if (result[i]["photo"] + restPhoto < centerPhoto) {
                result[i]["photo"] += restPhoto;
            }
        }
        return result;
    }
    // -----------------------------------------------------

    var filesInPixel = 2 * MAX_DATA / DAYS / HEIGHT;
    var monthReportData = makeMonthReportData(dataSpace, DAYS);

    function findY(files) {
        return (files / filesInPixel);
    }

    // one day line
    function drawLine(dayData, x) {
        var height = HEIGHT;
        var ya = height - findY(dayData["audio"]);
        var yv = ya - findY(dayData["video"]) - 1;
        var yp = yv - findY(dayData["photo"]) - 2;
        var audioLine = "x1='"+ x + "' y1='" + height + "' x2='" + x + "' y2='" + ya + "'";
        var videoLine = "x1='"+ x + "' y1='" + (ya - 1) + "' x2='" + x + "' y2='" + yv + "'";
        var photoLine = "x1='"+ x + "' y1='" + (yv - 1) + "' x2='" + x + "' y2='" + yp + "'";
        var restLine =  "x1='"+ x + "' y1='" + (yp - 1) + "' x2='" + x + "' y2='5'";
        var audioPath =  "<line " + audioLine + " stroke='" + currentAudioColor + "' stroke-width='9'/>";
        var videoPath =  "<line " + videoLine + " stroke='" + currentVideoColor + "' stroke-width= '9'/>";
        var photoPath =  "<line " + photoLine + " stroke='" + currentPhotoColor + "' stroke-width='9'/>";
        var restPath =  "<line " + restLine + " stroke='" + REST_COLOR + "' stroke-width='9'/>";
        return "<g>" + audioPath + videoPath + photoPath + restPath + "</g>"
    }

    function drawHorisontalLine() {
        var quarter = "<line x1='0' y1='" + HEIGHT/4 + "' x2='300' y2='" + HEIGHT/4 + "' stroke='#777' stroke-width='0.5'/>";
        var half = "<line x1='0' y1='" + HEIGHT/2 + "' x2='300' y2='" + HEIGHT/2 + "' stroke='#777' stroke-width='0.5'/>";
        var threequarters = "<line x1='0' y1='" + HEIGHT*3/4 + "' x2='300' y2='" + HEIGHT*3/4 + "' stroke='#777' stroke-width='0.5'/>";
        return "<g>" + quarter + half + threequarters +"</g>"
    }

    function drawLinearGraphic (data, days) {
        var result = "";
        var x = 5;
        for (var i = 1; i <= days; i++) {
            var group = drawLine(data[i], x);
            x += 10;
            result += group;
        }
        return result
    }

    function makeLinearGraphic () {
        return '<svg width="300" height="250" class="month-report" id="linear-diagram">' + drawLinearGraphic(monthReportData, DAYS) + drawHorisontalLine() + '</svg>';
    }

    // add linear diagram in DOM
    $(".statistic-round-diagram-widget-content").append(makeLinearGraphic ());
    $(".line-quarter").text((MAX_DATA / DAYS / 2).toFixed(2) + "Gb");
    $(".line-half").text((MAX_DATA / DAYS).toFixed(2) + "Gb");
    $(".line-three-quarter").text((MAX_DATA / DAYS * 3 / 2).toFixed(2) + "Gb");


    function changeLinearGraphic (elem) {
        $("#linear-diagram").replaceWith(elem);
    }
    // -----------------------------------------------------------------

    // helper functions for duognut diagram
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle){

        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, arcSweep, 0, end.x, end.y
        ].join(" ");

        return d;
    }

    function findAngle(data, maxData) {
        return Math.round(360 * data / maxData);
    }

    function findPersent(data, maxData) {
        return Math.round(data / maxData * 100);
    }
    // ------------------------------------------------------

    var audioArcAngle = findAngle(audioSpace, MAX_DATA);
    var videoArcangle = findAngle(videoSpace, MAX_DATA);
    var photoArcAngle = findAngle(photoSpace, MAX_DATA);

    var audioPersent = findPersent(audioSpace, MAX_DATA);
    var videoPersent = findPersent(videoSpace, MAX_DATA);
    var photoPersent = findPersent(photoSpace, MAX_DATA);

    // add persentage of data and color border
    $(".statistic-round-diagram-widget-data-audio span").text(audioPersent + "%");
    $(".statistic-round-diagram-widget-data-video span").text(videoPersent + "%");
    $(".statistic-round-diagram-widget-data-photo span").text(photoPersent + "%");

    $(".statistic-round-diagram-widget-data-audio").css({"border-top": "4px solid " + currentAudioColor});
    $(".statistic-round-diagram-widget-data-video").css({"border-top": "4px solid " + currentVideoColor});
    $(".statistic-round-diagram-widget-data-photo").css({"border-top": "4px solid " + currentPhotoColor});


    // change data text in the dougnut diagram and change colors of data on hover

    $("#dougnut-diagram path").hover(function () {
        var pathId = this.id.split("-")[0];
        $(".statistic-round-diagram-widget-diagram-space").text(dataSpace[pathId] + " Gb");
        $(this).animate({"stroke-width": "+=7"}, 300);
        if (pathId == "rest") {
            $(".statistic-round-diagram-widget-diagram-files").text("rest space");
            $(".statistic-round-diagram-widget-diagram-files").css({"color": "#8e8071"});
        } else {
            $(".statistic-round-diagram-widget-diagram-files").text(dataFiles[pathId] + " files");
            $(".statistic-round-diagram-widget-diagram-files").css("color",dataColors[pathId]);
        }
    }, function () {
        $(".statistic-round-diagram-widget-diagram-space").text(totalSpace + " Gb");
        $(".statistic-round-diagram-widget-diagram-files").text(totalFiles + " files");
        $(".statistic-round-diagram-widget-diagram-files").css({"color": "#8e8071"});
        $(this).animate({"stroke-width": "-=7"}, 300);
    });
    // ---------------------------------------------------

    // draw dougnut diagrm

    $("#audio-arc").attr({
        d: describeArc(117 , 117, 85, 0, audioArcAngle),
        stroke: AUDIO_COLOR
    });
    $("#video-arc").attr({
        d: describeArc(117, 117, 85, audioArcAngle + 1, audioArcAngle + videoArcangle),
        stroke: VIDEO_COLOR
    });
    $("#photo-arc").attr({
        d: describeArc(117, 117, 85, audioArcAngle + videoArcangle + 1, audioArcAngle + videoArcangle + photoArcAngle),
        stroke: PHOTO_COLOR
    });
    $("#rest-arc").attr({
        d: describeArc(117, 117, 85, audioArcAngle + videoArcangle + photoArcAngle + 1, 360),
        stroke: REST_COLOR
    });
    // --------------------------------------------------

    // change dougnut diagram

    function changeDougnut() {
        audioArcAngle = findAngle(audioSpace, MAX_DATA);
        videoArcangle = findAngle(videoSpace, MAX_DATA);
        photoArcAngle = findAngle(photoSpace, MAX_DATA);

        audioPersent = findPersent(audioSpace, MAX_DATA);
        videoPersent = findPersent(videoSpace, MAX_DATA);
        photoPersent = findPersent(photoSpace, MAX_DATA);

        $(".statistic-round-diagram-widget-data-audio span").text(audioPersent + "%");
        $(".statistic-round-diagram-widget-data-video span").text(videoPersent + "%");
        $(".statistic-round-diagram-widget-data-photo span").text(photoPersent + "%");

        $("#audio-arc").attr({
            d: describeArc(117 , 117, 85, 0, audioArcAngle)
        });
        $("#video-arc").attr({
            d: describeArc(117, 117, 85, audioArcAngle + 1, audioArcAngle + videoArcangle)
        });
        $("#photo-arc").attr({
            d: describeArc(117, 117, 85, audioArcAngle + videoArcangle + 1, audioArcAngle + videoArcangle + photoArcAngle)
        });
        $("#rest-arc").attr({
            d: describeArc(117, 117, 85, audioArcAngle + videoArcangle + photoArcAngle + 1, 360)
        });
        $("#linear-diagram").replaceWith(makeLinearGraphic ());
    }
    // ------------------------------------------------------

    // switch between diagram stats and month report

    $(".statistic-round-diagram-widget-title").click(function(){
        if ($(this).attr("data-active") == "false") {
            $(this).css({"background-color": "#fff", "color": "#8e8071"});
            $(this).attr("data-active", "true");
            if ($(this).hasClass("statistic-round-diagram-widget-title-left")) {
                $(".statistic-round-diagram-widget-title-right").css({"background-color": "transparent", "color": "#fff"});
                $(".month-report").fadeOut(500);
                if ($(".statistic-round-diagram-widget-footer-share").attr("data-active") == "true") {
                    $(".statistic-round-diagram-widget-color-change").fadeOut(500);
                    $(".statistic-round-diagram-widget-footer-share").attr("data-active", "false");
                }
                if ($(".statistic-round-diagram-widget-footer-upload").attr("data-active") == "true") {
                    $(".statistic-round-diagram-widget-data-change").fadeOut(500);
                    $(".statistic-round-diagram-widget-footer-upload").attr("data-active", "false");
                }
                $(".diagram-stats").delay(500).fadeIn(500);
                $(".statistic-round-diagram-widget-title-right").attr("data-active", "false");
            } else {
                $(".statistic-round-diagram-widget-title-left").css({"background-color": "transparent", "color": "#fff"});
                $(".diagram-stats").fadeOut(500);
                if ($(".statistic-round-diagram-widget-footer-share").attr("data-active") == "true") {
                    $(".statistic-round-diagram-widget-color-change").fadeOut(500);
                    $(".statistic-round-diagram-widget-footer-share").attr("data-active", "false");
                }
                if ($(".statistic-round-diagram-widget-footer-upload").attr("data-active") == "true") {
                    $(".statistic-round-diagram-widget-data-change").fadeOut(500);
                    $(".statistic-round-diagram-widget-footer-upload").attr("data-active", "false");
                }
                $(".month-report").delay(500).fadeIn(500);
                $(".statistic-round-diagram-widget-title-left").attr("data-active", "false");
            }
        }
    });

    // change colors on diagrams

    function changeDiagramColors() {
        $(".statistic-round-diagram-widget-data-audio").css({"border-top": "4px solid " + currentAudioColor});
        $(".statistic-round-diagram-widget-data-video").css({"border-top": "4px solid " + currentVideoColor});
        $(".statistic-round-diagram-widget-data-photo").css({"border-top": "4px solid " + currentPhotoColor});
        $("#audio-arc").attr({
            stroke: currentAudioColor
        });
        $("#video-arc").attr({
            stroke: currentVideoColor
        });
        $("#photo-arc").attr({
            stroke: currentPhotoColor
        });
        dataColors = {audio: currentAudioColor, video: currentVideoColor, photo: currentPhotoColor, rest: REST_COLOR};
        $("#linear-diagram").replaceWith(makeLinearGraphic ());
    }
    // --------------------------------------------------

    // input color plugin instances

    $('.audio-color').ColorPicker({
        color: currentAudioColor,
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('.audio-color').css('backgroundColor', '#' + hex);
        },
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).val(hex);
            $(el).ColorPickerHide();
            currentAudioColor = "#" + hex;
        }
    });

    $('.video-color').ColorPicker({
        color: currentVideoColor,
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('.video-color').css('backgroundColor', '#' + hex);
        },
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).val(hex);
            $(el).ColorPickerHide();
            currentVideoColor = "#" + hex;
        }
    });

    $('.photo-color').ColorPicker({
        color: currentPhotoColor,
        onShow: function (colpkr) {
            $(colpkr).fadeIn(500);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(500);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('.photo-color').css('backgroundColor', '#' + hex);
        },
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).val(hex);
            $(el).ColorPickerHide();
            currentPhotoColor = "#" + hex;
        }
    });
    // -------------------------------------------------------

    // change color button

    $(".audio-color").css({"background-color": currentAudioColor});
    $(".video-color").css({"background-color": currentVideoColor});
    $(".photo-color").css({"background-color": currentPhotoColor});


    var changeFooterShareActive = false;
    $(".statistic-round-diagram-widget-footer-share").click(function () {
        if (changeFooterShareActive) {
            return;
        }
        changeFooterShareActive = true;
        if ($(this).attr("data-active") == "false") {
            $(".statistic-round-diagram-widget-content > ").fadeOut(700);
            $(".statistic-round-diagram-widget-color-change").fadeIn(1000, function () {
                changeFooterShareActive = false;
            });
            if ($(".statistic-round-diagram-widget-footer-upload").attr("data-active") == "true") {
                $(".statistic-round-diagram-widget-footer-upload").css({"background-color": ""});
                $(".statistic-round-diagram-widget-footer-upload").attr("data-active", "false");
            }
            $(this).css({"background-color": "#64584c"});
            $(this).attr("data-active", "true");
        } else {
            changeDiagramColors();
            $(".statistic-round-diagram-widget-content > ").fadeIn(1000, function () {
                changeFooterShareActive = false;
            });
            $(".statistic-round-diagram-widget-color-change").css({"display": "none"});
            $(".statistic-round-diagram-widget-data-change").css({"display": "none"});
            if ($(".statistic-round-diagram-widget-title-left").attr("data-active") == "true") {
                $(".month-report").css({"display": "none"});
            } else {
                $(".diagram-stats").css({"display": "none"});
            }
            $(this).css({"background-color": ""});
            $(this).attr("data-active", "false");
        }
    });
    // ------------------------------------------------------

    // submit button on change color block

    var submitButtonActive = false;

    $(".color-picker-block-submit-button").click(function () {
        if (submitButtonActive) {
            return;
        }
        submitButtonActive = true;
        changeDiagramColors();
        $(".statistic-round-diagram-widget-content > ").fadeIn(1000, function () {
            submitButtonActive = false;
        });
        $(".statistic-round-diagram-widget-color-change").css({"display": "none"});
        $(".statistic-round-diagram-widget-data-change").css({"display": "none"});
        if ($(".statistic-round-diagram-widget-title-left").attr("data-active") == "true") {
            $(".month-report").css({"display": "none"});
        } else {
            $(".diagram-stats").css({"display": "none"});
        }
        $(".statistic-round-diagram-widget-footer-share").css({"background-color": ""});
        $(".statistic-round-diagram-widget-footer-share").attr("data-active", "false");
    });
    // ---------------------------------------------------------------


    // helper functions for change data block
    function findMaxData (fileSpace) {
        var rest = MAX_DATA - totalSpace;
        var filesMax = Math.round(rest * 1024 / fileSpace);
        return filesMax
    }

    function changeMaxFiles () {
        $(".statistic-round-diagram-widget-data-change-audio-max").text(" - you can add " + findMaxData(AUDIO_FILE_SPACE) + " files");
        $(".statistic-round-diagram-widget-data-change-video-max").text(" - you can add " + findMaxData(VIDEO_FILE_SPACE) + " files");
        $(".statistic-round-diagram-widget-data-change-photo-max").text(" - you can add " + findMaxData(PHOTO_FILE_SPACE) + " files");
    }

    // change number of files
    changeMaxFiles ();
    // ----------------------------------------------------------

    // jquery ui spinner instances
    $("#audio-spinner").spinner({
        min: 0,
        stop: function(event, ui) {
            currentAudioFiles = ($(this).spinner("value"));
            updateData ();
            $("#video-spinner").spinner({max: currentVideoFiles + findMaxData(VIDEO_FILE_SPACE)});
            $("#photo-spinner").spinner({max: currentPhotoFiles + findMaxData(PHOTO_FILE_SPACE)});
            changeMaxFiles ();
        }
    });

    $("#audio-spinner").spinner( "value", currentAudioFiles);
    $("#audio-spinner").spinner({max: currentAudioFiles + findMaxData(AUDIO_FILE_SPACE)});

    $("#video-spinner").spinner({
        min: 0,
        stop: function(event, ui) {
            currentVideoFiles = ($(this).spinner("value"));
            updateData ();
            $("#audio-spinner").spinner({max: currentAudioFiles + findMaxData(AUDIO_FILE_SPACE)});
            $("#photo-spinner").spinner({max: currentPhotoFiles + findMaxData(PHOTO_FILE_SPACE)});
            changeMaxFiles ();
        }
    });
    $("#video-spinner").spinner( "value", currentVideoFiles);
    $("#video-spinner").spinner({max: currentVideoFiles + findMaxData(VIDEO_FILE_SPACE)});

    $("#photo-spinner").spinner({
        min: 0,
        stop: function(event, ui) {
            currentPhotoFiles = ($(this).spinner("value"));
            updateData ();
            $("#video-spinner").spinner({max: currentVideoFiles + findMaxData(VIDEO_FILE_SPACE)});
            $("#audio-spinner").spinner({max: currentAudioFiles + findMaxData(AUDIO_FILE_SPACE)});
            changeMaxFiles ();
        }
    });
    $("#photo-spinner").spinner( "value", currentPhotoFiles);
    $("#photo-spinner").spinner({max: currentPhotoFiles + findMaxData(PHOTO_FILE_SPACE)});
    // ------------------------------------------------------------

    // change data button

    var changeFooterUploadActive = false;
    $(".statistic-round-diagram-widget-footer-upload").click(function () {
        if (changeFooterUploadActive) {
            return;
        }
        changeFooterUploadActive = true;
        if ($(this).attr("data-active") == "false") {
            $(".statistic-round-diagram-widget-content > ").fadeOut(700);
            $(".statistic-round-diagram-widget-data-change").fadeIn(1000, function () {
                changeFooterUploadActive = false;
            });
            if ($(".statistic-round-diagram-widget-footer-share").attr("data-active") == "true") {
                $(".statistic-round-diagram-widget-footer-share").css({"background-color": ""});
                $(".statistic-round-diagram-widget-footer-share").attr("data-active", "false");
            }
            $(this).css({"background-color": "#64584c"});
            $(this).attr("data-active", "true");
        } else {
            $(".statistic-round-diagram-widget-content > ").fadeIn(1000, function () {
                changeFooterUploadActive = false;
            });
            $(".statistic-round-diagram-widget-color-change").css({"display": "none"});
            $(".statistic-round-diagram-widget-data-change").css({"display": "none"});
            if ($(".statistic-round-diagram-widget-title-left").attr("data-active") == "true") {
                $(".month-report").css({"display": "none"});
            } else {
                $(".diagram-stats").css({"display": "none"});
            }
            $(this).css({"background-color": ""});
            $(this).attr("data-active", "false");
        }
    });
    // ---------------------------------------------------------

    // submit button of change data block

    var submitButtonActive = false;
    $(".data-change-block-submit-button").click(function () {
        if (submitButtonActive) {
            return;
        }
        submitButtonActive = true;
        changeDougnut();
        $(".statistic-round-diagram-widget-content > ").fadeIn(1000, function () {
            submitButtonActive = false;
        });
        $(".statistic-round-diagram-widget-color-change").css({"display": "none"});
        $(".statistic-round-diagram-widget-data-change").css({"display": "none"});
        if ($(".statistic-round-diagram-widget-title-left").attr("data-active") == "true") {
            $(".month-report").css({"display": "none"});
        } else {
            $(".diagram-stats").css({"display": "none"});
        }
        $(".statistic-round-diagram-widget-footer-upload").css({"background-color": ""});
        $(".statistic-round-diagram-widget-footer-upload").attr("data-active", "false");
    });
    // -------------------------------------------------------------------

    // restore default options

    var changeFooterBackUpActive = false;

    $(".statistic-round-diagram-widget-footer-back-up").click(function () {
        if (changeFooterBackUpActive) {
            return;
        }
        changeFooterBackUpActive = true;

        if ($(".statistic-round-diagram-widget-footer-share").attr("data-active") == "true") {
            $(".statistic-round-diagram-widget-footer-share").css({"background-color": ""});
            $(".statistic-round-diagram-widget-footer-share").attr("data-active", "false");
        }
        if ($(".statistic-round-diagram-widget-footer-upload").attr("data-active") == "true") {
            $(".statistic-round-diagram-widget-footer-upload").css({"background-color": ""});
            $(".statistic-round-diagram-widget-footer-supload").attr("data-active", "false");
        }
        setDefaultSettings ();
        updateData ();
        changeDiagramColors();
        changeDougnut();
        $(".statistic-round-diagram-widget-content > ").fadeIn(1000, function () {
            changeFooterUploadActive = false;
        });
        $(".statistic-round-diagram-widget-color-change").css({"display": "none"});
        $(".statistic-round-diagram-widget-data-change").css({"display": "none"});
        if ($(".statistic-round-diagram-widget-title-left").attr("data-active") == "true") {
            $(".month-report").css({"display": "none"});
        } else {
            $(".diagram-stats").css({"display": "none"});
        }
    });
    // ----------------------------------------------------------------------------

    // navigation menu widget script

    function setBorderRadius(elem, slide) {
        if ($(elem).css("border-top-left-radius") == "5px") {
            if (slide == "up") {
                return {"border-bottom-left-radius": "5px"}
            }else {
                return {"border-bottom-left-radius": "0px"}
            }
        } else {
            if (slide == "up") {
                return {"border-bottom-right-radius": "5px"}
            }else {
                return {"border-bottom-right-radius": "0px"}
            }
        }
    }

    var active = false;

    $(".navigation-widget-menu-item").click(function() {

        if (active) {
            return;
        }

        active = true;
        if ($(this).attr("data-active") == "false") {
            if ($(".navigation-widget-menu-item[data-active='true']").length == 1) {
                var activeClass = $(".navigation-widget-menu-item[data-active='true']")[0];
                var borderBottomRadiusUp = setBorderRadius(activeClass, "up");
                $(activeClass).next("li").find(".navigation-widget-menu-dropbox").slideUp(1000, function() {
                    $(activeClass).css({"background-color": "#fff", "border-bottom": "none" });
                    $(activeClass).css(borderBottomRadiusUp);
                    active = false;
                });
                $(activeClass).attr("data-active", "false");
            }
            var borderBottomRadius = setBorderRadius($(this), "down");
            $(this).css(borderBottomRadius);
            $(this).css({"background-color": "#f8f3f0", "border-bottom": "3px solid #49a371"});
            if ($(this).hasClass("navigation-widget-menu-my-profile")) {
                $(".navigation-widget-sale-block").animate({"left": "220px"}, 870);
            } else {
                $(".navigation-widget-sale-block").animate({"left": "16px"}, 1100);
            }
            $(this).next("li").find(".navigation-widget-menu-dropbox").slideDown(1000, function () {
                active = false;
            });
            $(this).attr("data-active", "true");
        } else {
            var thisClass = $(this);
            var borderBottomRadius = setBorderRadius($(this), "up");
            $(this).next("li").find(".navigation-widget-menu-dropbox").slideUp(1000, function() {
                $(thisClass).css(borderBottomRadius);
                $(thisClass).css({"border-bottom": "none"});
                active = false;
            });
            $(".navigation-widget-sale-block").animate({"left": "119px"}, 1000);
            $(this).css({"background-color": "#fff"});
            $(this).attr("data-active", "false");
        }
    });
    // ----------------------------------------------------------------

    // blog post widget script

    var views = 172;
    var comments = 34;
    var likes = 210;

    function makeComment (i, text) {
        if (typeof text == "undefined") {
            var com = "<article class='comments-area-comment-article'>" +
                "<h3 class='comments-area-comment-title'>Some user</h3>" +
                "<p class='comments-area-comment'>Lorem ipsum dolor sit amet, consectetur adipiscing elit," +
                " sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>" +
                "<span id='comments-like-icon" + i + "' class='icon-heart' data-active='false'>0</span></article>";
        } else {
            var com = "<article class='comments-area-comment-article'>" +
                "<h3 class='comments-area-comment-title'>Your nickname</h3>" +
                "<p class='comments-area-comment'>" + text + "</p>" +
                "<span id='comments-like-icon" + i + "' class='icon-heart'data-active='false'>0</span></article>";
        }
        return com;
    }

    function makeCommentArea(commentsNum) {
        var result = {};
        for (var i = 0; i < commentsNum; i++) {
            result[i] = makeComment (i);
        }
        return result;
    }

    var commentsData = makeCommentArea(comments);

    function addCommentsInDom (data) {
        $(".blog-post-widget-comments-block-comments-area").append(data);

    }

    function addCommentsDataInDom (data) {
        for (key in data) {
            addCommentsInDom (data[key]);
        }
    }

    addCommentsDataInDom (commentsData);

    // add numbers of views, comments, likes in DOM
    function updateNumbers () {
        $(".blog-post-widget-footer-views-number").text(views);
        $(".blog-post-widget-footer-comments-number").text(comments);
        $(".blog-post-widget-footer-likes-number").text(likes);
    }
    updateNumbers ();

    $(".blog-post-widget-footer-likes").click(function () {
        if ($(this).attr("data-active") == "false") {
            likes += 1;
            updateNumbers ();
            $(".blog-post-widget-footer-likes > *").css({"color": "#e86741", "opasity":"1"});
            $(this).attr("data-active", "true");
        } else {
            likes -= 1;
            updateNumbers ();
            $(".blog-post-widget-footer-likes > *").css({"color": "#8e8071", "opasity":".7"});
            $(this).attr("data-active", "false");
        }
    });

    // add comennt like

    $(document).on("click","[id^='comments-like-icon']",function () {
        if ($(this).attr("data-active") == "false") {
            var like = Number($(this).text()) + 1;
            $(this).text(like);
            $(this).css({"color": "#e86741", "opasity":"1"});
            $(this).attr("data-active", "true");
        } else {
            var like = Number($(this).text()) - 1;
            $(this).text(like);
            $(this).css({"color": "#8e8071", "opasity": ".7"});
            $(this).attr("data-active", "false");
        }
    });

    $(".blog-post-widget-comments-block-user-comment-add-button"). click(function () {
        var text = $("#blog-post-widget-comments-block-user-comment").val();
        if (text !== "") {
            var i = Object.keys(commentsData).length;
            var comment = makeComment (i, text);
            commentsData[i] = comment;
            addCommentsInDom (comment);
            $("#blog-post-widget-comments-block-user-comment").val("");
            comments += 1;
            updateNumbers ();
            $(".blog-post-widget-comments-block-comments-area").animate({ scrollTop: $(".blog-post-widget-comments-block-comments-area").prop("scrollHeight")}, 1000);
        }
    });


    var commentsActive = false;
    $(".blog-post-widget-footer-comments").click(function () {
        if (commentsActive) {
            return;
        }
        commentsActive = true;
        if ($(this).attr("data-active") == "false") {
            $(".blog-post-widget-header , .blog-post-widget-content").fadeOut(1000);
            $(".blog-post-widget-comments-block").fadeIn(1000, function() {
                commentsActive = false;
            });
            $(".blog-post-widget-footer-comments").attr("data-active", "true");
            $(".blog-post-widget-footer-comments").css({"background-color": "#e9e3df"});
        } else {
            $(".blog-post-widget-comments-block").fadeOut(1000);
            $(".blog-post-widget-header , .blog-post-widget-content").fadeIn(1000, function() {
                commentsActive = false;
            });
            $(".blog-post-widget-footer-comments").attr("data-active", "false");
            $(".blog-post-widget-footer-comments").css({"background-color": "#f6f1ed"});
        }
    });

    var timerId = setInterval(function() {
        if (views > 500) {
            clearInterval(timerId);
        } else {
            views += 1;
            $(".blog-post-widget-footer-views-number").text(views);
        }
    }, 5000);
    // ----------------------------------------------------------------
    
    // contact form widget script
    var emailsToSend = [];

    var lenghtOfSpan = {1: 250, 2: 123, 3:80, 4:58, 5:45, 6:36, 7:30, 8:25, 9:22, 10:19};
    var emailColors = {1: "#5e90af", 2: "#4daf7b", 3: "#e15432", 4: "#ebc85e", 5: "#4cd3be"};

    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    }

    function addEmail (email, num) {
        var color = num % 5;
        if (color == 0) {
            color = 5;
        }
        $(".contact-form-widget-text-section-emails").append("<span style='background-color:" + emailColors[color] + "'>" + email + "</span>")
    }

    function changeWidthOfEmails() {
        var num = $(".contact-form-widget-text-section-emails > *").length;
        $(".contact-form-widget-text-section-emails span").css({"width": + lenghtOfSpan[num] + "px"});
    }

    function addValidComment (text) {
        $(".contact-form-widget-text-section-valide-comment").text(text);
        $(".contact-form-widget-text-section-valide-comment").fadeIn(500);
        var timerId = setTimeout(function(){
            $(".contact-form-widget-text-section-valide-comment").fadeOut(500);
        },2000)
    }

    function addSendMessage (text) {
        $(".contact-form-widget-send-message").text(text);
        $(".contact-form-widget-send-message").fadeIn(500);
        var timerId = setTimeout(function(){
            $(".contact-form-widget-send-message").fadeOut(500);
        },2000)
    }

    $(".contact-form-widget-text-section-contacts-form-add-button").click(function () {
        if($(this).attr("data-active") == "false" && $(".contact-form-widget-text-section-emails").has("span")) {
            $(".contact-form-widget-text-section-emails").fadeOut(500);
            $(".contact-form-widget-text-section-contacts-form-add-button").css({"color": "#b1a599"});
            $(".contact-form-widget-text-section-contacts-form").attr("placeholder", "Add mail");
            $(this).attr("data-active", "true");
        } else {
            var email = $(".contact-form-widget-text-section-contacts-form").val();
            if (isValidEmailAddress(email) && ($.inArray(email, emailsToSend)) == -1) {
                emailsToSend.push(email);
                addEmail (email,emailsToSend.length);
                changeWidthOfEmails();
                $(".contact-form-widget-text-section-contacts-form").val("");
                $(".contact-form-widget-text-section-contacts-form-add-button").css({"color": "#ede3dd"});
                $(".contact-form-widget-text-section-contacts-form-add-button").attr("data-active", "false");
                $(".contact-form-widget-text-section-contacts-form").attr("placeholder", "");
                $(".contact-form-widget-text-section-emails").fadeIn(500);
            } else {
                var text = "This email is not valid or has already been in contact list";
                addValidComment (text);

            }
        }
    });

    $(".contact-form-widget-send-section-button").click(function() {
        var subject = $(".contact-form-widget-text-section-subject-form").val();
        var message = $(".contact-form-widget-text-section-message-form").val();
        if (emailsToSend.length != 0 && subject !== "" && message !== "") {
            if ($("#copycheckbox").prop("checked")) {
                var text = "Your mail was sent and copy was saved"
            } else {
                var text = "Your mail was sent"
            }
            addSendMessage(text);
            $(".contact-form-widget-text-section-contacts-form").val("");
            $("#text-section-subject-form").val("");
            $(".contact-form-widget-text-section-message-form").val("");
            $(".contact-form-widget-text-section-contacts-form").attr("placeholder", "Add mail");
            $(".contact-form-widget-text-section-contacts-form-add-button").attr("data-active", "true");
            $(".contact-form-widget-text-section-contacts-form-add-button").css({"color": "#ede3dd"});
            emailsToSend = [];
            $(".contact-form-widget-text-section-emails").fadeOut(5);
            $(".contact-form-widget-text-section-emails").empty();

        }else {
            if (subject == "") {
                $("#text-section-subject-form").css({"border":"1px solid red", "color": "red"});
                $("#text-section-subject-form").val("This field is required");
                var timerId1 = setTimeout(function(){
                    $("#text-section-subject-form").css({"border":"1px solid #e5d4c2", "color":""});
                    $("#text-section-subject-form").val("");
                },2000)
            }
            if (emailsToSend.length == 0) {
                $(".contact-form-widget-text-section-contacts-form-wrapper").css({"border":"1px solid red", "color": "red"});
                $(".contact-form-widget-text-section-contacts-form").css({"color": "red"});
                $(".contact-form-widget-text-section-contacts-form").val("This field is required");
                var timerId2 = setTimeout(function(){
                    $(".contact-form-widget-text-section-contacts-form-wrapper").css({"border":"1px solid #e5d4c2", "color":""});
                    $(".contact-form-widget-text-section-contacts-form").css({"color": "#8e8071"});
                    $(".contact-form-widget-text-section-contacts-form").val("");
                },2000)
            }
            if (message == "") {
                $(".contact-form-widget-text-section-message-form").css({"border":"1px solid red", "color": "red"});
                $(".contact-form-widget-text-section-message-form").val("This field is required");
                var timerId3 = setTimeout(function(){
                    $(".contact-form-widget-text-section-message-form").css({"border":"1px solid #e5d4c2", "color":""});
                    $(".contact-form-widget-text-section-message-form").val("");
                },2000)
            }
        }
    });
    // -------------------------------------------------------------------------------------------

    // team game widget script

    var Nick = {"first-name": ["Nikolai", "Nikolay","Николай"], "last-name":["Zuenok","Зуенок"]};
    var Mark = {"first-name": ["Andrei", "Andrew", "Андрей", "Andrey"], "last-name": ["Markovich","Маркович"]};
    var Vlada = {"first-name": ["Vlada", "Влада"], "last-name": ["Vasilevich", "Василевич"]};
    var Serg = {"first-name": ["Sergei","Sergey", "Сергей"], "last-name": ["Sheleg", "Шелег"]};
    var Roma = {"first-name": ["Roman", "Роман"], "last-name": ["Polikarpov","Поликарпов"]};
    var Tim = {"first-name": ["Timofei", "Timofey", "Тимофей"], "last-name": ["Zhidovich", "Жидович"]};
    var ourTeam = {"nick":Nick,"mark":Mark,"serg":Serg,"vlada":Vlada,"tim":Tim,"roman":Roma};

    var numbers = {1: "First", 2: "Second", 3: "Third", 4: "Fourth", 5: "Fifth", 6: "Sixth"};
    var teammates = {};
    var step = 1;


    function checkTeammate (firstName, lastName) {
        for (var teammate in ourTeam) {
            for (var i = 0; i < ourTeam[teammate]["last-name"].length; i++) {
                if (lastName.toLowerCase() == ourTeam[teammate]["last-name"][i].toLowerCase()) {
                    for (var j = 0; j < ourTeam[teammate]["first-name"].length; j++) {
                        if (firstName.toLowerCase() == ourTeam[teammate]["first-name"][j].toLowerCase()) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    function makeGameResults() {
        var res = "";
        var len = 0;
        for (var key in teammates) {
            len += 1;
        }
        for (var i = 1; i <= len; i++) {
            var firstName = teammates[i]["first-name"];
            var lastName = teammates[i]["last-name"];
            if (checkTeammate (firstName, lastName)) {
                res += "<li style='color: #4daf7b'>" + firstName + " " + lastName + " - You are right!</li>";
            } else {
                res += "<li style='color: #e7643f'>" + firstName + " " + lastName + " - Sorry, this guy is not our teammate</li>";
            }

        }        
        return "<ol>" + res + "</ol>";
    }


    $(".button-next").click(function () {
        if ($(this).hasClass("button-end")){
            var firstName = $("#first-name-input").val();
            var lastName = $("#last-name-input").val();
            teammates[step] = {"first-name": firstName, "last-name": lastName};
            $(".team-game-widget-fieldset").fadeOut (500, function () {
                $(".button-next").removeClass("button-end");
                $(".team-game-results").prepend(makeGameResults());
                $(".team-game-results").slideDown(500);
            });
        } else  {
            var firstName = $("#first-name-input").val();
            var lastName = $("#last-name-input").val();
            teammates[step] = {"first-name": firstName, "last-name": lastName};
            step += 1;
            var newLegend = "<legend>" + numbers[step] + " teammate:</legend>";
            $(".team-game-widget-fieldset").fadeOut (500, function () {

                $(".team-game-widget-fieldset legend").replaceWith(newLegend);
                if (step == 6) {
                    $("button.button-next").text("End");
                    $("button.button-next").addClass("button-end");
                }
                $("#first-name-input").val("");
                $("#last-name-input").val("");
                $(".team-game-widget-fieldset").fadeIn(500);
            });
        }
    });

    $(".button-again").click(function () {
        teammates = {};
        step = 1;
        var newLegend = "<legend>" + numbers[step] + " teammate:</legend>";
        $(".team-game-results").slideUp(500, function () {
            $(".team-game-widget-fieldset legend").replaceWith(newLegend);
            $("button.button-next").text("Next");
            $("#first-name-input").val("");
            $("#last-name-input").val("");
            $(".team-game-results ol").remove();
            $(".team-game-widget-fieldset").fadeIn (500);
        });
    });
    // -----------------------------------------------------------------
    
    // backgroung animation

    var colors1 = new Array(
        [238,134,153],
        [238,167,111],
        [177,141,85],
        [171,213,148],
        [144,241,205],
        [230,145,62]);

    var colors2 = new Array(
        [234,84,87],
        [214,107,203],
        [187,164,233],
        [122,205,240],
        [79,231,197],
        [219,231,121]);

    var colors3 = new Array(
        [122,203,219],
        [82,222,112],
        [233,209,79],
        [230,148,129],
        [246,148,231],
        [187,148,227]);

    var colors4 = new Array(
        [168,224,134],
        [236,161,106],
        [231,139,180],
        [198,159,221],
        [132,170,233],
        [107,222,175]);

    var backgroundStep = 0;
//color table indices for:
// current color left
// next color left
// current color right
// next color right
    var colorIndices = [0,1,2,3];

//transition speed
    var gradientSpeed = 0.002;

    function updateGradient()
    {

        if ( $===undefined ) return;

        var c1_0_0 = colors1[colorIndices[0]];
        var c1_0_1 = colors1[colorIndices[1]];


        var c2_0_0 = colors2[colorIndices[0]];
        var c2_0_1 = colors2[colorIndices[1]];


        var c3_0_0 = colors3[colorIndices[0]];
        var c3_0_1 = colors3[colorIndices[1]];


        var c4_0_0 = colors4[colorIndices[0]];
        var c4_0_1 = colors4[colorIndices[1]];


        var istep = 1 - backgroundStep;
        var r1 = Math.round(istep * c1_0_0[0] + backgroundStep * c1_0_1[0]);
        var g1 = Math.round(istep * c1_0_0[1] + backgroundStep * c1_0_1[1]);
        var b1 = Math.round(istep * c1_0_0[2] + backgroundStep * c1_0_1[2]);
        var color1_1 = "rgba("+r1+","+g1+","+b1+",1)";
        var color1_2 = "rgba("+r1+","+g1+","+b1+",0)";

        var r2 = Math.round(istep * c2_0_0[0] + backgroundStep * c2_0_1[0]);
        var g2 = Math.round(istep * c2_0_0[1] + backgroundStep * c2_0_1[1]);
        var b2 = Math.round(istep * c2_0_0[2] + backgroundStep * c2_0_1[2]);
        var color2_1 = "rgba("+r2+","+g2+","+b2+",1)";
        var color2_2 = "rgba("+r2+","+g2+","+b2+",0)";

        var r3 = Math.round(istep * c3_0_0[0] + backgroundStep * c3_0_1[0]);
        var g3 = Math.round(istep * c3_0_0[1] + backgroundStep * c3_0_1[1]);
        var b3 = Math.round(istep * c3_0_0[2] + backgroundStep * c3_0_1[2]);
        var color3_1 = "rgba("+r3+","+g3+","+b3+",1)";
        var color3_2 = "rgba("+r3+","+g3+","+b3+",0)";

        var r4 = Math.round(istep * c4_0_0[0] + backgroundStep * c4_0_1[0]);
        var g4 = Math.round(istep * c4_0_0[1] + backgroundStep * c4_0_1[1]);
        var b4 = Math.round(istep * c4_0_0[2] + backgroundStep * c4_0_1[2]);
        var color4_1 = "rgba("+r4+","+g4+","+b4+",1)";
        var color4_2 = "rgba("+r4+","+g4+","+b4+",0)";

        $('#gradient').css({
            background: "-webkit-linear-gradient(45deg,"+color1_1+" 0%, "+color1_2+" 70%), -webkit-linear-gradient(315deg,"+color2_1+" 0%, "+color2_2+" 70%), -webkit-linear-gradient(225deg,"+color3_1+" 0%, "+color3_2+" 70%), -webkit-linear-gradient(135deg,"+color4_1+" 0%, "+color4_2+" 70%)"}).css({
            background: "linear-gradient(45deg,"+color1_1+" 0%, "+color1_2+" 70%), linear-gradient(135deg,"+color2_1+" 0%, "+color2_2+" 70%), linear-gradient(225deg,"+color3_1+" 0%, "+color3_2+" 70%), linear-gradient(315deg,"+color4_1+" 0%, "+color4_2+" 70%)"});

        backgroundStep += gradientSpeed;
        if ( backgroundStep >= 1 )
        {
            backgroundStep %= 1;
            colorIndices[0] = colorIndices[1];
            colorIndices[2] = colorIndices[3];

            //pick two new target color indices
            //do not pick the same as the current one
            colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors1.length - 1))) % colors1.length;
            colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors1.length - 1))) % colors1.length;

        }
    }

    setInterval(updateGradient,20);
    // ---------------------------------------------------------------
    
    // graphic widget script

    var graphicWidgetData = [621.62, 618.57, 622.28, 624.68, 622.94, 624.25, 621.85, 623.81, 620.98, 618.15, 622.51, 619.46, 622.08, 618.81, 622.74, 626.01, 624.05, 624.49, 621.44 , 628.72, 630.68, 629.16, 627.86, 628.29, 629.38, 632.87, 631.78, 633.3, 632.21, 634.39];
    var barGraphData = [11, 11, 48, 59, 22, 9, 21, 16, 14, 12, 11, 23, 20, 16, 13, 11, 9, 15, 14, 16, 20, 18, 10, 15, 12, 22, 26, 30, 24, 18];
    var AAPLData = [15, 19, 28, 34, 16, 30, 20, 6, 10];
    var minOfGraphicWidgetData = 0;
    var graphicWidgetYDelta = 0;
    var MaxMinDiffOfGraphicWidgetData = 0;
    var graphicWidgetHeight = $("#graphic-widget-line-diagram").height() - 5;
    var graphicWidgetWidth = $("#graphic-widget-line-diagram").width();


    function findMinAndMaxOfData (data) {
        var min = 1000000;
        var max = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i] > max) {
                max = data[i];
            }
            if (data[i] < min) {
                min = data[i]
            }
        }
        return [max, min, (max - min)];
    }



    function findAveradgeChange (data) {
        var dx = 0;
        var lastItem = data[0];
        for (var i = 1; i < data.length; i++) {
            if (Math.abs(data[i] - lastItem) > dx) {
                dx = Math.abs(data[i] - lastItem);
            }
            lastItem = data[i];
        }
        return dx;
    }

    console.log(findAveradgeChange (barGraphData));

    function getRandomArbitary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function changeBarGraphData (data) {
        var newData = data;
        newData.shift();
        newData.push(Math.round(getRandomArbitary(0, 65)));
        return newData
    }

    function changeGraphicWidgetData (data) {
        var averadge = findAveradgeChange (data);
        var increase = Math.random();
        var change =  getRandomArbitary(0, averadge);
        var newData = data;
        var lastElem = newData[data.length - 1];
        newData.shift();
        var newElem = 0;
        if (increase > 0.5) {
            newElem = lastElem + change;
        } else {
            newElem = lastElem - change;
        }
        newData.push(newElem);
        return newData;
    }
    function updateGraphicWidgetData() {
        minOfGraphicWidgetData = findMinAndMaxOfData (graphicWidgetData)[1];
        MaxMinDiffOfGraphicWidgetData = findMinAndMaxOfData (graphicWidgetData)[2];
        graphicWidgetYDelta = graphicWidgetHeight/MaxMinDiffOfGraphicWidgetData;
    }

    function updategraphicWidgetContent () {
        var item1 = graphicWidgetData[graphicWidgetData.length - 1];
        var item2 = graphicWidgetData[graphicWidgetData.length - 2];
        var text1 = item1.toFixed(2);
        var text2 = (item1 - item2).toFixed(2);
        var text3 = ((item1 - item2) / (item2 / 100)).toFixed(2) + "%";
        if ((item1 - item2) > 0) {
            text2 = "+" + text2;
        }
        if ((item1 - item2) < 0 ) {
            $(".triangle-up").css({"border-top": "8px solid #ffffff", "border-bottom": ""});
        } else {
            $(".triangle-up").css({"border-bottom": "8px solid #ffffff", "border-top": ""});
        }
        $(".graphic-widget-line-diagram-indication-text1").text(graphicWidgetData[graphicWidgetData.length - 1].toFixed(2));
        $(".graphic-widget-line-diagram-indication-text2").text(text2 + " (" + text3 + ")")
    }

    updateGraphicWidgetData();
    updategraphicWidgetContent ();

    function makeGraphicWidgetDiagramPath (data, min, delta) {
        var x = 0;
        var d = "";
        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                d += "M ";
            } else {
                d += "L ";
            }
            var y = graphicWidgetHeight - (data[i] - min) * delta;
            d += x + "," + y + " ";
            x += graphicWidgetWidth/30;
        }
        return d
    }

    function drawGraphicWidgetLineDiagram () {
        $("#graphic-widget-line-diagram-path").attr({
            d: makeGraphicWidgetDiagramPath(graphicWidgetData, minOfGraphicWidgetData, graphicWidgetYDelta),
            "stroke": "#fff",
            "stroke-width": "3px",
            "fill": "none"
        })
    }

    function changeGraphic (graph, elem) {
        graph.replaceWith(elem);
    }

    function drawLineBarGraph(x, y1, y2, color, width) {
        var line = "x1='"+ x + "' y1='" + y1 + "' x2='" + x + "' y2='" + y2 + "'";
        var path =  "<line " + line + " stroke='" + color + "' stroke-width='" + width + "'/>";
        return path
    }

    function drawGraphicWidgetBarGraph (data) {
        var res = "";
        var x = 4;
        for (var i = 0; i < data.length; i++) {
            var y2 = 70 - data[i];
            res += drawLineBarGraph(x, 70, y2, "#3d9e68", 5);
            x += 9.4
        }
        return res
    }

    function drawGraphicWidgetAAPLChart(data) {
        res = "";
        x = 5;
        for (var i = 0; i < data.length; i++) {
            var y2 = 40 - data[i];
            var color = 0;
            if (i < 6) {
                color = "#e55f3b";
            } else {
                color = "#4daf7b";
            }
            res += drawLineBarGraph(x, 40, y2, color, 9);
            res += drawLineBarGraph(x, y2, 0, "#f6f0ec", 9);
            x += 14
        }
        return res

    }

    function makeGraphicWidgetBarGraph () {
        return '<svg width="283" height="70" id="graphic-widget-bar-graph">' + drawGraphicWidgetBarGraph (barGraphData) + '</svg>';
    }

    function makeGraphicWidgetAAPLChart () {
        return '<svg width="124" height="40" id="graphic-widget-my-chart">' + drawGraphicWidgetAAPLChart(AAPLData)  + '</svg>';
    }
    $(".graphic-widget-bar-graph-wrapper").append(makeGraphicWidgetBarGraph ());
    $(".graphic-widget-bar-chart").append(makeGraphicWidgetAAPLChart ());

    function graphicWidgetTimeUpdate () {
        var dt = new Date();
        var hours = dt.getHours();
        var minutes = dt.getMinutes();
        var time = "Today ";
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (hours > 12) {
            time += hours - 12 + ":" + minutes + " pm";
        } else {
            time += hours + ":" + minutes + " am";
        }
        $(".graphic-widget-date-time-indication").text(time);
    }

    makeGraphicWidgetBarGraph ();
    makeGraphicWidgetAAPLChart ();
    drawGraphicWidgetLineDiagram ();
    graphicWidgetTimeUpdate ();

    setInterval (function () {
        graphicWidgetTimeUpdate();
        graphicWidgetData = changeGraphicWidgetData(graphicWidgetData);
        barGraphData = changeBarGraphData(barGraphData);
        updateGraphicWidgetData();
        updategraphicWidgetContent ();
        drawGraphicWidgetLineDiagram ();
        changeGraphic ($("#graphic-widget-bar-graph"), makeGraphicWidgetBarGraph ());
    },10000);
    
});