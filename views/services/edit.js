var service_id = null;
var service_name = null;

$(function(){
  //根据image查询image详细信息
  service_id = getParam('service_id');
  loadServiceInfo(service_id)
  
  $('#btnAddLabel').click(function(){
    var tb = $('#tblLabels tbody'), labelName = $('#label').val(), labelV = $('#labelV').val();
    var tr = '<tr><td>'+labelName+'</td><td>'+labelV+'</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>';
    tb.prepend(tr);
  });
  $('#btnAddVolumes').click(function(){
    var tb = $('#tblVolumes tbody'), c_path = $('#c_path').val(), h_path = $('#h_path').val(), readable = $('#readable').val();
    var tr = '<tr><td>'+c_path+'</td><td>'+h_path+'</td><td>'+readable+'</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>';
    tb.prepend(tr);
  });
  $('#btnAddEnv').click(function(){
    var tb = $('#tblEnvs tbody'), envName = $('#envName').val(), envValue = $('#envValue').val();
    var tr = '<tr><td>'+envName+'</td><td>'+envValue+'</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>';
    tb.prepend(tr);
  });
  $('#btnAddPort').click(function(){
    var tb = $('#tblEpPort tbody');
    var tr = '<tr><td><input type="number" class="form-control input-no-border" name="port" value="" /></td>'
              +'<td><select name="protocolList"><option value="tcp">tcp</option><option value="udp">udp</option></select></td>'
              +'<td><input type="checkbox" name="published" /></td>'
              +'<td><input type="text" class="form-control input-no-border" name="node_port" value="" /></td>'
              +'<td><span class="glyphicon glyphicon-trash"></span></td></tr>';
    tb.prepend(tr);
  });
  $(document).on('change', 'input[name="published"]', function(){
    if ($(this).prop("checked")) {
      $('input[name="node_port"]', $(this).parents('tr')).val('dynamic');
    } else {
      $('input[name="node_port"]', $(this).parents('tr')).val('');
    }
  });
  
  //删除行操作
  $(document).on('click', '.glyphicon.glyphicon-trash', function(){
    $(this).parents('tr').remove();
  });
  
  $('#btnCreate').click(function(){
    var config = configService();
    ServiceAction.create(config);
  });
});

function loadServiceInfo(){
  ServiceAction.inspect(service_id, function(data, status){
    
    $('#titleService').html(data.Spec.Name);
    $('#serviceName').val(data.Spec.Name);
    //$('#stackList').html();
    $('input[name="restartCondition"][value='+data.Spec.TaskTemplate.RestartPolicy.Condition+']').prop("checked", true);
    if (data.Spec.Mode.hasOwnProperty('Replicated')) {
      $('input[name="mode"][value=replicated]').prop("checked", true);
      $('#containers').val(data.Spec.Mode.Replicated.Replicas);
    } else {
      $('input[name="mode"][value=global]').prop("checked", true);
    }
    //TODO
    if (data.Spec.Networks != null) {
      $('#networkList option[value='+data.Spec.Networks[0].Target+']').prop('selected', true);
    }
    
    //Container
    var cs = data.Spec.TaskTemplate.ContainerSpec;
    $('#image').html(cs.Image);
    $('#command').tagsinput('add', cs.Command.join(','));
    //$('#args').tagsinput('add', cs.Args.join(','));
    $('#dir').val(cs.hasOwnProperty('Dir') ? cs.Dir : '');    
    $('#user').val(cs.hasOwnProperty('User') ? cs.User : '');
    //Labels
    setLabel(cs.hasOwnProperty('Labels') ? cs.Labels : null);
    setVolumes(cs.hasOwnProperty('Mounts') ? cs.Mounts : null);
    setEnvs(cs.hasOwnProperty('Env') ? cs.Env : null);
    
    //Resources
    var rsrc = data.Spec.TaskTemplate.Resources;
    var limits = rsrc.hasOwnProperty('Limits') ? rsrc.Limits : null;
    var reservation = rsrc.hasOwnProperty('Reservation') ? rsrc.Reservation : null;
    if (limits != null) {
      $('#memlimit').val(limits.hasOwnProperty('MemoryBytes') ? parseFloat(limits.MemoryBytes)/1024/1024 : '');
      $('#cpulimit').val(limits.hasOwnProperty('NanoCPUs') ? limits.NanoCPUs : '');
    }
    if (reservation != null) {
      $('#memReservation').val(reservation.hasOwnProperty('MemoryBytes') ? parseFloat(reservation.MemoryBytes)/1024/1024 : '');
      $('#cpuReservation').val(reservation.hasOwnProperty('NanoCPUs') ? reservation.NanoCPUs : '');
    }
    if (data.Spec.hasOwnProperty('UpdateConfig')) {
      $('#parallelism').val(data.Spec.UpdateConfig.hasOwnProperty('Parallelism') ? data.Spec.UpdateConfig.Parallelism : '');
      $('#delay').val(data.Spec.UpdateConfig.hasOwnProperty('Delay') ? data.Spec.UpdateConfig.Delay : '');
    }
    
    $('input[name="epMode"][value='+data.Endpoint.Spec.Mode+']').prop('checked', true);
    setPorts(data.Endpoint.Spec.Ports);
    
  });
}

