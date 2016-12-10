var ImagesAction = (function(){
  var list = function(success_cal, error_cal){
    AjaxTool.get(DC_CONFIG.DC_API_IMAGES_PATH, params, function(text, status){
        success_cal(text, status);
    }, function(e,h,r){
    	if (typeof error_cal =='function'){
    		error_cal(e, h, r);
    	} else {
        	ToastrTool.error('List images failure ', r);
    	}
    });
  };
  
  var inspect = function(imageId, success_cal, error_cal){
    AjaxTool.get(DC_CONFIG.DC_API_IMAGES_PATH+'/'+imageId, null, function(text, status){
        if (typeof success_cal == 'function'){
          success_cal(text, status);
	    } else {
	    	if (status != 'success'){
		        ToastrTool.error('Inspect image failure: ' + status);
		    }
	    }
    }, function(e, h, r){
    	if (typeof error_cal == 'function'){
          error_cal(text, status);
	    } else {
	    	ToastrTool.error('Inspect image failure ', r);
	    }
    });
  };
  
  return {
    list: list,
    inspect: inspect
  }
})();
