var cur_step = 1;
$(function(){
  $('#ifrm-service-create').attr('src', 'wizard/images.html');
  cur_step = 1;
});

function changeStep(step) {
  $('.mt-element-step .step-thin .mt-step-col').removeClass('done');
  $('.mt-element-step .step-thin .mt-step-col').removeClass('active');
  $($('.mt-element-step .step-thin .mt-step-col')[(step-1)]).addClass('done');
  $($('.mt-element-step .step-thin .mt-step-col')[(step-1)]).addClass('active');
}
function autoIframeHeight(){
  $('#ifrm-service-create').css('height', $(document, $('#ifrm-service-create'))[0].body.scrollHeight);
}
