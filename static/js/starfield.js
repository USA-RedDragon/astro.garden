var particles = [];

const bgColor = "#060a17";
const maxParticles = 120;
const numGridX = 20;
const numGridY = 20;
const particleAlphaFadeIn = 15;
const particleAlphaFadeOut = 12;
const particleDelayMax = 2;
const particleTimerMax = 100;
const particleTimerMin = 16;
const drawMs = 100; // Rate at which to draw animated background
const debug = false;

const yellowStars = {
  center: '#cfc54a',
  outline: '#cfaf4a',
  sizeMin: 2.9,
  sizeMax: 1.5,
  maxStarburstLength: 0.3,
};

const blueStars = {
  center: '#9fb7ff',
  outline: '#b3c6ff',
  sizeMax: 2.4,
  sizeMin: 1.0,
  maxStarburstLength: 0.3,
};

const redStars = {
  center: '#86232a',
  outline: '#721e24',
  sizeMax: 3.2,
  sizeMin: 1.8,
  maxStarburstLength: 0.3,
};

// 4:3:2
// red:blue:yellow
const starColors = [
  redStars,
  redStars,
  redStars,
  redStars,
  blueStars,
  blueStars,
  blueStars,
  yellowStars,
  yellowStars,
]

function drawStar(context, point, alpha = 1) {
  // Fade in alpha compensation
  if (point.delay < particleAlphaFadeIn && point.delay > 0) {
    alpha = 1 / point.delay;
  } else if (point.timer <= particleAlphaFadeOut) {
    // Fade out alpha compensation
    alpha =
      point.timer * (1 / Math.abs(particleAlphaFadeOut - point.timer));
    if (alpha > 1) {
      alpha = 1;
    }
  }

  // Circle
  context.globalAlpha = alpha;
  context.beginPath();
  context.lineWidth = 1;
  context.strokeStyle = point.colors.outline;
  context.fillStyle = point.colors.center;
  const maxStarburstLen = Math.random() * point.colors.maxStarburstLength + point.size/2;

  context.arc(point.x, point.y, point.size+maxStarburstLen, 0, 2 * Math.PI);
  context.stroke();
  context.fill();
  context.closePath();
}

function checkPoint(point) {
  // Check the point to ensure it doesn't occupy
  // the same grid square bounds as another point
  if (squareOccupied(point.square)) {
    return false;
  }
  return true;
}

function fillParticles(canvas) {
  while (particles.length < maxParticles) {
    const clrIdx = Math.floor(Math.random() * starColors.length);
    const point = {
      x: Math.floor(Math.floor(Math.random() * canvas.width)),
      y: Math.floor(Math.floor(Math.random() * canvas.height)),
      size: Math.random() * (starColors[clrIdx].sizeMax - starColors[clrIdx].sizeMin) + starColors[clrIdx].sizeMin,
      timer: Math.floor(
        Math.random() * (particleTimerMax - particleTimerMin) +
        particleTimerMin +
        1,
      ),
      delay: Math.floor(Math.random() * particleDelayMax + 1),
      square: { x: 0, y: 0 }, // filled next,
      colors: starColors[clrIdx],
    };
    point.square = getSquare(point, canvas);
    if (checkPoint(point, canvas)) {
      particles.push(point);
    }
  }
}

function squareOccupied(square) {
  for (const particle of particles) {
    if (particle.square.x == square.x && particle.square.y == square.y) {
      return true;
    }
  }
}

function getSquare(point, canvas) {
  // Divide into grid
  const widthOfSquare = Math.floor(canvas.width / numGridX);
  const heightOfSquare = Math.floor(canvas.height / numGridY);

  // For each grid square, check if x and y are greater than
  // widthOfSquare*squareIndex AND less than widthOfSquare*squareIndex+widthOfSquare
  // If so, return this grid square
  for (let x = 0; x < numGridX; x++) {
    for (let y = 0; y < numGridY; y++) {
      if (
        point.x >= widthOfSquare * x &&
        point.y >= heightOfSquare * y &&
        point.x < widthOfSquare * x + widthOfSquare &&
        point.y < heightOfSquare * y + heightOfSquare
      ) {
        return { x, y };
      }
    }
  }
  return { x: 0, y: 0 };
}

function drawGridlines(canvas, context) {
  const widthOfSquare = Math.floor(canvas.width / numGridX);
  const heightOfSquare = Math.floor(canvas.height / numGridY);

  for (let x = 0; x < numGridX; x++) {
    context.strokeStyle = 'white';
    context.moveTo(widthOfSquare * x, 0);
    context.lineTo(widthOfSquare * x, canvas.height);
    context.stroke();
    context.fill();
  }

  for (let y = 0; y < numGridY; y++) {
    context.strokeStyle = 'white';
    context.moveTo(0, heightOfSquare * y);
    context.lineTo(canvas.width, heightOfSquare * y);
    context.stroke();
    context.fill();
  }
}

function resizeHandler() {
  window.document.getElementById('starfield').width = window.document.getElementById('starfield').clientWidth;
  window.document.getElementById('starfield').height = window.document.body.scrollHeight;
}

function animate() {
  const canvas = window.document.getElementById('starfield');
  const context = canvas.getContext('2d');

  canvas.height = canvas.clientHeight;
  canvas.width = canvas.clientWidth;

  context.fillStyle = bgColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (debug) {
    drawGridlines(canvas, context);
  }

  if (particles.length > maxParticles) {
    particles = particles.slice(0, maxParticles);
  } else {
    fillParticles(canvas);
  }

  const newParticles = [];
  for (let i = 0; i < particles.length; i++) {
    particles[i].delay = particles[i].delay - 1;
    if (
      particles[i].delay < particleAlphaFadeIn &&
      particles[i].delay > 0
    ) {
      drawStar(context, particles[i]);
      newParticles.push(particles[i]);
    } else if (particles[i].delay <= 0) {
      particles[i].delay = 0; // Prevent unbound negatives
      particles[i].timer = particles[i].timer - 1;
      if (particles[i].timer > 0) {
        drawStar(context, particles[i]);
        newParticles.push(particles[i]);
      }
    }
  }
  particles = newParticles;

  setTimeout(() => {
    window.requestAnimationFrame(animate);
  }, drawMs);
}

// window.addEventListener('resize', resizeHandler);
resizeHandler();
window.requestAnimationFrame(animate);
