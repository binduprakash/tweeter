$(document).ready(function() {
  $('#textbox').keyup(function(){
    let counter = $('#textbox').parent().find('.counter');
    let remaining = 140 - this.value.trim().length;
    counter.text(remaining);
    if(remaining < 0){
      counter.css("color", "red");
    } else {
      counter.css("color", "black");
    }
  });
});

