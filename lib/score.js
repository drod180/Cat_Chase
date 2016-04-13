var Score = {
	reset: function (points) {
		this.currentScore = 0;
	},

	addPoints: function (points) {
		this.currentScore += points;
	},

	display: function (ctx) {
		ctx.font = "bold 14px Arial";
    ctx.fillText("Score: " + this.currentScore, 30, 30);
	}
 };

module.exports = Score;
