var image = null;
$(function(){
  window.parent.changeStep('2');
  image = getParam('image');
  $('#image').html(image);
  //根据image查询image详细信息
  loadImageInfo();
  window.parent.autoIframeHeight();
  
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
    $.post(DC_CONFIG.DC_API_HOST + '/services/create', config, function(data, status){
      alert('create service status='+status);
      if (data != null && data.hasOwnProperty('ID')) {
        alert('create service success: '+data['ID']);
      } else {
        alert('create servicec error');
      }
    }, 'json');
  });
});

function loadImageInfo(){
  $.get(DC_CONFIG.DC_API_HOST + '/images/'+image+'/inspect').success(function(data){
    var config = data.Config, volumes = config.Volumes, entryPoint = config.Entrypoint, cmd = config.Cmd
    , exposedPorts = config.ExposedPorts, env = config.Env, labels = config.Labels, dir = config.WorkingDir
    , user = config.User;
    
    $('#user').val(user), $('#dir').val(dir);
    $('#command').val(cmd.join(' '));
    
    if (volumes != null) {
      var tr = '';
      for (var key in volumes) {
        tr += '<tr>'
                +'<td>' + key + '</td>'
                +'<td>' + JSON.stringify(volumes[key]) + '</td>'
                +'<td></td>'
                +'</tr>';
      }
      $('#tblVolumes tbody').append(tr);
    }
    
    if (exposedPorts != null) {
      var tr = '';
      for (var key in exposedPorts) {
        tr += '<tr>'
                +'<td>' + key.split('/')[0] + '</td>'
                +'<td>' + key.split('/')[1] + '</td>'
                +'<td><input type="checkbox" name="published" /></td>'
                +'<td><input type="text" class="form-control input-no-border" name="node_port" value="" /></td>'
                +'</tr>';
      }
      $('#tblEpPort tbody').append(tr);
    }
    
    if (env != null && env.length > 0) {
      var tr = '';
      for (var i = 0; i < env.length; i++) {
        tr += '<tr>'
                +'<td>' + env[i].split('=')[0] + '</td>'
                +'<td>' + env[i].split('=')[1] + '</td>'
                + '</tr>';
      }
      $('#tblEnvs tbody').append(tr);
    }
    
    if (labels != null) {
      var tr = '';
      for (var key in labels) {
        tr += '<tr>'
                +'<td>' + key + '</td>'
                +'<td>' + labels[key] + '</td>'
                +'</tr>';
      }
      $('#tblLabels tbody').append(tr);
    }
    
  });
}

var configService = function(){
  var sname = $('#serviceName').val()
  , stack = $('#stackList').val(), restartCondition = $('input[name="restartCondition"]:checked').val()
  , mode = $('input[name="mode"]:checked').val(), containers = $('#containers').val(), network = $('#networkList').val()
  , command = $('#command').val(), cmd_args = $('#args').val()
  , cmd_dir = $('#dir').val(), user = $('#user').val()
  , memlimit = $('#memlimit').val(), memReserve = $('#memReservation').val()
  , cpulimit = $('#cpulimit').val(), cpulReserve = $('#cpulReservation').val()
  , labels = getLabelFromTbl('#tblLabels'), mounts = getVolumesFromTbl('tblVolumes')
  , parallelism = $('#parallelism').val(), delay = $('#delay').val()
  , epMode = $('input[name="epMode"]:checked').val()
  , epPorts = getPortsFromTbl('tblEpPort')
  , envs = getEnvsFromTbl('tblEnvs');
  
  var config_mode = {};
  if(mode == 'replicated') {
    config_mode = {Replicated:{Replicas:containers}};
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
                UpdateConfig: {
                  Parallelism: parallelism,
                  Delay: delay
                },
                Networks: [{Target: network}],
                EndpointSpec: {
                  Mode: epMode,
                  Ports: epPorts
                }
               };
  return config;
}

function getLabelFromTbl(table){
  var trs = $('tbody tr', $(table));
  if (trs.length == 0) return {};
  var labels = {};
  for (var i = 0; i < trs.length; i++) {
    var name = $('td', $(trs[i]))[0].innerHTML
    , key = $('td', $(trs[i]))[1].innerHTML
    labels[name] = key;
  }
  return labels;
}

function getVolumesFromTbl(table){
  var trs = $('tbody tr', $(table));
  if (trs.length == 0) return {};
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
  if (trs.length == 0) return [];
  var ports = [];
  for (var i = 0; i < trs.length; i++) {
    var c_port = $('td', $(trs[i]))[0].innerHTML
    , protocol = $('td', $(trs[i]))[1].innerHTML
    , published = $('td', $(trs[i]))[2].innerHTML
    , node_port = $('td', $(trs[i]))[3].innerHTML;
    if (c_port == '' || (published && node_port == '')) continue;
    ports.push({Protocol: protocol, PublishedPort: c_port, TargetPort: node_port});
  }
  return ports;
}

function getEnvsFromTbl(table){
  var trs = $('tbody tr', $(table));
  if (trs.length == 0) return [];
  var envs = [];
  for (var i = 0; i < trs.length; i++) {
    var env_name = $('td', $(trs[i]))[0].innerHTML
    , env_value = $('td', $(trs[i]))[1].innerHTML;
    envs.push(env_name+'='+env_value);
  }
  return envs;
}
