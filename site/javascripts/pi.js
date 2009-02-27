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

    $(document).ready(function() {
        // Fetch the data, then pre-cache the next data.
        fetchNext(function() {fetchNext(nextDigit)});
    }).keypress(function(e) {
        var digit = e.which - zero;
        if (digit < 0 || digit > 9) return true;

        if (digit != current_digit) return true;
        nextDigit();

        $("span.digit.next").before("<span class='digit'>" + digit + "</span> ");
        if (first) {
            $("span.digit.next").before(" <span class='digit point'>.</span> ");
            first = false;
        }
    });
})();