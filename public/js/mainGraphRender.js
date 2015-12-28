var renderMain = function(data) {
	var tooltip = d3.select("#mapcontainer")
		.append("div")
		.attr('class', 'line-tooltip');

	var margin = {
			top: 5,
			right: 5,
			bottom: 5,
			left: 5
		},
		width = 400 - margin.left - margin.right,
		height = 630 - margin.top - margin.bottom;

	// var x0 = Math.max(-d3.min(data), d3.max(data));
	// var x1 = Math.max(d3.max(data));


	var x0 = 36;
	var x1 = 10;

	var x = d3.scale.linear()
		.range([0, width]);

	var y = d3.scale.ordinal()
		.rangeRoundBands([0, height], 0.2);

	var xAxis = d3.svg.axis().scale(x).ticks(10);

	var usa;
	data.forEach(function(country) {
		if(country.Country === "United States") {
			usa = country;
		}
	});

	x.domain(d3.extent(data, function(d) {
		return parseFloat(d.dollar_price) - parseFloat(usa.dollar_price);
	}));

	y.domain(data.map(function(d) {
		return d.Country;
	}));

	var svg = d3.select(".overlay").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g");
	//  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		// .attr("class", "value")
		.attr("class", function(d) {
			return parseFloat(d.dollar_price) - parseFloat(usa.dollar_price) < 0 ? "bar negative" : "bar positive";
		})
		.attr("x", function(d) {
			return Math.min(x(0), x(parseFloat(d.dollar_price) - (parseFloat(usa.dollar_price))));
		})
		.attr("y", function(d) {
			return y(d.Country);
		})
		.attr("width", function(d, i) {
			if ( (parseFloat(usa.dollar_price) - parseFloat(d.dollar_price)) === parseFloat(usa.dollar_price)){
				return 0;
			} else {
				return (Math.abs(x(parseFloat(usa.dollar_price)) - x(parseFloat(d.dollar_price))));
			}
		})
		.attr("height", y.rangeBand());



	svg.append("g")
		.attr("class", "y axis")
		.append("line")
		.attr("x1", x(0))
		.attr("x2", x(0))
		.attr("y1", 15)
		.attr("y2", height - 15);

	svg.append("g")
		.attr("class", "x axis")
		.call(xAxis);

	svg.selectAll(".y axis")
		.data(data)
		.enter().append("text")
		.text(function(d) {
			return d.Country;
		})
		.attr('class', 'main-text')
		.attr("text-anchor", "left")
		.attr("x", function(d, i) {
			var value = parseFloat(d.dollar_price) - parseFloat(usa.dollar_price);
			if(value <= 0) {
				return x(0) + 2;
			} else {
				return x(Math.min(0, value)) + Math.abs(x(value) - x(0)) + 1;
			}
		})
		.attr("y", function(d, i) {
			return y(i) + 8;
		});

};
