$(document).ready(function() {

  /*
    Input event handler for #textbox (Textarea) to update the count
    when type in some character.
  */
  $('#textbox').on('input', function(){
    let $counter = $('#textbox').parent().find('.counter');
    let remaining = 140 - this.value.trim().length;
    $counter.text(remaining);
    if(remaining < 0){
      $counter.css("color", "red");
    } else {
      $counter.css("color", "black");
    }
  });
});

