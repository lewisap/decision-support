var current, widget, btnnext, btnback, btnsubmit;
var savedMetrics = [];

var hideButtons = function (current) {
    "use strict";
    var limit = parseInt(widget.length);

    $(".action").hide();

    if (current < limit) {
        btnnext.show();
    }

    if (current > 1) {
        btnback.show();
    }

    if (current === limit) {
        btnnext.hide();
        btnsubmit.show();
    }
};

// Change progress bar action
var setProgress = function (currstep) {
    "use strict";
    var percent = parseFloat(100 / widget.length) * currstep;
    percent = percent.toFixed();
    $(".progress-bar")
        .css("width", percent + "%")
        .html(percent + "% Complete");
};

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
    });

    // Back button click action 	
    btnback.click(function () {
        if (current > 1) {
            current = current - 2;
            btnnext.trigger('click');
        }
        hideButtons(current);
    });

    // save the metric to JS array
    $('#addMetric').click(function (e) {
        var name = $('#metricName').val();
        var objective = $('#txtObjective').val();
        var goal = $('#txtGoal').val();
        var assumptions = $('#txtAssumptions').val();
        var considerations = $('#txtConsiderations').val();

        var list = $('#savedMetrics');
        var numSavedItems = $("#savedMetrics [href]").length;

        list.show();
        list.append('<a href="#" class="list-group-item savedMetric" id="metric-' + numSavedItems + '">' + name + '</a>');

        // save the metric to the metrics JS array as an object
        var metric = {};
        metric.name = name;
        metric.objective = objective;
        metric.goal = goal;
        metric.assumptions = assumptions;
        metric.considerations = considerations;

        savedMetrics[numSavedItems] = metric;

        // disable the add button once we hit 3 saved metrics (0 based)
        if (numSavedItems >= 2) {
            $(this).prop("disabled", true);
        }

        $("#frmMetrics").trigger('reset');
    });

    // click handler for user selecing an already saved metric
    $('#savedMetrics').on('click', 'a', function () {
        var arrNum = $(this).attr('id').split('-')[1];
        var obj = savedMetrics[arrNum];
        
        $('#metricName').val(obj.name);
        $('#txtObjective').val(obj.objective);
        $('#txtGoal').val(obj.goal);
        $('#txtAssumptions').val(obj.assumptions);
        $('#txtConsiderations').val(obj.considerations);
    });

    $('#btnStart').click(function (e) {
        $('#divTitle').hide();
        $('#divWorksheet').show("fast");
    });

    $('#btnSubmit').click(function (e) {
        e.preventDefault(); // don't auto-submit the form and navigate on
        $.ajax({
            type: "PUT",
            contentType: 'application/json',
            url: "/v1/documents?uri=example.json",
            data: JSON.stringify(savedMetrics),
        }).done(function (msg) {
            alert("Your data has been saved to the server");
        });
    });
});