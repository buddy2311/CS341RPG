function Hero(program, name, x, y, z, health, attack, picture)  {
    Characters.call(this, program, name, x, y, z, health, attack, picture);

    this.vbuffer = null;
    this.tbuffer = null;
    this.nbuffer = null;
    this.ibuffer = null;
    this.vposition = null;
    this.vnormal = null;
	this.jumpstate = 0;
	this.jumpposition = 0;
    
	
    this.vertices = [
	0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
	0.5, 0.5, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 0.5,-0.5, // v0-v3-v4-v5 right
	0.5, 0.0, 0.5,  0.5, 0.5,-0.5, -0.5, 0.5,-0.5, -0.5, 0.5, 0.5, // v0-v5-v6-v1 up
	-0.5, 0.5, 0.5, -0.5, 0.5,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
	-0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
	0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.5,-0.5,  0.5, 0.5,-0.5  // v4-v7-v6-v5 back
    ];

    // Normal
    this.normals = [
	0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
	1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
	0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
	-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
	0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
	0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ];

    // Indices of the vertices
    this.indices = [
	0, 1, 2,   0, 2, 3,    // front
	4, 5, 6,   4, 6, 7,    // right
	8, 9,10,   8,10,11,    // up
	12,13,14,  12,14,15,    // left
	16,17,18,  16,18,19,    // down
	20,21,22,  20,22,23     // back
    ];
    
    // Tex coords
    this.texcoord = [
	1,1, 0,1, 0,0, 1,0,
	0,1, 0,0, 1,0, 1,1,
	0,0, 1,0, 1,1, 0,1,
	1,1, 0,1, 0,0, 1,0,
	1,1, 0,1, 0,0, 1,0,
 	0,0, 1,0, 1,1, 0,1
    ];
};

Hero.prototype = Object.create(Characters.prototype);


/*
	This method initializes the Hero Object into the buffers.  
*/
Hero.prototype.init = function() {

    this.vbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );

    this.nbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.nbuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW );

    this.ibuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

    this.tbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.tbuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.texcoord), gl.STATIC_DRAW );
    var image0 = new Image();
    image0.crossOrigin = "anonymous";
    image0.src = this.picture;
    image0.onload = function() { 
	var texture0 = gl.createTexture();
	gl.activeTexture( gl.TEXTURE0);
	gl.bindTexture( gl.TEXTURE_2D, texture0 );
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		      gl.UNSIGNED_BYTE, image0);
	gl.generateMipmap( gl.TEXTURE_2D );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
			  gl.NEAREST_MIPMAP_LINEAR );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    };
};


/*
	This method allows for the Hero to jump visually
	on screen due to tweening.
*/
Hero.prototype.jump = function(){
	if(this.jumpposition == 0){
		this.jumpstate = 1;
	}
}

/*
	This method displays the Hero Object and checks the 
	state of the jump that it is currently in.
*/
Hero.prototype.show = function() {

    g_matrixStack.push(modelViewMatrix);
	
	if(this.jumpstate == 1){
		if(this.jumpposition == -30){
			this.jumpstate = -1;
		}
		else{
			this.z = this.z - this.jumpposition;
			this.jumpposition -= 1;
			this.z = this.z + this.jumpposition;
		}
	}
	else if(this.jumpstate == -1){
		if(this.jumpposition == 0){
			this.jumpstate = 0;
		}
		else{
			this.z = this.z - this.jumpposition;
			this.jumpposition += 1;
			this.z = this.z + this.jumpposition;
		}
	} 
    modelViewMatrix = mult(modelViewMatrix, translate(this.x, 0.0, this.z));
    modelViewMatrix = mult(modelViewMatrix, scalem(31.25,50.0,50.0));

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vbuffer );
    this.vposition = gl.getAttribLocation( program, "vposition" );
	
    gl.vertexAttribPointer(this.vposition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( this.vposition );    

    gl.bindBuffer( gl.ARRAY_BUFFER, this.nbuffer );
    this.vnormal = gl.getAttribLocation( program, "vnormal" );
	
    gl.vertexAttribPointer( this.vnormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.vnormal );

    gl.bindBuffer( gl.ARRAY_BUFFER, this.tbuffer);
    this.vtexcoord = gl.getAttribLocation( program, "vtexcoord");
	
    gl.vertexAttribPointer(this.vtexcoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.vtexcoord);

    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.ibuffer );

    gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
 		 1);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0); 
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );  
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 12 ); 
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 24 ); 
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36 ); 
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 48 );
    gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 60 );
    
    modelViewMatrix = g_matrixStack.pop();
    gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
		 0);
    gl.disableVertexAttribArray(this.vposition);
    gl.disableVertexAttribArray(this.vnormal);
    gl.disableVertexAttribArray(this.vtexcoord);
};