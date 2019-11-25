function Level3(program, x, y, z, name, view, picture)  {
	this.program = program;
	var floors = [];
	this.temp = "";
	var value = 0;
	
	for(var j = -970; j < 670; j = j + 60){
		temp = new DirtFloor(program, - j, 30, 1000, "DirtFloor.png");
		floors.push(temp);
	}
	for(var j = 0; j <= 1000; j += 100){
		temp = new Border(program, -710, 30, j, "DirtFloor.png");
		floors.push(temp);
		temp = new Border(program, -710, 30, -j, "DirtFloor.png");
		floors.push(temp);
	}
	value += 300;
	temp = new DirtFloor(program, -580, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	value += 60;
	temp = new DirtFloor(program, -380, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	temp = new DirtFloor(program, -320, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	value += 60;
	temp = new DirtFloor(program, -100, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	temp = new DirtFloor(program, -40, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	for(var j = 600; j >= 0; j -= 100){
		temp = new Border(program, 20, 30, j, "DirtFloor.png");
		floors.push(temp);
	}
	value += 330;
	temp = new DirtFloor(program, -160, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	value += 300;
	for(var j = -100; j <= 680; j = j + 60){
		temp = new DirtFloor(program, j, 30, 1000 - value, "DirtFloor.png");
		floors.push(temp);
	}
	for(var j = -50; j >= -1000; j -= 100){
		temp = new Border(program, 740, 30, j, "DirtFloor.png");
		floors.push(temp);
	}
	Level.call(this,program, x, y, z, name, view, picture, floors);
};
Level3.prototype = Object.create(Level.prototype);
