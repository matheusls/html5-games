var canvas;
var canvasContext;

var ballRadius = 10;
var ballX = 400;
var ballY = 300;
var ballSpeedX = 0;
var ballSpeedY = 0;
var prevBallSpeedX = 0;
var prevBallSpeedY = 0;

const paddleWidth = 10;
const paddleHeight = 100;
var leftPaddleX = 10;
var leftPaddleY = 250;
var rightPaddleX = 790;
var rightPaddleY = 250;

const winScore = 2;
var leftPlayerScore = 0;
var rightPlayerScore = 0;
var winner = '';
var gameOver = false;

var start = false;
var pause = false;

const getMousePosition = (event) => {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = event.clientX - rect.left - root.scrollLeft;
  let mouseY = event.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  }
}

const pauseGame = () => {
  if (!pause) {
    prevBallSpeedX = ballSpeedX;
    prevBallSpeedY = ballSpeedY;
    ballSpeedX = 0;
    ballSpeedY = 0;
    pause = true;
  } else {
    ballSpeedX = prevBallSpeedX;
    ballSpeedY = prevBallSpeedY;
  }
}

const startGame = () => {
  if (!start) {
    if (gameOver) {
      leftPlayerScore = 0;
      rightPlayerScore = 0;
      gameOver = false;
    }
    ballX = 405;
    ballY = 305;
    ballSpeedX = 10;
    start = true;
  }
  if (pause) {
    ballSpeedX = prevBallSpeedX;
    ballSpeedY = prevBallSpeedY;
    pause = false;
  }
}

const load = () => {
  console.log("Init");

  canvas = document.querySelector("#canvas");
  canvasContext = canvas.getContext("2d");

  let framesPerSecond = 30;
  setInterval(() => {
    // updates all positions
    update();
    // clean the canvas
    drawCanvas();
    // draw all the elements in the new positions
    draw();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousemove', (event) => {
    let mousePosition = getMousePosition(event);
    leftPaddleY = mousePosition.y - (paddleHeight/2);
  });
}

window.onload = () => {
  load();
  let startButton = document.querySelector("#start");
  let pauseButton = document.querySelector("#pause");
  startButton.addEventListener("click", startGame);
  pauseButton.addEventListener("click", pauseGame);
}

// updates everything
const update = () => {
  // updates the ball's position
  updateBall();
  // updates the right paddle's vertical position based on the ball vertical position
  updateRightPaddle();
}

// updates the ball's position
const updateBall = () => {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX <= 20) {
    if (ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
      ballSpeedX = -ballSpeedX;

      let deltaY = ballY - (leftPaddleY + (paddleHeight / 2));
      ballSpeedY = deltaY * 0.35;
    } else if (ballX <= 0) {
      rightPlayerScore++;
      checkGameOver();
      resetBall();
    }
  }
  if (ballX >= canvas.width-20) {
    if (ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
      ballSpeedX = -ballSpeedX;


      let deltaY = ballY - (rightPaddleY + (paddleHeight / 2));
      ballSpeedY = deltaY * 0.35;
    } else if (ballX > canvas.width-10) {
      leftPlayerScore++;
      checkGameOver();
      resetBall();
    }
  }

  if (ballY >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }
}

const resetBall = () => {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}

const updateRightPaddle = () => {
  let rightPaddleCenter = rightPaddleY + (paddleHeight / 2);

  if(rightPaddleCenter < ballY - 10) {
    rightPaddleY += 11;
  } else {
    if(rightPaddleCenter > ballY + 10) {
      rightPaddleY -= 11;
    }
  }
}

// draws everything, except the canvas
const draw = () => {
  // check if the game is over and, if so, stops the drawing and show the game over screen
  if (gameOver) {
    gameOverScreen();
    return;
  }
  // draws the net
  drawNet();
  // draws the ball
  drawBall('white', ballX, ballY, ballRadius);
  // draws the left paddle
  drawRect('white', 10, leftPaddleY, paddleWidth, paddleHeight);
  // draws the right paddle
  drawRect('white', canvas.width - 20, rightPaddleY, paddleWidth, paddleHeight);
  //draws the left player's score
  drawText(80, 'white', leftPlayerScore, 200, 100);
  //draws the right player's score
  drawText(80, 'white', rightPlayerScore, canvas.width - 260, 100);
}

// draws the canvas
const drawCanvas = () => {
  drawRect('#320b86', 0, 0, canvas.width, canvas.height);
}

// check if the game is over and, if so, who's the winner
const gameOverScreen = () => {
  ballSpeedX = 0;
  ballSpeedY = 0;
  if (leftPlayerScore >= winScore) {
    drawText(60, 'white', "YOU WIN", 100, 100);
    drawText(40, 'white', `Your score ${leftPlayerScore}`, 100, 170);
    drawText(40, 'white', `Computer score ${rightPlayerScore}`, 100, 220);
  }
  if (rightPlayerScore >= winScore) {
    drawText(60, 'white', "YOU LOSE", 100, 100);
    drawText(40, 'white', `Your score ${leftPlayerScore}`, 100, 170);
    drawText(40, 'white', `Computer score ${rightPlayerScore}`, 100, 220);
  }
}

const drawNet = () => {
  for (let i = 0; i < canvas.height; i += 40) {
    drawRect('white', canvas.width/2, i, 2, 20);
  }
}

const drawRect = (c, x, y, w, h) => {
  canvasContext.fillStyle = c;
  canvasContext.fillRect(x, y, w, h);
}

const drawBall = (c, x, y, r) => {
  canvasContext.fillStyle = c;
  canvasContext.beginPath();
  canvasContext.arc(x, y, r, 0, Math.PI*2, true);
  canvasContext.fill();
}

const drawText = (s, c, t, x, y) => {
  canvasContext.font = `${s}px VT323, monospace, sans-serif`;
  canvasContext.fillStyle = c;
  canvasContext.fillText(t, x, y);
}

const checkGameOver = () => {
  if (leftPlayerScore >= winScore || rightPlayerScore >= winScore) {
    gameOver = true;
    start = false;
  }
}
