/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

d3.json("data/buildings.json").then((data) => {
  data.forEach((d) => {
    d.height = +d.height
  })

  let svg = d3.select("#chart-area").append("svg")
    .attr("width", 500)
    .attr("height", 500)

  let barchartRect = svg.selectAll("rect")
    .data(data)

  barchartRect.enter()
    .append("rect")
    .attr("x", (d, i) => {
      return (i * 35) + 10
    })
    .attr("y", 10)
    .attr("height", (d) => {
      return d.height
    })
    .attr("width", 30)
    .attr("fill", "grey")

}).catch((error) => {
  console.log(error)
})