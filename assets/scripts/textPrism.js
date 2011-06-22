$(document).ready(function() {
	// Stuff to do as soon as the DOM is ready;

	(function( $ ){
		$.fn.textPrism = function(stops, list) {
			var pHTML = "";
			var bigColorList;
			var lastColor;
			var words = this.html().split(' ');

			colorStops = stops;
			colorList = list;

			if (colorStops.length != colorList.length) {console.warn('Color Stops and Color List are not the same length, heed warning.');}

			generateColorSteps();

			//start generated css rule
			styleHTML = "<style>s {display:inline;text-decoration:none;"+ fetchRGBString(colorList[0]) + "}\n";

			// generate css with colors
			for (i in words){
				pHTML += encodeColoring(i, words[i], colorList[i]);
				styleHTML += makeCSS(i);
			}

			function generateColorSteps() {
				var newColorList = [];
				var colorListCopy = colorList;
				var aim = []; 
				for ( i in colorList )
				{ 	
					j = parseInt(i) + 1 ;

					var colorListCopy = colorList.slice(i);

					current = colorListCopy.shift();
					target = colorListCopy.shift();

					// add root color into list
					newColorList.push(current);

					if (target == undefined) { lastColor = current; }

					stepCount = colorStops[j] - colorStops[i];

					for (o = 1; o < stepCount; o++){
						parseRGB(current);
						parseRGB(target);
						colorSteps = [0, 0, 0];
						colorSteps[0] = (target.r - current.r ) / (stepCount/o);
						colorSteps[1] = (target.g - current.g ) / (stepCount/o);
						colorSteps[2] = (target.b - current.b ) / (stepCount/o);

						//add interp color
						newColorList.push([current.r + colorSteps[0],
							current.g + colorSteps[1],
							current.b + colorSteps[2]]);
						}	
					}

					bigColorList = newColorList;

				}

				function parseRGB (cList) {
					cList.r = cList[0];
					cList.g = cList[1];
					cList.b = cList[2]; 
					return cList
				}

				function makeCSS(count){ 

					if (count >= bigColorList.length) { color = lastColor; }
					else {	color = bigColorList[count]; }

					var colorStr = fetchRGBString(color);

					count++;

					css = "s:nth-of-type("+count+"){ "+ colorStr +"}\n";

					return css;
				}

					function fetchRGBString(color){

						r = parseInt(color[0]);
						g = parseInt(color[1]);
						b = parseInt(color[2]);
						str = "color: rgb("+r+","+g+","+b+");";

						console.log(color + " >> " + str);

						return str;
					}

					function encodeColoring(count, word, color){
						pre = "<s>";

						for (index = 0; index < colorStops.length; index++) {
							if (count == colorStops[index]){ pre = "<s class='special'>"; }
						}

						return pre + word + "</s> "
					}


					render(this);

					function render(target){
						// put generated css
						$('head').append(styleHTML + "</style>");
						
						// rewrite target (this could probably be done better)
						target.html(pHTML);
					}

				};
				})( jQuery );

				// which words are the color anchors
				colorStops = [0,4,7,15,22,37,39,43,45];

				//what colors to make the anchor words
				colorList = [ [ 0, 0, 0 ],
				[ 0, 200, 0], 
				[ 255, 100, 0 ],
				[ 180, 180, 0 ],
				[ 0, 0, 0 ],
				[ 0, 0, 255 ],
				[ 0, 255, 0 ],
				[ 255, 255, 255 ],
				[ 100, 0, 0 ],
				[ 255, 0, 0 ],];


				$('#colorize').textPrism(colorStops, colorList);
			});	

