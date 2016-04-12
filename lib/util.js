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

  // Return a randomly oriented vector with the given length.
  randomVec : function (length) {
    var deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },

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
