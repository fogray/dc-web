var vm = null;
$(function(){
	vm = new Vue({
		el: '#serviceList',
		data: {
			services: []
		},
		methods: {
			listService: function(){
				ServiceAction.list(null, function(json, status){
					vm.services =[];
					if (json instanceof Array) {
						for (var i = 0; i < json.length; i++) {
							var data = json[i];
							var sn = data.Spec.Name, sn_short = sn.split('__')[1], id = data.ID
							, replicas = service.Spec.Mode.Replicated.Replicas
							, url = 'https://'+sn+'.service.imaicloud.com'
							, status = 'running', image = data.Spec.TaskTemplate.ContainerSpec.Image
							, updatedAt = service.UpdatedAt.substring(0,19).replace('T', ' ')
							vm.services.push({name: sn, shortName: sn_short, id: id, replicas: replicas
								              , url: url, status: status, image: image, updatedAt: updatedAt});
						}	
					}
				});
			},
			start: function(event){
				var sid = $(event.target).parents('li').attr('data-sid');
				ServiceAction.start(s_id);
			},
			stop: function(){
				var sid = $(event.target).parents('li').attr('data-sid');
				ServiceAction.stop(s_id);
			},
			trash: function(){
				var sid = $(event.target).parents('li').attr('data-sid');
				ServiceAction.terminate(s_id, function(data,status){
			    	if (status == 'success'){
			    		vm.listService();
			    	}
			    });
			},
			info: function(){
				var sid = $(event.target).parents('li').attr('data-sid');
				window.location.href = 'info.html?service_id='+s_id;
			}
		}
	});
  vm.listService();
  
);

function selectedService(){
  var sids = new Array();
  $('input[type="checkbox"][name="selector"]:checked').each(function(){
    var v = $(this).parents('li').attr('data-sid');
    if (v){
      sids.push(v);
    }
  });
  return sids;
}

function start(){
  var sids = selectedService();
  if (sids.length == 0) {
    //alert('');
    return;
  }
  for (var i = 0; i < sids.length; i++) {
    ServiceAction.start(sids[i]);
  }
}

function stop(){
  var sids = selectedService();
  if (sids.length == 0) {
    //alert('');
    return;
  }
  for (var i = 0; i < sids.length; i++) {
    ServiceAction.stop(sids[i]);
  }
}

function redeploy(){
  var sids = selectedService();
  if (sids.length == 0) {
    //alert('');
    return;
  }
  for (var i = 0; i < sids.length; i++) {
    ServiceAction.redeploy(sids[i]);
  }
}

function terminate(){
  var sids = selectedService();
  if (sids.length == 0) {
    //alert('');
    return;
  }
  for (var i = 0; i < sids.length; i++) {
    ServiceAction.terminate(sids[i]);
  }
}
