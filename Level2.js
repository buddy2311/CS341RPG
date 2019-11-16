function Level2(program, x, y, z, name, view, picture)  {
	this.program = program;
	var floors = [];
	this.temp = "";
	var value = 0;
	
	for(var j = -970; j < 930; j = j + 60){
		temp = new DirtFloor(program, j, 30, 1000, "DirtFloor.png");
		floors.push(temp);
	}
	value += 300;
	for(var j = 700; j >= -560; j = j - 60){
		temp = new DirtFloor(program, j, 30, 1000 - value, "DirtFloor.png");
		floors.push(temp);
	}
	value += 300;
	for(var j = -460; j < 700 - value; j = j + 60){
		temp = new DirtFloor(program, j, 30, 1000 - value, "DirtFloor.png");
		floors.push(temp);
	}
	value += 300;
	for(var j = -100; j < 140; j = j + 60){
		temp = new DirtFloor(program, j, 30, 1000 - value, "DirtFloor.png");
		floors.push(temp);
	}
	value += 300;
	temp = new DirtFloor(program, 80, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	for(var j = 0; j <= 1000; j += 100){
		temp = new Border(program, 930, 30, j, "DirtFloor.png");
		floors.push(temp);
		temp = new Border(program, 930, 30, -j, "DirtFloor.png");
		floors.push(temp);
	}
	for(var j = 700; j >= -1000; j -= 100){
		temp = new Border(program, -620, 30, j, "DirtFloor.png");
		floors.push(temp);
	}
	Level.call(this,program, x, y, z, name, view, picture, floors);
};
Level2.prototype = Object.create(Level.prototype);