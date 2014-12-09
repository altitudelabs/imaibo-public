(function(){
  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var model;

  $.getJSON('../../models/chart-sentiment-model.json', function(res){
    model = res;
    var i = 100;
    model.data.indexList.forEach(function(d){
      d.price = (getRandomInt(i, 10000)/100).toString();
      i += 10;
    });

   console.log( JSON.stringify(model));
  });
})();

