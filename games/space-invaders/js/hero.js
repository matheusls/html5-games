const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = 2;
const DIRECTION_DOWN = 3;
const DIRECTION_UP = 4;

function Hero(context, keyboard, animation) {
  this.context = context;
  this.keyboard = keyboard;
  this.animation = animation;
  this.x = 0;
  this.y = 0;
  this.direction = DIRECTION_RIGHT;
}

Hero.prototype = {
  update: function () {
    if (this.keyboard.pressedKey(LEFT_ARROW) && this.x > 0) {
      this.direction = DIRECTION_LEFT;
      this.x -= 10;
    }
    if (this.keyboard.pressedKey(RIGHT_ARROW) && this.x < this.context.canvas.width - 20) {
      this.direction = DIRECTION_RIGHT;
      this.x += 10;
    }
    if (this.keyboard.pressedKey(UP_ARROW) && this.y > 0) {
      this.direction = DIRECTION_UP;
      this.y -= 10;
    }
    if (this.keyboard.pressedKey(DOWN_ARROW) && this.y < this.context.canvas.height - 50) {
      this.direction = DIRECTION_DOWN;
      this.y += 10;
    }
  },
  draw: function () {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, canvas.width, canvas.height);
    this.context.fillStyle = 'white';
    this.context.fillRect(this.x, this.y, 20, 50);
  },
  shoot: function () {
    let shot = new Ball(this.context);
    shot.x = this.x + 10;
    shot.y = this.y + 10;
    shot.radius = 2;
    shot.color = 'red';

    if (this.direction == DIRECTION_LEFT) {
      shot.speedX = -10;
    }
    if (this.direction == DIRECTION_RIGHT) {
      shot.speedX = 10;
    }
    if (this.direction == DIRECTION_UP) {
      shot.speedY = -10;
    }
    if (this.direction == DIRECTION_DOWN) {
      shot.speedY = 10;
    }

    this.animation.newSprite(shot);
  }
}
