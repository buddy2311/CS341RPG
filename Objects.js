function Objects(program, x, y, z, picture)  {

    this.x = x;				//Int
    this.y = y;				//Int
    this.z = z;				//Int
    this.picture = picture;	//String
	
	Objects.prototype.getXYZ = function () {
		return [this.x,this.y,this.z];
    };
	
	Objects.prototype.getPicture = function () {
		return this.picture;
    };
};