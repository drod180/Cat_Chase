var Util = require("./util");

function _getPlayerShift(pos, center) {
	var dirBetween = Util.dirBetween([pos.x, pos.y], center),
			dirBetweenScale = Util.dist([pos.x, pos.y], center);

	if (dirBetweenScale > 250) { dirBetweenScale = 250; }
	if (dirBetweenScale < 1) {
		dirBetweenScale = 1;
		dirBetween = [0, 0];
	}

	dirBetweenScale *= MovingObject.CAT_SPEED;
	return [dirBetween[0] * dirBetweenScale, dirBetween[1] * dirBetweenScale];
}

function _updatePosition(velocity, velocityScale, playerShift) {
	var offset = [velocity[0] * velocityScale, velocity[1] * velocityScale];
	this.sprite.pos[0] = this.sprite.pos[0] + offset[0] + playerShift[0];
	this.sprite.pos[1] = this.sprite.pos[1] + offset[1] + playerShift[1];
}

function _updateVelocity(moveVel, velScaler) {
	this.vel[0] = this.vel[0] + (moveVel[0] * velScaler);
	this.vel[1] = this.vel[1] + (moveVel[1] * velScaler);
}

var MovingObject = function (options) {
  this.vel = options.vel;
  this.radius = options.radius;
	this.sprite = options.sprite;
  this.game = options.game;
};

MovingObject.TURN_RADIUS = 5;
MovingObject.CAT_SPEED = 0.01;
MovingObject.DOG_SPEED = 0.015;

MovingObject.prototype.collideWith = function (otherObject) {
 // default do nothing
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Util.dist(this.sprite.pos, otherObject.sprite.pos);
  return centerDist < (this.radius + otherObject.radius);
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
MovingObject.prototype.move = function (timeDelta, mousePos, center) {
	var moveVel = Util.dirBetween(this.sprite.pos, center);
	_updateVelocity.call(this, moveVel, MovingObject.TURN_RADIUS);

	var velocityScale = timeDelta /
											NORMAL_FRAME_TIME_DELTA *
											MovingObject.DOG_SPEED,
			playerShift = _getPlayerShift(mousePos, center);
  _updatePosition.call(this, this.vel, velocityScale, playerShift);
};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
};

module.exports = MovingObject;
