var tapiPath = DC_CONFIG.DC_API_HOST + '/tasks';
var TaskAction = (function(){
  var list = function(params, success){
    $.get(tapiPath, params, function(text, status){
      if (typeof success == 'function'){
        success(text, status);
      }
    });
  }
  var inspect = function(taskId, success){
    $.get(tapiPath+'/'+taskId+'/inspect', {}, function(text, status){
        if (typeof success == 'function'){
          success(text, status);
        }
    });
  }
  
  return {
    list: list,
    inspect: inspect
  }
})();
