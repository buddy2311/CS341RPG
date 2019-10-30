function Tile(program, x, y,a)  {
    GameObj.call(this, program, x, y);
    this.tilePoints = [
		vec2(((2*x)/1000)-1,(2*y)/624-1),
		vec2((2*(x+a)/1000)-1,(2*y)/624-1),
		vec2((2*(x+a)/1000)-1,2*(y+a)/624-1),
		vec2(((2*x)/1000)-1,2*(y+a)/624-1),
		vec2(((2*x)/1000)-1,(2*y)/624-1)
	];
	this.tBuffer = null;
	this.bufferId = null;
	this.iBuffer = null;
	
	this.texCoord = [
	1,1, 0,1, 0,0, 1,0,
	0,1, 0,0, 1,0, 1,1,
	0,0, 1,0, 1,1, 0,1,
	1,1, 0,1, 0,0, 1,0,
	1,1, 0,1, 0,0, 1,0,
 	0,0, 1,0, 1,1, 0,1
    ];
	
	this.indices = [
	0, 1, 2,   2, 4, 3
    ];
	
};

Tile.prototype = Object.create(GameObj.prototype);

Tile.prototype.init = function() {
    this.bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.tilePoints), gl.STATIC_DRAW );
	
	this.tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.texCoord), gl.STATIC_DRAW );
	
	this.iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
	
	var image4 = new Image();
    image4.crossOrigin = "anonymous";
    image4.src = "RedDoor.png";
    image4.onload = function() { 
	var texture4 = gl.createTexture();
	gl.activeTexture( gl.TEXTURE4);
	gl.bindTexture( gl.TEXTURE_2D, texture4 );
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		      gl.UNSIGNED_BYTE, image4);
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
			  gl.NEAREST_MIPMAP_LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    };
};

Tile.prototype.show = function() {
	gl.bindBuffer( gl.ARRAY_BUFFER, this.bufferId);
    this.vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer(this.vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray( this.vPosition );  
	
	gl.bindBuffer( gl.ARRAY_BUFFER, this.tBuffer);
	this.vTexCoord = gl.getAttribLocation( program, "vTexCoord");
	gl.vertexAttribPointer(this.vTexCoord, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(this.vTexCoord);
	gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
 		 2);
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.iBuffer );
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 4); 
	gl.drawElements( gl.TRIANGLES, 6,gl.UNSIGNED_SHORT, 0 );
	//gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
	//	 0);
	gl.disableVertexAttribArray(this.vTexCoord);
	gl.disableVertexAttribArray(this.vPosition);
};





