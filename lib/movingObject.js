var Util = require("./util");

var MovingObject = function (options) {
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
	this.sprite = options.sprite;
  this.game = options.game;
};

MovingObject.TURN_RADIUS = 3;
MovingObject.CAT_SPEED = 0.005;
MovingObject.DOG_SPEED = 0.01;

MovingObject.prototype.collideWith = function (otherObject) {
  ; // default do nothing
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Util.dist(this.sprite.pos, otherObject.sprite.pos);
  return centerDist < (this.radius + otherObject.radius);
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
MovingObject.prototype.move = function (timeDelta, mousePos, center) {

	// Get the direction and difference between the center as a way to make it
	// Move in relation to how the cat is "moving"
	var dirBetween = Util.dirBetween([mousePos.x, mousePos.y], center),
			dirBetweenScale = Util.dist([mousePos.x, mousePos.y], center),
			// Always attempt to get to the center
			moveVel = Util.dirBetween(this.sprite.pos, center);

	// Force moving objects to have some inertial in how fast they can adjust
	// their movement
	this.vel[0] = this.vel[0] + (moveVel[0] * MovingObject.TURN_RADIUS);
	this.vel[1] = this.vel[1] + (moveVel[1] * MovingObject.TURN_RADIUS);

  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale * MovingObject.DOG_SPEED,
      offsetY = this.vel[1] * velocityScale * MovingObject.DOG_SPEED,
			playerShiftX = dirBetween[0] * dirBetweenScale * MovingObject.CAT_SPEED,
			playerShiftY = dirBetween[1] * dirBetweenScale * MovingObject.CAT_SPEED;

  this.sprite.pos[0] = this.sprite.pos[0] + offsetX + playerShiftX;
	this.sprite.pos[1] = this.sprite.pos[1] + offsetY + playerShiftY;

};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
};

module.exports = MovingObject;
