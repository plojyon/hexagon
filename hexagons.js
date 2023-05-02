const TAU = 2 * Math.PI;

const getMousePos = (canvas, evt) => {
	const rect = canvas.getBoundingClientRect();
	return {
		x: Math.floor(evt.clientX - rect.left),
		y: Math.floor(evt.clientY - rect.top)
	};
}

const getHexAt = (ctx, grid, x, y) => {
	for (let row = 0; row < grid.length; row++) {
		for (let col = 0; col < grid[0].length; col++) {
			if (ctx.isPointInPath(grid[row][col], x, y)) return grid[row][col];
		}
	}
}

const gridToPixel = (gridX, gridY, opts) => {
	const m = gridMeasurements(opts);
	return toPoint(
		Math.floor(gridX * m.gridSpaceX),
		Math.floor(gridY * m.gridSpaceY + (gridX % 2 ? m.gridOffsetY : 0))
	);
};

const drawGrid = (ctx, x, y, w, h, opts = {}) => {
	let grid = [];
	for (let gy = y; gy < y + h; gy++) {
		grid[gy - y] = [];
		for (let gx = x; gx < x + w; gx++) {
			grid[gy - y][gx - x] = drawPoly(ctx, gridToPixel(gx, gy, opts), hexagonPoints, pickRandom(opts.colours), opts);
		}
	}
	return grid;
};

const drawPoly = (ctx, origin, points, colour, opts) => {
	const path = polyPath3(ctx, origin, points);
	ctx.fillStyle = colour;
	ctx.fill(path);
	ctx.lineWidth = opts.lineWidth;
	ctx.strokeStyle = opts.strokeStyle;
	ctx.stroke(path);
	return path;
};

const createPoly = (opts, points = []) => {
	const
		{ inset, radius, sides } = opts,
		size = radius - inset,
		step = TAU / sides;
	for (let i = 0; i < sides; i++) {
		points.push(toPolarCoordinate(0, 0, size, step * i));
	}
	return points;
};

const gridMeasurements = (opts) => {
	const
		{ inset, radius, sides } = opts,
		edgeLength = Math.sin(Math.PI / sides) * 2*radius,
		gridSpaceX = 2*radius - edgeLength / 2,
		gridSpaceY = Math.cos(Math.PI / sides) * 2*radius,
		gridOffsetY = gridSpaceY / 2;
	return {
		radius: (2*radius),
		edgeLength,
		gridSpaceX,
		gridSpaceY,
		gridOffsetY
	};
};

const polyPath3 = (ctx, origin, points = []) => {
	let [{ x: startX, y: startY }] = points;
	const poly = new Path2D();
	poly.moveTo(startX + origin.x, startY + origin.y);
	points.forEach(({ x, y }) => { poly.lineTo(x+origin.x, y+origin.y); });
	poly.closePath();
	return poly
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const toPoint = (x, y) => ({ x, y });

const fromPoint = ({ x, y }) => [ x, y ];

const toPolarCoordinate = (centerX, centerY, radius, angle) => ({
	x: centerX + radius * Math.cos(angle),
	y: centerY + radius * Math.sin(angle)
});

const toPolarCoordinate2 = (centerX, centerY, radius, sides, i) =>
	toPolarCoordinate(centerX, centerY, radius, i === 0 ? 0 : (i * TAU / sides));

const generateColors = (count, saturation = 1.0, lightness = 0.5, alpha = 1.0) =>
	Array.from({ length: count }, (_, i) =>
		`hsla(${[
			Math.floor(i / count * 360),
			`${Math.floor(saturation * 100)}%`,
			`${Math.floor(lightness * 100)}%`,
			alpha
		].join(', ')})`);


const gridOptions = {
	radius: 30,
	sides: 6,
	inset: 0,
	// Context
	lineWidth: 1,
	fillStyle: '',
	strokeStyle: 'black',
	// Other
	colours: generateColors(3, 1.0, 0.667)
};

console.log(pickRandom(gridOptions.colours));
const hexagonPoints = createPoly(gridOptions);

window.onload = () => {
	const canvas = document.querySelector('#drawing');
	const ctx = canvas.getContext('2d');
	canvas.height = window.innerHeight - 3;
	canvas.width = window.innerWidth;
	const grid = drawGrid(ctx, 7, 2, 15, 13, gridOptions);
	console.log(grid);
	canvas.onclick = (e) => {
		const { x, y } = getMousePos(canvas, e);
		const hex = getHexAt(ctx, grid, x, y);
		if (hex) {
			console.log("Clicked on hexagon at", hex.x, hex.y, pickRandom(gridOptions.colours))
			drawPoly(ctx, [x, y], hexagonPoints, pickRandom(gridOptions.colours), gridOptions);
		}
	}
}
