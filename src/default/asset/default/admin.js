/* Peento default JavaScript */
$(document).ready(function () {

   // init tag-it
  $('input[role="tag-it"]').each(function () {
    var $me = $(this);
    var tags = $me.data('tags');
    if (!tags) tags = '';
    tags = tags.split(',');
    $me.tagit({
      availableTags: tags
    });
  });

});
