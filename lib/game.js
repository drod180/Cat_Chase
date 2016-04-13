var Dog = require("./dog");
var Cat = require("./cat");
var SpriteUtil = require("./spriteUtil");

function _getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


var Game = function (canvas) {
  this.dogs  = [];
  this.cats = [];
	this.mousePos = {
		x: this.centerPosition()[0],
		y: this.centerPosition()[1]
	};
  this.addCat(canvas);

	//Get the new mouse position every time the mouse moves
	setInterval(this.addDog.bind(this, canvas), 3000);
		canvas.addEventListener('mousemove', function(e) {
		this.mousePos = this.getMousePos(canvas, e);
	}.bind(this));
};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_DOGS = 10;


Game.prototype.add = function (object) {
  if (object.type === "Dog") {
    this.dogs.push(object);
  } else if (object.type === "Cat") {
    this.cats.push(object);
  } else {
    throw "Add an unexpected object?";
  }
};

Game.prototype.addCat = function (canvas) {

	var catImage = new Image();
	catImage.src = "assets/sprites/cat_1.png";

	var catSprite = SpriteUtil.sprite({
		context: canvas.getContext("2d"),
    width: 40,
    height: 40,
		pos: this.centerPosition(),
    image: catImage,
		ticksPerFrame: 1,
		numberOfFrames: 1
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
		dogImage.src = "assets/sprites/dog_1.png";

		var dogSprite = SpriteUtil.sprite({
			context: canvas.getContext("2d"),
	    width: 60,
	    height: 60,
			pos: this.randomizedSpawnPos(),
	    image: dogImage,
			ticksPerFrame: 1,
			numberOfFrames: 1
		});
  	this.add(new Dog({
			game: this,
			sprite: dogSprite
		}));
	}
};

Game.prototype.allObjects = function () {
  return [].concat(this.cats, this.dogs);
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
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach(function (object) {
		object.sprite.render();
  });
};

Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
};

Game.prototype.getMousePos = function (canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
};

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach(function (object) {
		if(object.type !== "Cat") {
    	object.move(delta, this.mousePos, this.centerPosition());
		}
  }.bind(this));
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
  if (object instanceof Cat) {
    console.log("GAME OVER");
  } else if (object instanceof Dog) {
    var idx = this.dogs.indexOf(object);
    this.dogs.splice(idx, 1);
  } else {
    throw "Not an expected object to remove";
  }
};

Game.prototype.rotateObjects = function () {
	this.allObjects().forEach(function (object) {
    object.rotate(this.mousePos);
  }.bind(this));
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
	this.rotateObjects();
  this.checkCollisions();
};



module.exports = Game;
