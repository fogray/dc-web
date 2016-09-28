function ImagesListCtrl($scope){
    $.get('http://dev.imaicloud.com/dc/api/images').success(function(data){
      $scope.images = eval(data);
    });
  }
