
//Функция Дебаунсинга, при нескольких событиях срабатывает последнее событие после паузы
var deb = function (fn, wait) {
    var timer;

    return function () {
        if (timer) {
            clearTimeout(timer);
        }

        var arg = arguments;
        timer = setTimeout(function () {
            fn.apply(this, arg);
            timer = null;
        }, wait)
    }
};

var nameOfFn = deb(function (param1, param2) {
    //some function
}, 500);

nameOfFn(param1, param2);



//AJAX
$.ajax({
    type: 'POST',
    url: solidinfo_params.ajax_url,
    data: {
        security: solidinfo_params.get_op_data_nonce,
        date_start: date_start,
        date_end: date_end,
        action: 'solidinfo_get_op_data'
    },
    dataType: "json",
    success: function (ecology) {

        ajaxReceiveAvailableDates(ecology, indexActive);

        $("#datepicker").datepicker('refresh');
        preloader(false, inputCount, selfCelendar, selfInput);
    }
    ,
    error: function () {
        console.log('Error!');
    }
});


//to top
function toTopInit() {
    var scrollUp = $('.scroll-up');
    $(window).on('scroll', function () {

        var scrollTop = $(document).scrollTop();
        if (scrollTop >= window.innerHeight) {
            scrollUp.show();
        } else {
            scrollUp.hide();
        }

    });
    scrollUp.on('click', function () {

        var body = $('html, body');
        var top = $(window).scrollTop(); // Get position of the body

        if (top != 0) {
            body.animate({scrollTop: 0}, 1000);
        }
    });
}
toTopInit();


//video watch youtube
function initHomeVideo($homeVideo) {
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;

    window.onYouTubePlayerAPIReady = function () {
        // create the global player from the specific iframe (#video)
        player = new YT.Player('video', {
            events: {
                // call this function when player is ready to use
                'onReady': onPlayerReady
            }
        });
    }

    function onPlayerReady(event) {

        // bind events

        $('#btn-watch').on("click", function () {

            player.playVideo();
        });

        $('.video-modal-close').on('click', function () {
            player.pauseVideo();
        });

    }
}
initHomeVideo(someVideo);


//phone mask
require("jquery-mask-plugin");
function phoneMask() {
    var maskInput = '.js-phone-mask';
    $(maskInput).mask("+38 (000) 000-00-00", {
            clearIfNotMatch: true
        }
    );
}
phoneMask();

//form validation
require('parsleyjs/dist/parsley');
require('parsleyjs/dist/i18n/en');
$('.form__valid').each(function (i, item) {

    $(item).parsley().on('form:validate', function (formInst) {
        var $inputName = $(this.element).find($("input, textarea"));
        if (formInst.isValid()) {
            console.log('valid');
            $($inputName).removeClass("error__input");
            $inputName.each(function (i, item) {
                $(item).removeClass("error__input");
            });
            app.$proposalWrapper.fadeOut();
        } else {
            console.log('no valid');
            $inputName.each(function (i, item) {
                if (!$(item).val()) {
                    $(item).addClass("error__input");
                } else {
                    $(item).removeClass("error__input");
                }
            });
        }
    });
});