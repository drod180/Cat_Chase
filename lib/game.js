var Game = function () {
  this.dogs = [];
  this.cats = [];

  this.addAsteroids();
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
    throw "wtf?";
  }
};

Game.prototype.addDog = function () {
  for (var i = 0; i < Game.NUM_DOGS; i++) {
    this.add(new Dog({ game: this }));
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

Game.prototype.allObjects = function () {
  return [].concat(this.cats, this.dogs);
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

Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach(function (object) {
    object.move(delta);
  });
};

Game.prototype.randomPosition = function () {
  return [
    Game.DIM_X * Math.random(),
    Game.DIM_Y * Math.random()
  ];
};

Game.prototype.remove = function (object) {
  if (object instanceof Bullet) {
    this.bullets.splice(this.bullets.indexOf(object), 1);
  } else if (object instanceof Asteroid) {
    var idx = this.asteroids.indexOf(object);
    this.asteroids[idx] = new Asteroid({ game: this });
  } else if (object instanceof Ship) {
    this.ships.splice(this.ships.indexOf(object), 1);
  } else {
    throw "wtf?";
  }
};

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  this.checkCollisions();
};

module.exports = Game;
