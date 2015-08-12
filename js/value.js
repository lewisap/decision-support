var current, widget, btnnext, btnback, btnsubmit;

var hideButtons = function (current) {
    "use strict";
    var limit = parseInt(widget.length);

    $(".action").hide();

    if (current < limit) btnnext.show();
    if (current > 1) btnback.show();
    if (current == limit) {
        btnnext.hide();
        btnsubmit.show();
    }
}

$(document).ready(function () {
    "use strict";
    
    current = 1;
    widget = $(".step");
    btnnext = $(".next");
    btnback = $(".back");
    btnsubmit = $(".submit");

    // Init buttons and UI
    widget.not(':eq(0)').hide();
    hideButtons(current);
    setProgress(current);

    // Next button click action
    btnnext.click(function () {
        if (current < widget.length) {
            widget.show();
            widget.not(':eq(' + (current++) + ')').hide();
            setProgress(current);
        }
        hideButtons(current);
    })

    // Back button click action 	
    btnback.click(function () {
        if (current > 1) {
            current = current - 2;
            btnnext.trigger('click');
        }
        hideButtons(current);
    })
});

// Change progress bar action
setProgress = function (currstep) {
    var percent = parseFloat(100 / widget.length) * currstep;
    percent = percent.toFixed();
    $(".progress-bar")
        .css("width", percent + "%")
        .html(percent + "% Complete");
}

// Hide buttons according to the current step

// save the metric to hidden fields and manage the form appropriately
$('#addMetric').click(function (e) {
    var name = $('#metricName').val();
    var list = $('#savedMetrics');
    list.show();
    list.append('<a href="#" class="list-group-item">' + name + '</a>');

    var numSavedItems = $("#savedMetrics [href]").length;

    // disable the add button once we hit 3 saved metrics
    if (numSavedItems >= 3) {
        $(this).prop("disabled", true);
    }

    $("#frmMetrics").trigger('reset');
});

$('#btnStart').click(function (e) {
    $('#divTitle').hide();
    $('#divWorksheet').show("fast");
});