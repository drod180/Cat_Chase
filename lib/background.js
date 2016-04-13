var StaticObject = require("./staticObject");
var Util = require("./util");

var Background = {
	setup: function (options) {
		options = options || {};
		this.x = options.x || 0;
		this.y = options.x || 0;

		var backgroundImage = new Image();
		backgroundImage.src = "assets/sprites/background.png";
		this.image = backgroundImage;
	},

	updatePosition: function (xPos, yPos) {
		this.x = xPos ? this.x + xPos : this.x;
		this.y = yPos ? this.y + yPos : this.y;
		this.x = (this.x + 400) % 400;
		this.y = (this.y + 400) % 400;
	},

	draw: function (context) {

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
	}
};


module.exports = Background;


// ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
