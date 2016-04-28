//data format: 
//	time array [ 
//			"{"id": id, name}, {}, {}"
//			person array [
//				{"id": id, name}
//			] 
//		]

var time = [];

var width = 600,
    height = 200,
    centerx = width /2,
    centery = height /2,
    minDist = 80,
    circleRadius = 25,
    maxLength = (centerx - circleRadius) - 100,
    strokeWidth = 4,
    data = new Array;

var graph = d3.select(".mini-graph")
    .attr("width", width)
    .attr("height", height);

var img_array = [
"http://www.wall321.com/thumbnails/detail/20120506/green%20animals%20photography%20snakes%201920x1080%20wallpaper_www.wall321.com_85.jpg",
"http://www.chainimage.com/images/download-birds-duckling-baby-swimming-animals-yellow-water-animal.jpg",
"http://www.mobiletoones.com/downloads/wallpapers/iphone_wallpapers/preview/53/79066-cardinal-red-animal-iphone-wallpaper.jpg",
"http://dreamlandia.com/images/L/ladybug.jpg",
"http://animaliaz-life.com/data_images/chameleon/chameleon2.jpg",
"http://www3.canisius.edu/~grandem/butterflylifecycle/Butterfly.jpg",
"https://tctechcrunch2011.files.wordpress.com/2012/09/mark.jpeg",
"http://static1.comicvine.com/uploads/scale_large/11122/111225835/4716707-the+mask.jpg",
"http://animalwall.xyz/wp-content/uploads/2015/10/frogs-little-red-frog-poison-46-phone-wallpapers.jpg",
"http://moransanimaladaptations.yolasite.com/resources/45.jpg",
"http://science-all.com/images/fox/fox-05.jpg",
"http://i0.wp.com/cdn.bgr.com/2015/10/bear.jpg?w=625"
]

$(window).load(function(){ 
	//scale width to size of container
	console.log($( "#mini-graph" ).width());
    width = $( "#mini-graph" ).width();
    centerx = width /2,
    graph = d3.select("#mini-graph")
    	.attr("width", width)
    	.attr("height", height);

    $.ajax({
	    type: "GET",
	    url: $SCRIPT_ROOT + "/processed-json/",
	    contentType: "application/json; charset=utf-8",
	    success: function(response) {
		    time = JSON.parse(response); 
		    	console.log("startin");

			startData(0, time);

			addCircleActions();
	    }
	});  

})

function startData(time, timeData){
	//graph.selectAll("svg > *").remove();
	data = timeData[time];
	var circles = graph.selectAll("g")
    	.data(data)
	  .enter().append("g")
	  	.attr("transform", function(d, i) { 
	    	return "translate(" + centerx + ", " + centery + ")"; 
	    });

	circles.append("rect")
		//-1 for width offset
		.transition()
	    .attr("x",-1)
	    .attr("y",0)
	    .attr("height", function(d){return (minDist+ d.tieStrength * maxLength);})
	    .attr("width", 2)
	    .attr("fill", function(d){
		    return getStrokeColor(d);
		})
	    .attr("transform", function(d, i){ 
	    	return  "rotate(" + (i * (360/data.length))  + ", 0, 0)"; 
	    });

	circles.append('defs')
        .append('pattern')
            .attr('id', function(d, i) { return (img_array[i]);}) // just create a unique id (id comes from the json)
            .attr('width', 1)
            .attr('height', 1)
            .attr('patternContentUnits', 'objectBoundingBox')
            .append("svg:image")
                .attr("xlink:xlink:href", function(d, i) { 
               		return (img_array[i]);
                }) // "icon" is my image url. It comes from json too. The double xlink:xlink is a necessary hack (first "xlink:" is lost...).
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", 1)
                .attr("width", 1)
				.attr("preserveAspectRatio", "xMinYMin slice");

	circles.append("circle")
		.attr("id", function(d) { 
			return (d.id);
		})
		.attr("class", "circle")
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
		    .style("fill", function(d, i) { return ("url(#"+img_array[i]+")");})
		    .attr("stroke-width", strokeWidth)
		    .attr("stroke", function(d){
		    	return getStrokeColor(d);
		    });


	circles.append("text")
		.text(function(d) { return d.name; })
	    .attr("x", function(d, i){ 
		    	return getCircleX(d,i) - this.getComputedTextLength()/2;
		    })
	    .attr("y", function(d, i){ 
		    	var ytrans = circleRadius + strokeWidth*2 + getCircleY(d,i);
		    	return ytrans; 
		    })
	    .attr("dy", ".35em");
	
	//root circle
	graph.append('pattern')
        .attr('id', 'myicon') // just create a unique id (id comes from the json)
        .attr('width', 1)
        .attr('height', 1)
        .attr('patternContentUnits', 'objectBoundingBox')
        .append("svg:image")
            .attr("xlink:xlink:href", function(d) { 
            return ("https://www.petfinder.com/wp-content/uploads/2012/11/bird-average-bird-lifespans-thinkstock-155253666.jpg");}) // "icon" is my image url. It comes from json too. The double xlink:xlink is a necessary hack (first "xlink:" is lost...).
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", 1)
            .attr("width", 1)
			.attr("preserveAspectRatio", "xMinYMin slice");

	graph.append("circle")
		.attr("stroke-width", strokeWidth)
		.attr("stroke", getCenterColor())
	    .attr("cy", centery)
	    .attr("cx", centerx)
	    .attr("r", circleRadius * 2)
		.style("fill", "url(#myicon)");
}

