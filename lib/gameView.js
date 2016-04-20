var Game = require("./game");

var GameView = function (canvas) {
	this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
};

GameView.prototype.animate = function(time){
	var timeDelta = time - this.lastTime;

	this.game.step(timeDelta);

	this.game.draw(this.ctx);
	this.lastTime = time;

	//every call to animate requests causes another call to animate
	this.animationFrameToken = requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.end = function () {
	cancelAnimationFrame(this.animationFrameToken);
	this.modal.classList.remove("game-start");
};

GameView.prototype.start = function () {
	this.game = new Game(this.canvas);
	this.modal.classList.add("game-start");
	this.modal.children[2].removeEventListener("click", this.start.bind(this));
	this.lastTime = 0;
	//start the animation
	this.animationFrameToken = requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.welcome = function (modal) {
	this.modal = modal;
	//Get the start button
	this.modal.children[2].addEventListener("click", this.start.bind(this));
};
module.exports = GameView;
