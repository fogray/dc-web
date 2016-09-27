var sapiPath = '//dev.imaicloud.com/dc/api/services';
var ServiceAction = function(){
  function create(service_conf){
    // 弹出选择image页面，选择image后，跳转到service设置页面,设置完成后点击"Create"按钮创建service
    $.post(sapiPath+'/create', service_conf, function(text, status){
      alert(status+': '+text);
    });
  }
  function inspect(sid){
    $.get(sapiPath+'/'+sid+'/inspect', {serviceId:sid}, function(text, status){
      alert(status+': '+text);
    });
  }
  
  function start(sid){
    //根据service id查询出该service的所有task
    //tasks?filters={%22service%22:[%2294wkdf86cbyjgkthp3nsqjihn%22]}
    // 在task列表中检出container id，start container操作
    $.post(sapiPath+'/'+sid+'/start', {serviceId:sid}, function(text, status){
      alert(status+': '+text);
    });
  }
  function stop(sid){
    $.post(sapiPath+'/'+sid+'/stop', {serviceId:sid}, function(text, status){
      alert(status+': '+text);
    });
  }
  function redeploy(sid){
    return;
    $.post(sapiPath+'/'+sid+'/redeploy', {serviceId:sid}, function(text, status){
      alert(status+': '+text);
    });
  }
  function terminate(sid){
    $.post(sapiPath+'/'+sid, {_method:'delete', serviceId:sid}, function(text, status){
      alert(status+': '+text);
    });
  }
}
