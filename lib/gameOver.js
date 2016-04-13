var Util = require("./util");

var GameOver = {
	setup: function (options) {
		options = options || {};
		this.x = options.x || 0;
		this.y = options.x || 0;

		var gameOverImage = new Image();
		gameOverImage.src = "assets/sprites/game_over.png";
		this.image = gameOverImage;
	},

	draw: function (context) {

		context.drawImage(
			this.image,
			0,
			0,
			1000,
			600
		);
	}
};


module.exports = GameOver;
// ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
