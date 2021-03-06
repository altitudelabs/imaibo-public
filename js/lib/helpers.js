/*
 * Polyfill for Object.keys
 * From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 */
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

/*
 * Helper that converts date object to yyyymmdd format
 */
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  var dd  = this.getDate().toString();
  return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

/*
 * Helper that formats a string according to a regular expression
 */
String.prototype.format = function() {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
    var regexp = new RegExp('\\{'+i+'\\}', 'gi');
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

/*
 * Helper that returns a date string in yyyy-mm-dd format
 *
 * @param date is a Javascript date object
 */
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

/*
 * Helper that returns smaller of two elements
 */
function min(a, b){ return a < b ? a : b; }

/*
 * Helper that returns larger of two elements
 */
function max(a, b){ return a > b ? a : b; }

/*
 * Handlebars helpers
 */
Handlebars.registerHelper('ifEq', function(a, b, opts){
  return (a === b ? opts.fn(this): opts.inverse(this));
});

Handlebars.registerHelper('isGreater', function(a, b, opts){
  return (a > b ? opts.fn(this): opts.inverse(this));
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

Handlebars.registerHelper('toAbs', function(num){
  return Math.abs(num);
});

Handlebars.registerHelper('toPercentage', function(a){
  if(a === '-') return '-';
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

Handlebars.registerHelper('formatYi', function(num, dp){
  var numberWithCommas = function(x) {
    return x.toFixed(dp).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return new Handlebars.SafeString(numberWithCommas(num/1000000) + '亿');
});

Handlebars.registerHelper('formatWan', function(num, dp){
  var numberWithCommas = function(x) {
    return x.toFixed(dp).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return new Handlebars.SafeString(numberWithCommas(num/10000) + '万');
});

Handlebars.registerHelper('formatNumber', function(num, dp, addSign){
  if (typeof num === 'string') num = parseFloat(num);

  var numberWithCommas = function(x) {
    var prefix = '';
    if (addSign === 1 && x > 0) prefix = '+';
    if (addSign === 0 && x < 0) prefix = '-';
    return prefix + x.toFixed(dp).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (dp === 0){
    return new Handlebars.SafeString(numberWithCommas(num));
  } else {
    var base = Math.pow(10, dp),
        roundedNum = Math.round(num*base)/base;
    return new Handlebars.SafeString(numberWithCommas(num));
  }
});

var Helper = {

  /**
   * toDate() converts Javascript date to a certain date format
   *
   * @param date: Javascript date object
   * @param format: either 'yyyy/mm' or 'yyyy-mm-dd' (default)
   */
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

  /**
   * yyyymmddToDate() converts yyyymmdd string to Javascript Date object
   */
  yyyymmddToDate: function (str) {
    if (!/^(\d){8}$/.test(str)) { return 'invalid date'; }
    var y = str.substr(0,4),
        m = (parseInt(str.substr(4,2))-1).toString(),
        d = str.substr(6,2);
    return new Date(y,m,d);
  },

  /**
   * populateView() populates a handlebars view
   *
   * @param target_id: id/class of your div. i.e. '#expertsView'
   * @param template_id: id template. i.e. '#experts-template'
   * @param resource: the data you are passing in. e.g. {name: 'Ray'}
   */
  populateView: function (targetId, templateId, resource){
    var targetSelector = $(targetId);
    var templateSelector = $(templateId);
    var template = Handlebars.compile(templateSelector.html());
    if(resource.constructor === Array) {
      targetSelector.html(template({data: resource}));
    }
    else {
      targetSelector.html(template(resource));
    }
  },

  /**
   * IEtableEnterLoop() helper for enterLoop() for IE8
   */
  IEtableEnterLoop: function(tableID, data, template){
    var $table = $(tableID),
        $rows = $(tableID + ' tr'),
        rowsToAdd = data.length - $rows.length;

    for (var i = 0; i < rowsToAdd; i++){
      $table.append('<tr>' + template + '</tr>');
    }
  },

  /**
   * enterLoop()
   * - Acts as a helper function if you decide to use D3 for <tr> append
   * - This helper negates the error thrown by r2d3 for appending 'tr' element on the enter loop
   * - Note: the ordering is important. IEtableEnterLoop() must prepend the d3 selection-data loop
   *          Or else d3 selection object would not select anything.
   *
   * @param tableID: our table id with # selector. i.e. '#stockpicker-table-body'
   * @param data: the data you are passing in. usually an array.
   * @param template: the html you want d3 to render for you on the enter() loop
   * @param isIE8: boolean that defines if it is running in IE8
   */
  enterLoop: function(tableID, data, template, isIE8){
  	if(isIE8) Helper.IEtableEnterLoop(tableID, data, template); //ordering is important
      var table = d3.select(tableID)
                    .selectAll('tr')
                    .data(data);
  	if(!isIE8) table.enter().append('tr').html(template);	          // ordering is important
  	return table;
  },
}
