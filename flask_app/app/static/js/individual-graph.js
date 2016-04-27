//Set the dimensions of the canvas / graph
function viewPersonalGraph(centerx, centery){
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%d-%b-%y").parse;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5);

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });
        
    // Adds the svg canvas
    var svg = d3.select("#personal-graph")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("static/js/test.csv", function(error, data) {
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);

        svg.append("linearGradient")                
            .attr("id", "line-gradient")            
            .attr("gradientUnits", "userSpaceOnUse")    
            .attr("x1", 0).attr("y1", 0)         
            .attr("x2", 0).attr("y2", 200)      
        .selectAll("stop")                      
            .data([   
                // Gradient is flipped for some reason, 0-20 is green                          
                {offset: "0%", color: "#88a734"},       
                {offset: "30%", color: "#88a734"},

                {offset: "30%", color: "#fcd436"},       
                {offset: "70%", color: "#fcd436"},

                {offset: "70%", color: "#c8333d"},    
                {offset: "100%", color: "#c8333d"}    
            ])                  
        .enter().append("stop")         
            .attr("offset", function(d) { return d.offset; })   
            .attr("stop-color", function(d) { return d.color; });

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            // .attr("transform", "translate(0," + height + ")")
            .attr("transform", "translate(0," + 0 + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    });

    $("#personal-graph").slideDown("slow");}

