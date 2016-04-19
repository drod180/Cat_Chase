/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(12);
	
	document.addEventListener("DOMContentLoaded", function(){
		var modal = document.getElementsByTagName("section")[0];
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
		
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game(canvasEl);
	  new GameView(game, ctx).welcome(modal);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Dog = __webpack_require__(2);
	var Cat = __webpack_require__(5);
	var Fight = __webpack_require__(8);
	var SpriteUtil = __webpack_require__(6);
	var Util = __webpack_require__(3);
	var Background = __webpack_require__(10);
	var GameOverImage = __webpack_require__(11);
	var Score = __webpack_require__(7);
	
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
	
		ctx.font = 'bold 36pt Papyrus';
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
		catImage.src = "assets/sprites/Cat.png";
	
		var catSprite = SpriteUtil.sprite({
			context: canvas.getContext("2d"),
	    width: 80,
	    height: 40,
			pos: this.centerPosition(),
	    image: catImage,
			ticksPerFrame: 10,
			numberOfFrames: 2
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
			dogImage.src = "assets/sprites/Dog.png";
	
			var dogSprite = SpriteUtil.sprite({
				context: canvas.getContext("2d"),
		    width: 120,
		    height: 60,
				pos: this.randomizedSpawnPos(),
		    image: dogImage,
				ticksPerFrame: 10,
				numberOfFrames: 2
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Cat = __webpack_require__(5);
	var Score = __webpack_require__(7);
	
	var DEFAULTS = {
		RADIUS: 25
	};
	
	var Dog = function (options) {
		options = options || {};
	  options.radius = DEFAULTS.RADIUS;
	  options.vel = options.vel || [0, 0];
		options.sprite = options.sprite || {};
	
	  MovingObject.call(this, options);
	};
	
	
	Util.inherits(Dog, MovingObject);
	
	Dog.prototype.type = "Dog";
	
	Dog.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Cat") {
	    otherObject.remove();
	  } else if (otherObject.type === "Dog") {
			this.game.addFight(this.sprite.context, this.sprite.pos);
			Score.addPoints(1000, this.sprite.pos.slice());
			otherObject.remove();
			this.remove();
		}
	};
	
	//Dogs always face the cat
	Dog.prototype.rotate = function (centerPos) {
		var dir = Util.dirBetween(centerPos, this.sprite.pos);
	
		var angle = Math.atan2(dir[1], dir[0]);
		this.sprite.angle = angle - Math.PI / 2;
	};
	
	module.exports = Dog;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir: function (vec) {
	    var norm = Util.norm(vec);
			if (norm) {
		    return Util.scale(vec, 1 / norm);
			} else {
				return 0;
			}
	  },
	
	  // Find distance between two points.
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
		// Find the direction from one object to another.
		dirBetween: function (startPos, destPos) {
			var vec = [(destPos[0] - startPos[0]), (destPos[1] - startPos[1])];
			return Util.dir(vec);
		},
	
	  // Find the length of the vector.
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  },
		//
	  // // Return a randomly oriented vector with the given length.
	  // randomVec : function (length) {
	  //   var deg = 2 * Math.PI * Math.random();
	  //   return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  // },
	
	  // Scale the length of a vector by the given amount.
	  scale: function (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	
	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate() { this.constructor = ChildClass; }
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  }
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	function _getPlayerShift(pos, center) {
		var dirBetween = Util.dirBetween([pos.x, pos.y], center),
				dirBetweenScale = Util.dist([pos.x, pos.y], center);
	
		if (dirBetweenScale > 250) { dirBetweenScale = 250; }
		if (dirBetweenScale < 1) {
			dirBetweenScale = 1;
			dirBetween = [0, 0];
		}
	
		dirBetweenScale *= MovingObject.CAT_SPEED;
		return [dirBetween[0] * dirBetweenScale, dirBetween[1] * dirBetweenScale];
	}
	
	function _updatePosition(velocity, velocityScale, playerShift) {
		var offset = [velocity[0] * velocityScale, velocity[1] * velocityScale];
		this.sprite.pos[0] = this.sprite.pos[0] + offset[0] + playerShift[0];
		this.sprite.pos[1] = this.sprite.pos[1] + offset[1] + playerShift[1];
	}
	
	function _updateVelocity(moveVel, velScaler) {
		this.vel[0] = this.vel[0] + (moveVel[0] * velScaler);
		this.vel[1] = this.vel[1] + (moveVel[1] * velScaler);
	}
	
	var MovingObject = function (options) {
	  this.vel = options.vel;
	  this.radius = options.radius;
		this.sprite = options.sprite;
	  this.game = options.game;
	};
	
	MovingObject.TURN_RADIUS = 5;
	MovingObject.CAT_SPEED = 0.01;
	MovingObject.DOG_SPEED = 0.015;
	
	MovingObject.prototype.collideWith = function (otherObject) {
	 // default do nothing
	};
	
	MovingObject.prototype.isCollidedWith = function (otherObject) {
	  var centerDist = Util.dist(this.sprite.pos, otherObject.sprite.pos);
	  return centerDist < (this.radius + otherObject.radius);
	};
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	MovingObject.prototype.move = function (timeDelta, mousePos, center) {
		var moveVel = Util.dirBetween(this.sprite.pos, center);
		_updateVelocity.call(this, moveVel, MovingObject.TURN_RADIUS);
	
		var velocityScale = timeDelta /
												NORMAL_FRAME_TIME_DELTA *
												MovingObject.DOG_SPEED,
				playerShift = _getPlayerShift(mousePos, center);
	  _updatePosition.call(this, this.vel, velocityScale, playerShift);
	};
	
	MovingObject.prototype.remove = function () {
	  this.game.remove(this);
	};
	
	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	var spriteUtil = __webpack_require__(6);
	var Background = __webpack_require__(10);
	
	var Cat = function (options) {
	  options.radius = options.radius || 10;
	  options.vel = options.vel || [0, 0];
		options.sprite = options.sprite || {};
	  MovingObject.call(this, options);
	};
	
	Util.inherits(Cat, MovingObject);
	
	Cat.prototype.type = "Cat";
	
	//Update animation rate since Cat never really moves
	Cat.prototype.move = function (timeDelta, mousePos, center) {
		var direction = Util.dirBetween([mousePos.x, mousePos.y], center),
				speed = Util.dist([mousePos.x, mousePos.y], center);
		if (speed > 250) { speed = 250; }
	
		this.sprite.ticksPerFrame = Math.ceil(1000 / speed);
		var shift = [direction[0] * speed, direction[1] * speed];
		// Background.updatePosition(-shift[0] * 0.01, -shift[1] * 0.01);
	};
	
	//Make cat always face mouse
	Cat.prototype.rotate = function (mousePos) {
		var dir = Util.dirBetween([mousePos.x, mousePos.y], this.sprite.pos);
		var angle = Math.atan2(dir[1], dir[0]);
		this.sprite.angle = angle - Math.PI / 2;
	};
	
	module.exports = Cat;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var spriteUtil = {
	
		sprite: function (options) {
	
			var that = {},
				frameIndex = 0,
				tickCount = 0,
				numberOfFrames = options.numberOfFrames || 1;
	
			that.ticksPerFrame = options.ticksPerFrame || 0;
			that.context = options.context;
			that.width = options.width;
			that.height = options.height;
			that.image = options.image;
			that.scaleRatio = 1;
			that.pos = options.pos;
			that.angle = 0;
	
			that.update = function () {
				tickCount += 1;
				if (tickCount > that.ticksPerFrame) {
					tickCount = 0;
	  			// If the current frame index is in range
					if (frameIndex < numberOfFrames - 1) {
						frameIndex += 1;
					} else {
	  				frameIndex = 0;
					}
				}
			};
	
			that.render = function () {
	
			  // Draw the animation
				that.context.save();
				that.context.translate(that.pos[0], that.pos[1]);
				that.context.rotate(that.angle);
				that.context.translate(-that.width / (numberOfFrames * 2), -that.height / 2);
			  that.context.drawImage(
			    that.image,
			    frameIndex * that.width / numberOfFrames,
			    0,
			    that.width / numberOfFrames,
			    that.height,
					0,
					0,
			    that.width / numberOfFrames * that.scaleRatio,
			    that.height * that.scaleRatio);
				 that.context.restore();
			};
	
			return that;
		}
	};
	
	module.exports = spriteUtil;


/***/ },
/* 7 */
/***/ function(module, exports) {

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
			ctx.font = 'bold 24pt Calibri';
			ctx.fillStyle = 'yellow';
			ctx.fillText(
				"" + popup[0],
				popup[1][0] - 20,
				popup[1][1] - 20
			);
		});
	}
	
	function _displayScore(currentScore, ctx, pos) {
		ctx.font = 'bold 36pt Papyrus';
		ctx.fillStyle = "black";
		ctx.fillText("Score: " + currentScore, pos[0], pos[1]);
	}
	module.exports = Score;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var StaticObject = __webpack_require__(9);
	var Cat = __webpack_require__(5);
	var Dog = __webpack_require__(2);
	var Score = __webpack_require__(7);
	
	var Fight = function (options) {
		options = options || {};
	  options.radius = options.radius || 25;
	  options.vel = [0, 0];
		options.sprite = options.sprite || {};
	
	  StaticObject.call(this, options);
	};
	
	
	Util.inherits(Fight, StaticObject);
	
	
	Fight.prototype.type = "Fight";
	
	//Allows static object to move but appear to be at the same spot
	Fight.prototype.updatePosition = function (pos) {
		this.sprite.pos[0] = pos[0] ?
			this.sprite.pos[0] - pos[0] :
			this.sprite.pos[0];
		this.sprite.pos[1] = pos[1] ?
			this.sprite.pos[1] - pos[1] :
			this.sprite.pos[1];
	};
	
	Fight.prototype.collideWith = function (otherObject) {
	  if (otherObject.type === "Cat") {
	    otherObject.remove();
	  } else if (otherObject.type === "Dog") {
			otherObject.remove();
			this.sprite.scaleRatio += 0.2;
			this.radius = this.sprite.height * this.sprite.scaleRatio / 2;
			Score.addPoints(
				Math.ceil(this.sprite.scaleRatio * 500),
				this.sprite.pos.slice()
			);
		}
	};
	
	Fight.prototype.rotate = function (centerPos) {
		//Duck typing
	};
	
	
	module.exports = Fight;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var StaticObject = function (options) {
	  this.radius = options.radius;
		this.sprite = options.sprite;
	  this.game = options.game;
	};
	
	
	StaticObject.prototype.collideWith = function (otherObject) {
		// default do nothing
	};
	
	
	StaticObject.prototype.isCollidedWith = function (otherObject) {
	  var centerDist = Util.dist(this.sprite.pos, otherObject.sprite.pos);
	  return centerDist < (this.radius + otherObject.radius);
	};
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	StaticObject.prototype.move = function (timeDelta, mousePos, center) {
	
		var catDirection = Util.dirBetween([mousePos.x, mousePos.y], center),
				catSpeed = Util.dist([mousePos.x, mousePos.y], center),
				shiftX = catDirection[0] * catSpeed * 0.01,
				shiftY = catDirection[1] * catSpeed * 0.01;
	
		this.updatePosition([-shiftX, -shiftY]);
	};
	
	StaticObject.prototype.updatePosition = function (x, y) {
		//Do nothing
	};
	
	StaticObject.prototype.remove = function () {
	  //Do nothing, static objects are not removed in standard ways
	};
	
	module.exports = StaticObject;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var StaticObject = __webpack_require__(9);
	
	var Background = function () {
		this.x = 0;
		this.y = 0;
	
		var backgroundImage = new Image();
		backgroundImage.src = "assets/sprites/background.png";
		this.image = backgroundImage;
	};
	
	Util.inherits(Background, StaticObject);
	
	Background.prototype.updatePosition = function (pos) {
		this.x = pos[0] ? this.x + pos[0] : this.x;
		this.y = pos[1] ? this.y + pos[1] : this.y;
		this.x = (this.x + 400) % 400;
		this.y = (this.y + 400) % 400;
	};
	
	Background.prototype.draw = function (context) {
		context.drawImage(
			this.image,
			this.x,
			this.y,
			1000,
			600,
			0,
			0,
			1000,
			600
		);
	};
	
	
	module.exports = Background;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var GameOverImage = {
		draw: function (context) {
	
			context.drawImage(
				this.image,
				0,
				0,
				1000,
				600
			);
		},
	
		setup: function (options) {
			options = options || {};
			this.x = options.x || 0;
			this.y = options.x || 0;
	
			var gameOverImage = new Image();
			gameOverImage.src = "assets/sprites/game_over.png";
			this.image = gameOverImage;
		}
	};
	
	
	module.exports = GameOverImage;
	// ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);


/***/ },
/* 12 */
/***/ function(module, exports) {

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
		this.animationFrameToken = requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.end = function () {
		cancelAnimationFrame(this.animationFrameToken);
	};
	
	GameView.prototype.start = function () {
		this.modal.classList.add("game-start");
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map