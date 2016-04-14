var Score = {
	reset: function (points) {
		this.currentScore = 0;
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

	display: function (ctx) {
		ctx.font = 'bold 24pt Calibri';
    ctx.fillStyle = 'yellow';
    ctx.fillText("Score: " + this.currentScore, 30, 30);
		this.scorePopups.forEach(function (popup) {
			popup[1][1] += 1;
			ctx.fillText(
				"" + popup[0],
				popup[1][0] - 20,
				popup[1][1] - 20
		 	);
		});

	}
 };

module.exports = Score;
