var MovingObject = require("./movingObject");
var Util = require("./util");

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

  MovingObject.call(this, options);
};

Cat.prototype.type = "Cat";

Cat.RADIUS = 15;

Cat.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};

Util.inherits(Cat, MovingObject);

Cat.prototype.type = "Cat";

module.exports = Ship;
