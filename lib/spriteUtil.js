var spriteUtil = {

	sprite: function (options) {

		var that = {},
			frameIndex = 0,
			tickCount = 0,
			ticksPerFrame = options.ticksPerFrame || 0,
			numberOfFrames = options.numberOfFrames || 1;

		that.context = options.context;
		that.width = options.width;
		that.height = options.height;
		that.image = options.image;
		that.scaleRatio = 1;
		that.pos = options.pos;
		that.angle = 0;

		that.update = function () {
			tickCount += 1;
			if (tickCount > ticksPerFrame) {
				tickCount = 0;
  			// If the current frame index is in range
				if (frameIndex < numberOfFrames - 1) {
					frameIndex += 1;
				} else {
  				frameIndex = 0;
				}
			}
		};

		that.render = function () {

		  // Draw the animation
			that.context.save();
			that.context.translate(that.pos[0], that.pos[1]);
			that.context.rotate(that.angle);
			that.context.translate(-that.width / 2, -that.height / 2);
		  that.context.drawImage(
		    that.image,
		    frameIndex * that.width / numberOfFrames,
		    0,
		    that.width / numberOfFrames,
		    that.height,
				0,
				0,
		    that.width / numberOfFrames * that.scaleRatio,
		    that.height * that.scaleRatio);
			 that.context.restore();
		};

		return that;
	}
};

module.exports = spriteUtil;
