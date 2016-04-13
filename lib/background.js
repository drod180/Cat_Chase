var Background = {
	setup: function (options) {
		this.x = options.x || 0;
		this.y = options.x || 0;
	},

	updatePosition: function (xPos, yPos) {
		this.
	},

	draw: function (context) {
		var backgroundImage = new Image();
		backgroundImage.src = "assets/sprites/background.png";
		context.drawImage(
			backgroundImage,
			0,
			0,
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
