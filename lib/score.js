var Score = {
	reset: function (points) {
		this.currentScore = 0;
		this.pos = [20, 85];
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
			_displayHighScore(localStorage.highScore, ctx, drawPos);
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

function _displayHighScore(score, ctx, pos) {
	ctx.font = "bold 36pt Caveat Brush, cursive";
	ctx.fillStyle = "black";
	ctx.fillText("High Score: " + score, pos[0], pos[1] - 40);
}

function _displayScore(score, ctx, pos) {
	ctx.font = "bold 36pt Caveat Brush, cursive";
	ctx.fillStyle = "black";
	ctx.fillText("Score: " + score, pos[0], pos[1]);
}
module.exports = Score;
