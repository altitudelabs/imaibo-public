String.prototype.format = function() {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
    var regexp = new RegExp('\\{'+i+'\\}', 'gi');
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

function getDateString(date){
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if(month <= 9){
    month = '0' + month;
  }
  if(day <= 9){
    day = '0' + day;
  }
  return '{0}-{1}-{2}'.format(year, month, day);
}

function min(a, b){ return a < b ? a : b ; }
function max(a, b){ return a > b ? a : b; }

Handlebars.registerHelper('ifEq', function(a, b, opts){
  return (a==b? opts.fn(this): opts.inverse(this));
});

Handlebars.registerHelper('isGreater', function(a,b, opts){
  return (a > b? opts.fn(this): opts.inverse(this));
});

Handlebars.registerHelper('toPercentage', function(a){
  return (a*100).toFixed().toString() + '%';
});

Handlebars.registerHelper('dateStr', function(text) {
  text = text.toString();
  if (text.length === 8){
    var formattedDateStr = text.substr(0,4) + '-' + text.substr(4,2) + '-' + text.substr(6,2);
    return new Handlebars.SafeString(formattedDateStr);
  } else {
    return new Handlebars.SafeString(text);
  }
});

Handlebars.registerHelper('formatLargeNumber', function(num){
  return new Handlebars.SafeString(Math.round(num/1000000)/100 + '亿');
});

Handlebars.registerHelper('formatNumber', function(num, dp){
  if (typeof num === 'string') num = parseFloat(num);

  var numberWithCommas = function(x) {
      return x.toFixed(dp).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (dp === 0){
    return new Handlebars.SafeString(Math.round(num));
  } else {
    var base = Math.pow(10, dp),
        roundedNum = Math.round(num*base)/base;
    return new Handlebars.SafeString(numberWithCommas(num));
  }
});

var Helper = {
  toDate: function(date, format){
    var d = date.toString();
    var year = d.slice(0, 4);
    var month = d.slice(4, 6);
    var day = d.slice(6, 8);

    if (format === 'yyyy/mm'){
      return year + '/' + month;
    } else {
      return year + '-' + month + '-' + day;
    }
  },
  populateView:
    /*
     * Populate HandlebarJS template.
     * ==============================
     * arguments:
     *  - target_id: id/class of your div. i.e. '#expertsView'
     *  - template_id: id template. i.e. '#experts-template'
     *  - resource: the data you are passing in. e.g. {name: 'Ray'}
     */
    function (target_id, template_id, resource){
      var target_selector = $(target_id);
      var template_selector = $(template_id);
      var template = Handlebars.compile(template_selector.html());
      if(resource.constructor === Array){
        target_selector.html(template({data: resource}));
      }else{
        target_selector.html(template(resource));
      }
    }
}
