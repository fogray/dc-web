var webPath = '//dev.imaicloud.com/dc/';
$(function(){
  listServices();
}
);
function listServices(){
  var $wrapObj = $('#serviceList');
  $wrapObj.html('');
  $.ajax({
    url: webPath + 'api/services',
    type: 'get',
    error: function(e, h, r) {
      
    },
    success: function(data){
      var json = eval(data), len = json.length;
      for (var i = 0; i < len; i++) {
        $wrapObj.append(itemDiv());
      }
    }
  });
}
function itemDiv(data){
  var s_id = data.ID
  , v_i = data.Version.Index
  , ct = data.CreatedAt
  , ut = data.UpdatedAt
  , name = data.Spec.Name
  , image = data.Spec.TaskTemplate.ContainerSpec.Image
  , replicas = data.Spec.Mode.Replicated.Replicas;
  var left = '<div class="col-md-2" ><input class="selector" type="checkbox" name="selector"/></div>';
  var sn = '<div class="col-md-3">'
        +'<div class="row"><div class="col-md-12">'+name+'</div></div>'
        +'<div class="row"><div class="col-md-12">'+replicas+'</div></div>'
        +'<div class="row"><div class="col-md-12" name="s_stats">RUNNING</div></div>'
        +'</div>';
  var image = '<div class="col-md-3">'+image+'</div>';
  var ct = '<div class="col-md-3">'+ut+'</div>';
  var actions = '<div class="col-md-3"></div>';
  var right = '<div class="col-md-10"><div class="row">'+sn+image+ct+actions+'</div></div>';
  return '<li data-sid="'+s_id+'"><div class="row">'+left+right+'</div></li>';
  
}
