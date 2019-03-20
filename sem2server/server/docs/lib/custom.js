var APPDATA = {
    apiDef: undefined,
    apiDefExt: undefined
};

var loadApiDef = function (data) {
    APPDATA.apiDef = data;
};

var loadApiExt = function (data) {
    APPDATA.apiDefExt = data;
};

var otherAPIInfo;

function loadOtherAPIInfo(cb) {
    if (APPDATA.apiDefExt) {
        otherAPIInfo = APPDATA.apiDefExt;
        cb();
    }
    else {
        $.getJSON('config.json', function (config) {
            $.getJSON(config.staticExtend || config.extend, function (data) {
                otherAPIInfo = data;
                cb();
            });
        });
    }
};

$(document).ready(function () {
    $('#header').remove();
    var interval = setInterval(function () {
        if (window.swaggerUi && window.swaggerUi.api) {
            buildModelMenu();
            refixElementStyle();
            loadOtherAPIInfo(function () {
                appendDescriptionForModel();
            });
            $('.description_readMore').click(function () {
                if ($(this).html().indexOf('more') !== -1) {
                    $(this).parent().addClass('showAll');
                    $(this).html('Hide');
                } else {
                    $(this).parent().removeClass('showAll');
                    $(this).html('Read more');
                }
            });

            clearInterval(interval);
        }
    }, 1000);
});

function buildModelMenu() {
    var itemList = $('#resources').children();
    for (var i = 0; i < itemList.length; i = i + 1) {
        $('#model_menu').append($('#' + itemList[i].id + ' > div'));
    }
};

function refixElementStyle() {
    $('#message-bar').remove();

    $('div[class="description"]').css('display', 'block');

    var elementList = $('.signature-nav > li').children();
    for (var i = 0; i < elementList.length; i = i + 1) {
        var html = $(elementList[i]).html();
        $(elementList[i]).parent().html(html);
        $(elementList[i]).remove();
    }

    elementList = $('.sandbox');
    for (var i = 0; i < elementList.length; i = i + 1) {
        var paramContentType = $(elementList[i]).find('.parameter-content-type');
        $(elementList[i]).append(paramContentType);
    }

    //Hide value column in Parameters table
    elementList = $('.operation-params > tr');
    for (var i = 0; i < elementList.length; i = i + 1) {
        $($(elementList[i]).children()[1]).addClass('removeMe').css('display', 'none');
        $($(elementList[i]).find('.signature-nav')).addClass('removeMe').css('display', 'none');
        $($(elementList[i]).find('.signature-container')).addClass('removeMe').css('display', 'none');
    }
    elementList = $('.parameters > thead > tr');
    for (var i = 0; i < elementList.length; i = i + 1) {
        $($(elementList[i]).children()[1]).addClass('removeMe').css('display', 'none');
    }

    $('.submit').remove();
    //$('.operation-params > tr').children()[1].remove();
}

function appendDescriptionForModel() {
    if (otherAPIInfo && otherAPIInfo.definitions) {
        var properties = Object.keys(otherAPIInfo.definitions);
        for (var i = 0; i < properties.length; i = i + 1) {
            $('#' + properties[i] + '_endpoint_list').prepend('<div class="custom_resource_description">' + otherAPIInfo.definitions[properties[i]].description + '</div>');
            $('#' + properties[i] + '_endpoint_list').prepend('<div class="custom_resource_header">' + properties[i] + '</div>');
        }
    }
    $('.custom_resource_header').click(function () {
        $(this).parent().css('display', 'none');
    });
};
