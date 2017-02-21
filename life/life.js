// get the canvas and drawing context
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

// the grid of rects
var template = [];

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

// draw a frame
function draw(template, original) {
	// update the canvas
	for(let y = 0; y < template.length; ++y) {
		for(let x = 0; x < template[0].length; ++x) {
			// draw the rectangle if it is not already there
			if(template[y][x] && (!original || !original[y][x])) {
				rect(x * hookable.rectSize, y * hookable.rectSize, hookable.rectSize, hookable.rectSize, hookable.color);
			}
			// clear the rectangle if it needs to be cleared
			else if(!template[y][x] && (!original || original[y][x])) {
				// clearRect clears anything drawn in the dimensions we give it
				ctx.clearRect(x * hookable.rectSize, y * hookable.rectSize, hookable.rectSize, hookable.rectSize);
			}
		}
	}
};

// clone the template
function cloneTemplate() {
	// map iterates the array and returns a new version filled with what ever is
	// returned by the function
	return template.map(function(row) {
		// slice(0) clones an array
		return row.slice(0);
	});
}

// get hooks from the global context
function createHookable(defaults) {
	var helpMsg = [];

	// inherit from the default values then attach the overrides
	var overrides = Object.create(defaults);

	// get student overrides
	Object.getOwnPropertyNames(defaults)

	.forEach(function(key) {
		// check if an override exists
		if(key in window) {
			overrides[key] = window[key];
		}

		// print information about this hook
		var fnDefs = "";

		// get the parameters for a function
		if(typeof defaults[key] == "function") {
			fnDefs += defaults[key]
				// get the code for the function as a string
				.toString()
				// use a regular expression to get the function parameters
				.match(/\(.+?\)/)[0];
		}
		// print the value for any non-object
		else if(typeof overrides[key] != "object") {
			fnDefs += overrides[key];
		}

		// give type and arguments if its a function
		helpMsg.push(key + " [type: " + typeof defaults[key] + "] " + fnDefs);
	});

	// use setTimeout so the "Navigated to ..." message does not end up in the
	// middle of the help message
	setTimeout(function() {
		console.log("%cOverridable values", "font-size: 1.7em;");

		helpMsg.forEach(function(msg) {
			console.log(msg);
		});
	});

	return overrides;
}

// check if all the rects are dead
function allDead() {
	return template.every(function(row) {
		return row.every(function(cell) {
			return !cell;
		});
	});
}

// set a rect to alive
function alive(x, y) {
	// we need whole numbers
	x = Math.round(x);
	y = Math.round(y);

	template[y - 1][x - 1] = true;
}

// run a single frame
function frame() {
	// save the current state
	var original = template;
	template = cloneTemplate(template);

	// update the squares
	for(let i = 0; i < template.length; ++i) {
		for(let j = 0; j < template[i].length; ++j) {
			// count the live neighbours
			let neighbours = 0;

			// check above
			if(i > 0) {
				if(original[i - 1][j - 1]) ++neighbours;
				if(original[i - 1][j]) ++neighbours;
				if(original[i - 1][j + 1]) ++neighbours;
			}

			// check beside
			if(original[i][j - 1]) ++neighbours;
			if(original[i][j + 1]) ++neighbours;

			// check below
			if(i < template.length - 1) {
				if(original[i + 1][j - 1]) ++neighbours;
				if(original[i + 1][j]) ++neighbours;
				if(original[i + 1][j + 1]) ++neighbours;
			}

			// check if the rect lives or dies
			template[i][j] = hookable.isAlive(original[i][j], neighbours);
		}
	}

	// render the rects to the screen
	draw(template, original);

	// draw another frame
	if(!allDead() && hookable.run) {
		setTimeout(frame, hookable.delay);
	}
}

// create an object containing all the functions the students will override
// or our default versions
var hookable = createHookable({
	// the delay between frames
	delay: 50,

	// the size for the grid
	width: 50,
	height: 50,

	// the size in pixels of a rect
	rectSize: 10,

	// the color for a rect
	color: "green",

	run: true,

	// set the initial state of the grid
	init: function(width, height) {
		// create a glider gun (taken from Wikipedia)
		// https://en.wikipedia.org/wiki/Gun_(cellular_automaton)#/media/File:Game_of_life_glider_gun.svg
		alive(2, 6);
		alive(3, 6);
		alive(2, 7);
		alive(3, 7);
		alive(12, 6);
		alive(12, 7);
		alive(12, 8);
		alive(13, 5);
		alive(13, 9);
		alive(14, 4);
		alive(14, 10);
		alive(15, 4);
		alive(15, 10);
		alive(16, 7);
		alive(17, 5);
		alive(17, 9);
		alive(18, 6);
		alive(18, 7);
		alive(18, 8);
		alive(19, 7);
		alive(22, 6);
		alive(23, 6);
		alive(22, 5);
		alive(23, 5);
		alive(22, 4);
		alive(23, 4);
		alive(24, 3);
		alive(24, 7);
		alive(26, 3);
		alive(26, 7);
		alive(26, 2);
		alive(26, 8);
		alive(36, 4);
		alive(36, 5);
		alive(37, 4);
		alive(37, 5);
	},

	// check if a rect should live or die
	isAlive(alive, neighbours) {
		// a live rect with...
		if(alive) {
			// fewer than 2 neighbours dies
			if(neighbours < 2) return false;
			// more than 3 neighbours dies
			if(neighbours > 3) return false;
			// 2 or 3 neighbours lives
			else return true;
		}
		// a dead rect with 3 neighbours comes alive
		else if(neighbours == 3) {
			return true;
		}
	}
});

// resize the canvas
canvas.width = hookable.width * hookable.rectSize;
canvas.height = hookable.height * hookable.rectSize;

// initialize the template
for(let i = 0; i < hookable.height; ++i) {
	// create the row
	template[i] = [];

	for(let j = 0; j < hookable.width; ++j) {
		template[i][j] = false;
	}
}

// initialize the grid
hookable.init(hookable.width, hookable.height);

// draw the initial state
draw(template);

// start the game
if(hookable.run) {
	setTimeout(frame, hookable.delay);
}
