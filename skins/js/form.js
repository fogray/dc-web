var DC_CONFIG = {
  DC_HOST: 'http://dev.imaicloud.com/dc',
  DC_API_HOST: this.DC_HOST+ '/api/app/',
  DC_API_WS_PATH: this.DC_HOST+ '/ws/api/app/',
  DC_API_SERVICES_PATH: this.DC_HOST+ '/api/app/{tenant}/services',
  DC_API_CONTAINERS_PATH: this.DC_HOST+ '/api/app/{tenant}/containers',
  DC_API_IMAGES_PATH: this.DC_HOST+ '/api/app/{tenant}/images',
  WEBUI_CONTEXT: '/dc-web'
};
var USER_INFO = null;
$(function(){
  $('input[type="checkbox"].selector.selector-all').click(function(){
    if (this.checked) {
      $('input[type="checkbox"][name="selector"]').each(function(){
        $(this).prop('checked', true);
      });
    } else {
      $('input[type="checkbox"][name="selector"]:checked').each(function(){
        $(this).prop('checked', false);
      });
    }
  });
  
  var payload = getCookie(CookieKeys.payload)
  	  , payload = $.base64.decode(payload);
  USER_INFO = JSON.parse(payload);
  
  DockerActionDom.init();
  NoUiSliderDom.init();
  
  /**
   * 用于转化系统时间，按照正则表达式的形式显示
   * formatStr:
   *  yyyy:年
   *  MM:月
   *  dd:日
   *  hh:小时
   *  mm:分钟
   *  ss:秒
   */
  Date.prototype.toFormatString = function(formatStr) {
      var date = this;
      var timeValues = function() {
      };
      timeValues.prototype = {
          year : function() {
              if (formatStr.indexOf("yyyy") >= 0) {
                  return date.getFullYear();
              } else {
                  return date.getFullYear().toString().substr(2);
              }
          },
          elseTime : function(val, formatVal) {
              return formatVal >= 0 ? (val < 10 ? "0" + val : val) : (val);
          },
          month : function() {
              return this.elseTime(date.getMonth() + 1, formatStr.indexOf("MM"));
          },
          day : function() {
              return this.elseTime(date.getDate(), formatStr.indexOf("dd"));
          },
        hour : function() {
            return this.elseTime(date.getHours(), formatStr.indexOf("hh"));
        },
        minute : function() {
            return this.elseTime(date.getMinutes(), formatStr.indexOf("mm"));
        },
        second : function() {
            return this.elseTime(date.getSeconds(), formatStr.indexOf("ss"));
        }
      };
      var tV = new timeValues();
      var replaceStr = {
        year : [ "yyyy", "yy" ],
        month : [ "MM", "M" ],
        day : [ "dd", "d" ],
        hour : [ "hh", "h" ],
        minute : [ "mm", "m" ],
        second : [ "ss", "s" ]
      };
      for ( var key in replaceStr) {
        formatStr = formatStr.replace(replaceStr[key][0], eval("tV." + key
                + "()"));
        formatStr = formatStr.replace(replaceStr[key][1], eval("tV." + key
                + "()"));
      }
      return formatStr;
    };
});

//获取页面传递的查询参数
function getParams(){
  var search = window.location.search;
  if (search && search != '' && search.indexOf('?')>=0) {
    var ps = search.substring(1).split('&');
    var params = {};
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i].split('=');
      params[p[0]] = p[1]; 
    }
    return params;
  }
  return null;
}
//根据key获取页面查询参数值
function getParam(keyN){
  var params = getParams();
  if (params!=null) {
    return params[keyN];
  }
  return '';
}


var DockerActionDom = {
  ServiceDom : {
    init: function(){
      this.create();
    },
    create: function(){
      $(document).on('click', '.btn.service-action.service-action-create', function(){
        window.location.href = DC_CONFIG.WEBUI_CONTEXT+ '/views/services/wizard/config.html'
      });
    }
  },
  init: function(){
    this.ServiceDom.init();
  }
}

var NoUiSliderDom = {
  init: function(){
    $('.noUiSlider.slider-step').each(function(){
      var obj = this;
      noUiSlider.create(obj, {
        start: [0],
        step: 1,
        connect: true,
        range: {'min':0, 'max':20}
      });
      obj.noUiSlider.on('update', function(values, handles){
        obj.title = values[handles];
      });
    });
  },
  setValue: function(obj, v){
    $(obj)[0].noUiSlider.set(v);
  },
  getValue: function(obj){
    return Math.round($(obj)[0].noUiSlider.get());
  }
}

var ToastrTool = {
	success: function(title, msg){
		toastr['success'](title, msg);
	},
	error: function(title, msg){
		toastr['error'](title, msg);
	},
	info: function(title, msg){
		toastr['info'](title, msg);
	}
}
