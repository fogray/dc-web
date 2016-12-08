$(function(){
  listContainers();
  $(document).on('click', '#containerList>li .container-info', function(){
    var s_id = $(this).attr('data-sid');
    window.location.href = 'info.html?container_id='+s_id;
  });
}
);
function listContainers(){
  var $wrapObj = $('#containerList');
  $wrapObj.html('');
  ContainerAction.list(function(data,status){
    if (status == 'success'){
      var json = eval(data), len = json.length;
      for (var i = 0; i < len; i++) {
        $wrapObj.append(itemDiv(json[i]));
      }
    } else {
      alert(status);
    }
  });
}
function itemDiv(data){
  var c_id = data.Id, c_name = data.Names[0].substring(1), labels = data.Labels
  	  , n_id = labels['com.docker.swarm.node.id'], s_id = labels['com.docker.swarm.service.id'], s_name = labels['com.docker.swarm.service.name']
  	  , t_id = labels['com.docker.swarm.task.id'], t_name = labels['com.docker.swarm.task.name']
  	  , status = data.Status, state = data.State, image = data.Image, ct = data.Created
  var left = '<div class="col-md-1 check-col">'
  	  			+'<div class="checkbox"><label><input class="selector" type="checkbox" name="selector" value="'+c_id+'"/></label></div>'
              +'</div>';
  var cn = '<div class="col-md-5 container-info" data-nid="'+n_id+'" data-sid="'+s_id+'" data-cid="'+c_id+'" data-tid="'+t_id+'">'
        +'<div class="row"><div class="col-md-12 container-name" title="'+c_name+'">'+c_name+'</div></div>'
        +'<div class="row"><div class="col-md-12 container-status" name="c_stats">'+state+'</div></div>'
        +'</div>';
  var sn = '<div class="col-md-3 container-service">'+s_name+'</div>';
  var image = '<div class="col-md-3 container-image">'+image+'</div>';
  var st = '<div class="col-md-3 container-st">'
  				+ '<div class="row"><div class="col-md-12 container-status">' + status + '</div></div>'
  				+ '<div class="row"><div class="col-md-12 container-created">' + ct + '</div></div>'
  			+'</div>';
  var actions = '<div class="col-md-1 container-actions">'
                  +'<div class="btn-group">'
                    +'<a class="btn btn-elipsedropdown-toggle" data-toggle="dropdown" aria-haspopup="true">∷</a>'
                    +'<ul class="dropdown-menu">'
                      +'<li><a onclick="ContainerAction.start(\''+c_id+'\',\''+n_id+'\')">Start</a></li>'
                      +'<li><a onclick="ContainerAction.stop(\''+c_id+'\',\''+n_id+'\')">Stop</a></li>'
                      +'<li><a onclick="ContainerAction.redeploy(\''+c_id+'\',\''+n_id+'\')">Redeploy</a></li>'
                      +'<li><a onclick="ContainerAction.terminate(\''+c_id+'\',\''+n_id+'\')">Terminate</a></li>'
                    +'</ul>'
                  +'</div></div>';
  var right = '<div class="col-md-11"><div class="row">'+cn+sn+image+st+actions+'</div></div>';
  return '<li><div class="row">'+left+right+'</div></li>';
  
}

function selectedContainer(){
  var sids = new Array();
  $('input[type="checkbox"][name="selector"]:checked').each(function(){
    var c = $('.container-info' ,$(this).parents('#containerList')), cid = c.attr('data-cid'), nid = c.attr('data-nid');
    if (cid && nid){
      sids.push({cid:cid, nid:nid});
    }
  });
  return sids;
}

function start(){
  var cids = selectedContainer();
  if (cids.length == 0) {
    toastr['warning']('Select one container');
    return;
  }
  for (var i = 0; i < cids.length; i++) {
    ContainerAction.start(cids[i].cid, cids[i].nid);
  }
}

function stop(){
  var cids = selectedContainer();
  if (cids.length == 0) {
    toastr['warning']('Select one container');
    return;
  }
  for (var i = 0; i < cids.length; i++) {
    ContainerAction.stop(cids[i].cid, cids[i].nid);
  }
}

function redeploy(){
  var cids = selectedContainer();
  if (cids.length == 0) {
    toastr['warning']('Select one container');
    return;
  }
  for (var i = 0; i < cids.length; i++) {
    ContainerAction.redeploy(cids[i].cid, cids[i].nid);
  }
}

function terminate(){
  var cids = selectedContainer();
  if (cids.length == 0) {
    toastr['warning']('Select one container');
    return;
  }
  for (var i = 0; i < cids.length; i++) {
    ContainerAction.terminate(cids[i].cid, cids[i].nid);
  }
}
