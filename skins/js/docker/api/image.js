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
    $.ajax({
      url: DC_CONFIG.DC_API_IMAGES_PATH+'/'+imageId,
      type: 'get',
      dataType: 'json',
      error: function(e,h,r){
        alert(r);
      },
      success: function(data,status){
        if (status=='success'){
	  error_cal(data);
	}
      }
    });
  };
  
  return {
    list: list,
    inspect: inspect
  }
})();
