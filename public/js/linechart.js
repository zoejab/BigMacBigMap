var renderLineChart = function(data) {

	var tooltip = d3.select("body")
		.append("div")
		.attr('class', 'line-tooltip');

	var margin = {
			top: 30,
			right: 20,
			bottom: 30,
			left: 50
		},
		width = 500 - margin.left - margin.right,
		height = 200 - margin.top - margin.bottom;

	// Set the ranges
	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
		.orient("bottom").ticks(15).tickFormat(d3.format("d"));

	var yAxis = d3.svg.axis().scale(y)
		.orient("left").ticks(10);

	// Define the line
	var valueline = d3.svg.line()
		.x(function(d) {
			return x(parseInt(d.Year));
		})
		.y(function(d) {
			return y(parseFloat(d.local_price).toFixed(2));
		});

	var svg = d3.select("#mapcontainer")
		.append("svg")
		.attr('id', 'draggable')
		.attr('class', 'draggable ui-widget-content')
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	$('.draggable').draggable();

	svg.append('svg:image').attr('xlink:href', '../images/remove.png').attr('class', 'exit')
		.attr("height", '20px')
		.attr('width', '20px')
		.attr("y", -25)
		.attr("x", -45)
		.attr("dx", 20);

	$('.exit').on('click', function(e) {
		$(e.target.parentElement.parentElement).hide();
	});

	// Scale the range of the data
	x.domain(d3.extent(data, function(d) {
		return parseInt(d.Year);
	}));
	y.domain([0, d3.max(data, function(d) {
		return parseFloat(d.local_price);
	})]);

	// Add the valueline path.
	svg.append("path")
		.attr("class", "line")
		.attr("d", valueline(data));

	// Add the X Axis
	svg.append("g")
		.datum(data)
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.style("text-anchor", "start")
		.attr("y", 30) //this is the Year x axis label and this moves it up and down
		.attr("dx", "20em") //year axis label that moves it left to right
		.text("Year");

	svg.append("text")
		.attr("x", (width / 2))
		.attr("y", 0 - (margin.top / 5))
		.attr("text-anchor", "middle")
		.style("font-size", "14px")
		.text(data[0].Country + ": Historical Local Prices");

	// Add the Y Axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6) //up and down of label
		.attr("dy", ".71em") //left to right of label
		.style("text-anchor", "end") //anchors to a certain point
		.text("Price (local)");

	svg.selectAll("dot") // grabs all the circles on line chart
		.data(data) // associates the range of data to the group of elements
		.enter().append("circle") // adds a circle for each data point
		.attr("r", 5)
		.attr("cx", function(d) {
			return x(parseFloat(d.Year));
		}) // at an appropriate x coordinate
		.attr("cy", function(d) {
			return y(parseFloat(d.local_price).toFixed(2));
		}) // and an appropriate y coordinate
		.on("mouseover", function(d) {
			tooltip.text(parseFloat(d.local_price).toFixed(2));
			return tooltip.style("visibility", "visible");
		})
		.on("mousemove", function() {
			return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
		})
		.on("mouseout", function() {
			return tooltip.style("visibility", "hidden");
		});

};
