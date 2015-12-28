$(document).ready(function() {


	console.log('jquery loaded');
	var currencyNames;
	var arrayChoropleth = [];
	var array2015 = [];
	var currency;
	//SETS UP D3 MAP
	d3.select(window).on("resize", throttle);
	var zoom = d3.behavior.zoom()
		.scaleExtent([1, 5])
		.on("zoom", move);

	var width = document.getElementById('mapcontainer').offsetWidth + 200;
	var height = width / 1.5;
	var topo, projection, path, svg, g;
	var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

	setup(width, height);

	function setup(width, height) {
		projection = d3.geo.mercator()
			.translate([0, 80])
			.scale(width / 1.75 / Math.PI); //the width / # determines how zoomed in it is

		path = d3.geo.path()
			.projection(projection);

		svg = d3.select("#mapcontainer").append("svg")
			.attr('class', 'map')
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + width / 2.3 + "," + height / 2.2 + ")") //the number you divide by width changes how the map is translated in the window
			.call(zoom);

		g = svg.append("g");

	}

	d3.json("data/world-topo.json", function(error, world) {

		var countries = topojson.feature(world, world.objects.countries).features;
		topo = countries;
		draw(topo);
	});

	function populateArray() {
		console.log('populateArray');
		var year = $('#dropdown :selected').text();
		if (year === "Now") {year = 2015;}
		console.log(year);
		$.ajax({
			url: "/" + year,
			method: "GET",
			dataType: "json"
		}).done(pushToArray);
	}

	var pushToArray = function(data) {
		data.forEach(function(country) {
			arrayChoropleth.push(country);
		});
	};

	populateArray();

	function populate2015Array() {
		$.ajax({
			url: "/2015",
			method: "GET",
			dataType: "json"
		}).done(pushTo2015Array);
	}

	var pushTo2015Array = function(data) {
		data.forEach(function(country) {
			array2015.push(country);
		});
	};
	populate2015Array();

	var getCurrency = function() {
		$.ajax({
			url: "https://openexchangerates.org/api/latest.json?app_id=2b9c666e79b5461dad8b9490cc1f8193",
			method: "GET",
			dataType: "jsonp"
		}).done(pushCurrencyArray);
	};
	var pushCurrencyArray = function(data) {
		var dataRate = data;
		currency = dataRate;
	};

	getCurrency();

	var getCurrencyName = function() {
		$.ajax({
			url: "https://openexchangerates.org/api/currencies.json?app_id=2b9c666e79b5461dad8b9490cc1f8193",
			method: "GET",
			dataType: "jsonp"
		}).done(pushCurrencyName);
	};
	var pushCurrencyName = function(data) {
		currencyNames = data;
		console.log(currencyNames);
	};

	getCurrencyName();

	function redraw() {
		// width = document.getElementById('container').offsetWidth - 30;
		// height = width / 2;
		d3.select('.map').remove();
		setup(width, height);
		draw(topo);
	}

	function move() {
		var t = d3.event.translate;
		var s = d3.event.scale;
		var h = height / 3;

		t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
		t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

		zoom.translate(t);
		g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

	}

	var throttleTimer;

	function throttle() {
		window.clearTimeout(throttleTimer);
		throttleTimer = window.setTimeout(function() {
			redraw();
		}, 200);
	}

	function draw(topo) {
		var country = g.selectAll(".country").data(topo);

		//if country path is equal to country name from array then compare with the parseFloat.

		country.enter().insert("path")
			.attr("class", "country")
			.attr("d", path)
			.attr("id", function(d, i) {
				return d.id;
			})
			.style('fill', function(d, i) {
				return d.properties.color;
			})
			.attr("title", function(d, i) {
				return d.properties.name;
			}) //this is where the color is defined
			.transition()
			.duration(1500)
			.style("fill", function(d, i) {
				var col;
				var scaled = 0;
				arrayChoropleth.forEach(function(country) {
					if(country.Country === d.properties.name) {
						scaled = d3.scale.linear().domain([0, 12]).range([0, 200]);
						col = "hsl(45," + scaled(country.dollar_price) + "%,50%)";
					}
				});
				d.properties.color = col;
				return d.properties.color;
			});
		//offsets plus width/height of transform
		var offsetL = document.getElementById('worldmap').offsetLeft + (width / 2.75);
		var offsetT = document.getElementById('worldmap').offsetTop + (height / 2);

		//creates the hover for the country name
		country
			.on("mousemove", function(d, i) {
				var mouse = d3.mouse(svg.node()).map(function(d) {
					return parseInt(d);
				});
				array2015.forEach(function(country) {
					if(d.properties.color === undefined) {

						tooltip
							.classed("hidden", false)
							.attr("style", "left:" + (mouse[0] + offsetL + 400) + "px;top:" + (mouse[1] + offsetT) + "px")
							.html(d.properties.name);

					} else {
						tooltip
							.classed("hidden", false)
							.attr("style", "left:" + (mouse[0] + offsetL + 200) + "px;top:" + (mouse[1] + offsetT) + "px")
							.html(function() {

								// console.log(arrayChoropleth);
								var localPrice, dollarPrice, exchangeRate, currencyName;
								arrayChoropleth.forEach(function(country) {
									if(country.Country === d.properties.name) {
										localPrice = parseFloat(country.local_price).toFixed(2);
										dollarPrice = parseFloat(country.dollar_price).toFixed(2);
										exchangeRate = currency.rates[country.currency].toFixed(2);
										// exchangeRate = parseFloat(country.dollar_ex).toFixed(2);
										currencyName = currencyNames[country.currency];
									}
									// if (currencyNames[country.country_code] === country.countryCode
								});
								if ($('#dropdown :selected').text() != "Now") {
										return "<u>" + d.properties.name + "</u>" + "<br><strong> Local Price:</strong> " + localPrice + " " + currencyName + "s" + "<br> <strong>Dollar Price: $</strong>" + dollarPrice;
								} else {
								return "<u>" + d.properties.name + "</u>" + "<br><strong> Local Price:</strong> " + localPrice + " " + currencyName + "s" + "<br> <strong>Dollar Price: $</strong>" + (localPrice / exchangeRate).toFixed(2) + " <br><strong> Current Exchange Rate:</strong> " + exchangeRate + " to 1 USD"; }
							});
					}
				});



			}) //end mousemove
			.on("mouseout", function(d, i) {
				tooltip.classed("hidden", true);
			});


		country
			.on("click", function(d, i) {
				if(d.properties.color !== undefined) {
					showGraphContainer(d, i);
				}
			});


	}

	var mainGraph = function() {
		var year = $('#dropdown :selected').text();
		console.log(year);
		if (year === "Now") {year = 2015;}
		console.log(year);
		$.ajax({
			url: "/" + year,
			method: "GET",
			dataType: "json"
		}).done(renderMain);
	};

	mainGraph();

	var showGraphContainer = function(d, i) {
		var mouse = d3.mouse(svg.node()).map(function(d) {
			return parseInt(d);
		});

		$.ajax({
			url: "/countries/" + d.properties.name,
			method: "GET",
			dataType: "json"
		}).done(renderAllGraphs);

	};

	$('#go').on('click', function() {
		console.log('click');
		arrayChoropleth = [];
		populateArray();
		throttle();
	});

	$('#scrolldown').on('click', function(){
		$(window).scrollTop($('#worldmap').offset().top);
	});


}); //end onload
