// D3 to show the graphs for the class page// D3 to show the graphs for the class page

LearningGraphs = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    this.labelNames = ["visual", "auditory", "kinesthetic"]

    // define all "constants" here
    this.margin = {top: 50, right: 20, bottom: 60, left: 70},
    this.width = 300 - this.margin.left - this.margin.right,
    this.height = 210 - this.margin.top - this.margin.bottom;

    this.initVis();
}

// method to set up SVG and variables
LearningGraphs.prototype.initVis = function(){

    var that = this;


    // construct or select SVG

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // create axis and scales

    this.x= d3.scale.ordinal().rangeBands([0, that.width], .1)

    this.y = d3.scale.linear()
      .range([this.height, 0]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left")
      .tickFormat(d3.format(",.0f"));

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")

    this.svg.append("g")
        .attr("class", "y axis")
      .append("text")
        .attr("x", 65)
        .attr("y", -25)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Learning Styles");

    // filter, aggregate, modify data
    this.displayData = this.data;

    // call the update method
    this.updateVis();
}


/**
 * the drawing function - should use the D3 selection, enter, exit
 */
LearningGraphs.prototype.updateVis = function(){

    var that = this;

    // ...update scales
    this.x.domain([0,1, 2]);

    this.y.domain(d3.extent(this.displayData, function(d, i) {return d;}));

    this.yAxis.tickValues([0, 1, 2]);

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)
        .selectAll("text")
        	.text(function(d, i){return that.labelNames[i];})
        	.style("text-anchor", "end")
        	.attr("x", -15)
        	.attr("y", -9)
        	.attr("dy", "0.15em")
        	.attr("font-size", "35%")
        	.attr("transform", function(d){
        		return "rotate(-65)";
        	});

    this.svg.select(".y.axis")
        .call(this.yAxis)


    // updates graph
    d3.selectAll(".learnBars").remove();
    d3.selectAll(".barsLabel").remove();

   	var colorScale = d3.scale.category20c();

    var groups = this.svg.append("g")
                .selectAll("g.row")
                .data(this.displayData)
                .enter()
                .append("g")
                .attr("class", "row");

    var bars = groups
                .append("rect")
                .attr("width", function (d, i) {return 35;})
                .attr("height", function (d){return that.y(d);})
                .attr("x", function (d, i) {return that.x(i);})
                .attr("y", function (d,i) {return that.height - that.y(d);})
                .attr("class", "learnBars")
                .attr("fill", colorScale)
                .append("text")

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
LearningGraphs.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // this.wrangleData(function(d){return d.time >= selectionStart && d.time <= selectionEnd})

    this.updateVis();


}





