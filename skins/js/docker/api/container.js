var capiPath = DC_CONFIG.DC_API_CONTAINERS_PATH.replace('{tenant}', USER_INFO.tnt);
var ContainerAction = (function(){
  var list = function(success_cal, error_cal){
    AjaxTool.get(capiPath, params, function(text, status){
        success_cal(text, status);
    }, function(e,h,r){
    	if (typeof error_cal =='function'){
    		error_cal(e, h, r);
    	} else {
        	ToastrTool.error('List container failure ', r);
    	}
	};
  };
  
  var inspect = function(cid, nodeId, success_cal, error_cal){
    AjaxTool.get(capiPath+'/'+cid+'?node-id='+nodeId, {}, function(text, status){
        if (typeof success_cal == 'function'){
          success_cal(text, status);
	    } else {
	    	if (status != 'success'){
		        ToastrTool.error('Inspect container failure: ' + status);
		    }
	    }
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(text, status);
	    } else {
	    	ToastrTool.error('Inspect container failure ', r);
	    }
    });
  };
  
  var start = function(cid, nodeId){
    $.post(capiPath+'/'+cid+'/start?node-id='+nodeId, {}, function(text, status){
      	if (status == 'success') {
				ToastrTool.success('start container success ');
      	} else {
    		ToastrTool.error('start container failure:'+status, text);
      	}
    }, function(e,h,r){
    	ToastrTool.error('start container failure ', r);
    });
  };
  
  var stop = function(cid, nodeId){
    $.post(capiPath+'/'+cid+'/stop?node-id='+nodeId, {}, function(text, status){
      	if (status == 'success') {
    		ToastrTool.success('stop container success ');
      	} else {
    		ToastrTool.error('stop container failure:'+status, text);
      	}
    }, function(e,h,r){
    	ToastrTool.error('stop container failure ', r);
    });
  };
  
  var terminate = function(cid, nodeId, success_cal, error_cal){
  	  AjaxTool.delete(capiPath+'/'+cid+'?node-id='+nodeId, {}, function(text, status){
        if (typeof success_cal == 'function'){
          success_cal(text, status);
	    } else {
	    	if (status != 'success'){
		        ToastrTool.error('Delete container failure: ' + status);
		    }
	    }
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(text, status);
	    } else {
	    	ToastrTool.error('Get container failure ', r);
	    }
    });
  };
  
  return {
    list: list,
    inspect: inspect,
    start: start,
    stop: stop,
    terminate: terminate
  }
})();