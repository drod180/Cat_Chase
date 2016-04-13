var GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
};


GameView.prototype.animate = function(time){
	var timeDelta = time - this.lastTime;

	this.game.step(timeDelta);

	this.game.draw(this.ctx);
	this.lastTime = time;

	//every call to animate requests causes another call to animate
	requestAnimationFrame(this.animate.bind(this));
};

// GameView.prototype.endGame = function () {
// 	this.game.gameOver(this.ctx);
// };

GameView.prototype.start = function () {
	this.lastTime = 0;
	//start the animation
	requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
