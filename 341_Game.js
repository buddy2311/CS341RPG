// the-game.js
var gl;
var canvas; 
const WALLHEIGHT     = 70.0; // Some playing field parameters
const ARENASIZE      = 1000.0;
const EYEHEIGHT      = 15.0;
const HERO_VP        = 0.625;

const  upx=0.0, upy=1.0, upz=0.0;    // Some LookAt params 

const fov = 60.0;     // Perspective view params 
const near = 1.0;
const far = 5000.0;
var aspect, eyex, eyez;

const width = 1000;       // canvas size 
const height = 625;
const vp1_left = 0;      // Left viewport -- the hero's view 
const vp1_bottom = 0;

// Lighting stuff
var la0  = [ 0.2,0.2,0.2, 1.0 ]; // light 0 ambient intensity 
var ld0  = [ 1.0,1.0,1.0, 1.0 ]; // light 0 diffuse intensity 
var ls0  = [ 1.0,1.0,1.0, 1.0 ]; // light 0 specular 
var lp0  = [ 0.0,1.0,1.0, 1.0 ]; // light 0 position -- will adjust to hero's viewpoint 
var ma   = [ 0.02 , 0.2  , 0.02 , 1.0 ]; // material ambient 
var md   = [ 0.08, 0.06 , 0.08, 1.0 ]; // material diffuse 
var ms   = [ 0.06  , 0.07, 0.06  , 1.0 ]; // material specular 
var me      = 1000;             // shininess exponent 
const red  = [ 1.0,0.0,0.0, 1.0 ]; // pure red 
const blue = [ 0.0,0.0,1.0, 1.0 ]; // pure blue 
const green = [ 0.0,1.0,0.0, 1.0 ]; // pure blue 
const yellow = [ 1.0,1.0,0.0, 1.0 ]; // pure yellow

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var spot;
var xyz;
var program;
var mode = false;
var arena;
var door = [];
var screens = [];
var hero;
var thingSeeking;
var villain = [];
var map;
var stepCounter = -1;
var walkThisWay = 0;
var heroScore = 0;
var villainScore = 0;
var floors = [];
var floorBindings = [];
var onFloor;
var onLeft = false;
var onRight = false;
var audio = new Audio('Meanwhile in Bavaria.mp3');
var obj = 0;

var g_matrixStack = []; // Stack for storing a matrix

