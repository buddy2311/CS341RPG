function Level1(program, x, y, z, name, view, picture)  {
	this.program = program;
	var floors = [];
	this.temp = "";
	var value = 0;
	for(var j = -970;j < 700; j = j + 60){
		temp = new DirtFloor(program, j, 30, 1000, "DirtFloor.png");
		floors.push(temp);
	}
		//temp = new DirtFloor(program, 1000, 30, 1000, "DirtFloor.png");
		//floors.push(temp);
	value += 300;
	for(var j = 700;j > 700 - value; j = j - 60){
		temp = new DirtFloor(program, j, 30, 1000 - value, "DirtFloor.png");
		floors.push(temp);
	}
	value += 300;
	temp = new DirtFloor(program, 700 - 60, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	value += 300;
	temp = new DirtFloor(program, 460, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	value += 300;
	temp = new DirtFloor(program, 520, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	value += 300;
	temp = new DirtFloor(program, 580, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	value += 300;
	temp = new DirtFloor(program, 520, 30, 1000 - value, "DirtFloor.png");
	floors.push(temp);
	for(var j = 460; j > 700 - value; j = j - 60){
		temp = new DirtFloor(program, j, 30, 1000 - value, "DirtFloor.png");
		floors.push(temp);
	}
	
	Level.call(this,program, x, y, z, name, view, picture, floors);
};
Level1.prototype = Object.create(Level.prototype);