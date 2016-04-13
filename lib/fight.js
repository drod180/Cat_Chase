var Util = require("./util");
var StaticObject = require("./staticObject");
var Cat = require("./cat");
var Dog = require("./dog");
var Score = require("./score");

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

Fight.prototype.updatePosition = function (pos) {
	this.sprite.pos[0] = pos[0] ? this.sprite.pos[0] - pos[0] : this.sprite.pos[0];
	this.sprite.pos[1] = pos[1] ? this.sprite.pos[1] - pos[1] : this.sprite.pos[1];
};

Fight.prototype.collideWith = function (otherObject) {
  if (otherObject.type === "Cat") {
    otherObject.remove();
  } else if (otherObject.type === "Dog") {
		otherObject.remove();
		this.sprite.scaleRatio += 0.2;
		this.radius = this.sprite.width * this.sprite.scaleRatio / 2;

		Score.addPoints(scaleRatio * 50);
	}
};

Fight.prototype.rotate = function (centerPos) {
	//Duck typing
};


module.exports = Fight;