var configService = function(){
  var sname = $('#serviceName').val()
  , stack = $('#stackList').val(), restartCondition = $('input[name="restartCondition"]:checked').val()
  , mode = $('input[name="mode"]:checked').val(), containers = $('#containers').val(), network = $('#networkList').val()
  , command = $('#command').tagsinput('items'), cmd_args = $('#args').tagsinput('items')
  , cmd_dir = $('#dir').val(), user = $('#user').val()
  , memlimit = $('#memlimit').val(), memReserve = $('#memReservation').val()
  , cpulimit = $('#cpulimit').val(), cpulReserve = $('#cpulReservation').val()
  , labels = getLabelFromTbl('tblLabels'), mounts = getVolumesFromTbl('tblVolumes')
  , parallelism = $('#parallelism').val(), delay = $('#delay').val()
  , epMode = $('input[name="epMode"]:checked').val()
  , epPorts = getPortsFromTbl('tblEpPort')
  , envs = getEnvsFromTbl('tblEnvs');
  
  var config_mode = {};
  if(mode == 'replicated') {
    config_mode = {Replicated:{Replicas: containers == '' ? 1 : parseInt(containers, 10)}};
  } else {
    config_mode = {Global:{}};
  }
  var resource = {};
  if (memlimit != '') {
    resource['Limits']['MemoryBytes'] = parseFloat(memlimit)*1024*1024;
  }
  if (cpulimit != '') {
    resource['Limits']['NanoCPUs'] = parseFloat(cpulimit);
  }
  if (memReserve != '') {
    resource['Reservation']['MemoryBytes'] = parseFloat(memlimit)*1024*1024;
  }
  if (cpulReserve != '') {
    resource['Reservation']['NanoCPUs'] = parseFloat(cpulReserve);
  }
  var updateC = {};
  if (parallelism != '') {
    updateC['Parallelism'] = parseInt(parallelism, 10);
  }
  if (delay != '') {
    updateC['Delay'] = parseInt(delay, 10);
  } 
  
  var config = {Name: sname, Labels: labels == null ? {}: labels, 
                TaskTemplate:{
                  ContainerSpec:{
                    Image: image,
                    Command: command,
                    Args: cmd_args,
                    Env: envs,
                    Dir: cmd_dir,
                    User: user,
                    Labels: labels,
                    Mounts: mounts
                  },
                  Resources: resource,
                  RestartPolicy: {
                    Condition: restartCondition
                  }
                },
                Mode: config_mode,
                UpdateConfig: updateC,
                Networks: [{Target: network}],
                EndpointSpec: {
                  Mode: epMode,
                  Ports: epPorts
                }
               };
  return config;
}

