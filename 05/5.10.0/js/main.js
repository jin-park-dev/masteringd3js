/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

let margin = { left: 100, right:10, top:10, bottom:150 }

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
  .attr("x", width/2)
  .attr("y", height + 55)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)")


// Y Label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(height/2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy (Years)")

// Year Label
let yearLabel = g.append("text")
  .attr("x", width - 40)
  .attr("y", height - 10)
  .attr("font-size", "40px")
  .attr("opacity", "0.4")
  .attr("text-anchor", "middle")



// X-Axis
let xAxisGroup = g.append("g")
 .attr("class", "x-axis")
 .attr("transform", `translate(0, ${height})`)

// Y-Axis
let yAxisGroup = g.append("g")
  .attr("class", "y-axis")

//
// Main part
//
d3.json("data/data.json").then((data) => {

  data.forEach((d) => {
    d.year = +d.year
  })

  // console.log('Whole: data')
  // console.log(data)
  //
  // console.log('First in array: data[0]')
  // console.log(data[0])
  //
  // console.log('Country for year 19xx: data[0]["countries"]')
  // console.log(data[0]['countries'])

  // console.log('new')
  // console.log(data.length)

  // let data2 = data[200]['countries'].slice(80,110)
  // data = data[113]['countries'].slice(80,110)

  // Run for the first time so there's no empty first time.
  update(data[0])

  let i=0
  // Update live
  d3.interval(() => {
    update(data[i])
    i = (i < data.length-1) ? i+1 : 0
    // console.log(i)
    // console.log("updated")
  }, 200)

})
.catch((error) => {
  console.log(error)
})


function update(data) {

  // Creating scaling x, y

  // console.log("data in update function")
  // console.log(data)

  let year = data.year
  data = data['countries']

  // console.log('year')
  // console.log(year)
  // console.log("data[countries]")
  // console.log(data["countries"])

  let x = d3.scaleLog()
    // .domain(data.map((d) => { return d.income }))
    .domain([300, 150000])
    .range([0, width])
    // .paddingInner(0.3)
    // .paddingOuter(0.3)

  let y = d3.scaleLinear()
    // .domain([0, d3.max(data, (d) => {
    //   return d.life_exp
    // })])
    .domain([0, 90])
    .range([height, 0])

  let area = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => {
      return d.population
    })])
    // .range([5, 25])
    .range([25*Math.PI, 1500*Math.PI])

  let continentColor = d3.scaleOrdinal(d3.schemePastel1);

  // Creating axis
  let xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(d3.format("$"));
  xAxisGroup.call(xAxisCall)
  //
  let yAxisCall = d3.axisLeft(y)
    .ticks(10)
  // // .tickFormat((d) => { return `insert sometick format` })
  yAxisGroup.call(yAxisCall)


  //
  // Update pattern
  //

  let t = d3.transition().duration(100)

  // JOIN Data

  let circles = g.selectAll("circle")
    .data(data, (d) => {
      return d.country
    })

  // EXIT
  circles.exit()
    .attr("class", "exit")
    .remove()

  // // UPDATE (Don't seem to neeeeed???)
  //
  // circles
  //   .attr("cx", (d) => {
  //     return x(d.income) + x.bandwidth() / 2})
  //   .attr("cy", (d) => {
  //     return y(d.life_exp) })
  //   .attr("r", (d) => {
  //     return r(d.population)
  //   })
  //   .attr("fill-opacity", 0)

  // ENTER

  circles.enter()
    .append("circle")
    // .attr("width", x.bandwidth)
    // .attr("height", (d) => {
    //   return height - y(d.life_exp)
    // })
    // .attr("r", 8)
    .attr("class", "enter")
    .attr("fill", (d) => { return continentColor(d.continent) })
    // .attr("fill-opacity", 0)
    .merge(circles)
    .transition(t) //???ms transition
      .attr("cx", (d) => {
        // console.log("income")
        // console.log(d.income)
        // console.log(x(d.income))
        return x(d.income)})
      .attr("cy", (d) => {
        // console.log("life_exp")
        // console.log(d.life_exp)
        // console.log(y(d.life_exp))
        return y(d.life_exp) })
      .attr("r", (d) => {
        // console.log(d.population)
        // console.log(r(d.population))
        return Math.sqrt(area(d.population) / Math.PI)
      })
      // .attr("fill-opacity", 0.8)

  yearLabel.text(year)
}