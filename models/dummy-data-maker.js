var days = 250;
var timestamp = 1398988800;
var output = [];
var price = 100;
var variance = 5;
var drift = 0.1;

for (var i = 0; i < days; i++){
  price += drift + (Math.random()-0.5)*variance;
  timestamp += 60 * 60 * 24;

  var tick = {};
  tick.price = price.toFixed(2).toString()
  tick.timestamp = timestamp;
  tick.change = i > 0 ? (price - output[i-1].price).toFixed(2).toString() : '0.00';
  output.push(tick);
}

console.log(JSON.stringify(output));