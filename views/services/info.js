var service_id = null;
var service_name = null;
$(function(){
  service_id = getParam('service_id');
  loadServiceInfo(service_id)
});

function loadServiceInfo(){
  ServiceAction.info(service_id, function(data, status){
    if (status == 'success'){
      service_name = data.Spec.Name;
      $('[name="service_name"]').html(service_name);
      //service state 由tasks获取
      $('#service_state').html('');
      $('#updatedAt').html(data.UpdatedAt);
      $('#image').html(data.Spec.TaskTemplate.ContainerSpec.Image);
      $('#command').html(data.Spec.TaskTemplate.ContainerSpec.Command.join(' '));
      $('#mode').html(data.Spec.Mode.hasOwnProperty('Replicated') ? 'Replicated' : 'global');
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
        var itm = '<div class="col-md-6">'
                    +'<div class="col-md-6">'+containers[i].Name+'</div>'
                    +'<div class="col-md-2">'+containers[i].State+'</div>'
                    +'<div class="col-md-4">'+containers[i].Status+'</div>'
                  +'</div>';
        $('#containers').append(item)
      }
    }
  });
}
