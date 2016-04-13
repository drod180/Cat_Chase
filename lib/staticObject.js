var Util = require("./util");

var StaticObject = function (options) {
  this.radius = options.radius;
	this.sprite = options.sprite;
  this.game = options.game;
};


StaticObject.prototype.collideWith = function (otherObject) {
	// default do nothing
};


StaticObject.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Util.dist(this.sprite.pos, otherObject.sprite.pos);
  return centerDist < (this.radius + otherObject.radius);
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
StaticObject.prototype.move = function (timeDelta, mousePos, center) {

	var catDirection = Util.dirBetween([mousePos.x, mousePos.y], center),
			catSpeed = Util.dist([mousePos.x, mousePos.y], center),
			shiftX = catDirection[0] * catSpeed * 0.01,
			shiftY = catDirection[1] * catSpeed * 0.01;

	this.updatePosition([-shiftX, -shiftY]);
};

StaticObject.prototype.updatePosition = function (x, y) {
	//Do nothing
};

StaticObject.prototype.remove = function () {
  //Do nothing
};

module.exports = StaticObject;
