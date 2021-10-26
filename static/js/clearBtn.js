   window.reset = function (e) {

        e.wrap('<form>').closest('form').get(0).reset();
        e.unwrap();


    };



  var reset = $("#btn-reset");


    reset.on("click", function () {
        var output = document.getElementById('output');
        output.removeAttribute('src');
        output.hidden = true;
        var resultsRow = document.getElementById("results");
        resultsRow.style.visibility = "hidden";
        $('#barresults').html("")



        $('#barChart').remove();


    });