var AjaxTool = {
  post: function(url, requestBody, success, error){
    $.ajax({
      url: url,
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(requestBody),
      error: error(),
      success: success()
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
