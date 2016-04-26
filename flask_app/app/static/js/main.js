//data format: 
//	time array [ 
//			person array [
//				(tie strength, derivative strength)
//			] 
//		]

var time = [];
for (var x = 0; x < 100; x++){
	var people = [];
	for (var y = 0; y < 12; y++){
		//70 is the max length for now for no reason
		var person = { tieStrength: Math.random(), tieStrengthDerivative: Math.random() };
		people.push(person);
	}
	time.push(people);
}

var width = 600,
    height = 700,
    centerx = width /2,
    centery = height /2,
    minDist = 80,
    circleRadius = 20,
    maxLength = (centerx - circleRadius) - 50;

var graph = d3.select(".graph")
    .attr("width", width)
    .attr("height", height);

startData(0, time);


function startData(time, timeData){
	graph.selectAll("svg > *").remove();
	var data = new Array;
	data = timeData[time];
	//for(var person in timeData[time]) {
	//    data.push(timeData[time][person].tieStrength);
	//}
	var circles = graph.selectAll("g")
    	.data(data)
	  .enter().append("g")
	  	.attr("transform", function(d, i) { 
	    	return "translate(" + centerx + ", " + centery + ")"; 
	    });

	circles.append("rect")
	.transition()
		//-2 for width offset
	    .attr("x",-2)
	    .attr("y",0)
	    .attr("height", function(d){return (minDist+ d.tieStrength * maxLength);})
	    .attr("width", 4)
	    .attr("transform", function(d, i){ 
	    	return  "rotate(" + (i * (360/data.length))  + ", 0, 0)"; 
	    });

	circles.append("circle")
		.transition()
		    .attr("cy", function(d, i){ 
		    	var degrees = i * (360/data.length);
		    	var ytrans = (Math.cos(radians(degrees)) * (maxLength * d.tieStrength + minDist));
		    	return ytrans; 
		    })
		    .attr("cx", function(d, i){ 
		    	var degrees = i * (360/data.length);
		    	var xtrans = -1 * (Math.sin(radians(degrees)) * (maxLength * d.tieStrength + minDist));
				return xtrans;
		    })
		    .attr("r", circleRadius)
		    .attr("fill", function(d){
		    	//console.log(d);
				var red = 0;
				var green = 0; parseInt(255 - 255 * d.tieStrengthDerivative);
				var blue = 0;
				if (d.tieStrengthDerivative > 0.5){
					red = parseInt(255 - (255 * (d.tieStrengthDerivative - 0.5))*2);
					green = 255;
				}
				else{
					green = parseInt(255 * d.tieStrengthDerivative * 2);
					red = 255;
				}
		    	return "rgb(" + red + "," + green + "," + blue+")";
		    });


	circles.append("text")
	    .attr("x", 0)
	    .attr("y", 0)
	    .attr("dy", ".35em")
	    .text(function(d) { return d.tieStrength; });
	
	//root circle
	graph.append("circle")
	    .attr("cy", centery)
	    .attr("cx", centerx)
	    .attr("fill", "red")
	    .attr("r", circleRadius * 2);
}


function reloadData(time, timeData){
	//graph.selectAll("svg > *").remove();
	var data = new Array;
	data = timeData[time];
	var circles = graph.selectAll("g").data(data).transition();

	circles.select("rect")
		//-2 for width offset
	    .attr("x",-2)
	    .attr("y",0)
	    .attr("height", function(d){return (minDist+ d.tieStrength * maxLength);})
	    .attr("width", 4)
	    .attr("transform", function(d, i){ 
	    	return  "rotate(" + (i * (360/data.length))  + ", 0, 0)"; 
	    });


	circles.select("circle")
	    .attr("cy", function(d, i){ 
	    	var degrees = i * (360/data.length);
	    	var ytrans = (Math.cos(radians(degrees)) * (maxLength * d.tieStrength + minDist));
	    	return ytrans; 
	    })
	    .attr("cx", function(d, i){ 
	    	var degrees = i * (360/data.length);
	    	var xtrans = -1 * (Math.sin(radians(degrees)) * (maxLength * d.tieStrength + minDist));
			return xtrans;
	    })
	    .attr("r", circleRadius)
	    .attr("fill", function(d){
	    	//console.log(d);
			var red = 0;
			var green = 0; parseInt(255 - 255 * d.tieStrengthDerivative);
			var blue = 0;
			if (d.tieStrengthDerivative > 0.5){
				red = parseInt(255 - (255 * (d.tieStrengthDerivative - 0.5))*2);
				green = 255;
			}
			else{
				green = parseInt(255 * d.tieStrengthDerivative * 2);
				red = 255;
			}
	    	return "rgb(" + red + "," + green + "," + blue+")";
	    });


	circles.select("text")
	    .attr("x", 0)
	    .attr("y", 0)
	    .attr("dy", ".35em")
	    .text(function(d) { return d.tieStrength; });

}


function updateSlider(timeVal){
	reloadData(timeVal, time);
}

// Converts from degrees to radians.
function radians(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
function degrees(radians) {
  return radians * 180 / Math.PI;
};
