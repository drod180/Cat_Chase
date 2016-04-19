var Dog = require("./dog");
var Cat = require("./cat");
var Fight = require("./fight");
var SpriteUtil = require("./spriteUtil");
var Util = require("./util");
var Background = require("./background");
var GameOverImage = require("./gameOver");
var Score = require("./score");

function _between(a, b, value) {
	var min = Math.min(a, b),
	max = Math.max(a, b);

	return (value > min && value < max);
}

function _displayNewGameButton(ctx, buttonSize, buttonPos) {
	var buttonX = buttonPos[0] - buttonSize[0] / 2;
	var buttonY = buttonPos[1] - buttonSize[1] / 2;

	ctx.fillStyle = "white";
	ctx.strokeSytle = "black";
	ctx.fillRect(buttonX, buttonY, buttonSize[0], buttonSize[1]);
	ctx.strokeRect(buttonX, buttonY, buttonSize[0], buttonSize[1]);

	ctx.font = 'bold 36pt Brush, cursive';
	ctx.fillStyle = "black";
	ctx.fillText("Play Again", buttonX + 15, buttonY + 50);
}

function _fadeGameOverScreen(ctx) {
	ctx.clearRect(0, 0, (this.fadeAway * 1.4), Game.DIM_Y);
	ctx.clearRect(0, 0, Game.DIM_X, this.fadeAway);
	ctx.clearRect(Game.DIM_X - (this.fadeAway * 1.4), 0, Game.DIM_X, Game.DIM_Y);
	ctx.clearRect(0, Game.DIM_Y - this.fadeAway, Game.DIM_X, Game.DIM_Y);
	if (this.fadeAway < Game.DIM_X / 2) { this.fadeAway += 1; }
	GameOverImage.draw(ctx);
	Score.display(ctx, true, [Game.DIM_X / 2 - 125, Game.DIM_Y - 10]);
}

function _getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var Game = function (canvas) {
	Score.reset();
  this.dogs  = [];
  this.cats = [];
	this.fights = [];
	this.background = new Background();
	this.loss = false;
	this.gameOverButtonAdded = false;
	this.canvas = canvas;
	this.mousePos = {
		x: this.centerPosition()[0],
		y: this.centerPosition()[1]
	};
  this.addCat(canvas);

	//Dog spawning interval
	this.dogSpawnToken = window.setInterval(this.addDog.bind(this, canvas), 2000);
	//Get the new mouse position every time the mouse moves
	canvas.addEventListener('mousemove', function(e) {
		this.mousePos = this.getMousePos(canvas, e);
	}.bind(this));
};

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_DOGS = 55;


Game.prototype.add = function (object) {
  if (object.type === "Dog") {
    this.dogs.push(object);
  } else if (object.type === "Cat") {
    this.cats.push(object);
	} else if (object.type === "Fight") {
		this.fights.push(object);
  } else {
    throw "Attempted to add an unexpected object?";
  }
};

Game.prototype.addCat = function (canvas) {

	var catImage = new Image();
	catImage.src = "assets/sprites/Cat2.png";

	var catSprite = SpriteUtil.sprite({
		context: canvas.getContext("2d"),
    width: 240,
    height: 60,
		pos: this.centerPosition(),
    image: catImage,
		ticksPerFrame: 10,
		numberOfFrames: 6
	});

	var cat = new Cat({
		pos: this.centerPosition(),
		game: this,
		sprite: catSprite
	});

	this.add(cat);

	return cat;
};

Game.prototype.addDog = function (canvas) {
	if (this.dogs.length < Game.NUM_DOGS) {

		var dogImage = new Image();
		dogImage.src = "assets/sprites/Dog2.png";

		var dogSprite = SpriteUtil.sprite({
			context: canvas.getContext("2d"),
	    width: 360,
	    height: 80,
			pos: this.randomizedSpawnPos(),
	    image: dogImage,
			ticksPerFrame: 10,
			numberOfFrames: 6
		});

  	this.add(new Dog({
			game: this,
			sprite: dogSprite
		}));
	}
};

Game.prototype.addFight = function (canvas, position) {

	var fightImage = new Image();
	fightImage.src = "assets/sprites/fight.png";

	var fightSprite = SpriteUtil.sprite({
		context: canvas,
		width: 300,
		height: 60,
		pos: position,
		image: fightImage,
		ticksPerFrame: 10,
		numberOfFrames: 5
	});

	var fight = new Fight({
		game: this,
		sprite: fightSprite
	});

	this.add(fight);
	window.setTimeout(this.removeFight.bind(this, fight), 5000);
	return fight;
};

