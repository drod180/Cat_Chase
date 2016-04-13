var Util = require("./util");
var MovingObject = require("./movingObject");
var Cat = require("./cat");

var DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 25,
};

var Dog = function (options) {
	options = options || {};
  options.color = DEFAULTS.COLOR;
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || [0, 0];
	options.sprite = options.sprite || {};

  MovingObject.call(this, options);
};


Util.inherits(Dog, MovingObject);

Dog.prototype.type = "Dog";

Dog.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Cat") {
    otherObject.remove();
  } else if (otherObject.type === "Dog") {
		this.game.addFight(this.sprite.context, this.sprite.pos);
		otherObject.remove();
		this.remove();
	}
};

Dog.prototype.rotate = function (centerPos) {
	var dir = Util.dirBetween(centerPos, this.sprite.pos);

	var angle = Math.atan2(dir[1], dir[0]);
	this.sprite.angle = angle - Math.PI / 2;
};

module.exports = Dog;
