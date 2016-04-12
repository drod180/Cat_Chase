var Util = require("./util");


var MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
};

MovingObject.TURN_RADIUS = 3;
MovingObject.CAT_SPEED = 0.005;
MovingObject.DOG_SPEED = 0.01;

MovingObject.prototype.collideWith = function (otherObject) {
  ; // default do nothing
};


MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Util.dist(this.pos, otherObject.pos);
  return centerDist < (this.radius + otherObject.radius);
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
MovingObject.prototype.move = function (timeDelta, mousePos, center) {
  //timeDelta is number of milliseconds since last move
  //if the computer is busy the time delta will be larger
  //in this case the MovingObject should move farther in this frame
  //velocity of object is how far it should move in 1/60th of a second

	// Get the direction and difference between the center as a way to make it
	// Move in relation to how the cat is "moving"
	var dirBetween = Util.dirBetween([mousePos.x, mousePos.y], center);
	var dirBetweenScale = Util.dist([mousePos.x, mousePos.y], center);

	// Always attempt to get to the center
	var moveVel = Util.dirBetween(this.pos, center);

	this.vel[0] = this.vel[0] + (moveVel[0] * MovingObject.TURN_RADIUS);
	this.vel[1] = this.vel[1] + (moveVel[1] * MovingObject.TURN_RADIUS);

  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale * MovingObject.DOG_SPEED,
      offsetY = this.vel[1] * velocityScale * MovingObject.DOG_SPEED;

	var playerShiftX = dirBetween[0] * dirBetweenScale * MovingObject.CAT_SPEED;
	var playerShiftY = dirBetween[1] * dirBetweenScale * MovingObject.CAT_SPEED;

  this.pos = [
		this.pos[0] + offsetX + playerShiftX,
		this.pos[1] + offsetY + playerShiftY
	];

};

MovingObject.prototype.remove = function () {
  this.game.remove(this);
};

module.exports = MovingObject;
