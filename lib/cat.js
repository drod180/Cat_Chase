var MovingObject = require("./movingObject");
var Util = require("./util");
var spriteUtil = require("./spriteUtil");

var Cat = function (options) {
  options.radius = options.radius || 10;
  options.vel = options.vel || [0, 0];
	options.sprite = options.sprite || {};
  MovingObject.call(this, options);
};

Util.inherits(Cat, MovingObject);


Cat.prototype.type = "Cat";

Cat.prototype.move = function (timeDelta, mousePos, center) {
	var	speed = Util.dist([mousePos.x, mousePos.y], center);

	if (speed > 250) { speed = 250; }

	this.sprite.ticksPerFrame = Math.ceil(250 / speed);
};

Cat.prototype.collideWith = function () {
	//duck typing
};

Cat.prototype.getMoveVel = function (center, mousePos) {
	//duck typing
};

Cat.prototype.rotate = function (mousePos) {
	var dir = Util.dirBetween([mousePos.x, mousePos.y], this.sprite.pos);
	var angle = Math.atan2(dir[1], dir[0]);
	this.sprite.angle = angle - Math.PI / 2;
};


Cat.prototype.type = "Cat";

module.exports = Cat;
