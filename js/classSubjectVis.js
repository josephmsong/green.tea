// D3 to show the graphs for the class page// D3 to show the graphs for the class page

ClassGraphs = function(_parentElement, _data, _assignmentData, _allData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.assignmentData = _assignmentData;
    this.displayData = [];
    this.labelNames = ["math", "history", "science", "english"]
    this.labelHWNames = [["addition", "subtraction", "division", "multiplication"],["pledge", "constitution", "war","law"],["acids", "entropy", "elements", "animals"],["spelling", "grammar", "punctuation", "sentences"]]

    // define all "constants" here
    this.margin = {top: 40, right: 20, bottom: 40, left: 50},
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
        .attr("x", 90)
        .attr("y", -25)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Subject Breakdown");

    // filter, aggregate, modify data
    this.displayData = this.data;

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

    console.log(this.displayData);

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
* wrangles data when a subject is selected in order to show the more detailed assignment data
*/
ClassGraphs.prototype.wrangleData = function (subjectSelected){

    var that = this;

    console.log(subjectSelected);

    var subjectData = [0,0,0,0]
    var subjectID = 0;
    var count = 0;

    if(subjectSelected != "All"){

        switch(subjectSelected){
            case "Math":
                subjectID = 0;
                break;
            case "History":
                subjectID = 1;
                break;
            case "Science":
                subjectID = 2;
                break;
            case "English":
                subjectID = 3;
                break;
            default:
                subjectID = 0;
        }

        console.log(this.assignmentData[0]);

        for(var assignment in this.assignmentData[subjectID]){
            if(this.assignmentData[subjectID].hasOwnProperty(assignment)){

                subjectData[count] = this.assignmentData[subjectID][assignment];
                count++;    
            }
        }

        this.labelNames = this.labelHWNames[subjectID];
    }

    else{

        subjectData = this.data;
        this.labelNames = ["math", "history", "science", "english"]
    }

    this.displayData = subjectData;

}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
ClassGraphs.prototype.onSelectionChange= function (subjectSelected){

    this.wrangleData(subjectSelected)

    this.updateVis();


}





