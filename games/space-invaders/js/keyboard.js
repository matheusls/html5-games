const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const UP_ARROW = 38;
const DOWN_ARROW = 40;
const SPACE = 32;

function Keyboard(element) {
  this.element = element;

  // pressed keys array
  this.pressedKeys = [];

  // shot keys array
  this.shotKeys = [];

  // shooting functions
  this.shootingFunctions = [];

  // recording the state of the keys in the array
  var keyboard = this;
  element.addEventListener('keydown', function (event) {
    let key = event.keyCode; // current key being pressed
    keyboard.pressedKeys[key] = true;

    // shoot only if is the first keyDown of the key
    if (keyboard.shootingFunctions[key] && !keyboard.shotKeys[key]) {
      keyboard.shotKeys[key] = true;
      keyboard.shootingFunctions[key] ();
    }
  });
  element.addEventListener('keyup', function (event) {
    keyboard.pressedKeys[event.keyCode] = false;
    keyboard.shotKeys[event.keyCode] = false;
  });
}

Keyboard.prototype = {
  pressedKey: function (key) {
    return this.pressedKeys[key];
  },
  shot: function (key, callback) {
    this.shootingFunctions[key] = callback;
  }
}
