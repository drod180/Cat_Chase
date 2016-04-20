var GameView = require("./gameView");

document.addEventListener("DOMContentLoaded", function(){
	var modal = document.getElementsByTagName("section")[0];
  var canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = 1000;
  canvasEl.height = 600;

  new GameView(canvasEl).welcome(modal);
});
