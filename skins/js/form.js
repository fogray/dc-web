var DC_CONFIG = {
  DC_API_HOST: 'http://dev.imaicloud.com/dc/api'
};

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
  
  DockerActionDom.init();
  
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
      create();
    },
    create: function(){
      $(document).on('click', '.btn.service-action.service-action-create', function(){
        window.location.href = '/views/services/wizard.html'
      });
    }
  },
  init: function(){
    ServiceDom.init();
  }
}

