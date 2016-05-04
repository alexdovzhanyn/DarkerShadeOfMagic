var select1 = function(caller, name) {
  $('.active').removeClass('active');
  $(caller).addClass('active');
  $("#player1final").val(name).change();
}

var select2 = function(caller, name) {
  $('.active2').removeClass('active2');
  $(caller).addClass('active2');
  $("#player2final").val(name).change();
}
