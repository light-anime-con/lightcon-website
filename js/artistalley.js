

function transformCharCode(code, amount) {
    var maxAllowed = 126;
    var minAllowed = 33;

    if (amount == 0) {
        return code;
    }
    if (code < minAllowed || code > maxAllowed) {
        return code;
    }

    // there is almost certainly a mod-based solution to this;
    // for addition it is something like 33 + ((ch - 33) + (amount-to-add)) % (126 - 33).
    // for subtraction it is something like (126 - ((126-ch+1+i) % (126-33+1)));
    // But testing it out proved to be non-trivial, and there are edge cases that fail
    // the above cycle formulas.
    //
    // So we do this method, of simply doing an inc/dec by 1 and checking each time until
    // we've done as many as have been requested. Slower, but shouldn't matter for most.
    // situations.
    //
    // -Deka
    var delta = 1;
    if (amount < 0) {
        delta = -1;
    }

    var distance = Math.abs(amount) % ((maxAllowed + 1) - minAllowed);
    for (var i = 0; i < distance; i++) {
        code += delta;
        if (code > maxAllowed) {
        code = minAllowed;
        } else if (code < minAllowed) {
        code = maxAllowed;
        }
    }
    return code;
}

function encodeAddress(addr) {
    var actualAddress = ""
    for (var i = 0; i < addr.length; i++) {
        var ch = addr.charCodeAt(i);
        ch = transformCharCode(ch, i+1);
        actualAddress += String.fromCharCode(ch);
    }
    return actualAddress;
}

function decodeAddress(addr) {
    var actualAddress = ""
    for (var i = 0; i < addr.length; i++) {
        var ch = addr.charCodeAt(i);
        ch = transformCharCode(ch, -(i+1));
        actualAddress += String.fromCharCode(ch);
    }
    return actualAddress;
}

(function() {
    Galleria.loadTheme('/galleria/themes/classic/galleria.classic.min.js');
    Galleria.configure({
      autoplay: true,
      responsive: true,
      lightbox: true
    });
    Galleria.run('.galleria');
  }());

$(document).ready(function() {
    function showEnlargedImage(elem) {
        var fullsizeSrc = $(elem).attr("src");
        if ($(elem).attr('data-fullsize')) {
            fullsizeSrc = $(elem).attr('data-fullsize');
        }
        $("#image-modal .image-caption").text($(elem).attr("alt"));
        $("#image-modal img.modal-content").attr("src", fullsizeSrc);
        $("#image-modal").show();
    }
    $(".enlargeable-image").on('click', function() {
        showEnlargedImage(this);
    });
    $(".enlargeable-image").each(function() {
        var elem = $("<p></p>").text("(Click to enlarge)");
        
        var parentImg = this;
        $(elem).on('click', function() {
            showEnlargedImage(parentImg);
        });
        $(elem).addClass('click-to-enlarge');
        $(this).after(elem);
    });
    $("#image-modal").on('click', function() {
        $("#image-modal").hide();
    });
    $(".email-gen").each(function() {
        var data = $(this).attr('data-gen')
        var parentElem = $(this);
        setTimeout(function() {
        var actualAddress = decodeAddress(data);
        parentElem.attr('href', 'mailto:' + actualAddress);
        var oldText = parentElem.text();
        parentElem.text(oldText.replace(/%%MAIL%%/g, actualAddress));
        }, 501);
    });
});