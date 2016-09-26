var webPath = 'http://dev.imaicloud.com/dc/';
$(function(){
	listServices();
}
);
function listServices(){
	var $wrapObj = $('#serviceList');
	$wrapObj.html('');
	$.ajax({
		url: webPath + 'api/services',
		type: 'get',
		error: function(e, h, r) {
			
		},
		success: function(data){
			var json = eval(data), len = json.length;
			for (var i = 0; i < len; i++) {
				$wrapObj.append(itemDiv());
			}
		}
	});
}
function itemDiv(){
	var left = '<div class="col-md-2" ><input class="selector" type="checkbox"></checkbox></div>';
	var sn = '<div class="col-md-3"></div><div class="col-md-3">';
	var image = '<div class="col-md-3"></div><div class="col-md-3">';
	var ct = '<div class="col-md-3"></div><div class="col-md-3">';
	var actions = '<div class="col-md-3"></div><div class="col-md-3">';
	var right = '<div class="col-md-10"><div class="row">'+sn+image+ct+actions+'</div></div>';
	return '<li><div class="row">'+left+right+'</div></li>';
	
}
