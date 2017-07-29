var canvas;
var canvasContext;

const brickWidth = 80;
const brickHeight = 20;
const brickCols = 10;
const brickRows = 17;
const brickGap = 2;
var brickGrid = new Array(brickCols * brickRows);
var bricksLeft = 0;

var ballRadius = 10;
var ballX = 400;
var ballY = 400;
var ballSpeedX = 0;
var ballSpeedY = 0;
var prevBallSpeedX = 0;
var prevBallSpeedY = 0;

const paddleWidth = 100;
const paddleHeight = 10;
var paddleX = 350;
var paddleY = 550;

const attempts = 10;
var playerAttempts = attempts;
var winScore = 0;
var playerScore = 0;
var maxScore = 0;
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
      ballX = 400;
      ballY = 400;
      playerScore = 0;
      playerAttempts = 10;
      gameOver = false;
      setBricks();
    }
    ballSpeedX = 0;
    ballSpeedY = 5;
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
    checkGameOver();
    // draw all the elements in the new positions
    draw();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousemove', (event) => {
    let mousePosition = getMousePosition(event);
    paddleX = mousePosition.x - (paddleWidth/2);
  });
}

const setBricks = () => {
  for (var i = 0; i < 3 * brickCols; i++) {
    brickGrid[i] = false;
  }

  for (; i < brickCols * brickRows; i++) {
    if (Math.random() < 0.5) {
      brickGrid[i] = true;
      bricksLeft++;
    } else {
      brickGrid[i] = false;
    }
  }
}

window.onload = () => {
  setBricks();
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

  ballBrickCollision();

  ballPaddleCollision();
}

// updates the ball's position
const updateBall = () => {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // ballBrickCollision();
  //
  // ballPaddleCollision();

  if (ballX - 10 <= 0) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballX + 10 >= canvas.width) {
    ballSpeedX = -ballSpeedX;
  }
}

// resets the ball's positions
const resetBall = () => {
  playerAttempts--;
  ballX = 400;
  ballY = 400;
  ballSpeedX = 0;
  ballSpeedY = 5;
}

const ballBrickCollision = () => {
  let ballBrickCol = Math.floor(ballX / brickWidth);
  let ballBrickRow = Math.floor(ballY / brickHeight);
  let brickUnderBall = rowColToArrayIndex(ballBrickRow, ballBrickCol);

  if (brickUnderBall >= 0 && brickUnderBall < brickCols * brickRows) {
    if (brickGrid[brickUnderBall]) {
      let prevBallX = ballX - ballSpeedX;
      let prevBallY = ballY - ballSpeedY;
      let prevBrickCol = Math.floor(prevBallX / brickWidth);
      let prevBrickRow = Math.floor(prevBallY / brickHeight);

      if (prevBrickCol != ballBrickCol) {
        ballSpeedX = -ballSpeedX;
      }

      if (prevBrickRow != ballBrickRow) {
        ballSpeedY = -ballSpeedY;
      }

      brickGrid[brickUnderBall] = false;
      bricksLeft--;
      playerScore += 10;
      // ballSpeedY = -ballSpeedY;
    }
  }
}

const ballPaddleCollision = () => {
  let paddleTopEdgeY = canvas.height - 60;
  let paddleBottomEdgeY = paddleTopEdgeY + paddleHeight;
  let paddleLeftEdgeX = paddleX;
  let paddleRightEdgeX = paddleLeftEdgeX + paddleWidth;

  if (ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > paddleTopEdgeY && // below the top of the paddle
      ballY < paddleBottomEdgeY && // above the bottom of the paddle
      ballX + 10 > paddleLeftEdgeX && // right of the left side of the paddle
      ballX - 10 < paddleRightEdgeX) { // left of the right side of the paddle
        ballSpeedY *= -1;

        let paddleCenter = paddleX + paddleWidth / 2;
        let ballDistFromPaddleCenter = ballX - paddleCenter;
        ballSpeedX = ballDistFromPaddleCenter * 0.3;
  }
  if (ballY > paddleBottomEdgeY + 20) {
    resetBall();
  }
}

// draws everything, except the canvas
const draw = () => {
  // check if the game is over and, if so, stops the drawing and show the game over screen
  if (gameOver) {
    gameOverScreen();
    return;
  }
  // draws the bricks
  drawBricks();
  // draws the ball
  drawBall('white', ballX, ballY, ballRadius);
  // draws the left paddle
  drawRect('white', paddleX, paddleY, paddleWidth, paddleHeight);
  // draws the player's score
  drawText(20, 'white', `Score: ${playerScore}`, 25, 35);
  // draws the remaining playerAttempts
  drawText(20, 'white', `Attempts: ${playerAttempts}`, canvas.width-170, 35);
}

// draws the canvas
const drawCanvas = () => {
  drawRect('#320b86', 0, 0, canvas.width, canvas.height);
}

// check if the game is over and, if so, who's the winner
const gameOverScreen = () => {
  ballSpeedX = 0;
  ballSpeedY = 0;
  if (attempts >= 0) {
    drawText(60, 'white', "YOU WIN", 100, 100);
    drawText(40, 'white', `Your score ${playerScore}`, 100, 170);
    if (playerAttempts == attempts) {
      drawText(60, 'white', "PERFECT", 100, 270);
    }
  }
}

const rowColToArrayIndex = (row, col) => {
  return col + row * brickCols;
}

const drawBricks = () => {
  for (let i = 0; i < brickRows; i++) {
    for (let j = 0; j < brickCols; j++) {
      let arrayIndex = rowColToArrayIndex(i, j);

      if (brickGrid[arrayIndex]) {
        drawRect('#673AB7', brickWidth * j, brickHeight * i, brickWidth - brickGap, brickHeight - brickGap)
      }
    }
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
  canvasContext.font = `${s}px monospace, sans-serif`;
  canvasContext.fillStyle = c;
  canvasContext.fillText(t, x, y);
}

const checkGameOver = () => {
  if (start) {
    if (bricksLeft <= 0 || playerAttempts < 0) {
      gameOver = true;
      start = false;
    }
  }
}
