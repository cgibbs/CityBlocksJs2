SCREEN_WIDTH = 1600;
SCREEN_HEIGHT = 900;

// class Line {
// 	constructor(start, end) {
// 		this.start = start;
// 		this.end = end;
// 	}

// 	draw (ctx) {
// 		ctx.moveTo(...this.start);
// 		ctx.lineTo(...this.end);
// 	}
// }

class GenNode {
	// constructor(pos, exits) {
	// 	this.pos = pos;
	// 	this.exits = exits;
	// 	this.branches = [];
	// }

	// createBranch(dir) {
	// 	this.branches.push(dir);
	// }
	constructor(pos, neighbors, weight=2) {
		this.pos = pos;
		this.neighbors = neighbors || []; // array of tuples, each is an xy coord for mapArr
		this.weight = weight;
	}

	addNeighbors(neighbors) {
		this.neighbors = this.neighbors.concat(neighbors);
	}

	draw() {
		ctx.fillRect(this.pos[0]-1, this.pos[1], 5, 5);
	}
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomChoice(arr) {
	let ret = Math.floor(Math.random() * arr.length);
	return arr[ret];
}

GRID_WIDTH = 10;
GRID_HEIGHT = 10;
GRID_SPACE = 50;
CANVAS_OFFSET = 150;
RANDOM_OFFSET = 5;

// let frontier = [];
let nodes = [];
let objects = [];
let mapArr = [];

function branchesToLines(node) {
// 	let ends = [];
// 	let distance = getRandomInt(1,10) * 10;
// 	if (node.branches.indexOf('n') > -1)
//         ends.push([node.pos[0], node.pos[1] - distance]);
//     if (node.branches.indexOf('e') > -1)
//         ends.push([node.pos[0] + distance, node.pos[1]]);
//     if (node.branches.indexOf('s') > -1)
//         ends.push([node.pos[0], node.pos[1] + distance]);
//     if (node.branches.indexOf('w') > -1)
//         ends.push([node.pos[0] - distance, node.pos[1]]);

//     ends.forEach((end) => {
//     	while (end[0] < 0) end[0] += 100;
//     	while (end[0] > SCREEN_WIDTH) end[0] -= 100;
//     	while (end[1] < 0) end[1] += 100;
// 		while (end[1] > SCREEN_HEIGHT) end[1] -= 100;
// 		if (getRandomInt(0,4) === 3) { // weights toward center of the screen for picking nodes
// 			let new_node = new GenNode([SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2], ['n', 's', 'e', 'w']);
// 			objects.push(new Line(node.pos, end, 3));
//         	frontier.push(new_node);
// 		} else {
// 		    let new_node = new GenNode(end, ['n', 's', 'e', 'w']);
// 	        objects.push(new Line(node.pos, end, 3));
// 	        frontier.push(new_node);
//     	}
//     });
// }

// function pick_branches(node) {
//     if (getRandomInt(0,10) > 8)
//         return;
//     for (i = 0; i < 3; i++) {
//         node.createBranch(randomChoice(node.exits));
//     }
}

function initGrid() {
	for (let i = 0; i < GRID_WIDTH; i++) {
		let mapYArr = [];
		for (let j = 0; j < GRID_HEIGHT; j++) {
			mapYArr.push(new GenNode([CANVAS_OFFSET + i*GRID_SPACE, CANVAS_OFFSET + j*GRID_SPACE]));
		}
		mapArr.push(mapYArr);
	}

	// give generated neighbors to nodes
	for (let i = 0; i < mapArr.length; i++) {
		for (let j = 0; j < mapArr[i].length; j++) {
			// mapArr[i][j].draw();
			let neighborArr = [];
			if ((typeof(mapArr[i]) !== "undefined") && (typeof(mapArr[i][j-1]) !== "undefined")) neighborArr.push(mapArr[i][j-1]);
			if ((typeof(mapArr[i-1]) !== "undefined") && (typeof(mapArr[i-1][j]) !== "undefined")) neighborArr.push(mapArr[i-1][j]);
			if ((typeof(mapArr[i]) !== "undefined") && (typeof(mapArr[i][j+1]) !== "undefined")) neighborArr.push(mapArr[i][j+1]);
			if ((typeof(mapArr[i+1]) !== "undefined") && (typeof(mapArr[i+1][j]) !== "undefined")) neighborArr.push(mapArr[i+1][j]);

			// if ((typeof(mapArr[i]) !== "undefined") && (typeof(mapArr[i][j-1]) !== "undefined")) neighborArr.push('s');
			// if ((typeof(mapArr[i-1]) !== "undefined") && (typeof(mapArr[i-1][j]) !== "undefined")) neighborArr.push('w');
			// if ((typeof(mapArr[i]) !== "undefined") && (typeof(mapArr[i][j+1]) !== "undefined")) neighborArr.push('n');
			// if ((typeof(mapArr[i+1]) !== "undefined") && (typeof(mapArr[i+1][j]) !== "undefined")) neighborArr.push('e');

			mapArr[i][j].addNeighbors(getRandomSubarray(neighborArr, getRandomInt(1,3)));
		}
	}
}

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

function generate(steps) {
	// let n = new GenNode([SCREEN_WIDTH/2, SCREEN_HEIGHT/2], ['n', 's', 'e', 'w'])
	// frontier.push(n);

	// let j = 0
	// while (frontier.length > 0 && j < steps) {
	//     if (getRandomInt(0, 50) < 20)
	//         n = frontier.pop();
	//     else
	//         n = frontier.unshift();
	//     if (n instanceof GenNode) {
	//     	pick_branches(n);
	//     	branchesToLines(n);
	//     	j += 1;
	// 	}
	// }

	// if (frontier.length === 0)
	//     console.log("failed");
	initGrid();

	for (let s = 0; s < steps; s++) {
		let randX = getRandomInt(0, mapArr.length);
		let randY = getRandomInt(0, mapArr[randX].length);

		let randNode = mapArr[randX][randY];
		let randNeighbor = randomChoice(randNode.neighbors);

		let newNodeX = (randNode.pos[0] + randNeighbor.pos[0]) / 2;
		let newNodeY = (randNode.pos[1] + randNeighbor.pos[1]) / 2;

		let otherNewNode = null;

		if (newNodeX == randNode.pos[0]) {
			// newNodeY = getRandomInt(newNodeY - RANDOM_OFFSET, newNodeY + RANDOM_OFFSET);
			let horizOffsetDir = randomChoice([1, -1]);
			let spaceLength = getRandomInt(1, 3);
			otherNewNode = new GenNode([
				newNodeX 
					// + getRandomInt(GRID_SPACE / 4, spaceLength * GRID_SPACE) * horizOffsetDir,
					+ spaceLength * GRID_SPACE * randomChoice([.5, 1]) * horizOffsetDir
				, newNodeY]
				, [])
		}
		if (newNodeY == randNode.pos[1]) {
			// newNodeX = getRandomInt(newNodeX - RANDOM_OFFSET, newNodeX + RANDOM_OFFSET);
			let spaceLength = getRandomInt(1, 3);
			let vertOffsetDir = randomChoice([1, -1]);
			otherNewNode = new GenNode([newNodeX, 
				newNodeY 
				+ spaceLength * GRID_SPACE * randomChoice([.5, 1]) * vertOffsetDir
				// + getRandomInt(GRID_SPACE / 4, spaceLength * GRID_SPACE) * vertOffsetDir
			], [])
		}

		let newNode = new GenNode([newNodeX, newNodeY, otherNewNode], [randNode, randNeighbor]);

		mapArr[0].push(newNode);
		otherNewNode.addNeighbors(newNode);
		mapArr[0].push(otherNewNode);
	}
}

let canvas = document.getElementById('cityBlocks');
var ctx = "";
if (canvas.getContext) {
	var ctx = canvas.getContext('2d');
	ctx.lineWidth = 2;
}

generate(300);

for (let i = 0; i < mapArr.length; i++) {
	for (let j = 0; j < mapArr[i].length; j++) {
		let coords = mapArr[i][j].pos;
		for (let neighborIdx = 0; neighborIdx < mapArr[i][j].neighbors.length; neighborIdx++) {
			let neighborActualCoords = mapArr[i][j].neighbors[neighborIdx].pos;
			ctx.moveTo( coords[0] + 2, coords[1] + 2);
	 		ctx.lineTo(neighborActualCoords[0] + 2, neighborActualCoords[1] + 2);
		}
	}
}

ctx.stroke();