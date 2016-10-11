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
    //$.post(sapiPath+'/'+sid+'/redeploy', {}, function(text, status){
    //  alert(status+': '+text);
    //});
  }
  var terminate = function(sid){
    $.ajax({
      url: sapiPath+'/'+sid,
      type: 'DELETE',
      error: function(e, h, r){
        alert(r);
      },
      success: function(text, status){
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

  for (var i = 0; i < trs.length; i++) {
    var name = $('td', $(trs[i]))[0].innerHTML
    , key = $('td', $(trs[i]))[1].innerHTML
    labels[name] = key;
  }
  return labels;
}

function getVolumesFromTbl(table){
  var trs = $('tbody tr', $(table));
  if (trs.length == 0) return null;
  var mounts = {};
  for (var i = 0; i < trs.length; i++) {
    var target = $('td', $(trs[i]))[0].innerHTML
    , src = $('td', $(trs[i]))[1].innerHTML
    , readOnly = $('td', $(trs[i]))[2].innerHTML == 'Readable' ? true : false;
    mounts['Target'] = target, mounts['Source'] = src, mounts['ReadOnly'] = readOnly;
  }
  return mounts;
}

function getPortsFromTbl(table){
  var trs = $('tbody tr', $(table));
  if (trs.length == 0) return null;
  var ports = [];
  for (var i = 0; i < trs.length; i++) {
    var c_port = $('td', $(trs[i]))[0].innerHTML
    , protocol = $('td', $(trs[i]))[1].innerHTML
    , published = $('td', $(trs[i]))[2].innerHTML
    , node_port = $('td', $(trs[i]))[3].innerHTML;
    if (c_port == '' || (published && node_port == '')) continue;
    ports.push({Protocol: protocol, PublishedPort: node_port, TargetPort: c_port});
  }
  return ports;
}

function getEnvsFromTbl(table){
  var trs = $('tbody tr', $(table));
  if (trs.length == 0) return null;
  var envs = [];
  for (var i = 0; i < trs.length; i++) {
    var env_name = $('td', $(trs[i]))[0].innerHTML
    , env_value = $('td', $(trs[i]))[1].innerHTML;
    envs.push(env_name+'='+env_value);
  }
  return envs;
}
