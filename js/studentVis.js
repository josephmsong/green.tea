// D3 to show the graphs for the student page
ClassGraphs = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    this.labelNames = ["math", "history", "science", "english"]

    // define all "constants" here
    this.margin = {top: 20, right: 20, bottom: 40, left: 50},
    this.width = 600 - this.margin.left - this.margin.right,
    this.height = 210 - this.margin.top - this.margin.bottom;

    this.initVis();
}

// method to set up SVG and variables
ClassGraphs.prototype.initVis = function(){

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
        .attr("x", 95)
        .attr("y", -17)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Subject Breakdown");

    // filter, aggregate, modify data
    this.displayData = this.wrangleData(1);

    // call the update method
    this.updateVis();
}


/**
 * the drawing function - should use the D3 selection, enter, exit
 */
ClassGraphs.prototype.updateVis = function(){

    var that = this;

    // ...update scales
    this.x.domain([0,1,2,3]);

    this.y.domain([85, d3.max(this.displayData)]);

    // updates axis
    this.svg.select(".x.axis")
        .call(this.xAxis)
        .selectAll("text")
            .text(function(d, i){return that.labelNames[i];})
            .style("text-anchor", "end")
            .attr("x", -21)
            .attr("y", -24)
            .attr("dy", "0.15em")
            .attr("font-size", "65%")
            .attr("transform", function(d){
                  return "rotate(-65)";
            });

    this.svg.select(".y.axis")
        .call(this.yAxis)


    // updates graph
    d3.selectAll(".subjectBars").remove();

      var colorScale = d3.scale.category20b();

    var groups = this.svg.append("g")
                .selectAll("g.row")
                .data(this.displayData)
                .enter()
                .append("g")
                .attr("class", "row");

    var bars = groups
                .append("rect")
                .attr("width", function (d, i) {return 50;})
                .attr("height", function (d){return that.height - that.y(d);})
                .attr("x", function (d, i) {return that.x(i);})
                .attr("y", function (d,i) {return that.y(d);})
                .attr("class", "subjectBars")
                .attr("fill", colorScale)
                .append("text")

}

/**
* wrangles data when a year is selected to show the relevant information
*/
ClassGraphs.prototype.wrangleData = function (yearSelected){

      var that = this; 

      var currYear = 2 - yearSelected;

      // student subject order is math, history, science, english

      // currAvg is used to determine the average for the subject being determined
      // count is then used to store this into the appropriate part of avgData
      var currAvg = 0;
      var count = 0; 

      // subjectData holds the student's performance: math, history, science, english (in that order)
      var subjectData = [0, 0, 0, 0];

      // go through each subject in the current year for the current student
      for (var subject in this.data.year[currYear].grades){

            if(that.data.year[currYear].grades.hasOwnProperty(subject)){

                  // hwCount keeps track of how many assignments there are in the subject
                  var hwCount = 0;

                  // go through each assignment in the grade, adding in the value
                  for(var grade in this.data.year[currYear].grades[subject]){
                        if(that.data.year[currYear].grades[subject].hasOwnProperty(grade)){

                              hwCount++;
                              currAvg += that.data.year[currYear].grades[subject][grade];
                        }
                  }

                  subjectData[count] += currAvg/hwCount;

                  // prepare to find the average for a new subject
                  currAvg = 0;
                  count++;
            }

      }

      return subjectData;
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
ClassGraphs.prototype.onSelectionChange= function (yearSelected){

    this.displayData = this.wrangleData(yearSelected);

    this.updateVis();


}





