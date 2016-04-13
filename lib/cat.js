var MovingObject = require("./movingObject");
var Util = require("./util");
var spriteUtil = require("./spriteUtil");

function randomColor() {
  var hexDigits = "0123456789ABCDEF";

  var color = "#";
  for (var i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

var Cat = function (options) {
  options.radius = Cat.RADIUS;
  options.vel = options.vel || [0, 0];
  options.color = options.color || randomColor();
	options.sprite = options.sprite || {};
  MovingObject.call(this, options);
};

Util.inherits(Cat, MovingObject);

Cat.prototype.type = "Cat";

Cat.RADIUS = 15;

Cat.prototype.getMoveVel = function (center, mousePos) {
	//duck typing
};

Cat.prototype.collideWith = function () {
	//duck typing
};

Cat.prototype.rotate = function (mousePos) {
	var dir = Util.dirBetween([mousePos.x, mousePos.y], this.sprite.pos);
	this.sprite.angle = (dir[0]/dir[1]);
};

Cat.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

Cat.prototype.type = "Cat";

module.exports = Cat;
