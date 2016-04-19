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
		_displayScore(this.currentScore, ctx, drawPos);
		if(!gameOver) {
			_displayPopups(this.scorePopups, ctx);
		}
	}
};


function _displayPopups(scorePopups, ctx) {
	scorePopups.forEach(function (popup) {
		popup[1][1] += 1;
		 ctx.font = "bold 24pt Brush, cursive";
		ctx.fillStyle = 'yellow';
		ctx.fillText(
			"+" + popup[0],
			popup[1][0] - 20,
			popup[1][1] - 20
		);
	});
}

function _displayScore(currentScore, ctx, pos) {
	ctx.font = "bold 36pt Caveat Brush, cursive";
	ctx.fillStyle = "black";
	ctx.fillText("Score: " + currentScore, pos[0], pos[1]);
}
module.exports = Score;
