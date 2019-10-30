function BasicCharacter(program, name, x, y, z, health, attack, picture)  {
	Hero.call(this, program, name, x, y, z, health, attack, picture);
};
BasicCharacter.prototype = Object.create(Hero.prototype);