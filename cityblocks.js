SCREEN_WIDTH = 1600;
SCREEN_HEIGHT = 900;

class GenNode {

	constructor(pos, neighbors, weight=2) {
		this.pos = pos;
		this.neighbors = neighbors || [];
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

let nodes = [];
let objects = [];
let mapArr = [];

function initGrid() {
	for (let i = 0; i < GRID_WIDTH; i++) {
		let mapYArr = [];
		for (let j = 0; j < GRID_HEIGHT; j++) {
			mapYArr.push(new GenNode([CANVAS_OFFSET + i*GRID_SPACE, CANVAS_OFFSET + j*GRID_SPACE]));
		}
		mapArr.push(mapYArr);
	}

	for (let i = 0; i < mapArr.length; i++) {
		for (let j = 0; j < mapArr[i].length; j++) {
			let neighborArr = [];
			if ((typeof(mapArr[i]) !== "undefined") && (typeof(mapArr[i][j-1]) !== "undefined")) neighborArr.push(mapArr[i][j-1]);
			if ((typeof(mapArr[i-1]) !== "undefined") && (typeof(mapArr[i-1][j]) !== "undefined")) neighborArr.push(mapArr[i-1][j]);
			if ((typeof(mapArr[i]) !== "undefined") && (typeof(mapArr[i][j+1]) !== "undefined")) neighborArr.push(mapArr[i][j+1]);
			if ((typeof(mapArr[i+1]) !== "undefined") && (typeof(mapArr[i+1][j]) !== "undefined")) neighborArr.push(mapArr[i+1][j]);

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
			let horizOffsetDir = randomChoice([1, -1]);
			let spaceLength = getRandomInt(1, 3);
			otherNewNode = new GenNode([
				newNodeX 
					+ spaceLength * GRID_SPACE * randomChoice([.5, 1]) * horizOffsetDir
				, newNodeY]
				, [])
		}
		if (newNodeY == randNode.pos[1]) {
			let spaceLength = getRandomInt(1, 3);
			let vertOffsetDir = randomChoice([1, -1]);
			otherNewNode = new GenNode([newNodeX, 
				newNodeY 
				+ spaceLength * GRID_SPACE * randomChoice([.5, 1]) * vertOffsetDir
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
		// draw nodes, for debug purposes only
		// mapArr[i][j].draw();
		for (let neighborIdx = 0; neighborIdx < mapArr[i][j].neighbors.length; neighborIdx++) {
			let neighborActualCoords = mapArr[i][j].neighbors[neighborIdx].pos;
			ctx.moveTo(coords[0] + 2, coords[1] + 2);
	 		ctx.lineTo(neighborActualCoords[0] + 2, neighborActualCoords[1] + 2);
		}
	}
}

ctx.stroke();