$("#form").submit(function (e) {
    return false;
});



var predict = $("#predict");

predict.on("click", function () {

    var resultsRow = document.getElementById("results");
    resultsRow.style.visibility = "visible";
    var numValue = $("#fileText").val();


    if (isFileUpload) {
        var fileToUpload = document.getElementById('imageUpload').files[0];
        var formData = new FormData();
        formData.append('imageUpload', fileToUpload);
        $.ajax({
            url: '/api/classify',
            data: formData,
            type: 'post',
            dataType: 'text',
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            success: function (data) {
                console.log(JSON.parse(data))
                renderResponse(JSON.parse(data));
                return false;
            }
        })

    } else {
         $.get("/api/classify", {url: numValue}, function (data) {
        // Display the returned data in browser

               console.log(data)

       renderResponse(data);
         });
    }


});
var renderResponse= function (data){


         $('#barresults').html(getHtml(data))


$('#graph-container').append('<canvas id="barChart" width="250" height="250"><canvas>');

         var chartDiv = $("#barChart");
    var myChart = new Chart(chartDiv, {
        type: 'pie',
        data: {
            labels: [data.predictions[0].class, data.predictions[1].class, data.predictions[2].class],
            datasets: [
                {
                    data: [(data.predictions[0].prob*100),(data.predictions[1].prob*100),(data.predictions[2].prob*100)],
                    backgroundColor: [
                        "#1cc88a",
                        "#f6c23e",
                        "#e74a3b"
                    ]
                }]
        },
        options: {
            title: {
                display: false,
                text: 'Pie Chart'
            },
            responsive: true,
            maintainAspectRatio: false,
        }
    });





}

var getHtml=function (data){

        var resultHtml="";
         var classname = "";
        for (i in data.predictions) {
            console.log(data.predictions[i].class)


            if ((data.predictions[i].prob * 100) >= 80)
                classname = "bg-success"
            else if ((data.predictions[i].prob * 100) >= 70 && (data.predictions[i].prob * 100) < 80)
                classname = "bg-bg-info"
            else if ((data.predictions[i].prob * 100) >= 60 && (data.predictions[i].prob * 100) < 70)
                classname = "bg-primary"
            else if ((data.predictions[i].prob * 100) > 50 && (data.predictions[i].prob * 100) < 60)
                classname = "bg-warning"
            else if ((data.predictions[i].prob * 100) <= 50)
                classname = "bg-danger"


            resultHtml= resultHtml+
                " <h4 class=\"small fw-bold\">" + data.predictions[i].class + "<span class=\"float-end\">" + (data.predictions[i].prob * 100) + "%</span></h4>\n" +
                "                                <div class=\"progress mb-4\">\n" +
                "                                    <div class=\"progress-bar " + classname + "\" aria-valuenow=" + (data.predictions[i].prob * 100) + " aria-valuemin=\"0\"\n" +
                "                                         aria-valuemax=\"100\" style=\"width:" + (data.predictions[i].prob * 100) + "%;\"></div>\n" +
                "                                </div>"


        };

        return resultHtml;

        }


