/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

let margin = { left:100, right:10, top:10, bottom:150 }

let width = 800 - margin.left - margin.right
let height = 600 - margin.top - margin.bottom

let g = d3.select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

// X Label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", width/2) // On half way of the page
  .attr("y", height + 55) // on bottom of the page but with 40px extra lower (or it clashes with labels)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Months")

// Y Label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(height/2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue")

// Get data and doing all the required steps to create a barchart
d3.json("data/revenues.json").then( (data) => {
  console.log(data)

  data.forEach((d) => {
    d.revenue = +d.revenue
    d.profit = +d.profit
  })

  // Creating scaling x, y

  let x = d3.scaleBand()
    .domain(data.map((d) => { return d.month }))
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3)

  let y = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => {
      return d.revenue
    })])
    .range([height, 0])
    // .range([0, height])

  // Creating axis

  let xAxisCall = d3.axisBottom(x)

  g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxisCall)

  let yAxisCall = d3.axisLeft(y)
    .ticks(10)
    .tickFormat((d) => { return `£${d}` })

  g.append("g")
    .attr("class", "y-axis")
    .call(yAxisCall)

  // Creating bars

  let rects = g.selectAll("rect")
    .data(data)

  rects.enter()
    .append("rect")
    .attr("x", (d, i) => { return x(d.month)}) // Uses scaleBand object which auto worked out x position from data it was feed.
    .attr("y", (d) => { return y(d.revenue) })
    .attr("width", x.bandwidth)
    .attr("height", (d) => {
      return height - y(d.revenue)
    })
    .attr("fill", "grey")

})
.catch((error) => {
  console.log(error)
})
