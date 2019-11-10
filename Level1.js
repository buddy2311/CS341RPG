function Level1(program, x, y, z, name, view, picture)  {
	this.program = program;
	var floors = [];
	this.temp = "";
	
	for(var j = 0;j < 1000; j = j + 50){
		temp = new DirtFloor(program,0,30,j,"DirtFloor.png");
		floors.push(temp);
	}
	
	Level.call(this,program, x, y, z, name, view, picture,floors);
};
Level1.prototype = Object.create(Level.prototype);