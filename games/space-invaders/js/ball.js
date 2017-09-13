function Ball(context) {
  this.context = context;
  this.x = 0;
  this.y = 0;
  this.speedX = 0;
  this.speedY = 0;

  // standard drawing attributes
  this.color = 'black';
  this.radius = 10;
}

Ball.prototype = {
  update: function () {
    var ctx = this.context;

    if (this.x < this.radius || this.x > ctx.canvas.width - this.radius) {
      this.speedX *= -1;
    }

    if (this.y < this.radius || this.y > ctx.canvas.height - this.radius) {
      this.speedY *= -1;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  },
  draw: function () {
    var ctx = this.context;

    // saves the current context setup
    ctx.save();

    // sets up the context according to the Ball
    ctx.fillStyle = this.color;

    // draw
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();

    // go back to the previous setup
    ctx.restore();
  }
}
