var Util = require("./util");
var StaticObject = require("./staticObject");
var Cat = require("./cat");
var Dog = require("./dog");

var DEFAULTS = {
	RADIUS: 25
};

var Fight = function (options) {
	options = options || {};
  options.radius = options.radius || DEFAULTS.RADIUS;
  options.vel = [0, 0];
	options.sprite = options.sprite || {};

  StaticObject.call(this, options);
};


Util.inherits(Fight, StaticObject);


Fight.prototype.type = "Fight";

Fight.prototype.updatePosition = function (xPos, yPos) {
	this.sprite.x = xPos ? this.sprite.x + xPos : this.sprite.x;
	this.sprite.y = yPos ? this.sprite.y + yPos : this.sprite.y;
};

Fight.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Cat") {
    otherObject.remove();
  } else if (otherObject.type === "Dog") {
		otherObject.remove();
		this.radius += 5;
		this.sprite.width += 10;
		this.sprite.height += 10;
	}
};

Fight.prototype.rotate = function (centerPos) {
	//Duck typing
};


module.exports = Fight;
