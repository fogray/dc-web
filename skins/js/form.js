$(function(){
  $('input[type="checkbox"].selector.selector-all').click(function(){
    if (this.checked) {
      $('input[type="checkbox"][name="selector"]').each(function(){
        $(this).attr('checked', true).checkboxradio("refresh");
      });
    } else {
      $('input[type="checkbox"][name="selector"]:checked').each(function(){
        $(this).attr('checked', false).checkboxradio("refresh");
      });
    }
  });
});
