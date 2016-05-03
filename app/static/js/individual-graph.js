//Set the dimensions of the canvas / graph
function viewPersonalGraph(time, currentTime, personId){
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;

    // Parse the date / time
    function parseDate(dateString){
        //"2011-03-18"
        var dateVals = dateString.split("-");
        return new Date(dateVals[0], dateVals[1], dateVals[2]);
    }

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
        .x(function(d, i) { 
            return x(data[i].date); 
        })
        .y(function(d, i) { return y(data[i].close); });
        
    // Adds the svg canvas
    var svg = d3.select("#personal-graph")
        .append("svg")
            .attr("id", "personal-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    var data = [];
    console.log(time[timeVal]);
    var ID = time[timeVal][personId].id
    for (var i = 0; i < time.length; i++){
        tempID = -1;
        for (j = 0; j < time[i].length; j++){
            if (time[i][j].id == ID){
                tempID = j;
            }
        }

        //onsole.log(time[i], i);
        //console.log(time[i][tempID], tempID);
        if (tempID == -1){
            data[i] = {
                "date": parseDate(time[i][0].week), 
                "close": 0
            }
        }
        else{
            data[i] = {
                "date": parseDate(time[i][tempID].week), 
                "close":time[i][tempID].tieStrength
            }
        }
    }

    // Scale the range of the data
    x.domain(d3.extent(data, function(d, i) { return data[i].date; }));
    y.domain([0, d3.max(data, function(d, i) { return data[i].close; })]);

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
        .attr("offset", function(d, i) { 
            return d.offset; 
        })   
        .attr("stop-color", function(d, i) { return d.color; });

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


    $("#personal-graph").slideDown("slow");
    $("#minimize-personal").show();

}

