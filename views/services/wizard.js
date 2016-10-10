var cur_step = 1;
$(function(){
  $('#ifrm-service-create').attr('src', 'images.html');
  cur_step = 1;
});

function changeStep(step) {
  $('.mt-element-step .step-thin .mt-step-col').removeClass('done');
  $('.mt-element-step .step-thin .mt-step-col').removeClass('active');
  $($('.mt-element-step .step-thin .mt-step-col')[(step-1)]).addClass('done');
  $($('.mt-element-step .step-thin .mt-step-col')[(step-1)]).addClass('active');
}
