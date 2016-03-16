/* 
 * Copyright (C) 2016 Filippov Vladislav
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */


$(function () {

    var jsonURL;
    //imgURL = "http://localhost:3000/setimg";
    jsonURL = 'http://localhost:3000/setdata';

    // Variable to store your files
    var files;

// Add events
    $('input[type=file]').on('change', prepareUpload);

// Grab the files and set them to our variable
    function prepareUpload(event)
    {
        files = event.target.files;
    }

    $('#datetimepicker').datetimepicker(
            {
                language: 'ru',
                pickTime: false
            });

    $(document).on('change', '.btn-file :file', function () {
        var input = $(this),
                numFiles = input.get(0).files ? input.get(0).files.length : 1,
                label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    $(document).ready(function () {
        $('.btn-file :file').on('fileselect', function (event, numFiles, label) {

            var input = $(this).parents('.input-group').find(':text'),
                    log = numFiles > 1 ? numFiles + ' files selected' : label;

            if (input.length) {
                input.val(log);
                console.log(log);

            } else {
//                if (log)
//                    alert(log);
            }

        });
    });


    // send data
    $("#sendForm").submit(function (event) {

        // Stop form from submitting normally
        event.preventDefault();
//
//        $("#f1, #f2").html5Uploader({
//            name: "img",
//            postUrl: imgURL
//        });
        // Get some values from elements on the page:
        var $form = $(this);
        var dataValue = $form.find("input[id='data-value']").val();
        var polyCoord = $form.find("textarea[id='poly-coord']").val();
        var point1Coord = $form.find("textarea[id='pt1-coord']").val();
        var point2Coord = $form.find("textarea[id='pt2-coord']").val();
        var point1File = $form.find("input[id='pt1-file']").val();
        var point2File = $form.find("input[id='pt2-file']").val();

        // Send the data using post
        var posting = $.post(jsonURL, 
        {
            data: dataValue,
            polygon: polyCoord,
            point1: point1Coord,
            point1file: point1File,
            point2: point2Coord,
            point2file: point2File
        });

        // Put the results in a div
        posting.done(function (data) {
            $('#send-btn').addClass('btn-success');
            $('#send-btn').text('Сохранено');
        });

    });

});