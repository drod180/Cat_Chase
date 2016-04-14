var Score = {
	reset: function (points) {
		this.currentScore = 0;
		this.pos = [20, 45];
		this.scorePopups = [];
	},

	addPoints: function (points, pos) {
		this.currentScore += points;
		if (points >= 250) {
			this.scorePopups.push([points, pos]);
			window.setTimeout(function () {
				this.scorePopups.shift();
			}.bind(this), 1500);
		}
	},

	display: function (ctx, gameOver, pos) {
		var drawPos = pos || this.pos;
		ctx.font = 'bold 36pt Papyrus';
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + this.currentScore,
									drawPos[0],
								  drawPos[1]);
		if(!gameOver) {
			this.scorePopups.forEach(function (popup) {
				popup[1][1] += 1;
				ctx.font = 'bold 24pt Calibri';
		    ctx.fillStyle = 'yellow';
				ctx.fillText(
					"" + popup[0],
					popup[1][0] - 20,
					popup[1][1] - 20
			 	);
			});
		}
	}
};

module.exports = Score;
