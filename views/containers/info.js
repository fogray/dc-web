var service_id = null;
var service_name = null;
$(function(){
  service_id = getParam('service_id');
  loadServiceInfo(service_id)
  $('#btnEdit').click(function(){
    window.location.href = 'edit.html?service_id='+service_id;
  });
  $('#btnScale').click(function(){
    var scales = NoUiSliderDom.getValue($('#slider-step')[0]);
    ServiceAction.scale(service_id, scales+'');
  });
  $(document).on('click', '#containers .item .item-title', function(){
    var cid = $(this).parent().attr('data-id');
    window.location.href = DC_CONFIG.WEBUI_CONTEXT+'/views/containers/info.html?cid='+cid;
  });
});

function loadServiceInfo(){
  ServiceAction.info(service_id, function(data, status){
    if (status == 'success'){
      service_name = data.Spec.Name;
      $('[name="service_name"]').html(service_name);
      //service state 由tasks获取
      $('#service_state').html('');
      $('#updatedAt').html(data.UpdatedAt);
      var cs = data.Spec.TaskTemplate.ContainerSpec;
      $('#image').html(cs.Image);
      $('#command').html(cs.hasOwnProperty('Command')?cs.Command.join(' '):'');
      if (data.Spec.Mode.hasOwnProperty('Replicated')) {
        $('#mode').html('Replicated');
        NoUiSliderDom.setValue($('#slider-step')[0], data.Spec.Mode.Replicated.Replicas);
      } else {
        $('#mode').html('global');
      }
      $('#restartCondition').html(data.Spec.TaskTemplate.RestartPolicy.Condition);
      $('#network').html(data.Spec.Networks[0].Target);
      var ports = data.Spec.EndpointSpec.Ports;
      if (ports != null && ports.length > 0){
        for (var i = 0; i < ports.length; i++) {
          var tr = '<tr><td>'+ports[i].TargetPort+'</td><td>'+ports[i].Protocol+'/'+ports[i].PublishedPort+'</td><tr>';
          $('#tblPorts tbody').append(tr);
        }
      }
      //Containers info
      var containers = data.ContainerInfo;
      $('#containers').html('');
      for (var i = 0; i < containers.length; i++) {
        var item = '<div class="col-md-6 item" data-id="'+containers[i].Id+'">'
                    +'<div class="col-md-6 item-title" title="'+containers[i].Name+'">'+containers[i].Name+'</div>'
                    +'<div class="col-md-2 item-state '+containers[i].State+'">'+containers[i].State+'</div>'
                    +'<div class="col-md-4 item-date">'+containers[i].Status+'</div>'
                  +'</div>';
        $('#containers').append(item)
      }
      
      //Env
      $('#tblEnvs tbody').html('');
      var envs = data.Spec.TaskTemplate.ContainerSpec.hasOwnProperty('Env') ? data.Spec.TaskTemplate.ContainerSpec.Env : [];
      for (var i = 0; i < envs.length; i++) {
        var env = envs[i].split('=');
        var tr = '<tr><td class="item-key">'+env[0]+'</td><td class="item-value">'+env[1]+'</td></tr>';
        $('#tblEnvs tbody').append(tr);
      }
    }
  });
}
