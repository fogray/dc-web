var App = function(){
	blockUI: function(obj){
		$.blockUI({
			message: 'loading...',
			baseZ: 10000,
			overlayCSS: {
                        backgroundColor: '#555',
                        opacity: 0.05,
                        cursor: 'wait'
                    }
		});
	},
	unblockUI: function(obj){
		$.unblockUI();
	}
	return {
		init: function(){
		  blockUI();
		  unblockUI();
		}
	}
}();
$(function(){
	App.init();
});