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

    var firstFile, secondFile, imgURL, jsonURL;
    imgURL = "http://localhost:3000/setimg/";
    jsonURL = 'http://localhost:3000/setdata';
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

        // Get some values from elements on the page:
        var $form = $(this);
        var term = $form.find("input[id='data-value']").val();


        // Send the data using post
        var posting = $.post(jsonURL, {data: term});

        // Put the results in a div
        posting.done(function (data) {
            console.log('POST sending');
//            var content = $(data).find("#content");
//            $("#result").empty().append(content);
        });
        // send file
        $("#f1, #f2").html5Uploader({
            name: "img",
            postUrl: imgURL
        });
    });


});