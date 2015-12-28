console.log('app loaded');

var renderAllGraphs = function(data) {
	// renderBarGraph(data);
	renderLineChart(data);
};

//
// var renderBarGraph = function(data) {
//
// 	var margin = {
// 			top: 50,
// 			right: 20,
// 			bottom: 30,
// 			left: 40
// 		},
// 		width = 650 - margin.left - margin.right,
// 		height = 300 - margin.top - margin.bottom;
//
// 	var x = d3.scale.ordinal()
// 		.rangeRoundBands([0, width], 0.1);
//
// 	var y = d3.scale.linear()
// 		.range([height, 0]);
//
// 	var xAxis = d3.svg.axis()
// 		.scale(x)
// 		.orient("bottom");
//
// 	var yAxis = d3.svg.axis()
// 		.scale(y)
// 		.orient("left")
// 		.ticks(10);
//
// 	var svg = d3.select(".chart-container").append("svg")
// 		.attr("width", width + margin.left + margin.right)
// 		.attr("height", height + margin.top + margin.bottom)
// 		.append("g")
// 		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// 	x.domain(data.reverse().map(function(d) {
// 		return d.Year;
// 	}));
//
// 	y.domain([0, d3.max(data, function(d) {
// 		return parseFloat(d.local_price) + 1;
// 	})]);
//
// 	svg.append("g")
// 		.attr("class", "x axis")
// 		.attr("transform", "translate(0," + height + ")")
// 		.call(xAxis)
// 		.append("text")
// 		.style("text-anchor", "start")
// 		.attr("y", 30) //this is the Year x axis label and this moves it up and down
// 		.attr("dx", "30em") //year axis label that moves it left to right
// 		.text("Year");
//
// 	svg.append("g")
// 		.attr("class", "y axis")
// 		.call(yAxis)
// 		.append("text")
// 		.attr("transform", "rotate(-90)")
// 		.attr("y", 6) //up and down of label
// 		.attr("dy", ".71em") //left to right of label
// 		.style("text-anchor", "end") //anchors to a certain point
// 		.text("Price (local)");
//
// 	svg.selectAll(".bar")
// 		.data(data)
// 		.enter().append("rect")
// 		.attr("class", "bar")
// 		.attr("x", function(d) {
// 			return x(d.Year);
// 		})
// 		.attr("width", x.rangeBand())
// 		.attr('height', 0)
// 		.attr('y', height)
// 		.transition()
// 		.delay(function(d, i) {
// 			return i * 100;
// 		})
// 		.duration(500)
// 		.attr("y", function(d) {
// 			return y(parseFloat(d.local_price));
// 		})
// 		.attr("height", function(d) {
// 			return height - y(parseFloat(d.local_price));
// 		});


//
//
// };
