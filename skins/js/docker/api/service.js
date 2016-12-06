var sapiPath = DC_CONFIG.DC_API_SERVICES_PATH.replace('{tenant}', USER_INFO.tnt);
var ServiceAction = (function(){
  var list = function(params, success_cal, error_cal){
    AjaxTool.get(sapiPath, params, function(text, status){
    	success_cal(text, status);
    }, function(e,h,r){
    	if (typeof error_cal =='function'){
    		error_cal(e, h, r);
    	} else {
        	ToastrTool.error('List service failure ', r);
    	}
	});
  };
  var create = function(service_conf, success_cal, error_cal){
    // 弹出选择image页面，选择image后，跳转到service设置页面,设置完成后点击"Create"按钮创建service
    AjaxTool.post(sapiPath, service_conf, function(text, status){
	    if (typeof success_cal == 'function'){
	    	success_cal(text, status);
		} else {
			if (status != 'success'){
				ToastrTool.error('Create service failure: ' + status);
			} else {
		    	ToastrTool.success('Create service success');
		    }
		}
    }, function(e, h, r){
    	if (typeof error_cal =='function'){
    		error_cal(e, h, r);
    	} else {
        	ToastrTool.error('Create service failure ', r);
    	}
    });
  };
  
  var inspect = function(sid, success_cal, error_cal){
    AjaxTool.get(sapiPath+'/'+sid, {}, function(text, status){
    	success_cal(text, status);
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(text, status);
	    } else {
	    	ToastrTool.error('Inspect service failure ', r);
	    }
    });
  };
  
  var update = function(service_id, version, service_conf, success_cal, error_cal){
    var url = sapiPath+'/'+service_id;
    if (version != null) {
      url += '?version='+version;
    }
    AjaxTool.put(url, service_conf, function(text, status){
        if (typeof success_cal == 'function'){
          success_cal(text, status);
	    } else {
	    	if (status != 'success'){
		        ToastrTool.error('Update service failure: ' + status);
		    } else {
		    	ToastrTool.success('Update service success');
		    }
	    }
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(text, status);
	    } else {
	    	ToastrTool.error('Update service failure ', r);
	    }
    });
  };
  
  var scale = function(service_id, scale_number, success_cal, error_cal){
    var url = sapiPath+'/'+service_id+'/scale';
    AjaxTool.post(url, {replicas: scale_number}, function(text, status){
    	if (typeof success_cal == 'function'){
          success_cal(text, status);
	    } else {
	    	if (status != 'success'){
		        ToastrTool.error('Scale service failure: ' + status);
		    } else {
		    	ToastrTool.success('Scale service success');
		    }
	    }
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(text, status);
	    } else {
	    	ToastrTool.error('Scale service failure ', r);
	    }
    });
  };
  
  var info = function(sid, success, success_cal, error_cal){
    AjaxTool.get(sapiPath+'/'+sid+'/info', {}, function(text, status){
    	success_cal(text, status);
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(text, status);
	    } else {
	    	ToastrTool.error('Get service info failure ', r);
	    }
    });
  };
  
  var start = function(sid){
    //根据service id查询出该service的所有task
    //tasks?filters={%22service%22:[%2294wkdf86cbyjgkthp3nsqjihn%22]}
    // 在task列表中检出container id，start container操作
    $.post(sapiPath+'/'+sid+'/start', {}, function(text, status){
      	if (status == 'success') {
    		ToastrTool.success('start service success ');
      	} else {
    		ToastrTool.error('start service failure:'+status, text);
      	}
    }, function(e,h,r){
    	ToastrTool.error('start service failure ', r);
    });
  };
  
  var stop = function(sid){
    $.post(sapiPath+'/'+sid+'/stop', {}, function(text, status){
      	if (status == 'success') {
    		ToastrTool.success('stop service success ');
      	} else {
    		ToastrTool.error('stop service failure:'+status, text);
      	}
    }, function(e,h,r){
    	ToastrTool.error('stop service failure ', r);
    });
  };
  
  var redeploy = function(sid){
    return;
    //$.post(sapiPath+'/'+sid+'/redeploy', {}, function(text, status){
    //  alert(status+': '+text);
    //});
  };
  
  var terminate = function(sid, success_cal, error_cal){
  	  AjaxTool.delete(sapiPath+'/'+sid, {}, function(text, status){
        if (typeof success_cal == 'function'){
          success_cal(text, status);
	    } else {
	    	if (status != 'success'){
		        ToastrTool.error('Delete service failure: ' + status);
		    }
	    }
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(text, status);
	    } else {
	    	ToastrTool.error('Get service failure ', r);
	    }
    });
  };
  
  return {
    list: list,
    create: create,
    inspect: inspect,
    update: update,
    scale: scale,
    info: info,
    start: start,
    stop: stop,
    redeploy: redeploy,
    terminate: terminate
  }
})();
