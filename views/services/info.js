var service_id = null;
var service_name = null;
var vm = null;
$(function(){
  service_id = getParam('service_id');

  vm = new Vue({
		el: '#app-service-info',
		data: {
			service: {},
			containers: [],
			envs: ['='],
			ports: [{TargetPort:'',Protocol:'tcp'}],
			volumes: [{Source:'',Target:''}]
		},
		methods: {
			inspectService: function(){
				ServiceAction.info(service_id, function(data, status){
			    if (status == 'success' && data instanceof Object){
			    	var sn = data.Spec.Name, sn_short = sn.substring(sn.indexOf('__')+2), sn_icon = sn_short.substring(0, sn_short.indexOf('__')),
			    	ua = data.UpdateAt,
			    	image = data.Spec.TaskTemplate.ContainerSpec.Image;
			    	
			      vm.service = {name: sn, shortName: sn_short, icon:sn_icon, updateAt: ua, image: image, status: 'running'};
			      
			      //service state 由tasks获取
			      var cs = data.Spec.TaskTemplate.ContainerSpec;
			      vm.containers = data.ContainerInfo;
			      
			      if (data.Spec.hasOwnProperty('EndpointSpec') && data.Spec.EndpointSpec.hasOwnProperty('Ports')) {
			      	vm.ports = data.Spec.EndpointSpec.Ports;
			      }
			      
			      if (data.Spec.Mode.hasOwnProperty('Replicated')) {
			        NoUiSliderDom.setValue($('#slider-step')[0], data.Spec.Mode.Replicated.Replicas);
			      }
			      if (data.Spec.TaskTemplate.ContainerSpec.hasOwnProperty('Env')) {
			      	vm.envs = data.Spec.TaskTemplate.ContainerSpec.Env;
			      }
			    }
			  });
			},
			addEnv: function(){
				vm.envs.push('=');
			},
			addPort: function(){
				vm.ports.push({TargetPort:'', Protocol:'tcp'});
			},
			addVolume: function(){
				vm.volumes.push({Source:'', Target:''});
			},
			removetr: function(event){
				if ($(event.target).parents('tr').length == 1) return;
				
				var index = $(event.target).parents('tr')[0].rowIndex;
				var tbl = $(event.target).parents('table')[0].id;
				switch(tbl){
					case 'tblPorts': vm.ports.splice(index, 1); break;
					case 'tblEnvs': vm.envs.splice(index, 1); break;
					case 'tblVolumes': vm.volumes.splice(index, 1); break;
				}
				
			}
		}
	});
  vm.inspectService();
  $('#btnEdit').click(function(){
    window.location.href = 'edit.html?service_id='+service_id;
  });
  $('#btnScale').click(function(){
    var scales = NoUiSliderDom.getValue($('#slider-step')[0]);
    ServiceAction.scale(service_id, scales+'');
  });
  $(document).on('click', '#containers .item .item-title', function(){
    var cid = $(this).parent().attr('data-id'), nodeId = $(this).parent().attr('data-nid');
    window.location.href = DC_CONFIG.WEBUI_CONTEXT+'/views/containers/info.html?cid='+cid+'&nid='+nodeId;
  });
});

function loadServiceInfo(){
  
}
