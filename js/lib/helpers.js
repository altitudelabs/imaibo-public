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

function toDate(date){
  var d = date.toString();
  var year = d.slice(0, 4);
  var month = d.slice(4, 6);
  var day = d.slice(6, 8);

  return year + '-' + month + '-' + day;
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