window.onload = function init(){
	//				Set up for the Canvas and OpenGl
    canvas = document.getElementById( "gl-canvas" );
    //document.getElementById("villainScore").innerHTML = villainScore;
       gl = WebGLUtils.setupWebGL( canvas );
    //gl = WebGLDebugUtils.makeDebugContext( canvas.getContext("webgl") ); // For debugging
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    //  Configure WebGL
    
    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );
	audio.play();
    //  Load shaders and initialize attribute buffers

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    eyex  = ARENASIZE/2.0;	// Where the hero starts
    eyez  =  -ARENASIZE/2.0;
    aspect=width/height;

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    gl.uniform1i(gl.getUniformLocation(program, "texture_flag"),
		 0); // Assume no texturing is the default used in
                     // shader.  If your game object uses it, be sure
                     // to switch it back to 0 for consistency with
                     // those objects that use the defalt.
	
	var temp = function mapView(){
			modelViewMatrix = lookAt(  vec3(0.0,100.0,-0.0),
									   vec3(0.0,0.0,-0.0),
									   vec3(0.0,0.0,-1.0) );
			projectionMatrix = ortho( -1000,1000, -1000,1000, 0,200 );
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
			gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
		};
	screens.push(temp);
	temp = function playerView(){
				modelViewMatrix = lookAt( vec3(hero.x, 100.0, hero.z),
										  vec3(hero.x, EYEHEIGHT, hero.z),
										  vec3(0.0,0.0,-1.0) );
				projectionMatrix = ortho( -200,200, -200,200, 0,200 );
				gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
				gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
			}
	screens.push(temp);
	screens[0]();
	
    
    //				End Set up fot Canvas and OpenGl
	gl.uniform1i(gl.getUniformLocation(program, "texture_flag"), 1);
    arena = new Map(program, 0, 20, 0, "Demo", screens[0]);
	arena.getView()();
    arena.init();
	arena.show();
	
	
	hero = new BasicCharacter(program, "Player 1", 0,20, 0, 100, 5, "Hero_Forward.png");
	xyz = arena.getHeroStart();
	hero.setXYZ(xyz[0],xyz[1],xyz[2]);
    hero.init();
	hero.show();
	
	gl.uniform1i(gl.getUniformLocation(program, "texture_flag"), 0);
	
	
    render();
};

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	arena.getView()();
	arena.show();
	hero.show();
	spot = hero.getXYZ();
	if(arena.getName() == "Demo" && spot[0] >= 50 && spot[2] >= 50){
		arena = new Level1(program, -750, 20, 900, "Level1", screens[1],"Level1.png");
		arena.init();
		floorBindings = arena.getBindings();
		xyz = arena.getHeroStart();
		hero.setXYZ(xyz[0],xyz[1],xyz[2]);
		audio.pause();
		audio = new Audio('Double Polka.mp3');
		audio.play();
	}
	if(arena.getName() == "Demo" && spot[0] <= -50 && spot[0] >= -150 && spot[2] <= -50 && spot[2] >= -150){
		arena = new Level2(program, -750, 20, 900, "Level2", screens[1],"Level1.png");
		arena.init();
		floorBindings = arena.getBindings();
		xyz = arena.getHeroStart();
		hero.setXYZ(xyz[0],xyz[1],xyz[2]);
		audio.pause();
		audio = new Audio('Double Polka.mp3');
		audio.play();
	}
	if(arena.getName() == "Demo" && spot[0] <= -500 && spot[0] >= -600 && spot[2] <= -50 && spot[2] >= -150){
		arena = new Level3(program, -750, 20, 900, "Level3", screens[1],"Level1.png");
		arena.init();
		floorBindings = arena.getBindings();
		xyz = arena.getHeroStart();
		hero.setXYZ(950,xyz[1],xyz[2]);
		audio.pause();
		audio = new Audio('Four Beers Polka.mp3');
		audio.play();
	}
	if(arena.getName() == "Level1" && spot[0] <= -900 && spot[2] <= -800){
		arena = new Map(program, 0, 20, 0, "Demo", screens[0]);
		arena.init();
		floorBindings = arena.getBindings();
		xyz = arena.getHeroStart();
		hero.setXYZ(xyz[0],xyz[1],xyz[2]);
		audio.pause();
		audio = new Audio('Meanwhile in Bavaria.mp3');
		audio.play();
	}
	if(arena.getName() == "Level2" && spot[0] >= 100 && spot[2] <= -200){
		arena = new Map(program, 0, 20, 0, "Demo", screens[0]);
		arena.init();
		floorBindings = arena.getBindings();
		xyz = arena.getHeroStart();
		hero.setXYZ(xyz[0],xyz[1],xyz[2]);
		audio.pause();
		audio = new Audio('Meanwhile in Bavaria.mp3');
		audio.play();
	}
	if(arena.getName() == "Level3" && spot[0] >= 600 && spot[2] <= 0){
		arena = new Map(program, 0, 20, 0, "Demo", screens[0]);
		arena.init();
		floorBindings = arena.getBindings();
		xyz = arena.getHeroStart();
		hero.setXYZ(xyz[0],xyz[1],xyz[2]);
		audio.pause();
		audio = new Audio('Meanwhile in Bavaria.mp3');
		audio.play();
	}

	if(floorBindings != null && floorBindings.length != 0){
		var heroPos = hero.getXYZ();
		var check = [];
		for(var j = 0; j < floorBindings.length; ++j){
			var floorZ = floorBindings[j];
			
			if( (heroPos[0] <= floorZ[0]+65 && heroPos[0] >= floorZ[0]-65) && (heroPos[2] >= floorZ[2]-100 && heroPos[2] <= floorZ[2]+100) ){
				check.push(floorZ);
			}
		}
		if(check.length > 0){
			for(var i = 0; i < check.length; ++i){
				if(heroPos[0] <= check[i][0]+35 && heroPos[0] >= check[i][0]-35 && heroPos[2] >= check[i][2]-70 && heroPos[2] <= check[i][2]-50){
					onFloor = true;
					break;
				}
				else{onFloor = false;}
				
			}
			for(var i = 0; i < check.length; ++i){
				if(heroPos[2] >= check[i][2]-30 && heroPos[2] <= check[i][2]+100){
					if(heroPos[0] <= check[i][0]+30){
						onLeft = true;
					}
					if(heroPos[0] >= check[i][0]-30){
						console.log("onRight");
						onRight = true;
					}
				}else{
					onRight = false;
					onLeft = false;
				}
				
			}
		}else{
			onFloor = false;
			onRight = false;
			onLeft = false;
		}
		
		if(onFloor == false){
			hero.moveZ(3);
		}
	}
    requestAnimFrame( render );
};

// Key listener

window.onkeydown = function(event) {
    var key = String.fromCharCode(event.keyCode);
	switch (key) {
	case 'D':
		if(onRight == false){
			hero.moveX(10);
		}
	break;
    case 'A':
		if(onLeft == false){
			hero.moveX(-10);
		}
	break;
    case 'S':
		if(arena.getName() == "Demo"){
			hero.moveZ(10);
		}
	break;
    case 'W':
		if(arena.getName() == "Demo"){
			hero.moveZ(-10);
		}
	break;
	case 'E':
		if(onFloor == true){
			hero.jump();
		}
	break;
	case 'Q':
	//put debug tests here
	break;
    }
	
};
