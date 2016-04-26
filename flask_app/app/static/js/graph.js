//data format: 
//	time array [ 
//			person array [
//				(tie strength, derivative strength)
//			] 
//		]

var time = [];

var width = 600,
    height = 600,
    centerx = width /2,
    centery = height /2,
    minDist = 80,
    circleRadius = 20,
    maxLength = (centerx - circleRadius) - 100,
    strokeWidth = 5;

var graph = d3.select(".graph")
    .attr("width", width)
    .attr("height", height);


$.ajax({
    type: "GET",
    url: $SCRIPT_ROOT + "/processed-json/",
    contentType: "application/json; charset=utf-8",
    success: function(response) {
	    console.log('OMG');
	    time = JSON.parse(response); ;
	    console.log(time[0]);
		startData(0, time);
    }
});  

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

	circles.append('defs')
	        .append('pattern')
	            .attr('id', function(d) { return (d.id+"-icon");}) // just create a unique id (id comes from the json)
	            .attr('width', 1)
	            .attr('height', 1)
	            .attr('patternContentUnits', 'objectBoundingBox')
	            .append("svg:image")
	                .attr("xlink:xlink:href", function(d) { 
	                console.log(d.icon);
	                return (d.icon);}) // "icon" is my image url. It comes from json too. The double xlink:xlink is a necessary hack (first "xlink:" is lost...).
	                .attr("x", 0)
	                .attr("y", 0)
	                .attr("height", 1)
	                .attr("width", 1)
					.attr("preserveAspectRatio", "xMinYMin slice");

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
		    .style("fill", function(d) { return ("url(#"+d.id+"-icon)");})
		    .attr("stroke-width", strokeWidth)
		    .attr("stroke", function(d){
		    	return getStrokeColor(d);
		    });


	circles.append("text")
	    .attr("x", function(d, i){ 
		    	var degrees = i * (360/data.length);
		    	var xtrans = -1 * (Math.sin(radians(degrees)) * (maxLength * d.tieStrength + minDist));
				return xtrans;
		    })
	    .attr("y", function(d, i){ 
		    	var degrees = i * (360/data.length);
		    	var ytrans = (Math.cos(radians(degrees)) * (maxLength * d.tieStrength + minDist));
		    	return ytrans; 
		    })
	    .attr("dy", ".35em")
	    .text(function(d) { return d.tieStrength; });
	
	//root circle
	graph.append("circle")
	    .attr("cy", centery)
	    .attr("cx", centerx)
	    .attr("fill", "red")
	    .attr("r", circleRadius * 2);
}

function getStrokeColor(d){
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
}
//change what you need to change at reload
function reloadData(time, timeData){
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
	    .attr("stroke-width", strokeWidth)
		.attr("stroke", function(d){
	    	return getStrokeColor(d);
	    });


	circles.select("text")
	    .attr("x", function(d, i){ 
		    	var degrees = i * (360/data.length);
		    	var xtrans = -1 * (Math.sin(radians(degrees)) * (maxLength * d.tieStrength + minDist));
				return xtrans;
		    })
	    .attr("y", function(d, i){ 
		    	var degrees = i * (360/data.length);
		    	var ytrans = (Math.cos(radians(degrees)) * (maxLength * d.tieStrength + minDist));
		    	return ytrans; 
		    })
	    .attr("dy", ".35em")
	    .text(function(d) { return d.tieStrength; });

}
var jsonData = {"name":"Users","children":[{"id":"id0","icon":"https://twitter.com/iHeartRadio/profile_image?size=original","name":"@iHeartRadio","size":15000,"value":48},{"id":"id1","icon":"https://twitter.com/IamDiamondEyes/profile_image?size=original","name":"@IamDiamondEyes","size":14000,"value":44},{"id":"id2","icon":"https://twitter.com/pranshu11/profile_image?size=original","name":"@Macys","size":13000,"value":43},{"id":"id3","icon":"https://twitter.com/natekristanto/profile_image?size=original","name":"@natekristanto","size":12000,"value":42},{"id":"id4","icon":"https://twitter.com/CVGUpdates/profile_image?size=original","name":"@CVGUpdates","size":11000,"value":32},{"id":"id5","icon":"https://twitter.com/w0nderfvl/profile_image?size=original","name":"@w0nderfvl","size":10000,"value":27},{"id":"id6","icon":"https://twitter.com/clearhair/profile_image?size=original","name":"@clearhair","size":9000,"value":25},{"id":"id7","icon":"https://twitter.com/BPlizak/profile_image?size=original","name":"@BPlizak","size":8000,"value":24},{"id":"id8","icon":"https://twitter.com/courtneyerhard4/profile_image?size=original","name":"@courtneyerhard4","size":7000,"value":24},{"id":"id9","icon":"https://twitter.com/BriaKelly/profile_image?size=original","name":"@BriaKelly","size":6000,"value":19},{"id":"id10","icon":"https://twitter.com/bulbaqsauce/profile_image?size=original","name":"@bulbaqsauce","size":5000,"value":19},{"id":"id11","icon":"https://twitter.com/kubbyop/profile_image?size=original","name":"@kubbyop","size":4000,"value":19},{"id":"id12","icon":"https://twitter.com/Lemonade229/profile_image?size=original","name":"@Lemonade229","size":3000,"value":18}]}

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