// get the canvas and drawing context
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

// draw a rectange
function rect(x, y, width, height, color) {
	// start a new stroke so when we fill in the rectange everything
	// else we have drawn already will not be redrawn
	ctx.beginPath();

	// add a rectange to the path
	ctx.rect(x, y, width, height);

	// set the color for the rectange
	ctx.fillStyle = color;

	// draw the rectange
	ctx.fill();
}

if(typeof draw == "function") {
	function frame() {
		draw();

		requestAnimationFrame(frame)
	}

	frame();
}

document.body.addEventListener("keydown", function(e) {
	// left arrow press
	if(e.keyCode == 37 && typeof left == "function") {
		left();
	}
	// right arrow press
	if(e.keyCode == 39 && typeof right == "function") {
		right();
	}
});
