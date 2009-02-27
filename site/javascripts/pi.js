(function() {
    var i = 0;
    var data = null;
    var next_data = null;
    var zero = "0".charCodeAt(0);

    function fetchNext(after) {
        data = next_data;
        i++;
        $.get("/data/pi." + i, {}, function(text, textStatus) {
            next_data = text;
            if (after) after();
        }, "text");
    }


    var data_i = 0;
    var current_digit = null;

    function nextDigit() {
        var digit = data[data_i];
        if (!digit) {
            fetchNext();
            data_i = 0;
            return nextDigit();
        }

        data_i++;
        current_digit = digit.charCodeAt(0) - zero;
        return current_digit;
    }


    var first = true;
    var timer, next;

    $(document).ready(function() {
        // Fetch the data, then pre-cache the next data.
        fetchNext(function() {fetchNext(nextDigit)});

        next = $("#next");
        timer = $.timer(750, function() {
            if (next.hasClass("on"))
                next.removeClass("on");
            else
                next.addClass("on");
        });
    }).keypress(function(e) {
        var digit = e.which - zero;
        if (digit < 0 || digit > 9) return true;

        if (digit != current_digit) {
            var wrong = $("#wrong");
            if (wrong.length != 0)
                wrong.text(digit);
            else
                next.before("<span class='digit' id='wrong'>" + digit + "</span> ");
            return false;
        }

        next.addClass("on");
        timer.reset(750);
        nextDigit();

        var wrong = $("#wrong");
        if (wrong.length != 0) {
            wrong.removeAttr("id");
            wrong.text(digit);
        } else
            next.before("<span class='digit'>" + digit + "</span> ");
        if (first) {
            next.before(" <span class='digit point'>.</span> ");
            first = false;
        }
    });
})();
