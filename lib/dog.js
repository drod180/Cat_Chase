var Util = require("./util");
var MovingObject = require("./movingObject");
var Cat = require("./cat");

var DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 25,
	SPEED: 4
};

var Dog = function (options = {}) {
  options.color = DEFAULTS.COLOR;
  options.pos = options.pos || options.game.randomPosition();
  options.radius = DEFAULTS.RADIUS;
  options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);

  MovingObject.call(this, options);
};


Dog.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Cat") {
    otherObject.relocate();
  }
};

Util.inherits(Dog, MovingObject);

Dog.prototype.type = "Dog";

module.exports = Dog;
