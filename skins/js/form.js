function selectAll(ckb_name){
  $('input[type="checkbox"][name="'+ckb_name+'"]').each(function(){
    $(this).attr('checked', true);
  });
}
