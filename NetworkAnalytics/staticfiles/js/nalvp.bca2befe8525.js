$(document).ready(function(){


    // These set of lines is to check whether drag and drop is possible or not
    var isAdvancedUpload = function() {
      var div = document.createElement('div');
      return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

    // The next set of lines add the class has-advanced-upload to the form element
    // if the browser supports it
    // var $form = $('.box');

    console.log(isAdvancedUpload);

    if (isAdvancedUpload) {
    }

    // To get the animation of adding the file
//     if (isAdvancedUpload) {

//       var droppedFiles = false;

//       $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
//         e.preventDefault();
//         e.stopPropagation();
//       })
//       .on('dragover dragenter', function() {
//         $form.addClass('is-dragover');
//       })
//       .on('dragleave dragend drop', function() {
//         $form.removeClass('is-dragover');
//       })
//       .on('drop', function(e) {
//         droppedFiles = e.originalEvent.dataTransfer.files;
//       });

//     }

//     $form.on('submit', function(e) {
//       if ($form.hasClass('is-uploading')) return false;

//       $form.addClass('is-uploading').removeClass('is-error');

//       if (isAdvancedUpload) {
//         // ajax for modern browsers
//         if (isAdvancedUpload) {
//           e.preventDefault();

//           var ajaxData = new FormData($form.get(0));
//           var data = {
//               uploaded_data: ajaxData,
//               overide: false
//           };

//           if (droppedFiles) {
//             $.each( droppedFiles, function(i, file) {
//               ajaxData.append( $input.attr('name'), file );
//             });
//           }

//           $.ajax({
//             url: "/uploadData/",
//             type: "POST",
//             data: JSON.stringify(data),
//             dataType: 'json',
//             beforeSend: function (xhr) {
//                 // This function sets the authorisation request header
//                 xhr.setRequestHeader ("Authorization", "Basic " + btoa("nalvp" + ":" + "na@lvpei"));
//                 function getCookie(name) {
//                     var cookieValue = null;
//                     if (document.cookie && document.cookie != '') {
//                         var cookies = document.cookie.split(';');
//                         for (var i = 0; i < cookies.length; i++) {
//                             var cookie = jQuery.trim(cookies[i]);
//                             // Does this cookie string begin with the name we want?
//                             if (cookie.substring(0, name.length + 1) == (name + '=')) {
//                                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                                 break;
//                             }
//                         }
//                     }
//                     return cookieValue;
//                 }
//                 xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
//             },
//             cache: false,
//             contentType: false,
//             processData: false,
//             complete: function() {
//               $form.removeClass('is-uploading');
//             },
//             success: function(data) {
//             //   $form.addClass( data.success == true ? 'is-success' : 'is-error' );
//             //   if (!data.success) $errorMsg.text(data.error);
//             console.log(data);
//             },
//             error: function() {
//               // Log the error, show an alert, whatever works for you
//             }
//           });
//         }
//       } else {
//         // ajax for legacy browsers
//     }
// });

    $('.dropify').dropify();

    drEvent.on('dropify.beforeClear', function(event, element){
        return confirm("Do you really want to delete \"" + element.filename + "\" ?");
    });



// $file = $('.dropify');

});



$(document).ready(function () {
    $('.sidenav').sidenav();
})