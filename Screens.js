function Screens(program, x, y, z, name, view)  {
	//Use x,y,z to choose hero starting location
    this.x = x;			//Int
    this.y = y;			//Int
    this.z = z;			//Int
    this.name = name;	//String
    this.view = view;	//Function that creates the camera
	this.bindings = [];
	
	Screens.prototype.getBindings = function () {
	return this.bindings;
    };
	
	Screens.prototype.getName = function () {
	return this.name;
    };
	
	Screens.prototype.getView = function () {
	return this.view;
    };
	
	Screens.prototype.getHeroStart = function () {
	return [this.x,this.y,this.z];
    };
};