var bricksLevel = [];
bricksLevel.push(
	[0, 3, 4],
	[0, 8, 4],
	[1, 3, 4],
	[1, 8, 4],
	[2, 4, 2],
	[2, 7, 2],
	[3, 4, 2],
	[3, 7, 2]
);
for (let i = 4; i <= 5; i++) {
	for (let j = 3; j <= 8; j++) {
		bricksLevel.push([i, j, 2]);
	}
}
for (let i = 6; i <= 7; i++) {
	for (let j = 2; j <= 9; j++) {
		if (j == 4 || j == 7) {
			bricksLevel.push([i, j, -1]);
		} else {
			bricksLevel.push([i, j, 2]);
		}
	}
}
for (let i = 8; i <= 10; i++) {
	for (let j = 1; j <= 10; j++) {
		bricksLevel.push([i, j, 2]);
	}
}
for (let i = 11; i <= 13; i++) {
	bricksLevel.push(
		[i, 1, 2],
		[i, 3, 1],
		[i, 8, 1],
		[i, 10, 2]
	);
}
for (let j = 4; j <= 7; j++) {
	bricksLevel.push([11, j, 1]);
}
bricksLevel.push(
	[14, 4, 1],
	[14, 7, 1],
	[15, 4, 1],
	[15, 7, 1]
);

window.onload = function(){
	controller = new GameCtrl(480, 720, bricksLevel);
};
