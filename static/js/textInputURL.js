  jQuery(document).ready(function ($) {


            $('#fileText').bind('change keydown paste input', function () {
                console.log("bind")
                var outputImage = $('#output')
                outputImage.attr('src', $(this).val());
                outputImage.show();
                outputImage.removeAttr('hidden');
                 isFileUpload = false;

                console.log("image", $('#output').attr('src'))
            });

        });