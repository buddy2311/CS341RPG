function Level1(program, x, y, z, name, view, picture)  {
	this.program = program;
	var floors = [];
	this.temp = "";
	
	for(var j = -970;j < 1000; j = j + 60){
		temp = new DirtFloor(program,j,30,1000,"DirtFloor.png");
		floors.push(temp);
	}
	for(var j = -970;j < 1000; j = j + 100){
		temp = new DirtFloor(program,1000,30,j,"DirtFloor.png");
		floors.push(temp);
	}
	
	Level.call(this,program, x, y, z, name, view, picture,floors);
};
Level1.prototype = Object.create(Level.prototype);