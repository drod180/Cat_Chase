var MovingObject = require("./movingObject");
var Util = require("./util");
var spriteUtil = require("./spriteUtil");
var Background = require("./background");

var Cat = function (options) {
  options.radius = options.radius || 10;
  options.vel = options.vel || [0, 0];
	options.sprite = options.sprite || {};
  MovingObject.call(this, options);
};

Util.inherits(Cat, MovingObject);

Cat.prototype.type = "Cat";

//Update animation rate since Cat never really moves
Cat.prototype.move = function (timeDelta, mousePos, center) {
	var direction = Util.dirBetween([mousePos.x, mousePos.y], center),
			speed = Util.dist([mousePos.x, mousePos.y], center);
	if (speed > 250) { speed = 250; }

	this.sprite.ticksPerFrame = Math.ceil(1000 / speed);
	var shift = [direction[0] * speed, direction[1] * speed];
	// Background.updatePosition(-shift[0] * 0.01, -shift[1] * 0.01);
};

//Make cat always face mouse
Cat.prototype.rotate = function (mousePos) {
	var dir = Util.dirBetween([mousePos.x, mousePos.y], this.sprite.pos);
	var angle = Math.atan2(dir[1], dir[0]);
	this.sprite.angle = angle - Math.PI / 2;
};

module.exports = Cat;
