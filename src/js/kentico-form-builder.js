//Add the uploaded file name next to the input.
$('.uploader-upload').each(function() {
    $(this).append('<span></span>');
    let fileInput = $('.uploader-input-file', this);
    fileInput.on('change', function() {
        fileInput.next().next().text(this.value);
    });
});
