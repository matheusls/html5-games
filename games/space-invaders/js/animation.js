function Animation(context) {
  this.context = context;
  this.sprites = [];
  this.started = false;
}

Animation.prototype = {
  newSprite: function (sprite) {
    this.sprites.push(sprite);
  },
  start: function () {
    this.started = true;
    this.nextFrame();
  },
  stop: function () {
    this.started = false;
  },
  nextFrame: function () {
    if (!this.started) {
      return
    }

    this.cleanScreen();

    for (var i in this.sprites) {
      this.sprites[i].update();
    }

    for (var i in this.sprites) {
      this.sprites[i].draw();
    }

    // calling the next cycle
    var animation = this;
    requestAnimationFrame(function () {
      animation.nextFrame();
    });
  },
  cleanScreen: function () {
    var ctx = this.context;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
