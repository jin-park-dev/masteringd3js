/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/


let svg = d3.select("#chart-area").append("svg")
  .attr("width", 500)
  .attr("height", 500)

let line = svg.append("line")
  .attr("x1", 15)
  .attr("y1", 15)
  .attr("x2", 150)
  .attr("y2", 15)
  .attr("stroke", "green")
  .attr("stroke-weigth", 10)

let circle = svg.append("circle")
  .attr("cx", 35)
  .attr("cy", 50)
  .attr("r", 25)
  .attr("fill", "blue")

let ellipse = svg.append("ellipse")
  .attr("cx", 65)
  .attr("cy", 120)
  .attr("rx", 55)
  .attr("ry", 25)
  .attr("fill", "grey")
