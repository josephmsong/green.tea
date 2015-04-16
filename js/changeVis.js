// D3 to show the graphs for the student page
ChangeGraphs = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    this.labelNames = ["Grade 1", "Grade 2", "Grade 3"]
    this.showLine = [true, true, true, true]

    // define all "constants" here
    this.margin = {top: 20, right: 20, bottom: 60, left: 50},
    this.width = 600 - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.initVis();
}

// method to set up SVG and variables
ChangeGraphs.prototype.initVis = function(){

    var that = this;

    // construct or select SVG

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // create axis and scales

    this.x= d3.scale.ordinal().rangeBands([0, that.width+50], .1)

    this.y = d3.scale.linear()
      .range([this.height, 20]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left")
      .tickFormat(d3.format(",.0f"));

    this.mathLine = d3.svg.line()
      .x(function(d, i) { return that.x(i); })
      .y(function(d) { return that.y(d); });

    this.historyLine = d3.svg.line()
      .x(function(d, i) { return that.x(i); })
      .y(function(d) { return that.y(d); });

    this.scienceLine = d3.svg.line()
      .x(function(d, i) { return that.x(i); })
      .y(function(d) { return that.y(d); });

    this.englishLine = d3.svg.line()
      .x(function(d, i) { return that.x(i); })
      .y(function(d) { return that.y(d); });

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")

    this.svg.append("g")
        .attr("class", "y axis")
      .append("text")
        .attr("x", 95)
        .attr("y", -17)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Change Over Time");

    // filter, aggregate, modify data
    this.displayData = this.data;

    // call the update method
    this.updateVis();
}


/**
 * the drawing function - should use the D3 selection, enter, exit
 */
ChangeGraphs.prototype.updateVis = function(){

    var that = this;

    // ...update scales
    this.x.domain([0,1,2]);

    this.y.domain([84, 100]);

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)
        .selectAll("text")
            .text(function(d, i){return that.labelNames[i];})
            .style("text-anchor", "end")
            .attr("x", -47)
            .attr("y", -67)
            .attr("dy", "0.15em")
            .attr("font-size", "75%")
            .attr("transform", function(d){
                  return "rotate(-65)";
            });

    this.svg.select(".y.axis")
        .call(this.yAxis)


    // updates graph
    d3.selectAll(".subjectLine").remove();

    if(this.showLine[0]){

      that.svg.append("path")
        .datum(that.displayData[0])
        .attr("class", "subjectLine")
        .style("fill", "none")
        .style("stroke", "steelblue")
        .style("stroke-width", "3px")
        .attr("d", that.mathLine);
    }

    if(this.showLine[1]){

      that.svg.append("path")
        .datum(that.displayData[1])
        .attr("class", "subjectLine")
        .style("fill", "none")
        .style("stroke", "green")
        .style("stroke-width", "3px")
        .attr("d", that.historyLine);
    }

    if(this.showLine[2]){

      that.svg.append("path")
        .datum(that.displayData[2])
        .attr("class", "subjectLine")
        .style("fill", "none")
        .style("stroke", "red")
        .style("stroke-width", "3px")
        .attr("d", that.scienceLine);
    }

    if(this.showLine[3]){

      that.svg.append("path")
        .datum(that.displayData[3])
        .attr("class", "subjectLine")
        .style("fill", "none")
        .style("stroke", "orange")
        .style("stroke-width", "3px")
        .attr("d", that.englishLine);
    }
}

/**
* wrangles data when a year is selected to show the relevant information
*/
ChangeGraphs.prototype.wrangleData = function (yearSelected){


}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
ChangeGraphs.prototype.onSelectionChange= function (subjectSelected){

    this.showLine[subjectSelected] = !this.showLine[subjectSelected];

    this.updateVis();


}





