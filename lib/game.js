var Dog = require("./dog");
var Cat = require("./cat");

var Game = function (canvas) {
  this.dogs  = [];
  this.cats = [];
	this.mousePos = {
		x: this.centerPosition()[0],
		y: this.centerPosition()[1]
	};
  this.addCat();

	//Get the new mouse position every time the mouse moves
	setInterval(this.addDog.bind(this), 3000);
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

Game.prototype.addCat = function () {
	var cat = new Cat({
		pos: this.centerPosition(),
		game: this
	});

	this.add(cat);

	return cat;
};

Game.prototype.addDog = function () {
	if (this.dogs.length < Game.NUM_DOGS) {
  	this.add(new Dog({ game: this }));
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
    object.draw(ctx);
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
	var mousePos = this.mousePos;
  this.allObjects().forEach(function (object) {
		if(object.type !== "Cat") {
    	object.move(delta, mousePos, this.centerPosition());
		}
  }.bind(this));
};

Game.prototype.randomPosition = function () {
  return [
    Game.DIM_X * Math.random(),
    Game.DIM_Y * Math.random()
  ];
};

Game.prototype.remove = function (object) {
  if (object instanceof Cat) {
    console.log("GAME OVER");
  } else if (object instanceof Dog) {
    var idx = this.asteroids.indexOf(object);
    this.asteroids[idx] = new Asteroid({ game: this });
  } else if (object instanceof Ship) {
    this.ships.splice(this.ships.indexOf(object), 1);
  } else {
    throw "Not an expected object to remove";
  }
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  this.checkCollisions();
};



module.exports = Game;