Game.prototype.addNewGameButton = function (canvas){
	var buttonSize = [260, 70];
	var buttonPos = this.centerPosition();
	var ctx = canvas.getContext("2d");
	this.gameOverButtonAdded = true;

	//Add event listener to check if it is on the button
	canvas.addEventListener("mousedown", function(e) {
		if (_between(buttonPos[0] - buttonSize[0] / 2,
			 					 buttonPos[0] + buttonSize[0] / 2,
								 e.offsetX) &&
				_between(buttonPos[1] - buttonSize[1] / 2,
								 buttonPos[1] + buttonSize[1] / 2,
							   e.offsetY))
		{
			location.reload();
		}
	});
};


Game.prototype.allObjects = function () {
  return [].concat(this.cats, this.dogs, this.fights);
};

Game.prototype.centerPosition = function () {
	return [
		Game.DIM_X / 2,
		Game.DIM_Y / 2
	];
};

Game.prototype.checkCollisions = function () {
  var game = this;

  this.allObjects().forEach(function (obj1) {
    game.allObjects().forEach(function (obj2) {
      if (obj1 == obj2) {
        // don't allow self-collision
        return;
      }
      if (obj1.isCollidedWith(obj2)) {
        obj1.collideWith(obj2);
      }
    });
  });
};

Game.prototype.draw = function (ctx) {
	if (this.loss){
		_fadeGameOverScreen.call(this, ctx);

		if (this.gameOverButtonAdded){
			var buttonSize = [260, 70];
			var buttonPos = this.centerPosition();
			_displayNewGameButton(ctx, buttonSize, buttonPos);
		}

	} else {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
		this.background.draw(ctx);
	  this.allObjects().forEach(function (object) {
			object.sprite.update();
			object.sprite.render();
	  });
		Score.addPoints(1);
		Score.display(ctx, false);
	}
};

Game.prototype.gameOver = function () {
	GameOverImage.setup();
	this.fadeAway = 0;
	this.loss = true;
	this.cats = [];
	this.dogs = [];
	window.clearInterval(this.dogSpawnToken);
	window.setTimeout(this.addNewGameButton.bind(this, this.canvas), 4700);
};

Game.prototype.getMousePos = function (canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
};

Game.prototype.moveObjects = function (delta) {
	var center = this.centerPosition(),
			mousePos = this.mousePos;
  this.allObjects().forEach(function (object) {
		object.move(delta, mousePos, center);
  }.bind(this));
	//Background is not in the allObjects list
	//so that it does not trigger collissions.
	//We will need to move it seperately
	this.background.move(delta, mousePos, center);
};

Game.prototype.randomPosition = function () {
  return [
    Game.DIM_X * Math.random(),
    Game.DIM_Y * Math.random()
  ];
};

Game.prototype.randomizedSpawnPos = function () {
	var spawnDecider = Math.random();
	if (spawnDecider < 0.25) {
	  return [
	    _getRandomArbitrary(0, Game.DIM_X) ,
	    _getRandomArbitrary(Game.DIM_Y + 5, Game.DIM_Y + 10)
	  ];
	} else if (spawnDecider >= 0.25 && spawnDecider < 0.5) {
		return [
	    _getRandomArbitrary(0, Game.DIM_X) ,
	    _getRandomArbitrary(-10, -5)
	  ];
	} else if (spawnDecider >= 0.5 && spawnDecider < 0.75) {
		return [
	    _getRandomArbitrary(Game.DIM_X + 5, Game.DIM_X + 10) ,
	    _getRandomArbitrary(0, Game.DIM_Y)
	  ];
	} else {
		return [
	    _getRandomArbitrary(-10, -5) ,
	    _getRandomArbitrary(0, Game.DIM_Y)
	  ];
	}
};

Game.prototype.remove = function (object) {
	var idx;
  if (object instanceof Cat) {
		this.gameOver();
  } else if (object instanceof Dog) {
    idx = this.dogs.indexOf(object);
    this.dogs.splice(idx, 1);
	} else if (object instanceof Fight) {
		idx = this.fights.indexOf(object);
		this.fights.splice(idx, 1);
  } else {
    throw "Not an expected object to remove";
  }
};

Game.prototype.removeFight = function (object) {
	this.remove(object);
};

Game.prototype.rotateObjects = function () {
	this.allObjects().forEach(function (object) {
		if (object instanceof Cat) {
	    object.rotate(this.mousePos);
		} else if (object instanceof Dog) {
			object.rotate(this.centerPosition());
		}
  }.bind(this));
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
	this.rotateObjects();
  this.checkCollisions();
};

module.exports = Game;