//change what you need to change at reload
function reloadData(time, timeData){
	data = timeData[time];
	var circles = graph.selectAll("g").data(data).transition();

	circles.select("rect")
		//-2 for width offset
	    .attr("x",-1)
	    .attr("y",0)
	    .attr("height", function(d){return (minDist+ d.tieStrength * maxLength);})
	    .attr("width", 2)
	    .attr("fill", function(d){
		    return getStrokeColor(d);
		})
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
		.text(function(d) { return d.name; })
	    .attr("x", function(d, i){ 
		    	return getCircleX(d,i) - this.getComputedTextLength()/2;
		    })
	    .attr("y", function(d, i){ 
				var ytrans = circleRadius + strokeWidth*2 + getCircleY(d,i);
		    	return ytrans; 
		    })
	    .attr("dy", ".35em");

	graph.select("circle")
		.attr("stroke", getCenterColor());
}
//var jsonData = {"name":"Users","children":[{"id":"id0","icon":"https://twitter.com/iHeartRadio/profile_image?size=original","name":"@iHeartRadio","size":15000,"value":48},{"id":"id1","icon":"https://twitter.com/IamDiamondEyes/profile_image?size=original","name":"@IamDiamondEyes","size":14000,"value":44},{"id":"id2","icon":"https://twitter.com/pranshu11/profile_image?size=original","name":"@Macys","size":13000,"value":43},{"id":"id3","icon":"https://twitter.com/natekristanto/profile_image?size=original","name":"@natekristanto","size":12000,"value":42},{"id":"id4","icon":"https://twitter.com/CVGUpdates/profile_image?size=original","name":"@CVGUpdates","size":11000,"value":32},{"id":"id5","icon":"https://twitter.com/w0nderfvl/profile_image?size=original","name":"@w0nderfvl","size":10000,"value":27},{"id":"id6","icon":"https://twitter.com/clearhair/profile_image?size=original","name":"@clearhair","size":9000,"value":25},{"id":"id7","icon":"https://twitter.com/BPlizak/profile_image?size=original","name":"@BPlizak","size":8000,"value":24},{"id":"id8","icon":"https://twitter.com/courtneyerhard4/profile_image?size=original","name":"@courtneyerhard4","size":7000,"value":24},{"id":"id9","icon":"https://twitter.com/BriaKelly/profile_image?size=original","name":"@BriaKelly","size":6000,"value":19},{"id":"id10","icon":"https://twitter.com/bulbaqsauce/profile_image?size=original","name":"@bulbaqsauce","size":5000,"value":19},{"id":"id11","icon":"https://twitter.com/kubbyop/profile_image?size=original","name":"@kubbyop","size":4000,"value":19},{"id":"id12","icon":"https://twitter.com/Lemonade229/profile_image?size=original","name":"@Lemonade229","size":3000,"value":18}]}

function getStrokeColor(d){
	return getColorEmotion(d.tieStrengthDerivative);
}

function getCenterColor(){
	totalStrength = 0;
	for(person in data){
		totalStrength += data[person].tieStrength;
	}
	totalStrength /= data.length;
	return getColorEmotion(totalStrength);
}
function getColorEmotion(value){
	var red = 0;
	var green = 0; parseInt(255 - 255 * value);
	var blue = 0;
	if (value > 0.5){
		red = parseInt(255 - (255 * (value - 0.5))*2);
		green = 255;
	}
	else{
		green = parseInt(255 * value * 2);
		red = 255;
	}
	return "rgb(" + red + "," + green + "," + blue+")";
}

function getCircleY(d,i){
	var degrees = i * (360/data.length);
	var ytrans = (Math.cos(radians(degrees)) * (maxLength * d.tieStrength + minDist));
	return ytrans; 
}

function getCircleX(d,i){
	var degrees = i * (360/data.length);
	var xtrans = -1 * (Math.sin(radians(degrees)) * (maxLength * d.tieStrength + minDist));
	return xtrans;
}

function updateSlider(timeVal){
	reloadData(timeVal, time);
}

// Converts from degrees to radians.
function radians(degrees) {
  return degrees * Math.PI / 180;
}
 
// Converts from radians to degrees.
function degrees(radians) {
  return radians * 180 / Math.PI;
}

function addCircleActions(){
	var people = document.getElementsByClassName("circle");
	for (var i = 0; i < people.length; i++) {
	    people[i].addEventListener("click", function() { 
	        viewPersonalGraph();
	    });
	}
}


