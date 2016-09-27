function selectAll(ckb_name){
  var ret = '';
  $('input[type="checkbox"][name="'+ckb_name+'"]:checked').each(function(){
    ret += $(this).val() + ',';
  });
  if (ret != '') ret = ret.substring(0, ret.length-1);
  return ret;
}
