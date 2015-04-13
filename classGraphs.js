// D3 to show the graphs for the class page

LearningGraphs = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    this.labelNames = ["visual", "auditory", "kinesthetic"]

    // define all "constants" here
    this.margin = {top: 20, right: 20, bottom: 30, left: 50},
    this.width = 300 - this.margin.left - this.margin.right,
    this.height = 200 - this.margin.top - this.margin.bottom;

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
      .orient("left");

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
        .attr("y", -17)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Learning Styles");

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
LearningGraphs.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
LearningGraphs.prototype.updateVis = function(){

    var that = this;

    // ...update scales
    this.x.domain([0,1,2]);
    this.y.domain(d3.extent(this.displayData, function(d, i) {return d; }));

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)
        .selectAll("text")
        	.text(function(d, i){return that.labelNames[i];})
        	.style("text-anchor", "end")
        	.attr("x", -10)
        	.attr("y", 10)
        	.attr("dy", "0.15em")
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
                .attr("height", function (d){return that.height - that.y(d);})
                .attr("x", function (d, i) {return that.x(i);})
                .attr("y", function (d,i) {return that.y(d);})
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


/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
LearningGraphs.prototype.filterAndAggregate = function(_filter){


    // Set filter to a function that accepts all items if nothing provided
    var filter = function(){return true;}

    // if filter provided, use that one
    if (_filter != null){
        filter = _filter;
    }

    // filters the data based on the given filter
    this.displayData = this.data.filter(filter)

    return this.displayData;
}




