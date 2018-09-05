/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.4 - Adding SVGs with D3
*/

// var svg = d3.select("#chart-area").append("svg")
// 	.attr("width", 400)
// 	.attr("height", 400);

// var circle = svg.append("circle")
// 	.attr("cx", 100)
// 	.attr("cy", 250)
// 	.attr("r", 70)
// 	.attr("fill", "grey");

let svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400)

let circle = svg.append("circle")
	.attr("cx", 200)
	.attr("cy", 200)
	.attr("r", 100)
	.attr("fill", "blue")

let rect = svg.append("rect")
	.attr("width", 100)
	.attr("height", 50)
