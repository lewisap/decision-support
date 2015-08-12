/*jslint browser: true*/
/*global $, jQuery, alert*/

var current, widget, btnNext, btnStart, btnBack, btnSubmit, btnAddMetric, btnCalcWeights, btnContinue, frmContinue;
var savedMetrics = [];

var hideButtons = function (current) {
    "use strict";
    var limit = parseInt(widget.length);

    $(".action").hide();

    if (current < limit) {
        btnNext.show();
    }

    if (current > 1) {
        btnBack.show();
    }

    if (current === limit) {
        btnNext.hide();
        btnSubmit.show();
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

    // set up our obj references
    current = 1;
    widget = $(".step");
    btnNext = $(".next");
    btnBack = $(".back");
    btnSubmit = $(".submit");
    btnAddMetric = $("#btnAddMetric");
    btnCalcWeights = $('#btnCalcWeights');
    btnContinue = $('#btnContinue');
    btnStart = $('#btnStart');
    frmContinue = $('#frmContinue');

    // Init buttons and UI
    widget.not(':eq(0)').hide();
    hideButtons(current);
    setProgress(current);

    // Next button click action
    btnNext.click(function () {
        if (current < widget.length) {
            widget.show();
            widget.not(':eq(' + (current++) + ')').hide();
            setProgress(current);
        }
        hideButtons(current);
    });

    btnBack.click(function () {
        if (current > 1) {
            current = current - 2;
            btnNext.trigger('click');
        }
        hideButtons(current);
    });

    // save the metric to JS array
    btnAddMetric.click(function (e) {
        var name, objective, goal, assumptions, considerations, list, numSavedItems, metric;

        name = $('#metricName').val();
        objective = $('#txtObjective').val();
        goal = $('#txtGoal').val();
        assumptions = $('#txtAssumptions').val();
        considerations = $('#txtConsiderations').val();

        list = $('#savedMetrics');
        numSavedItems = $("#savedMetrics [href]").length;

        list.show();
        list.append('<a href="#" class="list-group-item savedMetric" id="metric-' + numSavedItems + '">' + name + '</a>');

        // save the metric to the metrics JS array as an object
        metric = {};
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
        var arrNum, obj;
        
        arrNum = $(this).attr('id').split('-')[1];
        obj = savedMetrics[arrNum];

        $('#metricName').val(obj.name);
        $('#txtObjective').val(obj.objective);
        $('#txtGoal').val(obj.goal);
        $('#txtAssumptions').val(obj.assumptions);
        $('#txtConsiderations').val(obj.considerations);
    });

    btnStart.click(function (e) {
        $('#divTitle').hide();
        $('#divWorksheet').show("fast");
    });

    btnSubmit.click(function (e) {
        $.ajax({
            type: "PUT",
            contentType: 'application/json',
            url: "/v1/documents?uri=example.json",
            data: JSON.stringify(savedMetrics)
        }).success(function (msg) {
            //alert("Your data has been saved to the server");
            $('#alertSaveSuccess').show();
        }).error(function (msg) {
            $('#alertSaveError').show();
        });
    });

    btnCalcWeights.click(function (e) {
        alert('placeholder functionality');
    });
    
    btnContinue.click(function (e) {
        frmContinue.submit();
    });
});