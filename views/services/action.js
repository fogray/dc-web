var sapiPath = '//dev.imaicloud.com/dc/api/services';
var ServiceAction = (function(){
  var create = function(service_conf){
    // 弹出选择image页面，选择image后，跳转到service设置页面,设置完成后点击"Create"按钮创建service
    $.post(sapiPath+'/create', service_conf, function(text, status){
      alert(status+': '+text);
    });
  }
  var inspect = function(sid){
    $.get(sapiPath+'/'+sid+'/inspect', {}, function(text, status){
      alert(status+': '+text);
    });
  }
  
  var start = function(sid){
    //根据service id查询出该service的所有task
    //tasks?filters={%22service%22:[%2294wkdf86cbyjgkthp3nsqjihn%22]}
    // 在task列表中检出container id，start container操作
    $.post(sapiPath+'/'+sid+'/start', {}, function(text, status){
      alert(status+': '+text);
    });
  }
  var stop = function(sid){
    $.post(sapiPath+'/'+sid+'/stop', {}, function(text, status){
      alert(status+': '+text);
    });
  }
  var redeploy = function(sid){
    return;
    $.post(sapiPath+'/'+sid+'/redeploy', {}, function(text, status){
      alert(status+': '+text);
    });
  }
  var terminate = function(sid){
    $.ajax({
      url: sapiPath+'/'+sid,
      type: 'DELETE',
      error: function(e, h, r){
        alert(r);
      },
      success: fcuntion(text, status){
        alert(status+': '+text);
      }
    });
  }
  return {
    create: create,
    inspect: inspect,
    start: start,
    stop: stop,
    redeploy: redeploy,
    terminate: terminate
  }
})();
