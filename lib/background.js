var Util = require("./util");
var StaticObject = require("./staticObject");

var Background = function () {
	this.x = 0;
	this.y = 0;

	var backgroundImage = new Image();
	backgroundImage.src = "assets/sprites/background.png";
	this.image = backgroundImage;
};

Util.inherits(Background, StaticObject);

Background.prototype.updatePosition = function (pos) {
	this.x = pos[0] ? this.x + pos[0] : this.x;
	this.y = pos[1] ? this.y + pos[1] : this.y;
	this.x = (this.x + 400) % 400;
	this.y = (this.y + 400) % 400;
};

Background.prototype.draw = function (context) {
	context.drawImage(
		this.image,
		this.x,
		this.y,
		1000,
		600,
		0,
		0,
		1000,
		600
	);
};


module.exports = Background;