function setLabel(json){
  if (json == null) return;
  var tbody = $('#tblLabels tbody');
  tbody.html('');
  for (var key in json) {
    var tr = '<tr><td>'+key+'</td><td>'+json[key]+'</td></tr>'
    tbody.append(tr);
  }
}
function getLabelFromTbl(table){
  var trs = $('tbody tr', $('#'+table));
  if (trs.length == 0) return {};
  var labels = {};
  for (var i = 0; i < trs.length; i++) {
    var name = $('td', $(trs[i]))[0].innerHTML
    , key = $('td', $(trs[i]))[1].innerHTML
    labels[name] = key;
  }
  return labels;
}

function setVolumes(json){
  if (json == null) return;
  var tbody = $('#tblVolumes tbody');
  tbody.html('');
  for (var i = 0; i < json.length; i++) {
    var tr = '<tr><td>'+json[i].Source+'</td><td>'+json[i].Target+'</td><td>-</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>'
    tbody.append(tr);
  }
}
function getVolumesFromTbl(table){
  var trs = $('tbody tr', $('#'+table));
  if (trs.length == 0) return [];
  var mounts = [];
  for (var i = 0; i < trs.length; i++) {
    var target = $('td', $(trs[i]))[0].innerHTML
    , src = $('td', $(trs[i]))[1].innerHTML
    , readOnly = $('td', $(trs[i]))[2].innerHTML == 'Readable' ? true : false;
    mounts.push({Target: target, Source: src, ReadOnly: readOnly});
  }
  return mounts;
}

function setPorts(json){
  if (json == null) return;
  var tbody = $('#tblEpPort tbody');
  tbody.html('');
  for (var i = 0; i < json.length; i++) {
    var tr = '<tr><td><input type="number" class="form-control input-no-border" name="port" value="'+json[i].TargetPort+'" /></td>'
              +'<td><select name="protocolList"><option value="tcp" '+(json[i].Protocol == 'tcp' ?'selected':'')+'>tcp</option>'
                +'<option value="udp" '+(json[i].Protocol == 'udp' ?'selected':'')+'>udp</option></select></td>'
              +'<td><input type="checkbox" name="published" '+(json[i].hasOwnProperty('PublishedPort') ?'checked':'')+'/></td>'
              +'<td><input type="text" class="form-control input-no-border" name="node_port" value="'+json[i].PublishedPort+'" /></td>'
              +'<td><span class="glyphicon glyphicon-trash"></span></td></tr>';
    tbody.append(tr);
  }
}
function getPortsFromTbl(table){
  var trs = $('tbody tr', $('#'+table));
  if (trs.length == 0) return [];
  var ports = [];
  for (var i = 0; i < trs.length; i++) {
    var c_port = $('input[name="port"]', $(trs[i])).val()
    , protocol = $('select[name="protocolList"]', $(trs[i])).val()
    , published = $('input[name="published"]:checked', $(trs[i])) ? true : false
    , node_port = $('input[name="node_port"]', $(trs[i])).val();
    if (c_port == '') continue;
    var p = '{"Protocol": "'+protocol+'", "TargetPort":' + parseInt(c_port, 10);
    if (node_port != 'dynamic' && node_port != '') p += ', "PublishedPort":'+parseInt(node_port, 10);
    p += '}';
    ports.push($.parseJSON(p));
  }
  return ports;
}

function setEnvs(json){
  if (json == null) return;
  var tbody = $('#tblEnvs tbody');
  tbody.html('');
  for (var i = 0; i < json.length; i++) {
    var env = json[i].split('=');
    var tr = '<tr><td>'+env[0]+'</td><td>'+env[1]+'</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>'
    tbody.append(tr);
  }
}
function getEnvsFromTbl(table){
  var trs = $('tbody tr', $('#'+table));
  if (trs.length == 0) return [];
  var envs = [];
  for (var i = 0; i < trs.length; i++) {
    var env_name = $('td', $(trs[i]))[0].innerHTML
    , env_value = $('td', $(trs[i]))[1].innerHTML;
    envs.push(env_name+'='+env_value);
  }
  return envs;
}
