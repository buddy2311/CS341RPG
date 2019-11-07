/*
	Creates Object Characters
*/
function Characters(program, name, x, y, z, health, attack, picture)  {
	this.name = name;		//String
    this.x = x;				//Int
    this.y = y;				//Int
    this.z = z;				//Int
	this.health = health;	//Int
	this.attack = attack;	//Int
	this.picture = picture; //String
	/*
		Allows character to move along X axis
	*/
    Characters.prototype.moveX = function (speed) {		// Pass in negative speed for backward motion
		this.x = this.x + speed;
    };
	/*
		Allows character to move along Z axis
	*/
	Characters.prototype.moveZ = function (speed) {		// Pass in negative speed for backward motion
		this.z = this.z + speed;
    };
	/*
		Allows character to move along Y axis
	*/
	Characters.prototype.moveY = function (speed) {		
		this.y = this.y + speed;
    };
	/*
		Retreives array of X, Y, and Z coords
	*/
	Characters.prototype.getXYZ = function () {
		return [this.x,this.y,this.z];
    };
	/*
		Sets the X, Y, and Z coordinates
	*/
	Characters.prototype.setXYZ = function(x,y,z) {
		this.x = x;
		this.y = y;
		this.z = z;
	};
	/*
		Retreives int health 
	*/
	Characters.prototype.getHealth = function(){
		return this.health;
	}
	/*
		Sets the health bar
	*/
	Characters.prototype.setHealth = function(health){
		this.health = health;
	}
	/*
		Retreives Damage 
	*/
	Characters.prototype.getAttack = function(){
		return this.attack;
	}
	/*
		Sets Damage
	*/
	Characters.prototype.setAttack = function(attack){
		this.attack = attack;
	}
};