var service_id = null;
var service_name = null;
var vm = null;
$(function(){
  service_id = getParam('service_id');
  Vue.extend({
  	components: {
  		'volume-tr-comp' : {
  			template: '<tr><td><input type="text" name="container-path" class="form-control input-no-border" placeholder="容器目录" />'
  								+ '</td><td><input type="text" name="host-path" class="form-control input-no-border" placeholder="主机目录" />'
  								+ '</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>'
  		},
  		'env-tr-comp': {
  			template: '<tr><td><input type="text" class="form-control input-no-border" name="envName" placeholder="键"  />'
  								+ ' </td><td><input type="text" class="form-control input-no-border" name="envValue" placeholder="值"/>'
  								+ '</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>'
  		},
  		'port-tr-comp': {
  			template: '<tr><td><input type="number" name="container-port" class="form-control input-no-border" placeholder="容器端口" />'
									+ '</td><td><select name="protocolList"><option value="tcp" selected>TCP</option><option value="udp">UDP</option></select>'
									+ '</td><td><input type="number" name="host-port" class="form-control input-no-border" placeholder="主机端口" value="对外服务" disabled="true" />'
									+ '</td><td><span class="glyphicon glyphicon-trash"></span></td></tr>'
  		}
  	}
  });
  vm = new Vue({
		el: '#app-service-info',
		data: {
			service: {},
			containers: [],
			envs: [],
			ports: [],
			volumes: []
		},
		methods: {
			inspectService: function(){
				ServiceAction.info(service_id, function(data, status){
			    if (status == 'success' && data instanceof Object){
			      service_name = data.Spec.Name;
			      vm.service = data;
			      
			      //service state 由tasks获取
			      var cs = data.Spec.TaskTemplate.ContainerSpec;
			      vm.containers = data.ContainerInfo;
			      
			      if (data.Spec.hasOwnProperty('EndpointSpec') && data.Spec.EndpointSpec.hasOwnProperty('Ports')) {
			      	vm.ports = data.Spec.EndpointSpec.Ports;
			      }
			      
			      if (data.Spec.Mode.hasOwnProperty('Replicated')) {
			        //NoUiSliderDom.setValue($('#slider-step')[0], data.Spec.Mode.Replicated.Replicas);
			      }
			      if (data.Spec.TaskTemplate.ContainerSpec.hasOwnProperty('Env')) {
			      	vm.envs = data.Spec.TaskTemplate.ContainerSpec.Env;
			      }
			    }
			  });
			},
			addEnv: function(){
			},
			addPort: function(){
			},
			addVolume: function(){
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
