# Cat Chase

Cat Chase is a avoider style browser game built with HTML5 and Canvas. The basic controls are to use move your mouse around the screen and the cat will always run towards it. However, the dogs are always running at you so you need to change directions often in order to avoid them.

Dodge some dogs at [Cat Chase](drod180.github.io/Cat_Chase)

###Instructions View:

![instructions]

###Game View:

![gameplay]

###Game Over View:

![gameOver]

###Technical Details:
* Cat Chase use HTML5 and Canvas in order to render images on the webpage. In order to update the page a game view class starts by calling an animate function which calls itself recursively.

```
GameView.prototype.animate = function(time){
	var timeDelta = time - this.lastTime;

	this.game.step(timeDelta);

	this.game.draw(this.ctx);
	this.lastTime = time;

	//every call to animate requests causes another call to animate
	this.animationFrameToken = requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.start = function () {
	this.modal.classList.add("game-start");
	this.lastTime = 0;
	//start the animation
	this.animationFrameToken = requestAnimationFrame(this.animate.bind(this));
};
```

* Cat Chase implements a game design in which you play as a character that never actually moves. However, your movement is implied through careful [background](./lib/background.js) manipulation. By scrolling the background in this way, a small image is able to appear to be infinite as well as providing visual feedback of character movement. Working off this same idea of a centered character, the dogs also need to be affected by the cat's "movements". As a result the dogs needed a movement algorithm which took into consideration where the cat was headed along with their current trajectory.

```
var NORMAL_FRAME_TIME_DELTA = 1000/60;
MovingObject.prototype.move = function (timeDelta, mousePos, center) {
	var moveVel = Util.dirBetween(this.sprite.pos, center);
	_updateVelocity.call(this, moveVel, MovingObject.TURN_RADIUS);

	var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA * MovingObject.DOG_SPEED,
			playerShift = _getPlayerShift(mousePos, center);
  _updatePosition.call(this, this.vel, velocityScale, playerShift);
};
```


[instructions]: ./img/instructions.png
[gameplay]: ./img/gameplay.png
[gameOver]: ./img/game_over.png
