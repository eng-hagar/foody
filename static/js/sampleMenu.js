   var getURL = function (event, link) {
        event.preventDefault()

        console.log("event" + link.href);

        var field = document.getElementById("fileText");
        field.value = link.href;
        var outputImage = $('#output')
        outputImage.attr('src', link.href);
        outputImage.show();
        outputImage.removeAttr('hidden');

        return false
    };
