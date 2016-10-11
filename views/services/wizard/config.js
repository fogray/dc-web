
var configService = function(){
  var sname = $('#serviceName').val(), image = getParam('image')
  , stack = $('#stackList').val(), restartCondition = $('input[name="restartCondition"]:checked').val()
  , mode = $('input[name="mode"]:checked').val(), containers = $('#containers').val(), network = $('#networkList').val()
  , command = $('#command').val(), cmd_args = $('#args').val()
  , cmd_dir = $('#dir').val(), user = $('#user').val()
  , memlimit = $('#memlimit').val(), memReserve = $('#memReservation').val()
  , cpulimit = $('#cpulimit').val(), cpulReserve = $('#cpulReservation').val()
  , lables = getLabelFromTbl('#tblLabels'), mounts = getVolumesFromTbl('tblVolumes')
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
  
  var config = {Name: sname, Labels: labels == null ? {}: labels, 
                TaskTemplate:{
                  ContainerSpec:{
                    Image: image,
                    Command: command,
                    Args: cmd_args,
                    Env: envs,
                    Dir: cmd_dir,
                    User: user,
                    Labels: lables,
                    Mounts: mounts
                  },
                  Resources: {
                    Limits: {NanoCPUs:cpulimit, MemoryBytes: memlimit},
                    Reservation: {NanoCPUs:cpulReserve, MemoryBytes: memReserve},
                  },
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
  if (trs.length == 0) return null;
  var labels = {};
