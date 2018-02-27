
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

//init google map
var cont = {
    initMap: function() {
        window.initMap = function () {
            function mapInit(map, lat, lng) {
                var coords = {lat: lat, lng: lng};
                var map = new google.maps.Map(document.getElementById(map), {
                    zoom: 10,
                    center: coords
                });
                var PhoneMedia = window.matchMedia("(max-width: 800px)");
                var image = "";
                if(PhoneMedia.matches) {
                    image = "./images/marker/marker-320.png";
                } else {
                    image = "./images/marker/marker.png";
                }
                var marker = new google.maps.Marker({
                    position: coords,
                    map: map,
                    icon: image
                });
            }
            mapInit('mapN', 51.961034, 6.025370);
            mapInit('mapU', 49.829508, 30.111414);
            mapInit('mapB', 53.133599, 29.222612);

        };
    }
};
$('html').append($(`<script async defer 
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAf9OSJCuQhWNsN7xgkrGvRFMr5UUsYUvw&callback=initMap">
			</script>
			`));
cont.initMap();

// Custom select

//html
// .select-block__prise.js-select3230
//     select
//         option(value='1') названию (а-я)
//         option(value='2') названию (я-а)
//         option(value='3') цене (по возрастанию)
//         option(value='4') цена (по убыванию)
//         option(value='5') популярности
//         option(value='6') оценке товара

//js
require('./jquery.select3230');

function initSelect3230(selector, options) {
    const $select3230 = $(selector);

    if(!$select3230[0]) {
        console.log(`Не найден элемент "${selector}"`);
        return;
    }

    $(selector).select3230(options)
}

window.itua = window.itua || {};
window.itua.initSelect3230 = initSelect3230;
module.exports = initSelect3230;
initSelect3230('.js-select3230');