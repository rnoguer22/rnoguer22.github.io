const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Variables
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: 2, dy: -2 };
let leftPaddle = { x: 20, y: canvas.height / 2 - 60, width: 10, height: 120 };
let rightPaddle = { x: canvas.width - 30, y: canvas.height / 2 - 60, width: 10, height: 120 };
let scoreLeft = 0;
let scoreRight = 0;

// Con esta función dibujamos la pelota
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

// Dibujamos las paletas
function drawPaddles() {
  ctx.fillStyle = 'black';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
}

// Marcador
function drawScore() {
  ctx.font = '24px Arial';

  //Establecemos las medidas del rectangulo que contendra los contadores
  const rectWidth = 140; // Ancho del rectángulo
  const rectHeight = 50; // Altura del rectángulo
  const rectX = canvas.width / 2 - rectWidth / 2; // Posición X del rectángulo
  const rectY = 0; // Posición Y del rectángulo

  // Dibujamos el rectangulo
  ctx.beginPath();
  ctx.rect(rectX, rectY, rectWidth, rectHeight); // Posición y tamaño del rectángulo
  ctx.stroke();
  ctx.closePath();

  // Barra horizontal para separar los contadores
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0); // Posición inicial de la barra
  ctx.lineTo(canvas.width/2, 50); // Posición final de la barra
  ctx.stroke(); // Dibujar la barra
  ctx.closePath(); 

  ctx.fillText(scoreLeft, canvas.width/2 - 40, 32.5);
  ctx.fillText(scoreRight, canvas.width/2 + 30, 32.5);
}

// Función para mostrar el mensaje de "Game Over" en pantalla
function showGameOverMessage() {
  const gameOverMessage = document.getElementById('gameOverMessage');
  gameOverMessage.style.display = 'block';
}

// Función principal para dibujar todo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddles();
  drawScore();

  // Si uno de los jugadores llega a 5 puntos, pierde el juego
  if (scoreLeft >= 5 || scoreRight >= 5) {
    // Detener el juego
    return showGameOverMessage();
  }



  // Movimiento de la pelota
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Colisión con las paredes superior e inferior
  if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  }

  // Colisión con las paletas
  if (
    ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
    ball.y > leftPaddle.y &&
    ball.y < leftPaddle.y + leftPaddle.height
  ) {
    ball.dx = -ball.dx;
  }

  if (
    ball.x + ball.radius > rightPaddle.x &&
    ball.y > rightPaddle.y &&
    ball.y < rightPaddle.y + rightPaddle.height
  ) {
    ball.dx = -ball.dx;
  }

  // Si la pelota sale de la pantalla, se anota un punto
  if (ball.x + ball.dx > canvas.width - ball.radius) {
    scoreLeft++;
    resetBall();
  }

  if (ball.x + ball.dx < ball.radius) {
    scoreRight++;
    resetBall();
  }

  requestAnimationFrame(draw);
}



let ballSpeed = 2; // Velocidad base de la pelota
let currentDifficulty = 'easy'; // Variable para almacenar la dificultad actual

// Función para reiniciar la posición de la pelota
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  // Configuramos la velocidad de la pelota dependiendo de la dificultad
  switch (currentDifficulty) {
    case 'easy':
      ballSpeed = 2;
      break;
    case 'medium':
      ballSpeed = 6;
      break;
    case 'hard':
      ballSpeed = 13;
      break;
    default:
      ballSpeed = 2;
      break;
  }

  ball.dx = -ballSpeed;
  ball.dy = Math.random() < 0.5 ? -ballSpeed : ballSpeed;
}

// Asignamos los eventos a los botones de dificultad
document.getElementById('easyButton').addEventListener('click', function() {
  currentDifficulty = 'easy';
  resetBall();
});

document.getElementById('mediumButton').addEventListener('click', function() {
  currentDifficulty = 'medium';
  resetBall();
});

document.getElementById('hardButton').addEventListener('click', function() {
  currentDifficulty = 'hard';
  resetBall();
});

function handleScore(scoreLeft, scoreRight) {
  // Verificar si alguno de los jugadores ha alcanzado la puntuacion máxima
  if (scoreLeft >= 5 || scoreRight >= 5) {
    showGameOverMessage();
  } else {
    // Reiniciar la pelota con la misma dificultad después de que se anota un punto
    resetBall();
  }
}

// Función para reiniciar el juego
function restartGame() {
  // Reiniciar puntajes
  scoreLeft = 0;
  scoreRight = 0;

  // Ocultamos el mensaje de Game Over
  const gameOverMessage = document.getElementById('gameOverMessage');
  gameOverMessage.style.display = '';


  // Reiniciar el juego
  resetBall();
  draw();
}

// Boton para reiniciar el juego
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', restartGame);


// Detectar las teclas presionadas para controlar las paletas
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp' && rightPaddle.y > 0) {
    rightPaddle.y -= 10;
  } else if (event.key === 'ArrowDown' && rightPaddle.y < canvas.height - rightPaddle.height) {
    rightPaddle.y += 10;
  }

  if (event.key === 'w' && leftPaddle.y > 0) {
    leftPaddle.y -= 10;
  } else if (event.key === 's' && leftPaddle.y < canvas.height - leftPaddle.height) {
    leftPaddle.y += 10;
  }
});

// Iniciar el juego
draw();