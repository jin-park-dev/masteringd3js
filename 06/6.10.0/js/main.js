/*
*    main.js
*    Mastering Data Visualization with D3.js
*    CoinStats
*/

var margin = { left:80, right:100, top:50, bottom:100 },
  height = 500 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

var svg = d3.select("#chart-area").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left +
    ", " + margin.top + ")");

let t = () => { return d3.transition().duration(1000); }

// Time parser for x-scale
var parseTime = d3.timeParse("%d/%m/%Y");
let formatTime = d3.timeFormat("%d/%m/%Y");

// For tooltip
var bisectDate = d3.bisector(function(d) { return d.year; }).left;

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Axis generators
var xAxisCall = d3.axisBottom()
  .ticks(4)
var yAxisCall = d3.axisLeft()

// Axis groups
var xAxis = g.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g")
  .attr("class", "y axis")

// X-Axis label
let xAxisLabel = g.append("text")
  .attr("class", "axis-title")
  .attr("x", width/2)
  .attr("y", height + 55)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")

// Y-Axis label
let yAxixLabel = g.append("text")
  .attr("class", "axis-title")
  .attr("transform", "rotate(-90)")
  .attr("x", -height/2)
  .attr("y", -70)
  .attr("dy", ".71em")
  .attr("font-size", "20px")
  .style("text-anchor", "middle")
  // .attr("fill", "#5D6971")


// Add line to chart
g.append("path")
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "grey")
  .attr("stroke-with", "3px")


///
/// JSON GET ///
///

let dataAll

d3.json("data/coins.json").then(function(data) {
  // Data cleaning
  // console.log(data)

  filteredData = {}
  for (let coin in data) {
    // console.log(coin)

    filteredData[coin] = data[coin].filter((d) => {
      return (d.price_usd !== null)
    })

    filteredData[coin].forEach(function(d) {
      // console.log(d)
      d["24h_vol"] = Number(d["24h_vol"])
      d.date = parseTime(d.date);
      d.market_cap = Number(d.market_cap)
      // console.log(d.price_usd)
      d.price_usd = parseFloat(d.price_usd)
      // console.log(d.price_usd)
    });
  }

  data = filteredData
  dataAll = data

  console.log(data)

  update(data)

});


let coinSelect = document.getElementById("coin-select")
coinSelect.onchange = () => {
  update(dataAll)
}
let varSelect = document.getElementById("var-select")
varSelect.onchange = () => {
  update(dataAll)
}


// Have to use jquery as it's jquery library
// let dateSlider = document.getElementById("date-slider")
// dateSlider.slider({
//   range: true,
//   max: parseTime("31/10/2017").getTime(),
//   min: parseTime("12/5/2013").getTime(),
//   step: 86400000, // One day
//   values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
//   slide: function(event, ui){
//     $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
//     $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
//     update();
//   }
// })

// Add jQuery UI slider
$("#date-slider").slider({
  range: true,
  max: parseTime("31/10/2017").getTime(),
  min: parseTime("12/5/2013").getTime(),
  step: 86400000, // One day
  values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
  slide: function(event, ui){
    $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
    $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
    update(dataAll);
  }
});



function update(data) {
  let coin = document.getElementById("coin-select").value
  let yValue = document.getElementById("var-select").value

  let sliderValues = $("#date-slider").slider("values");
  data = data[coin].filter(function(d) {
    return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
  })

  // console.log(coin)
  // data = data[coin]

  // console.log(sliderValues)
  // console.log(data)

  // Set scale domains
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([d3.min(data, function(d) { return d[yValue]; }) / 1.005,
    d3.max(data, function(d) { return d[yValue]; }) * 1.005]);

  // Fix for format values
  var formatSi = d3.format(".2s");
  function formatAbbreviation(x) {
    var s = formatSi(x);
    switch (s[s.length - 1]) {
      case "G": return s.slice(0, -1) + "B";
      case "k": return s.slice(0, -1) + "K";
    }
    return s;
  }

  // console.log("d[yValue]")
  // console.log(data[yValue])
  // console.log("== end d[yValue] ==")

  // Generate axes once scales have been set
  xAxisCall.scale(x);
  xAxis.transition(t()).call(xAxisCall);
  yAxisCall.scale(y);
  yAxis.transition(t()).call(yAxisCall.tickFormat(formatAbbreviation));
// .tickFormat(function(d) { return parseInt(d / 1000) + "k"; });
// .ticks(6)


  // xAxis.call(xAxisCall.scale(x))
  // yAxis.call(yAxisCall.scale(y))

  // Clear old tooltips
  d3.select(".focus").remove();
  d3.select(".overlay").remove();



  /******************************** Tooltip Code ********************************/

  var focus = g.append("g")
    .attr("class", "focus")
    .style("display", "none");

  focus.append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height);

  focus.append("line")
    .attr("class", "y-hover-line hover-line")
    .attr("x1", 0)
    .attr("x2", width);

  focus.append("circle")
    .attr("r", 7.5);

  focus.append("text")
    .attr("x", 15)
    .attr("dy", ".31em");

  g.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { focus.style("display", null); })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d[yValue]) + ")");
        focus.select("text").text(function() { return d3.format("$,")(d[yValue].toFixed(2)); });
    focus.select(".x-hover-line").attr("y2", height - y(d[yValue]));
    focus.select(".y-hover-line").attr("x2", -x(d.date));
  }


  /******************************** Tooltip Code ********************************/

  // Line path generator
  var line = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d[yValue]); });
  // console.log(line(data))

  g.select(".line")
    .transition(t)
    .attr("d", line(data));

  // Update axis labels
  let newText
  xAxisLabel.text("Time")
  if (yValue === 'price_usd') {
    newText = 'Price (USD)'
  } else if (yValue === 'market_cap') {
    newText = 'Market Capitalization (USD)'
  } else {
    newText = '24 Hour Trading Volume (USD)'
  }
  yAxixLabel.text(newText)
}