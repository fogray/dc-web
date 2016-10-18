var AjaxTool = {
  post: function(url, requestBody, success, error){
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(requestBody),
      error: function(e, h, r){
        if (typeof error != 'function'){
          alert(r);
        } else {
          error(e,h,r);
        }
      },
      success: function(text, status) {
        if (typeof success == 'function') {
          success(text, status);
        } else {
          alert('status: '+status);
        }
      }
    });
  },
  
  get: function(url, params, success, error){
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'json',
      data: JSON.stringify(params),
      error: error,
      success: success
    });
  },
  delete: function(url, params, success, error){
    $.ajax({
      url: url,
      type: 'DELETE',
      dataType: 'json',
      data: JSON.stringify(params),
      error: error,
      success: success
    });
  }
};
